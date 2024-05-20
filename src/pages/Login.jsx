import React from "react";
import LoginForm from "../components/Login/LoginForm";

const Login = () => {
  console.log(process.env.REACT_APP_API_URL);
  return (
    <>
      <div className="container">
        <LoginForm />
      </div>
    </>
  );
};

export default Login;
