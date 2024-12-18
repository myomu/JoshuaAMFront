import api from './api';

// 로그인
export const login = (username, password) => api.post(`/login?username=${username}&password=${password}`)

// 사용자 정보
export const info = () => api.get(`/users/info`)

// 사용자 가입 (회원 가입)
export const join = (data) => api.post(`/users/join`, data)

// 사용자 정보 수정
export const updateUser = (data) => api.put(`/users`, data)

// 사용자 탈퇴 (회원 탈퇴)
export const removeUser = (userId) => api.delete(`/users/${userId}`)