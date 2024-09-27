import api from './api';

// 게시글 추가
export const createMinutes = (data) => api.post(`/minutes/create`, data);

// 게시글 추가 전 이미지 파일 업로드
export const uploadImage = (data) => api.post(`/minutes/uploadImage`, data, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

// 게시글 목록 요청
export const getAllOfMinutes = () => api.get(`/minutes`);

// 게시글 하나 요청
export const getOneOfMinutes = (minutesId) => api.get(`/minutes/${minutesId}`);

// 게시글 수정
export const editMinutes = (minutesId, data) => api.post(`/minutes/edit/${minutesId}`, data);

// 게시글 삭제
export const deleteMinutes = (minutesIds) => api.post(`/minutes/delete`, minutesIds);

