import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import CreateGroup from "./CreateGroup";
import EditGroup from "./EditGroup";
import GroupList from "./GroupList";
import Header from "../Header/Header";

const Groups = () => {

  return (
    <div>
      <Header />
      <Suspense fallback={<div>로딩중임</div>}>
        <Routes>
          <Route path="/" element={<GroupList />} />
          <Route path="/create" element={<CreateGroup />} />
          <Route path="/edit/:groupId" element={<EditGroup />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default Groups;
