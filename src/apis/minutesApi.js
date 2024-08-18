import api from './api';

// 회의록 추가
export const createMinutes = (data) => api.post(`/minutes/create`, data);

// 회의록 추가 전 이미지 파일 업로드
export const uploadImage = (data) => api.post(`/minutes/uploadImage`, data, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

// 회의록 목록 요청
export const getAllOfMinutes = () => api.get(`/minutes`);

// 회의록 하나 요청
export const getOneOfMinutes = (minutesId) => api.get(`/minutes/${minutesId}`);

// 회의록 수정
export const editMinutes = (minutesId, data) => api.post(`/minutes/edit/${minutesId}`, data);

// 회의록 삭제
export const deleteMinutes = (minutesIds) => api.post(`/minutes/delete`, minutesIds);

