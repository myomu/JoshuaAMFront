import React, { useContext } from 'react';
import './UserProfile.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as auth from "../../apis/auth";
import * as Swal from '../../apis/alert';
import { LoginConfigContext } from '../../config/LoginConfigContextProvider';

const UserProfile = () => {

  const { loginCheck, logoutSetting } = useContext(LoginConfigContext);

  const navigate = useNavigate();

  const goMain = () => {
    navigate("/");
  }

  const userInfo = useSelector((state) => {
    return state.userInfo.info;
  })

  const updateUser = async (form) => {

    let response;
    try {
      response = await auth.updateUser(form);
    } catch (error) {
      console.error(`${error}`);
      console.error(`회원 정보 수정 중 에러가 발생했습니다.`);
      if (error.response.status === 400) {
        Swal.alert("회원 정보 수정 실패", error.response.data, "error");
      }
      return;
    }

    const status = response.status;

    if (status === 200) {
      alert("회원 정보 수정 성공");
      loginCheck();
      window.location.replace("/user/profile");
    }
  }

  const deleteUser = async (form) => {

    let response;
    try {
      response = await auth.removeUser(form);
    } catch (error) {
      console.error(`${error}`);
      console.error(`회원 탈퇴에 실패했습니다.`);
      if (error.response.status === 400) {
        Swal.alert("회원 탈퇴 실패", error.response.data, "error");
      }
      return;
    }

    const status = response.status;

    if (status === 200) {
      alert("회원 탈퇴 성공");
      logoutSetting();
      navigate("/");
    }
  }

  // 사용자 정보 수정
  const onUpdate = (e) => {
    e.preventDefault();

    const id = userInfo.id;

    const form = e.target;
    const userLoginId = form.username.value;
    const userPw = form.password.value;
    const userName = form.name.value;
    const email = form.email.value;

    console.log(id, userPw, userName, email);

    updateUser( { id, userLoginId, userPw, userName, email } );
  };

  return (
    // <div className="form">
    //   <h2 className="login-title">UserInfo</h2>

    //   <form className="login-form" onSubmit={(e) => onUpdate(e)}>
    //     <div>
    //       <label htmlFor="username">Username</label>
    //       <input
    //         id="username"
    //         type="text"
    //         placeholder="Username"
    //         name="username"
    //         autoComplete="username"
    //         required
    //         readOnly
    //         defaultValue={userInfo?.userId}
    //       />
    //     </div>
    //     <div>
    //       <label htmlFor="password">Password</label>
    //       <input
    //         id="password"
    //         type="password"
    //         placeholder="Password"
    //         name="password"
    //         autoComplete="current-password"
    //         required
    //       />
    //     </div>
    //     <div>
    //       <label htmlFor="name">Name</label>
    //       <input
    //         id="name"
    //         type="text"
    //         placeholder="Name"
    //         name="name"
    //         autoComplete="name"
    //         required
    //         defaultValue={userInfo?.name}
    //       />
    //     </div>
    //     <div>
    //       <label htmlFor="email">Email</label>
    //       <input
    //         id="email"
    //         type="email"
    //         placeholder="Email"
    //         name="email"
    //         autoComplete="email"
    //         required
    //         defaultValue={userInfo?.email}
    //       />
    //     </div>

    //     <button className="btn btn--form btn-login" type="submit">
    //         정보 수정
    //     </button>
    //     <button className="btn btn--form btn-login" type="button" 
    //         onClick={ () => deleteUser(userInfo.userId) }>
    //           회원 탈퇴
    //     </button>
    //   </form>
    // </div>

    <div className="content">
      <div className="edit__user__form card border-0 shadow rounded-3">
        <div className="card-body p-4 p-sm-5">
          <h5 className="edit__user__form__title card-title mb-5" onClick={goMain}>
            회원 정보
          </h5>
          <form onSubmit={(e) => onUpdate(e)}>
            <div className="form-floating mb-3">
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                placeholder="아이디"
                autoComplete="username"
                required
                readOnly
                defaultValue={userInfo?.userLoginId}
              />
              <label className="form__label" htmlFor="username">
                아이디
              </label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                placeholder="비밀번호"
                autoComplete="current-password"
                required
              />
              <label className="form__label" htmlFor="password">
                비밀번호
              </label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                placeholder="이름"
                autoComplete="name"
                required
                defaultValue={userInfo?.userName}
              />
              <label className="form__label" htmlFor="name">
                이름
              </label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                placeholder="이메일"
                autoComplete="email"
                defaultValue={userInfo?.email}
                required
              />
              <label className="form__label" htmlFor="email">
                이메일
              </label>
            </div>
            
            <div className="d-grid">
              <button
                className="btn btn-primary btn__edit text-uppercase fw-bold"
                type="submit"
              >
                회원 정보 수정
              </button>
            </div>

            <hr className='mt-3' />
            <div className="btn__delete__account" type="button" 
            onClick={() => {
              Swal.confirm(
                "회원 탈퇴",
                "회원 탈퇴 하시겠습니까?",
                "warning",
                (result) => {
                  if (result.isConfirmed) {
                    deleteUser(userInfo.id);
                  }
                }
              )
            }}>
              회원 탈퇴
            </div>
            {/* <div className="error-message mt-3"></div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;