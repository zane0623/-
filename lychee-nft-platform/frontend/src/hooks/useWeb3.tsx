'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { ethers } from 'ethers';

interface Web3ContextType {
  account: string | null;
  balance: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // 连接钱包
  const connect = async () => {
    try {
      setIsConnecting(true);

      // 检查是否安装了MetaMask
      if (typeof window.ethereum === 'undefined') {
        alert('请先安装MetaMask钱包插件！');
        return;
      }

      // 请求连接钱包
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        const web3Signer = web3Provider.getSigner();
        
        setProvider(web3Provider);
        setSigner(web3Signer);
        setAccount(accounts[0]);

        // 获取余额
        const balance = await web3Provider.getBalance(accounts[0]);
        setBalance(ethers.utils.formatEther(balance));

        // 保存到localStorage
        localStorage.setItem('walletConnected', 'true');
      }
    } catch (error: any) {
      console.error('连接钱包失败:', error);
      alert('连接钱包失败：' + error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  // 断开钱包
  const disconnect = () => {
    setAccount(null);
    setBalance(null);
    setProvider(null);
    setSigner(null);
    localStorage.removeItem('walletConnected');
  };

  // 监听账户变化
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          // 重新获取余额
          if (provider) {
            provider.getBalance(accounts[0]).then((balance) => {
              setBalance(ethers.utils.formatEther(balance));
            });
          }
        } else {
          disconnect();
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeAllListeners();
      }
    };
  }, [provider]);

  // 自动连接（如果之前连接过）
  useEffect(() => {
    const wasConnected = localStorage.getItem('walletConnected');
    if (wasConnected === 'true' && typeof window.ethereum !== 'undefined') {
      connect();
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        balance,
        isConnected: !!account,
        isConnecting,
        connect,
        disconnect,
        provider,
        signer
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

// 声明window.ethereum类型
declare global {
  interface Window {
    ethereum?: any;
  }
}

