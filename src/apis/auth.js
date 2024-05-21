import api from './api';

// 로그인
export const login = (username, password) => {
    return api.post(`/login?username=${username}&password=${password}`,
{
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
}
)
.then(response => {
    console.log('Full response:', response);
    console.log('Response Data:', response.data);
    const authorization = response.headers.get('Authorization');
    console.log(authorization);
})
.catch(error => {
    console.error('Error:', error);
    throw error;
})
}
// 사용자 정보
export const info = () => api.get(`/users/info`)

// 회원 가입
export const join = (data) => api.post(`/users/join`, data)

// 회원 정보 수정
export const update = (data) => api.put(`/users`, data)

// 회원 탈퇴
export const remove = (userId) => api.delete(`/users/${userId}`)