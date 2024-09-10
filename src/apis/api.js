import axios from "axios";
import Cookies from "js-cookie";

// axios 객체 생성
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
  withCredentials: true, // 쿠키 전송 허용
});

// Access Token 요청 함수
const requestNewAccessToken = async () => {
  try {
    // get 요청을 사용하지 않는 이유는 브라우저나 중간 프록시 서버에 의해 캐시될 가능성이 있다고 한다.
    // 민감한 정보인 refreshToken 이 URL에 포함되기 때문이다.
    // 또한 restful 서버에서 서버의 상태를 변화 시키는 작업이기에 get 은 적절하지 않다고 한다.
    const response = await api.post("/auth/refresh-token", null);
    //const { accessToken } = response.data;

    const headers = response.headers;
    const authorization = headers.authorization;
    const accessToken = authorization.replace("Bearer ", "");

    Cookies.set("accessToken", accessToken); // 새 액세스 토큰을 쿠키에 저장
    return accessToken;
  } catch (error) {
    console.error("failed to refresh access token: ", error);
    return null;
  }
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

// 최대 재시도 횟수 설정
const MAX_RETRY_COUNT = 3;
let retryCount = 0;

api.interceptors.response.use(
  (response) => {
    if (response?.status === 403) {
      console.warn("forbidden access - redirecting to login.");
      window.location.replace("/login");
    } else if (response?.status === 404) {
      console.warn("resource not fount - 404.");
      // 404 Not found 페이지로 이동하게끔 추가 필요.
      // ...
    }

    return response; // 성공적인 응답은 그대로 반환
  },
  async (error) => {
    const originalRequest = error.config;

    // Access Token 이 만료된 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 재시도 플래그 설정

      // 재시도 횟수 확인
      if (retryCount < MAX_RETRY_COUNT) {
        retryCount++; // 재시도 횟수 증가

        // 새로운 요청 전, 에러 메시지를 통해 refreshToken 존재 및 유효 여부 확인
        const errorMessage = error.response.data?.error;

        if (errorMessage === "Refresh token is missing or expired" || errorMessage === "Refresh token is invalid") {
          handleTokenExpired(); // RefreshToken 이 없음 - 로그아웃 처리
          return Promise.reject(error);
        }

        const newAccessToken = await requestNewAccessToken(); // 새로운 Access Token 요청
        
        if (newAccessToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          retryCount = 0;
          return api(originalRequest); // 원래 요청 재시도
        }
      }

      // 재시도 횟수 초과 또는 토큰 발급 실패 시
      handleTokenExpired(); // Refresh Token 도 만료된 경우 로그아웃 처리
      retryCount = 0; // 재시도 횟수 초기화
      return Promise.reject(error); // 루프 방지
    }

    return Promise.reject(error);
  }
);

// 최상위 컴포넌트인 App.js 에서 렌더링 될때마다 Cookie 값을 제거하고
// login 화면으로 navigate 하게 만들어주는 코드를 handleTokenExpired 에 넣어준다.
// 401 에러가 나면 handleTokenExpired 를 실행하여 로그아웃 처리를 하게된다.
let handleTokenExpired = () => {};

export const setHandleTokenExpired = (handler) => {
  handleTokenExpired = handler;
};

export default api;
