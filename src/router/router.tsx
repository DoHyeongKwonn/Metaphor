import { Routes, Route } from "react-router-dom";
import { memo } from "react";
import Board from "../components/Board";
import Home from "../components/Home";
import CreateAccount from "../components/CreateAccount";
import Login from "../components/Login";
import { Profile } from "../components/Profile";
import WritePage from "../components/WritePage";
import Content from "../components/Content";
import Movies from "../components/Movies";
import Detail from "../components/Detail";
import Edit from "../components/Edit";

const Router = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contents" element={<Board collectionName="contents" />} />
      <Route path="/spoils" element={<Board collectionName="spoils" />} />
      <Route path="/acc" element={<CreateAccount />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/normalWrite" element={<WritePage collectionName="contents" />} />
      <Route path="/spoWrite" element={<WritePage collectionName="spoils" />} />
      <Route path="/Content" element={<Content />} />
      <Route path="/:collectionName/:id" element={<Content />} />
      <Route path="/Movies" element={<Movies />} />
      <Route path="/detail/:id" element={<Detail />} />
      <Route path="/:collectionName/:id/edit" element={<Edit />} />
    </Routes>
  );
};

export default memo(Router);
