import React from 'react'
import ReactDOM from 'react-dom'

import "./App.scss";
import "boxicons/css/boxicons.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Chart from "./pages/Chart";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Chart />} />
          <Route path="/calendar" element={<Chart />} />
          <Route path="/user/:id" element={<Chart />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
