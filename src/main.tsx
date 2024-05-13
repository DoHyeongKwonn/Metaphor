import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import Nav from "./components/Nav.tsx";
import Board from "./components/Board.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Nav />
    <Board />
    {/* <App /> */}
  </React.StrictMode>
);
