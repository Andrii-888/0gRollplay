import { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";

const WALLET_KEY = "0g_wallet_address";
const USERNAME_KEY = "0g_username";

export const useWallet = () => {
  const [address, setAddress] = useState(() =>
    localStorage.getItem(WALLET_KEY)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-reconnect on page load if wallet was previously connected
  useEffect(() => {
    const savedAddress = localStorage.getItem(WALLET_KEY);
    if (savedAddress && window.ethereum) {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts) => {
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            localStorage.setItem(WALLET_KEY, accounts[0]);
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
      } else {
        localStorage.setItem(WALLET_KEY, accounts[0]);
        setAddress(accounts[0]);
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

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
  }, []);

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
    connect,
    disconnect,
    saveUsername,
    getSavedUsername,
  };
};

export default useWallet;
