import React, { lazy, Suspense, useEffect } from "react";
import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import AttendanceCheck from "./components/attendance/AttendanceCheck.jsx";
import Home from "./pages/Home.jsx";
import LoginConfigContextProvider from "./config/LoginConfigContextProvider";
import PrivateRoute from "./components/routes/PrivateRoute";
import Login from "./pages/Login.jsx";
import Join from "./pages/Join.jsx";
import UserProfile from "./components/User/UserProfile.jsx";
import { setHandleTokenExpired } from "./apis/api.js";
import { useDispatch } from "react-redux";
import { resetIsLogin, setRole, setUserInfo } from "./config/store.js";
import Cookies from "js-cookie";
import Members from "./components/member/Members.jsx";
import Attendances from "./components/attendance/Attendances.jsx";
import Groups from "./components/group/Groups.jsx";

// const Attendances = lazy(() =>
//   import("./components/attendance/Attendances.jsx")
// );
// const Members = lazy(() => import("./components/member/Members.jsx"));
// const Groups = lazy(() => import("./components/group/Groups.jsx"));

function App() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // JWT Token 만료 시 로그인 화면으로 이동
  useEffect(() => {
    setHandleTokenExpired(() => {
      Cookies.remove("accessToken");
      dispatch(resetIsLogin(false));
      dispatch(setUserInfo(null));
      dispatch(setRole(null));
      navigate("/login");
    });
  }, [navigate]);

  return (
      <LoginConfigContextProvider>
          <div className="container">
            {/* <Suspense fallback={ <Loading /> }> */}
              <Routes>
                {/* 권한이 필요없는 Route. */}
                <Route path="/login" element={<Login />} />
                <Route path="/join" element={<Join />} />
                {/* 권한이 필요한 Route. PrivateRoute 를 만들어 적용시켜 주었다. */}
                <Route element={<PrivateRoute />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/attendances/*" element={<Attendances />} />
                  <Route path="/attendanceCheck" element={<AttendanceCheck />} />
                  <Route path="/members/*" element={<Members />} />
                  <Route path="/groups/*" element={<Groups />} />
                  <Route path="/user/profile" element={<UserProfile />} />
                </Route>
              </Routes>
            {/* </Suspense> */}
          </div>
      </LoginConfigContextProvider>
  );
}

export default App;
