import React, { useContext, useEffect } from 'react';
import './UserProfile.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as Auth from "../../apis/auth";
import * as Swal from '../../apis/alert';
import { LoginConfigContext } from '../../config/LoginConfigContextProvider';
import { setUserInfo } from '../../config/store';

const UserProfile = () => {

  const { logoutSetting } = useContext(LoginConfigContext);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const goMain = () => {
    navigate("/");
  }

  // 프로필 화면 렌더링 시 userInfo를 다시 받아올 수 있도록 설정
  const refreshUserInfo = async () => {

    let response;
    let data;

    try {
      response = await Auth.info();
    } catch (error) {
      console.error(`error: ${error}`);
      return;
    }

    data = response.data;
    const { id, userLoginId, auth, userName, email } = data;
    const updatedUserInfo = { id, userLoginId, auth, userName, email };
    dispatch(setUserInfo(updatedUserInfo));

  }

  useEffect(() => {
    refreshUserInfo();
  }, [])

  const userInfo = useSelector((state) => {
    return state.userInfo.info;
  })

  // 사용자 정보 수정 요청 보냄
  const updateUser = async (form) => {

    let response;
    try {
      response = await Auth.updateUser(form);
    } catch (error) {
      console.error(`${error}`);
      console.error(`계정 정보 수정 중 에러가 발생했습니다.`);
      if (error.response.status === 400) {
        alert("계정 정보 수정 실패");
      }
      return;
    }

    const status = response.status;

    if (status === 200) {
      alert("계정 정보 수정 성공");
      dispatch(setUserInfo(form));
      window.location.replace("/user/profile");
    }
  }

  // 사용자 탈퇴
  const deleteUser = async (form) => {

    let response;
    try {
      response = await Auth.removeUser(form);
    } catch (error) {
      console.error(`${error}`);
      console.error(`계정 탈퇴에 실패했습니다.`);
      if (error.response.status === 400) {
        alert("계정 탈퇴 실패");
      }
      return;
    }

    const status = response.status;

    if (status === 200) {
      alert("계정 탈퇴 성공");
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

    updateUser( { id, userLoginId, userPw, userName, email } );
  };

  return (
    <div className="content">
      <div className="edit__user__form card border-0 shadow rounded-3">
        <div className="card-body p-4 p-sm-5">
          <h5 className="edit__user__form__title card-title mb-5" onClick={goMain}>
            계정 정보
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
                계정 정보 수정
              </button>
            </div>

            <hr className='mt-3' />
            <div className="btn__delete__account" type="button" 
            onClick={() => {
              Swal.confirm(
                "계정 탈퇴",
                "계정 탈퇴 하시겠습니까?",
                "warning",
                (result) => {
                  if (result.isConfirmed) {
                    deleteUser(userInfo.id);
                  }
                }
              )
            }}>
              계정 탈퇴
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;