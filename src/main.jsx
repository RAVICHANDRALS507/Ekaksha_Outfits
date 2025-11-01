// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { BrowserRouter } from 'react-router-dom';
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   // <StrictMode>
//   //   <App />
//   // </StrictMode>,

//   <BrowserRouter>
//   <App />
// </BrowserRouter>
//   // <BrowserRouter basename="/Ekaksha-Outfits">
//   //   <App />
//   // </BrowserRouter>,
// )



// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
