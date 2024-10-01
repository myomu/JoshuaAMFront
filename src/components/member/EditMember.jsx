import { useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import * as memberApi from "../../apis/memberApi";
import * as groupApi from "../../apis/groupApi";
import dayjs from "dayjs";
import "./CreateOrEditMember.css";

const EditMember = () => {
  const { memberId } = useParams();
  let navigate = useNavigate();

  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [group, setGroup] = useState("");
  const [groups, setGroups] = useState("");

  // 여러개로 나눠진 valid state 를 isValid state 하나로 합침.
  const [isValid, setIsValid] = useState({
    name: true,
    birthdate: true,
    gender: true,
    group: true,
  });

  const nameChange = (e) => {
    setName(e.target.value);
  };

  const birthdateChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // 숫자 이외의 문자 제거
    if (value.length <= 8) {
      let formatted = value;
      if (value.length > 4) {
        formatted = `${value.slice(0, 4)}.${value.slice(4, 6)}`;
      }
      if (value.length > 6) {
        formatted = `${formatted}.${value.slice(6, 8)}`;
      }
      setBirthdate(formatted);
    }
  };

  const genderChange = (e) => {
    setGender(e.target.value);
  };

  const groupChange = (e) => {
    setGroup(e.target.value);
  };

  // 생년월일이 유효한 값인지 확인하기 위한 함수.
  const birthdateValidation = () => {
    const year = parseInt(birthdate.slice(0, 4), 10);
    const month = parseInt(birthdate.slice(5, 7), 10);
    const day = parseInt(birthdate.slice(8, 10), 10);

    if (dayjs(birthdate, "YYYY.MM.DD").toDate() > Date.now()) return false;

    if (month < 1 || month > 12) return false;

    const daysInMonth = [
      31,
      (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31,
    ];
    if (day < 1 || day > daysInMonth[month - 1]) return false;

    return true;
  };

  const getGroups = async () => {
    try {
      const response = await groupApi.getGroups();
      const data = response.data;
      setGroups(data);
    } catch (error) {
      console.error(`${error}`);
    }
  };

  const getEditMember = async () => {
    try {
      const response = await memberApi.getEditMember(memberId);
      const data = response.data;
      const localDateTime = dayjs.utc(data.birthdate).local();

      setName(data.name);
      setBirthdate(localDateTime.format("YYYY.MM.DD"));
      setGender(data.gender);
      setGroup(data.groupId);
    } catch (error) {
      console.error(`${error}`);
    }
  };

  const editMember = async (form) => {
    try {
      await memberApi.editMember(memberId, form);
      alert("회원 수정 성공");
      window.location.replace("/members");
    } catch (error) {
      console.error(`${error}`);
      alert("회원 수정 실패");
    }
  };

  // valid 변경 함수
  const changeValid = (key, value) => {
    setIsValid((valid) => {
      let newValid = { ...valid };
      newValid[key] = value;
      return newValid;
    });
  };

  // validation 체크 함수
  const validationCheck = () => {
    if (!name) {
      changeValid("name", false);
      return false;
    } else {
      changeValid("name", true);
    }

    if (birthdate.length <= 9 || !birthdateValidation()) {
      changeValid("birthdate", false);
      return false;
    } else {
      changeValid("birthdate", true);
    }

    if (!gender) {
      changeValid("gender", false);
      return false;
    } else {
      changeValid("gender", true);
    }

    if (!group) {
      changeValid("group", false);
      return false;
    } else {
      changeValid("group", true);
    }

    return true;
  };

  useEffect(() => {
    getGroups();
    getEditMember();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault(); //페이지 리로드 방지.

    const convertBirthdate = dayjs(birthdate, "YYYY.MM.DD").toDate();
    if (validationCheck()) {
      editMember({ name, birthdate: convertBirthdate, gender, group });
    }
  };

  return (
    <div className="form__container">
      <Form className="member__form" noValidate onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="name">
            {/* <Form.Label>이름</Form.Label> */}
            <Form.Control
              required
              type="text"
              placeholder="이름"
              value={name}
              onChange={nameChange}
              isInvalid={!isValid.name}
            />
            <Form.Control.Feedback type="invalid">
              이름을 입력해주세요.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="birthdate">
            {/* <Form.Label>생년월일 ex) 1999.01.01 </Form.Label> */}
            <Form.Control
              required
              type="text"
              placeholder="생년월일 8자리"
              value={birthdate}
              onChange={birthdateChange}
              isInvalid={!isValid.birthdate}
              maxLength={10}
              minLength={8}
            />
            <Form.Control.Feedback type="invalid">
              {/* 생년월일을 입력해주세요. */}
              {birthdateValidation()
                ? "생년월일을 입력해주세요."
                : "생년월일이 정확한지 확인해 주세요."}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="gender" className="genderSelect">
            {/* <Form.Label>성별</Form.Label> */}
            <div id={"inline-radio"} className="form-check">
              <Form.Check
                required
                inline
                type="radio"
                label="남자"
                id="man"
                name="gender"
                value="MAN"
                checked={gender === "MAN"}
                onChange={genderChange}
                isInvalid={!isValid.gender}
              />
              <Form.Check
                required
                inline
                type="radio"
                label="여자"
                id="woman"
                name="gender"
                value="WOMAN"
                onChange={genderChange}
                checked={gender === "WOMAN"}
                isInvalid={!isValid.gender}
              />
              <Form.Control.Feedback type="invalid">
                성별을 입력해 주세요.
              </Form.Control.Feedback>
            </div>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="group">
            {/* <Form.Label>그룹</Form.Label> */}
            <Form.Select
              // group 값이 null 이면 에러가 발생. 이를 해결하기 위해 "" 을 추가.
              value={group || ""}
              onChange={groupChange}
              required
              isInvalid={!isValid.group}
            >
              <option value="">그룹 없음</option>
              {groups
                ? groups.map((a, i) => (
                    <option key={i} value={a.groupId}>
                      {a.groupName}
                    </option>
                  ))
                : null}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              그룹을 선택해 주세요.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <ButtonGroup>
          <Button
            onClick={() => {
              navigate("/members");
            }}
            className="btnCancel"
          >
            취소
          </Button>
          <Button variant="primary" type="submit" className="btnSave">
            저장
          </Button>
        </ButtonGroup>
      </Form>
    </div>
  );
};

export default EditMember;
