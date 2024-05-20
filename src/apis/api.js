import axios from 'axios';

// axios 객체 생성
const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api`,
    withCredentials: true
});

export default api;
