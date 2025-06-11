import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Patients from "./pages/Patients";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/patients" />} />
        <Route path="/patients" element={<Patients />} />
        {/* Ajoute les autres routes ici plus tard */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
