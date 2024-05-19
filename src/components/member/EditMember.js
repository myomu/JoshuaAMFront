import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../apis/api";

function EditMember() {
  const { memberId } = useParams();
  let navigate = useNavigate();
  const [groups, setGroups] = useState("");

  
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(0);
  const [gender, setGender] = useState();
  const [group, setGroup] = useState();

  const [validated, setValidated] = useState(false);

  const nameChange = (e) => {
    setName(e.target.value);
  };
  const dateOfBirthChange = (e) => {
    setDateOfBirth(e.target.value);
  };

  const Server = `${process.env.REACT_APP_Server}`;

  useEffect(() => {
    api.get(`/api/groups`)
    .then((response) => {
      setGroups(response.data);
    })
    api
      .get(`/api/members/edit/` + memberId)
      .then((response) => {
        setName(response.data.name);
        setDateOfBirth(response.data.dateOfBirth);
        setGender(response.data.gender);
        setGroup(response.data.groupId);
        console.log(response);
      })
      .catch((error) => console.log(error));
  }, [memberId]);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    console.log("저장");
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    event.preventDefault(); //페이지 리로드 방지.

    let formData = new FormData();
    formData.append("name", name);
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("gender", gender);
    formData.append("group", group);

    api
      .post(`/api/members/edit/` + memberId, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        alert("회원 수정에 성공하였습니다.");
        window.location.replace("/members");
      })
      .catch(function (error) {
        alert("회원 수정에 실패하였습니다.");
      });
  };

  const handleSelectGroup = (e) => {
    setGroup(e.target.value);
  }

  const handleSelectGender = (e) => {
    setGender(e.target.value);
  }

  return (
    <div>
      <div>회원수정 화면입니다</div>
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
            <Form.Label>생년월일</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="생년월일"
              min={0}
              max={200}
              value={dateOfBirth}
              onChange={dateOfBirthChange}
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
                checked={gender === "MAN"}
                onChange={handleSelectGender}
              />
              <Form.Check
                inline
                type="radio"
                label="여자"
                id="woman"
                name="gender"
                value="WOMAN"
                checked={gender === "WOMAN"}
                onChange={handleSelectGender}
              />
            </div>
          </Form.Group>

          <Form.Group as={Col} md="3" controlId="group">
            <Form.Label>조</Form.Label>
            <Form.Select value={group} onChange={handleSelectGroup}>
              <option value={-1}>조 없음</option>
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

export default EditMember;
