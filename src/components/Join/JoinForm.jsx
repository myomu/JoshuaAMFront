import { useNavigate } from 'react-router-dom';
import './JoinForm.css';

const JoinForm = ({ join }) => {

  const navigate = useNavigate();

  const onJoin = (e) => {
    e.preventDefault(); // submit 기본 동작 방지
    const form = e.target;
    const userLoginId = form.username.value;
    const userPw = form.password.value;
    const userName = form.name.value;
    const email = form.email.value;
    const authKey = form.authKey.value;

    console.log(userLoginId, userPw, userName, email, authKey);

    join( { userLoginId, userPw, userName, email, authKey } );
  };

  const goMain = () => {
    navigate("/");
  }

  return (
    // <div className="form">
    //   <h2 className="login-title">Join</h2>

    //   <form className="login-form" onSubmit={(e) => onJoin(e)}>
    //     <div>
    //       <label htmlFor="username">Username</label>
    //       <input
    //         id="username"
    //         type="text"
    //         placeholder="Username"
    //         name="username"
    //         autoComplete="username"
    //         required
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
    //       />
    //     </div>

    //     <button className="btn btn--form btn-login" type="submit">
    //       Join
    //     </button>
    //   </form>
    // </div>
    <div className="content">
      <div className="join__form card border-0 shadow rounded-3">
        <div className="card-body p-4 p-sm-5">
          <h5 className="join__form__title card-title mb-5" onClick={goMain}>
            JOSHUA
          </h5>
          <form onSubmit={(e) => onJoin(e)}>
            <div className="form-floating mb-3">
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                placeholder="아이디"
                required
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
                required
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
                required
              />
              <label className="form__label" htmlFor="email">
                이메일
              </label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                id="authKey"
                name="authKey"
                className="form-control"
                placeholder="인증키"
                required
              />
              <label className="form__label" htmlFor="authKey">
                인증키
              </label>
            </div>
            <div className="d-grid">
              <button
                className="btn btn-primary btn__login text-uppercase fw-bold"
                type="submit"
              >
                회원가입
              </button>
            </div>

            {/* <div className="error-message mt-3"></div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinForm;