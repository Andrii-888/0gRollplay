import React from "react";
import { Routes, Route } from "react-router-dom";
import Play from "../../pages/Play";
import NotFoundPage from "../../pages/NotFoundPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Play />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
