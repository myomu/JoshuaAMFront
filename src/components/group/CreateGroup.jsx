import { Button, ButtonGroup, Col, Form, Row } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { Button } from "@mui/material";
import * as groupApi from "../../apis/groupApi";
import * as Swal from "../../apis/alert";
import "./CreateOrEditGroup.css";

const CreateGroup = () => {
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState("");

  const [isValid, setIsValid] = useState({
    groupName: true,
  });

  const groupNameChange = (e) => {
    setGroupName(e.target.value);
  };

  // 그룹 추가
  const createGroup = async (form) => {
    try {
      await groupApi.createGroup(form);
      Swal.alert("그룹 추가 성공", "", "success", () => {
        window.location.replace("/groups");
      });
    } catch (error) {
      console.error(`${error}`);
      Swal.alert("그룹 추가 실패", "", "error");
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
    if (!groupName) {
      changeValid("groupName", false);
      return false;
    } else {
      changeValid("groupName", true);
    }

    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault(); //페이지 리로드 방지.

    if (validationCheck()) {
      createGroup({ groupName });
    }
  };

  return (
    <div className="form__container">
      <Form className="group__form" noValidate onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="groupName">
            {/* <Form.Label>그룹 이름</Form.Label> */}
            <Form.Control
              required
              type="text"
              placeholder="그룹 이름"
              value={groupName}
              onChange={groupNameChange}
              isInvalid={!isValid.groupName}
            />
            <Form.Control.Feedback type="invalid">
              그룹 이름을 입력해주세요.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        {/* <div className="btnWrapper"> */}
        <ButtonGroup>
          <Button
            // variant="contained"
            variant="secondary"
            onClick={() => {
              navigate("/groups");
            }}
            className="btnCancel"
          >
            취소
          </Button>
          <Button
            // variant="contained"
            variant="primary"
            type="submit"
            className="btnSave"
          >
            저장
          </Button>
        </ButtonGroup>
        {/* </div> */}
      </Form>
    </div>
  );
};

export default CreateGroup;
