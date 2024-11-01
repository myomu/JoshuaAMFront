// import React, { useEffect } from "react";
// import api from "../apis/api";
// import Cookies from "js-cookie";
// import * as auth from "../apis/auth";
// import { useNavigate } from "react-router-dom";
// import * as Swal from "../apis/alert";
// import { useDispatch, useSelector } from "react-redux";
// import { setIsLogin, setRoles, setUserInfo } from "./store";

// // const dispatch = useDispatch();
// // const isLogin = useSelector((state) => {
// //   return state.isLogin;
// // });
// // const userInfo = useSelector((state) => {
// //   return state.userInfo;
// // });
// // const roles = useSelector((state) => {
// //   return state.roles;
// // });

// /*
//     💍✅ 로그인 체크
//     - 쿠키에 jwt 가 있는지 확인
//     - jwt 로 사용자 정보를 요청
//   */
// export const loginCheck = async () => {
//   // 🍪 -> 💍 쿠키에서 jwt 토큰 가져오기
//   const accessToken = Cookies.get("accessToken");
//   console.log(`accessToken : ${accessToken}`);

//   // accessToken (jwt) 이 없음
//   if (!accessToken) {
//     console.log(`쿠키에 accessToken(jwt) 이 없음`);
//     // 로그아웃 세팅
//     logoutSetting();
//     return;
//   }

//   // accessToken (jwt) 이 있음
//   // -> header 에 jwt 담기
//   api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

//   // 사용자 정보 요청
//   let response;
//   let data;

//   try {
//     response = await auth.info();
//   } catch (error) {
//     console.log(`error : ${error}`);
//     console.log(`status : ${response.status}`);
//     return;
//   }

//   data = response.data;
//   console.log(`data : ${data}`);

//   // ❌ 인증 실패
//   if (data === "UNAUTHORIZED" || response.status === 401) {
//     console.error(`accessToken (jwt) 이 만료되었거나 인증에 실패하였습니다.`);
//     return;
//   }

//   // ✅ 인증 성공
//   console.log(`accessToken (jwt) 토큰으로 사용자 인증정보 요청 성공!`);

//   // 로그인 세팅
//   loginSetting(data, accessToken);
// };

// // 🔒 로그인
// export const login = async (username, password) => {
//   console.log(`username: ${username}`);
//   console.log(`password: ${password}`);

//   try {
//     const response = await auth.login(username, password); // 예외 발생시 catch로
//     const data = response.data;
//     const status = response.status;
//     const headers = response.headers;
//     const authorization = headers.authorization;
//     const accessToken = authorization.replace("Bearer ", ""); // 💍 JWT

//     console.log(`data : ${data}`);
//     console.log(`status : ${status}`);
//     console.log(`headers : ${headers}`);
//     console.log(`jwt : ${accessToken}`);

//     // ✅ 로그인 성공
//     if (status === 200) {
//       // 💍 -> 🍪 쿠키에 accessToken(jwt) 저장
//       Cookies.set("accessToken", accessToken);

//       // 로그인 체크 ( /users/{userId}  <--- userData)
//       loginCheck();

//       // alert(`로그인 성공`);
//       Swal.alert(`로그인 성공`, `메인 화면으로 갑니다.`, "success", () => {
//         navigate("/");
//       });

//       // 메인 페이지로 이동
//       navigate("/");
//     }
//   } catch (error) {
//     // 로그인 실패
//     // - 아이디 또는 비밀번호가 일치하지 않습니다.
//     // alert(`로그인 실패!`);
//     Swal.alert(
//       "로그인 실패",
//       "아이디 또는 비밀번호가 일치하지 않습니다.",
//       "error"
//     );
//   }
// };

// // 🔓 로그아웃
// export const logout = (force = false) => {
//   if (force) {
//     // 로그아웃 세팅
//     logoutSetting();

//     // 메인 페이지로 이동
//     navigate("/");
//     return;
//   }

//   // const check = window.confirm(`로그아웃 하시겠습니까?`);
//   // if (check) {
//   //   // 로그아웃 세팅
//   //   logoutSetting();

//   //   // 메인 페이지로 이동
//   //   navigate("/");
//   // }
//   Swal.confirm(
//     "로그아웃 하시겠습니까?",
//     "로그아웃을 진행합니다.",
//     "warning",
//     (result) => {
//       if (result.isConfirmed) {
//         // 로그아웃 세팅
//         logoutSetting();

//         // 메인 페이지로 이동
//         navigate("/");
//       }
//     }
//   );
// };

// // 🔒 로그인 세팅
// // 😄 userData, 💍 accessToken (jwt)
// export const loginSetting = (userData, accessToken) => {
//   const { no, userId, authList } = userData;
//   const roleList = authList.map((auth) => auth.auth);

//   console.log(`no : ${no}`);
//   console.log(`userId : ${userId}`);
//   console.log(`authList : ${authList}`);
//   console.log(`roleList : ${roleList}`);

//   // 🚀 axios 객체의 header(Authorization : `Bearer ${accessToken}`)
//   api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

//   // 로그인 여부 : true
//   dispatch(setIsLogin(true));

//   // 유저 정보 세팅
//   const updatedUserInfo = { no, userId, roleList };
//   dispatch(setUserInfo(updatedUserInfo));

//   // 권한정보 세팅
//   const updatedRoles = { isUser: false, isAdmin: false };

//   roleList.forEach((role) => {
//     if (role === "ROLE_USER") updatedRoles.isUser = true;
//     if (role === "ROLE_ADMIN") updatedRoles.isAdmin = true;
//   });
//   dispatch(setRoles(updatedRoles));
// };

// // 로그아웃 세팅
// export const logoutSetting = () => {
//   // 🚀❌ axios 헤더 초기화
//   api.defaults.headers.common.Authorization = undefined;

//   // 🍪❌ 쿠키 초기화
//   Cookies.remove("accessToken");

//   // 로그인 여부 : false
//   dispatch(setIsLogin(false));

//   // 유저 정보 초기화
//   setUserInfo(null);

//   // 권한 정보 초기화
//   setRoles(null);
// };
