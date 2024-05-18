import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../apis/api";

function CreateMember() {
  const [validated, setValidated] = useState(false);
  let navigate = useNavigate();

  const [groups, setGroups] = useState("");

  const [name, setName] = useState("");
  const [age, setAge] = useState(0);

  const nameChange = (e) => {
    setName(e.target.value);
  };
  const ageChange = (e) => {
    setAge(e.target.value);
  };

  useEffect(() => {
    api
      .get("http://localhost:8080/api/groups")
      .then((response) => {
        setGroups(response.data);
        console.log("---");
        console.log(response);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    console.log("저장");
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    event.preventDefault();
    setValidated(true);

    let formData = new FormData();
    formData.append("name", name);
    formData.append("age", age);
    formData.append("gender", event.target.gender.value);
    formData.append("group", event.target.group.value);

    for (let key of formData.keys()) {
      console.log(key);
    }
    for (let value of formData.values()) {
      console.log(value);
    }

    api
      .post("http://localhost:8080/api/members/create", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        alert("회원 추가에 성공하였습니다.");
        window.location.replace("/members");
      })
      .catch(function (error) {
        alert("회원 추가에 실패하였습니다.");
      });
  };

  return (
    <div>
      <div>회원추가 화면입니다~</div>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} md="6" controlId="validationCustom01">
            <Form.Label>이름</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="이름"
              value={name}
              onChange={nameChange}
            />
            <Form.Control.Feedback type="invalid">
              이름을 입력해주세요.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} md="4" controlId="validationCustom02">
            <Form.Label>나이</Form.Label>
            <Form.Control
              required
              type="number"
              placeholder="나이"
              min={0}
              max={200}
              value={age}
              onChange={ageChange}
            />
            <Form.Control.Feedback type="invalid">
              나이를 입력해주세요.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} md="4" controlId="gender">
            <Form.Label>성별</Form.Label>
            <div id={"inline-radio"} className="form-check">
              <Form.Check
                inline
                type="radio"
                label="남자"
                id="man"
                name="gender"
                value="MAN"
              />
              <Form.Check
                inline
                type="radio"
                label="여자"
                id="woman"
                name="gender"
                value="WOMAN"
              />
            </div>
          </Form.Group>

          <Form.Group as={Col} md="3" controlId="group">
            <Form.Label>조</Form.Label>
            <Form.Select aria-label="Default select example">
              <option>조 없음</option>
              {groups
                ? groups.map((a, i) => (
                    <option key={i} value={a.groupId}>
                      {a.groupName}
                    </option>
                  ))
                : null}
            </Form.Select>
          </Form.Group>
        </Row>
        <Button type="submit" className="btnSave">
          저장
        </Button>
        <Button
          onClick={() => {
            navigate("/members");
          }}
          className="btnCancel"
        >
          취소
        </Button>
      </Form>
    </div>
  );
}

export default CreateMember;
