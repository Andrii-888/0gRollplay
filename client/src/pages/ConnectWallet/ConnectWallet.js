import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import globalContext from "./../../context/global/globalContext";
import socketContext from "../../context/websocket/socketContext";
import { CS_FETCH_LOBBY_INFO } from "../../game/actions";
import useWallet from "../../hooks/useWallet";
import "./ConnectWallet.scss";

const USERNAME_MIN = 3;
const USERNAME_MAX = 20;
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

const validateUsername = (value) => {
  if (!value.trim()) return "Username is required";
  if (value.trim().length < USERNAME_MIN)
    return "Minimum " + USERNAME_MIN + " characters";
  if (value.trim().length > USERNAME_MAX)
    return "Maximum " + USERNAME_MAX + " characters";
  if (!USERNAME_REGEX.test(value.trim()))
    return "Only letters, numbers and _ allowed";
  return null;
};

const ConnectWallet = () => {
  const { setWalletAddress } = useContext(globalContext);
  const { socket } = useContext(socketContext);
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);

  const {
    address,
    loading,
    error,
    connect,
    disconnect,
    saveUsername,
    getSavedUsername,
  } = useWallet();
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(null);
  const [touched, setTouched] = useState(false);

  const hasMetaMask = typeof window !== "undefined" && Boolean(window.ethereum);
  const isUsernameValid = validateUsername(username) === null;

  // Load saved username on mount
  useEffect(() => {
    const saved = getSavedUsername();
    if (saved) setUsername(saved);
  }, [getSavedUsername]);

  // Handle URL params (external link flow)
  useEffect(() => {
    if (socket !== null && socket.connected === true) {
      const walletAddress = query.get("walletAddress");
      const gameId = query.get("gameId");
      const urlUsername = query.get("username");
      if (walletAddress && gameId && urlUsername) {
        setWalletAddress(walletAddress);
        socket.emit(CS_FETCH_LOBBY_INFO, {
          walletAddress,
          socketId: socket.id,
          gameId,
          username: urlUsername,
        });
        navigate("/play");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    if (value.length <= USERNAME_MAX + 1) setUsername(value);
    if (touched) setUsernameError(validateUsername(value));
  };

  const handleUsernameBlur = () => {
    setTouched(true);
    setUsernameError(validateUsername(username));
  };

  const enterGame = (walletAddr) => {
    saveUsername(username.trim());
    setWalletAddress(walletAddr);
    if (socket && socket.connected) {
      socket.emit(CS_FETCH_LOBBY_INFO, {
        walletAddress: walletAddr,
        socketId: socket.id,
        gameId: "1",
        username: username.trim(),
      });
      navigate("/play");
    }
  };

  const handleConnect = async () => {
    setTouched(true);
    const err = validateUsername(username);
    if (err) {
      setUsernameError(err);
      return;
    }

    const walletAddress = await connect();
    if (walletAddress) {
      enterGame(walletAddress);
    }
  };

  const handlePlayAsGuest = () => {
    setTouched(true);
    const err = validateUsername(username);
    if (err) {
      setUsernameError(err);
      return;
    }

    const guestAddress =
      "0x" +
      Array.from({ length: 40 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
    enterGame(guestAddress);
  };

  const handleDisconnect = () => {
    disconnect();
    setUsername("");
    setTouched(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && isUsernameValid && !loading) {
      if (address) {
        enterGame(address);
      } else if (hasMetaMask) {
        handleConnect();
      } else {
        handlePlayAsGuest();
      }
    }
  };

  return (
    <div className="connect-wallet-container">
      <div className="connect-wallet-card">
        <p className="connect-wallet-subtitle">Connect your wallet to play</p>

        {!address ? (
          <>
            <div className="connect-wallet-field">
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={handleUsernameChange}
                onBlur={handleUsernameBlur}
                onKeyDown={handleKeyDown}
                className={
                  "connect-wallet-input" +
                  (touched && usernameError ? " input-error" : "") +
                  (touched && !usernameError && username ? " input-valid" : "")
                }
              />
              {touched && usernameError && (
                <span className="field-error">{usernameError}</span>
              )}
              {touched && !usernameError && username && (
                <span className="field-valid">Username is valid</span>
              )}
              <span className="field-hint">
                {username.length}/{USERNAME_MAX}
              </span>
            </div>

            {hasMetaMask ? (
              <button
                onClick={handleConnect}
                disabled={loading || !isUsernameValid}
                className="connect-wallet-button"
              >
                {loading ? "Connecting..." : "Connect MetaMask"}
              </button>
            ) : (
              <button
                onClick={handlePlayAsGuest}
                disabled={!isUsernameValid}
                className="connect-wallet-button"
              >
                Play as Guest
              </button>
            )}

            {hasMetaMask && (
              <button
                onClick={handlePlayAsGuest}
                disabled={!isUsernameValid}
                className="connect-wallet-guest"
              >
                or Play as Guest
              </button>
            )}

            {!hasMetaMask && (
              <p className="connect-wallet-hint">
                Install MetaMask to connect your wallet
              </p>
            )}
          </>
        ) : (
          <div className="connect-wallet-connected">
            <p className="wallet-address-display">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
            <div className="connect-wallet-field">
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={handleUsernameChange}
                onBlur={handleUsernameBlur}
                onKeyDown={handleKeyDown}
                className={
                  "connect-wallet-input" +
                  (touched && usernameError ? " input-error" : "") +
                  (touched && !usernameError && username ? " input-valid" : "")
                }
              />
              {touched && usernameError && (
                <span className="field-error">{usernameError}</span>
              )}
              <span className="field-hint">
                {username.length}/{USERNAME_MAX}
              </span>
            </div>
            <button
              onClick={() => enterGame(address)}
              disabled={!isUsernameValid || loading}
              className="connect-wallet-button"
            >
              Enter Game
            </button>
            <button
              onClick={handleDisconnect}
              className="connect-wallet-disconnect"
            >
              Disconnect Wallet
            </button>
          </div>
        )}

        {error && <p className="connect-wallet-error">{error}</p>}
        {!socket?.connected && (
          <p className="connect-wallet-warning">Connecting to server...</p>
        )}
      </div>
    </div>
  );
};

export default ConnectWallet;
