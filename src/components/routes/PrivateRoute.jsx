import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, Route } from "react-router-dom";

const PrivateRoute = ({ path, element }) => {
  const isLogin = useSelector((state) => {
    return state.isLogin.value;
  });
  console.log(isLogin);

  return isLogin ? (
    // <Route path={path} element={element} />
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
