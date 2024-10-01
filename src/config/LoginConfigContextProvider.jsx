import React, { createContext, useState } from "react";
import api from "../apis/api";
import Cookies from "js-cookie";
import * as auth from "../apis/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetIsLogin, setIsLogin, setRole, setUserInfo } from "./store";

export const LoginConfigContext = createContext();

const LoginConfigContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [errorMessage, setErrorMessage] = useState("");

  /*
    💍✅ 로그인 체크
    - 쿠키에 jwt 가 있는지 확인
    - jwt 로 사용자 정보를 요청
  */
  const loginCheck = async () => {
    // 🍪 -> 💍 쿠키에서 jwt 토큰 가져오기
    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
      //console.log(`쿠키에 accessToken(jwt) 이 없음`);
      logoutSetting();
      return;
    }

    // 사용자 정보 요청
    try {
      const response = await auth.info();
      const data = response.data;

      if (data === "UNAUTHORIZED" || response.status === 401) {
        console.error(`AccessToken 이 만료되었거나 인증에 실패하였습니다.`);
        logoutSetting();
        return;
      }

      loginSetting(data, accessToken);
    } catch (error) {
      console.error(`error : ${error}`);
      logoutSetting();
      return;
    }
  };

  // 🔒 로그인
  const login = async (username, password) => {
    try {
      const response = await auth.login(username, password); // 예외 발생시 catch로
      const status = response.status;
      const headers = response.headers;
      const authorization = headers.authorization;
      const accessToken = authorization.replace("Bearer ", ""); // 💍 JWT

      // ✅ 로그인 성공
      if (status === 200) {
        // 💍 -> 🍪 쿠키에 accessToken(jwt) 저장
        Cookies.set("accessToken", accessToken);

        // 로그인 체크 ( /users/{userId}  <--- userData)
        await loginCheck();
        setErrorMessage("");
        // 메인 페이지로 이동
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  // 🔓 로그아웃
  const logout = () => {
    // 로그아웃 세팅
    logoutSetting();

    // 메인 페이지로 이동
    navigate("/");
  };

  // 🔒 로그인 세팅
  // 😄 userData, 💍 accessToken (jwt)
  const loginSetting = (userData, accessToken) => {
    const { id, userLoginId, auth, userName, email } = userData;

    // 로그인 여부 : true
    dispatch(setIsLogin(true));

    // 유저 정보 세팅
    const updatedUserInfo = { id, userLoginId, auth, userName, email };
    dispatch(setUserInfo(updatedUserInfo));
    dispatch(setRole(auth));
  };

  // 로그아웃 세팅
  const logoutSetting = async () => {
    try {
      // refreshToken 삭제 요청
      // 로그아웃 요청 보내기
      await api.post(`/auth/logout`, {});

      // 🚀❌ axios 헤더 초기화
      api.defaults.headers.common.Authorization = undefined;

      // 🍪❌ 쿠키 초기화
      Cookies.remove("accessToken");

      // 로그인 여부 : false
      dispatch(resetIsLogin(false));

      // 유저 정보 초기화
      dispatch(setUserInfo(null));

      // 권한 정보 초기화
      dispatch(setRole(null));
    } catch (error) {
      console.error(`Logout Error:${error}`);
    }
  };

  // useEffect(() => {
  //   // 로그인 체크
  //   loginCheck();
  // }, []);

  return (
    <LoginConfigContext.Provider
      value={{ login, loginCheck, logout, logoutSetting, errorMessage }}
    >
      {children}
    </LoginConfigContext.Provider>
  );
};

export default LoginConfigContextProvider;
