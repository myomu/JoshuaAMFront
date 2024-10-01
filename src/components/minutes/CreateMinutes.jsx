import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import * as minutesApi from "../../apis/minutesApi";
import { useSelector } from "react-redux";
import Highlight from "@tiptap/extension-highlight";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ResizableImage from "../Editor/ResizableImage";
import TipTapEditor from "../Editor/TipTapEditor";

const CreateMinutes = () => {
  let navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [isValid, setIsValid] = useState({
    title: true,
    content: true,
  });

  const titleChange = (e) => {
    setTitle(e.target.value);
  };

  const createMinutes = async (form) => {
    try {
      await minutesApi.createMinutes(form);
      window.location.replace("/minutes");
    } catch (error) {
      console.error(`${error}`);
      alert("게시글 추가 실패");
    }
  };

  const userId = useSelector((state) => {
    return state.userInfo.info.id;
  });

  // createMinutes Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const date = new Date();
    const content = editor.getHTML();
    createMinutes({ title, content, createdAt: date, userId });
  };

  const editor = useEditor({
    extensions: [StarterKit, ResizableImage, Highlight.configure({ multicolor: true })],
  });

  // 에디터 로그 테스트용
  // useEffect(() => {
  //   if (editor) {
  //     editor.on('update', ({ editor }) => {
  //       console.log('Editor content updated: ', editor.getHTML());
  //     });
  //   }
  // }, [editor]);

  return (
    <div className="minutes__container">
      <Form
        className="minutes__create__form mt-5"
        noValidate
        //onSubmit={handleSubmit}
        style={{ width: "80%" }}
      >
        <Row className="mb-3">
          <Form.Group as={Col} controlId="title" style={{ padding: "0", fontFamily: "GangwonEdu_OTFBoldA" }}>
            {/* <Form.Label>이름</Form.Label> */}
            <Form.Control
              required
              type="text"
              placeholder="제목"
              value={title}
              onChange={titleChange}
              isInvalid={!isValid.title}
            />
            <Form.Control.Feedback type="invalid">
              이름을 입력해주세요.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        {/* 에디터 자리 */}
        <Row className="mb-4">
          <TipTapEditor editor={editor}/>
          {/* {editor && <MenuBar editor={editor} />}
          <EditorContent className="editor__content" editor={editor} /> */}
        </Row>

        <Row className="mb-3">
          <ButtonGroup style={{ padding: "0", fontFamily: "GangwonEdu_OTFBoldA" }}>
            <Button
              onClick={() => {
                navigate("/minutes");
              }}
              className="btnCancel"
            >
              취소
            </Button>
            <Button
              variant="primary"
              type="button"
              className="btnSave"
              onClick={handleSubmit}
            >
              저장
            </Button>
          </ButtonGroup>
        </Row>
      </Form>
    </div>
  );
};

export default CreateMinutes;
