import { useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import * as groupApi from "../../apis/groupApi";
import "./CreateOrEditGroup.css";

const EditGroup = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState("");

  const [isValid, setIsValid] = useState({
    groupName: true,
  });

  const groupNameChange = (e) => {
    setGroupName(e.target.value);
  };

  // 그룹 수정 화면 요청
  const getEditGroup = async () => {
    try {
      const response = await groupApi.getEditGroup(groupId);
      const data = response.data;
      setGroupName(data.groupName);
    } catch (error) {
      console.error(`${error}`);
    }
  };

  // 그룹 수정
  const editGroup = async (form) => {
    try {
      await groupApi.editGroup(groupId, form);
      alert("그룹 수정 성공");
      window.location.replace("/groups");
    } catch (error) {
      console.error(`${error}`);
      alert("그룹 수정 실패");
    }
  };

  // valid 변경 함수
  const changeValid = (key, value) => {
    setIsValid((valid) => {
      let newValid = {...valid};
      newValid[key] = value;
      return newValid;
    });
  }

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

  useEffect(() => {
    
    getEditGroup();

  }, []);

  const handleSubmit = (e) => {
    
    e.preventDefault(); //페이지 리로드 방지.

    if (validationCheck()) {
      editGroup({ groupName });
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
              placeholder="이름"
              value={groupName}
              onChange={groupNameChange}
              isInvalid={!isValid.groupName}
            />
            <Form.Control.Feedback type="invalid">
              그룹 이름을 입력해주세요.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

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
      </Form>
    </div>
  );
}

export default EditGroup;
