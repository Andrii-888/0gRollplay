import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "../../components/loading/LoadingScreen";
import ConnectWallet from "../../pages/ConnectWallet";
import Play from "../../pages/Play";
import NotFoundPage from "../../pages/NotFoundPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/wallet" element={<ConnectWallet />} />
      <Route path="/play" element={<Play />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
