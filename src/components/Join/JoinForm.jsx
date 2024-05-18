import './JoinForm.css';

const JoinForm = ({ join }) => {

  const onJoin = (e) => {
    e.preventDefault(); // submit 기본 동작 방지
    const form = e.target;
    const userLoginId = form.username.value;
    const userPw = form.password.value;
    const userName = form.name.value;
    const email = form.email.value;

    console.log(userLoginId, userPw, userName, email);

    join( { userLoginId, userPw, userName, email } );
  };

  return (
    <div className="form">
      <h2 className="login-title">Join</h2>

      <form className="login-form" onSubmit={(e) => onJoin(e)}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            name="username"
            autoComplete="username"
            required
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
          />
        </div>

        <button className="btn btn--form btn-login" type="submit">
          Join
        </button>
      </form>
    </div>
  );
};

export default JoinForm;