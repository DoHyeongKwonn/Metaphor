import { Routes, Route } from "react-router-dom";
import { memo } from "react";
import Board from "../components/Board";
import Home from "../components/Home";
import CreateAccount from "../components/CreateAccount";
import Login from "../components/Login";
import { Profile } from "../components/Profile";

const Router = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Board" element={<Board />} />
      <Route path="/acc" element={<CreateAccount />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default memo(Router);
