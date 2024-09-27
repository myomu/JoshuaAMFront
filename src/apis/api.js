import axios from "axios";
import Cookies from "js-cookie";
import { resetIsLogin, setRole, setUserInfo, store } from "../config/store";
// axios 객체 생성
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
  withCredentials: true, // 쿠키 전송 허용
});

let refreshTokenPromise = null;

// Access Token 요청 함수
const requestNewAccessToken = async () => {
  // 이미 RefreshToken 요청이 진행 중이라면, 그 Promise 를 반환하여 다른 요청이 대기하도록 한다.
  // 한 페이지에 서버 요청이 2개 이상이라면 refreshToken 으로 accessToken 을 재발급 하는 요청이 2번 이상이 되는 것을 막기 위함이다.
  if (refreshTokenPromise) {
    return refreshTokenPromise;
  }

  refreshTokenPromise = new Promise(async (resolve, reject) => {
    try {
      // get 요청을 사용하지 않는 이유는 브라우저나 중간 프록시 서버에 의해 캐시될 가능성이 있다고 한다.
      // 민감한 정보인 refreshToken 이 URL에 포함되기 때문이다.
      // 또한 restful 서버에서 서버의 상태를 변화 시키는 작업이기에 get 은 적절하지 않다고 한다.

      const response = await api.post("/auth/refresh-token");
      const headers = response.headers;
      const authorization = headers.authorization;
      const accessToken = authorization.replace("Bearer ", "");

      Cookies.set("accessToken", accessToken); // 새 액세스 토큰을 쿠키에 저장
      resolve(accessToken); // 새 토큰을 반환
    } catch (error) {
      console.error("failed to refresh access token: ", error);
      reject(null);
    } finally {
      refreshTokenPromise = null; // 완료되면 초기화
    }
  });

  return refreshTokenPromise;
};

api.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("accessToken");

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    } else {
      delete config.headers["Authorization"]; // 명시적으로 Authorization 헤더를 제거
    }

    return config;
  },
  (error) => {
    console.error("Request Error: ", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // 성공적인 응답은 그대로 반환
    return response;
  },
  async (error) => {
    if (
      (error.response?.status === 401 &&
        error.response?.data === "Unauthorized: Token is missing") ||
      error.response?.status === 403
    ) {
      console.warn("forbidden access - redirecting to login.");
      logoutSetting();
      window.location.replace("/login");
    } else if (error.response?.status === 404) {
      console.warn("resource not fount - 404.");
      // 404 Not found 페이지로 이동하게끔 추가 필요.
      // ...
    }

    const originalRequest = error.config;

    // Access Token 이 만료된 경우
    if (
      error.response?.status === 401 &&
      error.response?.data === "JWT Token is expired or Invalid Token" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // 재시도 플래그 설정

      // 새로운 요청 전, 에러 메시지를 통해 refreshToken 존재 및 유효 여부 확인
      const errorMessage = error.response.data;

      if (
        errorMessage === "Refresh token is missing or expired" ||
        errorMessage === "Refresh token is invalid"
      ) {
        handleTokenExpired(); // RefreshToken 이 없음 - 로그아웃 처리
        return Promise.reject(error);
      }

      try {
        const newAccessToken = await requestNewAccessToken(); // 새로운 Access Token 요청
        if (newAccessToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return api(originalRequest); // 원래 요청 재시도
        } else {
          logoutSetting();
          window.location.replace("/login");
        }
      } catch (error) {
        logoutSetting();
        window.location.replace("/login");
      }

      // 재시도 횟수 초과 또는 토큰 발급 실패 시
      handleTokenExpired(); // Refresh Token 도 만료된 경우 로그아웃 처리
      return Promise.reject(error); // 루프 방지
    }

    return Promise.reject(error);
  }
);

const logoutSetting = () => {
  Cookies.remove("accessToken");
  store.dispatch(resetIsLogin(false));
  store.dispatch(setUserInfo(null));
  store.dispatch(setRole(null));
};

// 최상위 컴포넌트인 App.js 에서 렌더링 될때마다 Cookie 값을 제거하고
// login 화면으로 navigate 하게 만들어주는 코드를 handleTokenExpired 에 넣어준다.
// 401 에러가 나면 handleTokenExpired 를 실행하여 로그아웃 처리를 하게된다.
let handleTokenExpired = () => {};

export const setHandleTokenExpired = (handler) => {
  handleTokenExpired = handler;
};

export default api;
