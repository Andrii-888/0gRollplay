import { useState, useCallback } from "react";
import { ethers } from "ethers";

export const useWallet = () => {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask not installed. Please install MetaMask.");
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      if (accounts.length > 0) {
        setAddress(accounts[0]);
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
    setAddress(null);
  }, []);

  return { address, loading, error, connect, disconnect };
};

export default useWallet;
