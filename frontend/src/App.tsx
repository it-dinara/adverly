import { Route, Routes, Navigate } from "react-router-dom";
import AdvertisementPage from "./pages/ItemPage";
import React, { StrictMode } from "react";
import FormPage from "./pages/FormPage";
import ListOfAdvertisementsPage from "./pages/ItemsListPage";

function App() {
  return (
    <StrictMode>
      <Routes>
        <Route path="/" element={<Navigate to="/form" replace />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/list/" element={<ListOfAdvertisementsPage />} />
        <Route path="/items/:id" element={<AdvertisementPage />} />
      </Routes>
    </StrictMode>
  );
}

export default App;
