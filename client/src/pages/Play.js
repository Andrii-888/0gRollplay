import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/layout/Container";
import Button from "../components/buttons/Button";
import ErrorBoundary from "../components/ErrorBoundary";
import gameContext from "../context/game/gameContext";
import socketContext from "../context/websocket/socketContext";
import globalContext from "../context/global/globalContext";
import PokerTable from "../components/game/PokerTable";
import { RotateDevicePrompt } from "../components/game/RotateDevicePrompt";
import { PositionedUISlot } from "../components/game/PositionedUISlot";
import { PokerTableWrapper } from "../components/game/PokerTableWrapper";
import { Seat } from "../components/game/Seat/Seat";
import { InfoPill } from "../components/game/InfoPill";
import { GameUI } from "../components/game/GameUI";
import { GameStateInfo } from "../components/game/GameStateInfo";
import BrandingImage from "../components/game/BrandingImage";
import PokerCard from "../components/game/PokerCard";
import background from "../assets/img/background.png";
import useWallet from "../hooks/useWallet";
import "./Play.scss";

const CHIP_PACKAGES = [
  { chips: 1000, label: "1,000", price: "0.01" },
  { chips: 5000, label: "5,000", price: "0.05" },
  { chips: 10000, label: "10,000", price: "0.10" },
  { chips: 50000, label: "50,000", price: "0.50" },
];

const Play = () => {
  const navigate = useNavigate();
  const { socket } = useContext(socketContext);
  const { walletAddress } = useContext(globalContext);
  const {
    messages,
    currentTable,
    seatId,
    joinTable,
    leaveTable,
    sitDown,
    standUp,
    fold,
    check,
    call,
    raise,
  } = useContext(gameContext);

  const [bet, setBet] = useState(0);
  const [showWallet, setShowWallet] = useState(false);
  const [notification, setNotification] = useState(null);

  const {
    address,
    loading: walletLoading,
    error: walletError,
    balance,
    txStatus,
    chipsBalance,
    connect,
    disconnect,
    buyChips,
  } = useWallet();

  const showNotification = (msg, type) => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    if (!socket) return;
    if (walletAddress) {
      joinTable(1);
    }
    return () => leaveTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, walletAddress]);

  useEffect(() => {
    currentTable &&
      (currentTable.callAmount > currentTable.minBet
        ? setBet(currentTable.callAmount)
        : currentTable.pot > 0
        ? setBet(currentTable.minRaise)
        : setBet(currentTable.minBet));
  }, [currentTable]);

  useEffect(() => {
    if (txStatus === "success")
      showNotification("Chips purchased successfully!", "success");
    if (txStatus === "rejected")
      showNotification("Transaction rejected", "error");
    if (txStatus === "error") showNotification("Transaction failed", "error");
  }, [txStatus]);

  const handleBuyChips = async (amount) => {
    if (!address) {
      const walletAddr = await connect();
      if (!walletAddr) return;
    }
    await buyChips(amount);
  };

  const handleLeave = () => {
    leaveTable();
    navigate("/menu");
  };

  return (
    <ErrorBoundary>
      <RotateDevicePrompt />

      {notification && (
        <div
          style={{
            position: "fixed",
            top: "12px",
            right: "1.5rem",
            zIndex: 200,
            padding: "12px 20px",
            borderRadius: "10px",
            background:
              notification.type === "success"
                ? "rgba(74, 222, 128, 0.15)"
                : "rgba(248, 113, 113, 0.15)",
            border:
              "1px solid " +
              (notification.type === "success"
                ? "rgba(74, 222, 128, 0.4)"
                : "rgba(248, 113, 113, 0.4)"),
            color: notification.type === "success" ? "#4ade80" : "#f87171",
            fontSize: "0.85rem",
            fontWeight: 500,
          }}
        >
          {notification.msg}
        </div>
      )}

      <Container
        fullHeight
        style={{
          backgroundImage: `url(${background})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "center center",
          backgroundAttachment: "fixed",
          backgroundColor: "black",
        }}
        className="play-area"
      >
        {currentTable && (
          <>
            <PositionedUISlot
              top="2vh"
              left="1.5rem"
              scale="0.65"
              style={{ zIndex: "50" }}
            >
              <Button small secondary onClick={handleLeave}>
                Leave
              </Button>
            </PositionedUISlot>

            <div
              style={{
                position: "fixed",
                top: "1.5vh",
                right: "1.5rem",
                zIndex: 50,
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  color: "#4ade80",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  background: "rgba(74, 222, 128, 0.1)",
                  padding: "6px 12px",
                  borderRadius: "12px",
                  border: "1px solid rgba(74, 222, 128, 0.2)",
                }}
              >
                {chipsBalance.toLocaleString()} chips
              </span>
              <button
                onClick={() => setShowWallet(!showWallet)}
                style={{
                  padding: "8px 20px",
                  background:
                    "linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #c084fc 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(139, 92, 246, 0.4)",
                }}
              >
                Buy Credits
              </button>
            </div>
          </>
        )}

        <PokerTableWrapper>
          <PokerTable />
          {currentTable && (
            <>
              <PositionedUISlot
                top="-5%"
                left="0"
                scale="0.55"
                origin="top left"
              >
                <Seat
                  seatNumber={1}
                  currentTable={currentTable}
                  sitDown={sitDown}
                />
              </PositionedUISlot>
              <PositionedUISlot
                top="-5%"
                right="2%"
                scale="0.55"
                origin="top right"
              >
                <Seat
                  seatNumber={2}
                  currentTable={currentTable}
                  sitDown={sitDown}
                />
              </PositionedUISlot>
              <PositionedUISlot
                bottom="15%"
                right="2%"
                scale="0.55"
                origin="bottom right"
              >
                <Seat
                  seatNumber={3}
                  currentTable={currentTable}
                  sitDown={sitDown}
                />
              </PositionedUISlot>
              <PositionedUISlot bottom="8%" scale="0.55" origin="bottom center">
                <Seat
                  seatNumber={4}
                  currentTable={currentTable}
                  sitDown={sitDown}
                />
              </PositionedUISlot>
              <PositionedUISlot
                bottom="15%"
                left="0"
                scale="0.55"
                origin="bottom left"
              >
                <Seat
                  seatNumber={5}
                  currentTable={currentTable}
                  sitDown={sitDown}
                />
              </PositionedUISlot>
              <PositionedUISlot
                top="-25%"
                scale="0.55"
                origin="top center"
                style={{ zIndex: "1" }}
              >
                <BrandingImage />
              </PositionedUISlot>
              <PositionedUISlot
                width="100%"
                origin="center center"
                scale="0.60"
                style={{
                  display: "flex",
                  textAlign: "center",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {currentTable.board && currentTable.board.length > 0 && (
                  <>
                    {currentTable.board.map((card, index) => (
                      <PokerCard key={index} card={card} />
                    ))}
                  </>
                )}
              </PositionedUISlot>
              <PositionedUISlot top="-5%" scale="0.60" origin="bottom center">
                {messages && messages.length > 0 && (
                  <>
                    <InfoPill>{messages[messages.length - 1]}</InfoPill>
                    {currentTable.winMessages.length > 0 && (
                      <InfoPill>
                        {
                          currentTable.winMessages[
                            currentTable.winMessages.length - 1
                          ]
                        }
                      </InfoPill>
                    )}
                  </>
                )}
              </PositionedUISlot>
              <PositionedUISlot top="12%" scale="0.60" origin="center center">
                {currentTable.winMessages.length === 0 && (
                  <GameStateInfo currentTable={currentTable} />
                )}
              </PositionedUISlot>
            </>
          )}
        </PokerTableWrapper>

        {currentTable &&
          currentTable.seats[seatId] &&
          currentTable.seats[seatId].turn && (
            <GameUI
              currentTable={currentTable}
              seatId={seatId}
              bet={bet}
              setBet={setBet}
              raise={raise}
              standUp={standUp}
              fold={fold}
              check={check}
              call={call}
            />
          )}
      </Container>

      {showWallet && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 99,
          }}
          onClick={() => setShowWallet(false)}
        />
      )}

      {showWallet && (
        <div
          style={{
            position: "fixed",
            top: "60px",
            right: "1.5rem",
            zIndex: 100,
            background: "rgba(15, 10, 30, 0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            boxShadow: "0 0 40px rgba(139, 92, 246, 0.2)",
            width: "320px",
            color: "white",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <span style={{ fontWeight: 600, fontSize: "1.1rem" }}>
              Buy Credits
            </span>
            <span
              style={{ cursor: "pointer", opacity: 0.6, fontSize: "1.2rem" }}
              onClick={() => setShowWallet(false)}
            >
              x
            </span>
          </div>

          {!address ? (
            <>
              <p
                style={{
                  color: "rgba(196, 181, 253, 0.6)",
                  fontSize: "0.85rem",
                  marginBottom: "16px",
                }}
              >
                Connect your wallet to purchase chips
              </p>
              <button
                onClick={connect}
                disabled={walletLoading}
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "linear-gradient(135deg, #8b5cf6, #c084fc)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {walletLoading ? "Connecting..." : "Connect MetaMask"}
              </button>
            </>
          ) : (
            <>
              <div
                style={{
                  background: "rgba(139, 92, 246, 0.1)",
                  padding: "12px",
                  borderRadius: "10px",
                  marginBottom: "12px",
                  border: "1px solid rgba(139, 92, 246, 0.2)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "0.85rem",
                      color: "#a78bfa",
                    }}
                  >
                    {address.slice(0, 8)}...{address.slice(-6)}
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "rgba(196, 181, 253, 0.5)",
                      cursor: "pointer",
                    }}
                    onClick={disconnect}
                  >
                    Disconnect
                  </span>
                </div>
                {balance && (
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "rgba(196, 181, 253, 0.5)",
                      marginTop: "6px",
                    }}
                  >
                    Balance: {parseFloat(balance).toFixed(4)} ETH
                  </div>
                )}
              </div>

              <div
                style={{
                  background: "rgba(74, 222, 128, 0.08)",
                  padding: "10px",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  textAlign: "center",
                  border: "1px solid rgba(74, 222, 128, 0.15)",
                }}
              >
                <span
                  style={{
                    color: "#4ade80",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                  }}
                >
                  {chipsBalance.toLocaleString()} chips
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                }}
              >
                {CHIP_PACKAGES.map((pkg) => (
                  <button
                    key={pkg.chips}
                    onClick={() => handleBuyChips(pkg.chips)}
                    disabled={
                      txStatus === "pending" || txStatus === "confirming"
                    }
                    style={{
                      padding: "12px 8px",
                      borderRadius: "10px",
                      background: "rgba(139, 92, 246, 0.1)",
                      border: "1px solid rgba(139, 92, 246, 0.25)",
                      color: "#fff",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      opacity:
                        txStatus === "pending" || txStatus === "confirming"
                          ? 0.5
                          : 1,
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                      {pkg.label}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#a78bfa",
                        marginTop: "4px",
                      }}
                    >
                      {pkg.price} ETH
                    </div>
                  </button>
                ))}
              </div>

              {txStatus && (
                <div
                  style={{
                    marginTop: "12px",
                    padding: "10px",
                    borderRadius: "8px",
                    textAlign: "center",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    background:
                      txStatus === "success"
                        ? "rgba(74, 222, 128, 0.1)"
                        : txStatus === "pending" || txStatus === "confirming"
                        ? "rgba(251, 191, 36, 0.1)"
                        : "rgba(248, 113, 113, 0.1)",
                    color:
                      txStatus === "success"
                        ? "#4ade80"
                        : txStatus === "pending" || txStatus === "confirming"
                        ? "#fbbf24"
                        : "#f87171",
                    border:
                      "1px solid " +
                      (txStatus === "success"
                        ? "rgba(74, 222, 128, 0.2)"
                        : txStatus === "pending" || txStatus === "confirming"
                        ? "rgba(251, 191, 36, 0.2)"
                        : "rgba(248, 113, 113, 0.2)"),
                  }}
                >
                  {txStatus === "pending" && "Waiting for approval..."}
                  {txStatus === "confirming" && "Confirming transaction..."}
                  {txStatus === "success" && "Chips purchased!"}
                  {txStatus === "rejected" && "Transaction rejected"}
                  {txStatus === "error" && "Transaction failed"}
                </div>
              )}
            </>
          )}

          {walletError && (
            <p
              style={{
                color: "#f87171",
                fontSize: "0.8rem",
                marginTop: "10px",
              }}
            >
              {walletError}
            </p>
          )}
        </div>
      )}
    </ErrorBoundary>
  );
};

export default Play;
