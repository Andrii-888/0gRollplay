import { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";

const WALLET_KEY = "0g_wallet_address";
const USERNAME_KEY = "0g_username";
const CHIPS_KEY = "0g_chips_balance";

export const useWallet = () => {
  const [address, setAddress] = useState(() =>
    localStorage.getItem(WALLET_KEY)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(null);
  const [txStatus, setTxStatus] = useState(null);
  const [chipsBalance, setChipsBalance] = useState(() => {
    const saved = localStorage.getItem(CHIPS_KEY);
    return saved ? parseInt(saved, 10) : 10000;
  });

  useEffect(() => {
    const savedAddress = localStorage.getItem(WALLET_KEY);
    if (savedAddress && window.ethereum) {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts) => {
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            localStorage.setItem(WALLET_KEY, accounts[0]);
            fetchBalance(accounts[0]);
          } else {
            localStorage.removeItem(WALLET_KEY);
            setAddress(null);
          }
        })
        .catch(() => {
          localStorage.removeItem(WALLET_KEY);
          setAddress(null);
        });
    }
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        localStorage.removeItem(WALLET_KEY);
        setAddress(null);
        setBalance(null);
      } else {
        localStorage.setItem(WALLET_KEY, accounts[0]);
        setAddress(accounts[0]);
        fetchBalance(accounts[0]);
      }
    };
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  const fetchBalance = async (addr) => {
    if (!window.ethereum || !addr) return;
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const bal = await provider.getBalance(addr);
      setBalance(ethers.utils.formatEther(bal));
    } catch (err) {
      console.log("Balance fetch error:", err.message);
    }
  };

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed. Please install MetaMask extension.");
      return null;
    }
    try {
      setLoading(true);
      setError(null);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        localStorage.setItem(WALLET_KEY, accounts[0]);
        await fetchBalance(accounts[0]);
        return accounts[0];
      }
    } catch (err) {
      if (err.code === 4001) {
        setError("Connection rejected by user");
      } else {
        setError("Connection error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
    return null;
  }, []);

  const disconnect = useCallback(() => {
    localStorage.removeItem(WALLET_KEY);
    localStorage.removeItem(USERNAME_KEY);
    setAddress(null);
    setBalance(null);
    setTxStatus(null);
  }, []);

  const buyChips = useCallback(
    async (amount) => {
      if (!window.ethereum || !address) {
        setError("Connect wallet first");
        return false;
      }
      try {
        setTxStatus("pending");
        setError(null);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const ethAmount = (amount / 100000).toFixed(6);
        const tx = await signer.sendTransaction({
          to: "0x0000000000000000000000000000000000000000",
          value: ethers.utils.parseEther(ethAmount),
        });
        setTxStatus("confirming");
        await tx.wait();
        const newBalance = chipsBalance + amount;
        setChipsBalance(newBalance);
        localStorage.setItem(CHIPS_KEY, newBalance.toString());
        setTxStatus("success");
        await fetchBalance(address);
        setTimeout(() => setTxStatus(null), 3000);
        return true;
      } catch (err) {
        if (err.code === 4001 || err.code === "ACTION_REJECTED") {
          setTxStatus("rejected");
          setError("Transaction rejected");
        } else if (err.message && err.message.includes("insufficient funds")) {
          setTxStatus("error");
          setError("Insufficient funds. Please add ETH to your wallet.");
        } else {
          setTxStatus("error");
          setError("Transaction failed. Please try again.");
        }
        setTimeout(() => {
          setTxStatus(null);
          setError(null);
        }, 4000);
        return false;
      }
    },
    [address, chipsBalance]
  );

  const saveUsername = useCallback((name) => {
    localStorage.setItem(USERNAME_KEY, name);
  }, []);

  const getSavedUsername = useCallback(() => {
    return localStorage.getItem(USERNAME_KEY) || "";
  }, []);

  return {
    address,
    loading,
    error,
    balance,
    txStatus,
    chipsBalance,
    connect,
    disconnect,
    buyChips,
    saveUsername,
    getSavedUsername,
  };
};

export default useWallet;
