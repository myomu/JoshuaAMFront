import React, { useContext, useState } from "react";
import "./LoginForm.css";
import { LoginConfigContext } from "../../config/LoginConfigContextProvider";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const { login } = useContext(LoginConfigContext);
  // const [rememberUserId, setRememberUserId] = useState();

  const navigate = useNavigate();

  const toJoin = () => {
    // console.log("test");
    navigate("/join");
  };

  const onLogin = (e) => {
    // 데이터 세팅
    e.preventDefault();

    const form = e.target;
    const username = form.username.value;
    const password = form.password.value;

    login(username, password);
  };

  return (
    <div className="content">
      <div className="login__form card border-0 shadow rounded-3">
        <div className="text-center card-body p-4 p-sm-5">
          <h5 className="login__form__title card-title text-center mb-5">
            JOSHUA
          </h5>
          <form onSubmit={(e) => onLogin(e)}>
            <div className="form-floating mb-3">
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                placeholder="아이디"
                required
              />
              <label className="form__label" htmlFor="username">
                아이디
              </label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                placeholder="비밀번호"
                required
              />
              <label className="form__label" htmlFor="password">
                비밀번호
              </label>
            </div>
            {/* <hr className="my-4" /> */}
            <div className="d-grid">
              <button
                className="btn btn-primary btn__login text-uppercase fw-bold"
                type="submit"
              >
                로그인
              </button>
            </div>

            <div className="error-message mt-3"></div>
          </form>
          <hr className="mt-3" />
          <div className="btn__login__join text-center" onClick={toJoin}>
            계정 등록
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
