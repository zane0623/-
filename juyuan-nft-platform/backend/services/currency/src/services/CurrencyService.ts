import axios from 'axios';
import Redis from 'ioredis';
import cron from 'node-cron';

export class CurrencyService {
  private redis: Redis;
  private readonly CACHE_KEY = 'currency:rates';
  private readonly CACHE_TTL = 300; // 5分钟

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379')
    });
  }

  /**
   * 启动汇率更新定时任务
   */
  startRateUpdater() {
    // 每5分钟更新一次汇率
    cron.schedule('*/5 * * * *', async () => {
      console.log('Updating currency rates...');
      await this.updateRates();
    });

    // 启动时立即更新
    this.updateRates();
  }

  /**
   * 获取所有汇率
   */
  async getAllRates() {
    const cached = await this.redis.get(this.CACHE_KEY);
    
    if (cached) {
      return JSON.parse(cached);
    }

    return await this.updateRates();
  }

  /**
   * 更新汇率
   */
  async updateRates() {
    try {
      // 获取法币汇率（使用免费API）
      const fiatRates = await this.fetchFiatRates();
      
      // 获取加密货币价格
      const cryptoPrices = await this.fetchCryptoPrices();

      const rates = {
        fiat: fiatRates,
        crypto: cryptoPrices,
        lastUpdated: new Date().toISOString()
      };

      await this.redis.setex(this.CACHE_KEY, this.CACHE_TTL, JSON.stringify(rates));

      return rates;
    } catch (error) {
      console.error('Error updating rates:', error);
      throw error;
    }
  }

  /**
   * 获取特定汇率
   */
  async getRate(from: string, to: string): Promise<number> {
    const rates = await this.getAllRates();

    // 如果是同一货币
    if (from === to) return 1;

    // 法币对法币
    if (rates.fiat[from] && rates.fiat[to]) {
      return rates.fiat[to] / rates.fiat[from];
    }

    // 加密货币对法币
    if (rates.crypto[from] && rates.fiat[to]) {
      const cryptoInUsd = rates.crypto[from].usd;
      return cryptoInUsd * rates.fiat[to];
    }

    // 法币对加密货币
    if (rates.fiat[from] && rates.crypto[to]) {
      const usdAmount = 1 / rates.fiat[from];
      return usdAmount / rates.crypto[to].usd;
    }

    // 加密货币对加密货币
    if (rates.crypto[from] && rates.crypto[to]) {
      return rates.crypto[from].usd / rates.crypto[to].usd;
    }

    throw new Error(`Cannot convert ${from} to ${to}`);
  }

  /**
   * 货币转换
   */
  async convert(from: string, to: string, amount: number) {
    const rate = await this.getRate(from, to);
    return {
      convertedAmount: amount * rate,
      rate
    };
  }

  /**
   * 获取加密货币价格
   */
  async getCryptoPrices() {
    const rates = await this.getAllRates();
    return rates.crypto;
  }

  /**
   * 获取法币汇率
   */
  private async fetchFiatRates(): Promise<Record<string, number>> {
    try {
      // 使用免费汇率API（以USD为基准）
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/USD`
      );

      const rates: Record<string, number> = {};
      const currencies = ['USD', 'CNY', 'SGD', 'HKD', 'EUR', 'JPY', 'KRW', 'THB', 'MYR', 'VND'];
      
      for (const currency of currencies) {
        rates[currency] = response.data.rates[currency] || 1;
      }

      return rates;
    } catch (error) {
      console.error('Error fetching fiat rates:', error);
      // 返回默认汇率
      return {
        USD: 1, CNY: 7.24, SGD: 1.34, HKD: 7.82,
        EUR: 0.92, JPY: 149.5, KRW: 1320, THB: 35.5,
        MYR: 4.72, VND: 24500
      };
    }
  }

  /**
   * 获取加密货币价格
   */
  private async fetchCryptoPrices(): Promise<Record<string, { usd: number; change24h: number }>> {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            ids: 'ethereum,bitcoin,tether,usd-coin,matic-network',
            vs_currencies: 'usd',
            include_24hr_change: true
          }
        }
      );

      return {
        ETH: { usd: response.data.ethereum?.usd || 2000, change24h: response.data.ethereum?.usd_24h_change || 0 },
        BTC: { usd: response.data.bitcoin?.usd || 40000, change24h: response.data.bitcoin?.usd_24h_change || 0 },
        USDT: { usd: response.data.tether?.usd || 1, change24h: 0 },
        USDC: { usd: response.data['usd-coin']?.usd || 1, change24h: 0 },
        MATIC: { usd: response.data['matic-network']?.usd || 0.8, change24h: response.data['matic-network']?.usd_24h_change || 0 }
      };
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      // 返回默认价格
      return {
        ETH: { usd: 2000, change24h: 0 },
        BTC: { usd: 40000, change24h: 0 },
        USDT: { usd: 1, change24h: 0 },
        USDC: { usd: 1, change24h: 0 },
        MATIC: { usd: 0.8, change24h: 0 }
      };
    }
  }
}

