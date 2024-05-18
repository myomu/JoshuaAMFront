import React from "react";
import Header from "../components/Header/Header";
import JoinForm from "../components/Join/JoinForm";
import * as auth from '../apis/auth';
import { useNavigate } from "react-router-dom";
import * as Swal from '../apis/alert';

const Join = () => {

  const navigate = useNavigate();

  // 회원 가입 요청
  const join = async (form) => {
    console.log(form);

    let response;
    let data;
    try {
      response = await auth.join(form);
    } catch (error) {
      console.error(`${error}`);
      console.error(`회원 가입 요청 중 에러가 발생하였습니다.`);
      if (error.response.status === 400) {
        Swal.alert("회원가입 실패", error.response.data, "error");
      }
      return;
    }

    data = response.data;
    const status = response.status;
    console.log(`data : ${data}`);
    console.log(`status : ${status}`);

    if (status === 200) {
      console.log(`회원가입 성공!`);
      // alert(`회원가입 성공!`);
      // navigate("/login");
      Swal.alert("회원가입 성공", "메인 화면으로 이동합니다.", "success", () => {navigate("/login")});
    } else {
      console.log(`회원가입 실패!`);
      // alert(`회원가입에 실패하였습니다.`);
      Swal.alert("회원가입 실패", "회원가입에 실패하였습니다.", "error");
    }
  }

  return (
    <>
      <div className="container">
        <JoinForm join={ join } />
      </div>
    </>
  );
};

export default Join;
