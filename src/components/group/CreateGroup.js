import { Button, Col, Form, Row } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../apis/api";

function CreateGroup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const nameChange = (e) => {
    setName(e.target.value);
  };


  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    event.preventDefault(); //페이지 리로드 방지.

    const formData = {
      groupName: name
    }

    api
      .post(`/groups/create`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        alert("그룹 추가에 성공하였습니다.");
        // navigate("/groups"); //navigate 사용시 재 렌더링이 안되는 문제 발생.
        // window.location.reload();
        window.location.replace("/groups");
        // navigate("/groups");
      })
      .catch(function (error) {
        alert("그룹 추가에 실패하였습니다.");
      });
  };

  return (
    <div>
      <div>그룹 추가 화면입니다~</div>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} md="6" controlId="groupName">
            <Form.Label>그룹 이름</Form.Label>
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
        </Row>

        <Button type="submit" className="btnSave">
          저장
        </Button>
        <Button
          onClick={() => {
            navigate("/groups");
          }}
          className="btnCancel"
        >
          취소
        </Button>
      </Form>
    </div>
  );
}

export default CreateGroup;
