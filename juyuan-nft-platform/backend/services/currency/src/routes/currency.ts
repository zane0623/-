import express, { Request, Response } from 'express';
import { query, validationResult } from 'express-validator';
import { CurrencyService } from '../services/CurrencyService';

const router = express.Router();
const currencyService = new CurrencyService();

// 支持的货币
const SUPPORTED_FIAT = ['USD', 'CNY', 'SGD', 'HKD', 'EUR', 'JPY', 'KRW', 'THB', 'MYR', 'VND'];
const SUPPORTED_CRYPTO = ['ETH', 'BTC', 'USDT', 'USDC', 'MATIC'];

/**
 * @route GET /api/v1/currency/rates
 * @desc 获取所有汇率
 */
router.get('/rates', async (req: Request, res: Response) => {
  try {
    const rates = await currencyService.getAllRates();
    res.json({
      data: rates,
      lastUpdated: rates.lastUpdated
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/v1/currency/convert
 * @desc 货币转换
 */
router.get(
  '/convert',
  [
    query('from').isIn([...SUPPORTED_FIAT, ...SUPPORTED_CRYPTO]),
    query('to').isIn([...SUPPORTED_FIAT, ...SUPPORTED_CRYPTO]),
    query('amount').isFloat({ min: 0 })
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { from, to, amount } = req.query;
      const result = await currencyService.convert(
        from as string,
        to as string,
        parseFloat(amount as string)
      );

      res.json({
        data: {
          from,
          to,
          amount: parseFloat(amount as string),
          convertedAmount: result.convertedAmount,
          rate: result.rate
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/**
 * @route GET /api/v1/currency/rate/:pair
 * @desc 获取特定货币对汇率
 */
router.get('/rate/:pair', async (req: Request, res: Response) => {
  try {
    const { pair } = req.params;
    const [from, to] = pair.split('-');
    
    if (!from || !to) {
      return res.status(400).json({ error: 'Invalid pair format. Use FROM-TO' });
    }

    const rate = await currencyService.getRate(from.toUpperCase(), to.toUpperCase());
    res.json({ data: { pair, rate } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/v1/currency/crypto/prices
 * @desc 获取加密货币价格
 */
router.get('/crypto/prices', async (req: Request, res: Response) => {
  try {
    const prices = await currencyService.getCryptoPrices();
    res.json({ data: prices });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/v1/currency/supported
 * @desc 获取支持的货币列表
 */
router.get('/supported', (req: Request, res: Response) => {
  res.json({
    data: {
      fiat: SUPPORTED_FIAT.map(code => ({
        code,
        name: getCurrencyName(code),
        symbol: getCurrencySymbol(code)
      })),
      crypto: SUPPORTED_CRYPTO.map(code => ({
        code,
        name: getCryptoName(code),
        symbol: code
      }))
    }
  });
});

function getCurrencyName(code: string): string {
  const names: Record<string, string> = {
    USD: '美元', CNY: '人民币', SGD: '新加坡元', HKD: '港币',
    EUR: '欧元', JPY: '日元', KRW: '韩元', THB: '泰铢',
    MYR: '马来西亚林吉特', VND: '越南盾'
  };
  return names[code] || code;
}

function getCurrencySymbol(code: string): string {
  const symbols: Record<string, string> = {
    USD: '$', CNY: '¥', SGD: 'S$', HKD: 'HK$',
    EUR: '€', JPY: '¥', KRW: '₩', THB: '฿',
    MYR: 'RM', VND: '₫'
  };
  return symbols[code] || code;
}

function getCryptoName(code: string): string {
  const names: Record<string, string> = {
    ETH: 'Ethereum', BTC: 'Bitcoin', USDT: 'Tether',
    USDC: 'USD Coin', MATIC: 'Polygon'
  };
  return names[code] || code;
}

export default router;

