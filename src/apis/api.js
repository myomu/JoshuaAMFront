import axios from 'axios';

// axios 객체 생성
const api = axios.create({
    baseURL: `/api`,
    withCredentials: true
});

export default api;
