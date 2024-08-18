import React, { Suspense } from "react";
import Header from "../Header/Header";
import Loading from "../Loading/Loading";
import { Route, Routes } from "react-router-dom";
import MinutesList from "./MinutesList";
import CreateMinutes from "./CreateMinutes";
import DetailMinutes from "./DetailMinutes";
import EditMinutes from "./EditMinutes";

const Minutes = () => {
  return (
    <div>
      <Header />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<MinutesList />} />
          <Route path="/create" element={<CreateMinutes />} />
          <Route path="/detail/:minutesId" element={<DetailMinutes />} />
          <Route path="/edit/:minutesId" element={<EditMinutes />} />
        </Routes>
      </Suspense>

    </div>
  ) 


};

export default Minutes;
