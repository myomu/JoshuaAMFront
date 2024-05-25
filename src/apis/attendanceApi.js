import api from './api';

// 출석 목록
// Get 요청을 보낼때는 params 로 감싸서 보내야한다.
export const getAttendances = () => api.get(`/attendances`);

// 출석 추가
export const createAttendance = (data) => api.post(`/attendances/create`, data);

// 출석체크 회원 데이터 요청
export const getAttendanceCheck = () => api.get(`/attendances/check`);

// 출석체크 데이터 요청
export const getEditAttendanceCheck = (attendanceId) => api.get(`/attendances/edit/${attendanceId}`);

// 출석체크 수정
export const editAttendance = (attendanceId, data) => api.post(`/attendances/edit/${attendanceId}`, data);

// 출석 삭제
export const deleteAttendance = (attendanceIds) => api.post(`/attendances/delete`, attendanceIds);