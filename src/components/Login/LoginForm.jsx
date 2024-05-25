import React, { useContext, useState } from "react";
import './LoginForm.css';
import { LoginConfigContext } from "../../config/LoginConfigContextProvider";

const LoginForm = () => {
  const { login } = useContext(LoginConfigContext);
  const [rememberUserId, setRememberUserId] = useState();

  const onLogin = (e) => {
    // 데이터 세팅
    e.preventDefault()

    const form = e.target;
    const username = form.username.value;
    const password = form.password.value;

    login(username, password);
  }

  return (
    <div className="form">
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={(e) => onLogin(e)}>
        <div>
          <label htmlFor="name">username</label>
          <input
            id="username"
            type="text"
            placeholder="username"
            name="username"
            autoComplete="username"
            required
            defaultValue={rememberUserId}
          />
        </div>
        <div>
          <label htmlFor="password">password </label>
          <input
            id="password"
            type="password"
            placeholder="password"
            name="password"
            autoComplete="current-password"
            required
          />
        </div>
        <button type="submit" className="btn btn--form btn-login" value="Login">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
