import React from "react";
import JoinForm from "../components/Join/JoinForm";
import { useNavigate } from "react-router-dom";
import * as auth from "../apis/auth";
import * as Swal from "../apis/alert";

const Join = () => {
  const navigate = useNavigate();

  // 회원 가입 요청
  const join = async (form) => {
    let response;
    try {
      response = await auth.join(form);
    } catch (error) {
      console.error(`회원 가입 요청 중 에러가 발생하였습니다 : ${error}`);
      if (error.response.status === 400) {
        Swal.alert("회원가입 실패", error.response.data, "error");
      }
      return;
    }

    const status = response.status;

    if (status === 200) {
      alert("회원가입 성공");
      navigate("/login");
      //Swal.alert("회원가입 성공", "메인 화면으로 이동합니다.", "success", () => {navigate("/login")});
    } else {
      console.error(`회원가입 실패!`);
      alert(`회원가입에 실패하였습니다.`);
    }
  };

  return (
    <>
      <JoinForm join={join} />
    </>
  );
};

export default Join;
