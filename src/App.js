import React, { lazy, Suspense, useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import NavbarComponents from "./components/NavbarComponent";
import SidebarMenu from "./components/SidebarMenu";
import { Navbar, Nav, Container } from "react-bootstrap";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  Outlet,
  BrowserRouter,
} from "react-router-dom";
import AttendanceCheck from "./components/attendance/AttendanceCheck.js";
import Home from "./Home.js";
import LoginConfigContextProvider from "./config/LoginConfigContextProvider";
import PrivateRoute from "./components/routes/PrivateRoute";
import Login from "./pages/Login.jsx";
import Join from "./pages/Join.jsx";
import Header from "./components/Header/Header.jsx";

const Attendances = lazy(() =>
  import("./components/attendance/Attendances.js")
);
const Members = lazy(() => import("./components/member/Members.js"));
const Groups = lazy(() => import("./components/group/Groups.js"));

function App() {
  return (
    <BrowserRouter>
      <LoginConfigContextProvider>
        <div>
          {/* <NavbarComponents/> */}
          {/* <SidebarMenu/> */}
          <Header />
          <div className="container">
            <Suspense fallback={<div>로딩중임</div>}>
              <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/join" element={<Join />}></Route>
                {/* 권한이 필요한 Route. PrivateRoute 를 만들어 적용시켜 주었다. */}
                <Route element={<PrivateRoute />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/attendances/*" element={<Attendances />} />
                  <Route
                    path="/attendanceCheck"
                    element={<AttendanceCheck />}
                  />
                  <Route path="/members/*" element={<Members />} />
                  <Route path="/groups/*" element={<Groups />} />
                </Route>
              </Routes>
            </Suspense>
          </div>
        </div>
      </LoginConfigContextProvider>
    </BrowserRouter>
  );
}

export default App;
