import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import globalContext from "./../../context/global/globalContext";
import socketContext from "../../context/websocket/socketContext";
import { CS_FETCH_LOBBY_INFO } from "../../game/actions";
import useWallet from "../../hooks/useWallet";
import "./ConnectWallet.scss";

const ConnectWallet = () => {
  const { setWalletAddress } = useContext(globalContext);
  const { socket } = useContext(socketContext);
  const navigate = useNavigate();
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();

  const { address, loading, error, connect } = useWallet();
  const [username, setUsername] = useState("");

  // Handle URL params (existing flow)
  useEffect(() => {
    if (socket !== null && socket.connected === true) {
      const walletAddress = query.get("walletAddress");
      const gameId = query.get("gameId");
      const urlUsername = query.get("username");
      if (walletAddress && gameId && urlUsername) {
        console.log(urlUsername);
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
  }, [socket, navigate, query, setWalletAddress]);

  const handleConnect = async () => {
    const walletAddress = await connect();
    if (walletAddress && socket && socket.connected && username.trim()) {
      setWalletAddress(walletAddress);
      socket.emit(CS_FETCH_LOBBY_INFO, {
        walletAddress,
        socketId: socket.id,
        gameId: "1",
        username: username.trim(),
      });
      navigate("/play");
    }
  };

  return (
    <div className="connect-wallet-container">
      <div className="connect-wallet-card">
        <p className="connect-wallet-subtitle">Connect your wallet to play</p>

        {!address ? (
          <>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="connect-wallet-input"
            />
            <button
              onClick={handleConnect}
              disabled={loading || !username.trim()}
              className="connect-wallet-button"
            >
              {loading ? "Connecting..." : "Connect MetaMask"}
            </button>
          </>
        ) : (
          <div className="connect-wallet-connected">
            <p>
              Connected: {address.slice(0, 6)}...{address.slice(-4)}
            </p>
            <button
              onClick={handleConnect}
              disabled={!username.trim()}
              className="connect-wallet-button"
            >
              Enter Game
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
