import axios from "axios";
import Cookies from "js-cookie";

// axios 객체 생성
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
      config.headers["Authorization"] = undefined;
    } else {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // config.headers["Content-Type"] = "application/json"; <- 요것 때문에 이미자 파일을 서버에서
    // multipartfile 로 못받았던 거였음.

    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use((response) => {
  if (response.status === 404) {
    console.log("404 page 로 이동 필요.");
  }
  if (response.status === 403) {
    window.location.replace("/login");
  }

  return response;
},
async (error) => {
  if (error.response?.status === 401) {
    if (error.response.data === "JWT Token is expired") {
      handleTokenExpired();

    }
    console.error(error.response.data);
  }
  return Promise.reject(error);
}
);

// 최상위 컴포넌트인 App.js 에서 렌더링 될때마다 Cookie 값을 제거하고
// login 화면으로 navigate 하게 만들어주는 코드를 handleTokenExpired 에 넣어준다.
// 401 에러가 나면 handleTokenExpired 를 실행하여 로그아웃 처리를 하게된다.
let handleTokenExpired = () => {}

export const setHandleTokenExpired = (res) => {
  handleTokenExpired = res;
}
export default api;
