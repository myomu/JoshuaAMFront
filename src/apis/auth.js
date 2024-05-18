import api from './api';

const Server = `${process.env.REACT_APP_Server}`;
// 로그인
export const login = (username, password) => api.post(`${Server}/login?username=${username}&password=${password}`)

// 사용자 정보
export const info = () => api.get(`${Server}/users/info`)

// 회원 가입
export const join = (data) => api.post(`${Server}/users/join`, data)

// 회원 정보 수정
export const update = (data) => api.put(`${Server}/users`, data)

// 회원 탈퇴
export const remove = (userId) => api.delete(`${Server}/users/${userId}`)