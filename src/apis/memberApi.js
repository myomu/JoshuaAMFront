import api from './api';

// 회원 목록
// Get 요청을 보낼때는 params 로 감싸서 보내야한다.
export const getMembers = (date) => api.get(`/members`, {params: date});

// 회원 추가
export const createMember = (data) => api.post(`/members/create`, data);

// 회원 수정 데이터 요청
export const getEditMember = (memberId) => api.get(`/members/edit/${memberId}`);

// 회원 수정
export const editMember = (memberId, data) => api.post(`/members/edit/${memberId}`, data);

// 회원 삭제
export const deleteMember = (memberIds) => api.post(`/members/delete`, memberIds);