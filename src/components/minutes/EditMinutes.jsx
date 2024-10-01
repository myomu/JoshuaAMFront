import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import * as minutesApi from "../../apis/minutesApi";
import Highlight from "@tiptap/extension-highlight";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ResizableImage from "../Editor/ResizableImage";
import TipTapEditor from "../Editor/TipTapEditor";

const EditMinutes = () => {
  const { minutesId } = useParams();
  let navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [isValid, setIsValid] = useState({
    title: true,
    content: true,
  });

  const titleChange = (e) => {
    setTitle(e.target.value);
  };

  const editMinutes = async (form) => {
    try {
      await minutesApi.editMinutes(minutesId, form);
      window.location.replace(`/minutes/detail/${minutesId}`);
    } catch (error) {
      console.error(`${error}`);
      alert("게시글 수정 실패");
    }
  };

  // createMinutes Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const date = new Date();
    const content = editor.getHTML();
    editMinutes({ title, content, updatedAt: date });
  };


  const editor = useEditor({
    extensions: [StarterKit, ResizableImage, Highlight.configure({ multicolor: true })],
  });

  useEffect(() => {
    if (editor && content) {
      // 서버에서 받아온 content를 에디터에 설정
      Promise.resolve().then(() => {
        editor.commands.setContent(content, true);
      });

      // 에디터 업데이트 이벤트 핸들링
      // editor.on('update', ({ editor }) => {
      //   console.log('Editor content updated: ', editor.getHTML());
      // });
    }
  }, [editor, content]);

  // 게시글 요청
  const getOneMinutes = async () => {
    try {
      const response = await minutesApi.getOneOfMinutes(minutesId);
      const minutes = response.data;

      setTitle(minutes.title);
      setContent(minutes.content);
    } catch (error) {
      console.error(`${error}`);
    }
  };

  useEffect(() => {
    getOneMinutes();
  }, []);

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
          <TipTapEditor editor={editor} content={content}/>
          {/* {editor && <MenuBar editor={editor} />}
          <EditorContent className="editor__content" editor={editor} /> */}
        </Row>

        <Row className="mb-3">
          <ButtonGroup style={{ padding: "0", fontFamily: "GangwonEdu_OTFBoldA" }}>
            <Button
              onClick={() => {
                navigate(`/minutes/detail/${minutesId}`);
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

export default EditMinutes;
