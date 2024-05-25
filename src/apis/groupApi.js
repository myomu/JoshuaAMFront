import api from './api';

// 그룹 목록
export const getGroups = () => api.get(`/groups`);

// 그룹 추가
export const createGroup = (data) => api.post(`/groups/create`, data);

// 그룹 수정 화면 요청
export const getEditGroup = (groupId) => api.get(`/groups/edit/${groupId}`);

// 그룹 수정
export const editGroup = (groupId, data) => api.post(`/groups/edit/${groupId}`, data);

// 그룹 삭제
export const deleteGroup = (groupIds) => api.post(`/groups/delete`, groupIds);