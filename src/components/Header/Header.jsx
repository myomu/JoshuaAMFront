import React, { useContext } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { LoginConfigContext } from "../../config/LoginConfigContextProvider";
import { Container, Nav, Navbar } from "react-bootstrap";

const Header = () => {
  // isLogin : 로그인 여부 - Y(true), N(false)
  // logout() : 로그아웃 함수 - setLogin(false)
  // const { isLogin, login, logout } = useContext(LoginContext);
  const { login, logout } = useContext(LoginConfigContext);
  const isLogin = useSelector((state) => {
    return state.isLogin.value;
  });

  const navigate = useNavigate();

  console.log(process.env.REACT_APP_API_URL);
  console.log(process.env.REACT_APP_TEST);

  return (
    <>
      {!isLogin ? (
        /* 비로그인 시 */
        <Navbar bg="light" data-bs-theme="light">
          <Container>
            <Navbar.Brand href="/">Joshua AM</Navbar.Brand>
            <Nav className="me-auto text-nowrap">
              {/* <Nav.Link href="/">홈</Nav.Link> */}
              <Nav.Link
                onClick={() => {
                  navigate("/login");
                }}
              >
                로그인
              </Nav.Link>
              <Nav.Link
                onClick={() => {
                  navigate("/join");
                }}
              >
                회원가입
              </Nav.Link>
            </Nav>
            <Nav className="me-auto">
              {/* { result.isLoading ? '로딩중': result.data.name } */}
              {/* {result.isLoading && "로딩중"}
            {result.isError && "에러남"}
            {result.data && result.data.name} */}
            </Nav>
          </Container>
        </Navbar>
      ) : (
        /* 로그인 시 */
        <Navbar bg="light" data-bs-theme="light">
          <Container>
            <Navbar.Brand href="/">Joshua AM</Navbar.Brand>
            <Nav className="me-auto text-nowrap">
              {/* <Nav.Link href="/">홈</Nav.Link> */}
              <Nav.Link
                onClick={() => {
                  navigate("/");
                }}
              >
                홈
              </Nav.Link>
              <Nav.Link
                onClick={() => {
                  navigate("/attendances");
                }}
              >
                출석
              </Nav.Link>
              <Nav.Link
                onClick={() => {
                  navigate("/attendanceCheck");
                }}
              >
                출석체크
              </Nav.Link>
              <Nav.Link
                onClick={() => {
                  navigate("/members");
                }}
              >
                회원
              </Nav.Link>
              <Nav.Link
                onClick={() => {
                  navigate("/groups");
                }}
              >
                그룹
              </Nav.Link>
              <Nav.Link
                onClick={() => {
                    logout()
                }}
              >
                로그아웃
              </Nav.Link>
            </Nav>
            <Nav className="me-auto">
              {/* { result.isLoading ? '로딩중': result.data.name } */}
              {/* {result.isLoading && "로딩중"}
            {result.isError && "에러남"}
            {result.data && result.data.name} */}
            </Nav>
          </Container>
        </Navbar>
      )}
    </>
  );
};

export default Header;
