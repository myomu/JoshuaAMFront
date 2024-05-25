import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { resetIsLogin } from "../../config/store";

const PrivateRoute = () => {
  // jwt 토큰이 없으면 로그인을 false 로 설정.
  const dispatch = useDispatch();
  const accessToken = Cookies.get("accessToken");
  
  // 로그인이 true 이면 현재 페이지로, false 이면 로그인 화면으로 이동.
  const isLogin = useSelector((state) => {
    return state.isLogin.value;
  });

  useEffect(() => {
    if (!accessToken) {
      dispatch(resetIsLogin(false));
    };
  }, [])

  return isLogin ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
