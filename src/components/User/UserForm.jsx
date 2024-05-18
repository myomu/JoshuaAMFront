import React from 'react';
import './UserForm.css';

const UserForm = ({ userInfo, updateUser, deleteUser }) => {

  // 사용자 정보 수정
  const onUpdate = (e) => {
    e.preventDefault();

    const form = e.target;
    const userId = form.username.value;
    const userPw = form.password.value;
    const name = form.name.value;
    const email = form.email.value;

    console.log(userId, userPw, name, email);

    updateUser( { userId, userPw, name, email } );
  };

  return (
    <div className="form">
      <h2 className="login-title">UserInfo</h2>

      <form className="login-form" onSubmit={(e) => onUpdate(e)}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            name="username"
            autoComplete="username"
            required
            readOnly
            defaultValue={userInfo?.userId}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            name="password"
            autoComplete="current-password"
            required
          />
        </div>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Name"
            name="name"
            autoComplete="name"
            required
            defaultValue={userInfo?.name}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            name="email"
            autoComplete="email"
            required
            defaultValue={userInfo?.email}
          />
        </div>

        <button className="btn btn--form btn-login" type="submit">
            정보 수정
        </button>
        <button className="btn btn--form btn-login" type="button" 
            onClick={ () => deleteUser(userInfo.userId) }>
              회원 탈퇴
        </button>
      </form>
    </div>
  );
};

export default UserForm;