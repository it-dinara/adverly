import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdvertisementPage from "./pages/ItemPage";
import React, { StrictMode } from "react";
import FormPage from "./pages/FormPage";
import ListOfAdvertisementsPage from "./pages/ItemsListPage";

function App() {
  return (
    <StrictMode>
      <Routes>
        <Route path="/items/:id" element={<AdvertisementPage />} />
        <Route path="/list/" element={<ListOfAdvertisementsPage />} />
        <Route path="/form" element={<FormPage />} />
      </Routes>
    </StrictMode>
  );
}

export default App;
