import "./MenuBar.css";

import React, { Fragment } from "react";

import MenuItem from "./MenuItem.jsx";

import * as minutesApi from "../../apis/minutesApi.js";

const MenuBar = ({ editor }) => {
  const fileInputRef = React.useRef(null);

  const addImage = (files) => {
    const file = files[0];
    console.log(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        // 로컬 미리보기로 이미지 삽입
        editor.chain().focus().setImage({ src: reader.result }).run();

        // 파일을 서버를 통해 s3 에 업로드
        const formData = new FormData();
        formData.append('file', file);

        // 서버에서 받아온 이미지 url 로 교체
        try {
        const response = await minutesApi.uploadImage(formData);
        const imageUrl = response.data.url;
        editor.chain().focus().setImage({ src: imageUrl }).run();
        } catch (error) {
          console.error(`이미지 업로드 실패: ${error}`);
        }

      };
      // 파일 입력 리셋 - 이것을 해줘야 이미지를 지우고 다시 같은 이미지를 선택할 수 있다.
      fileInputRef.current.value = '';
      reader.readAsDataURL(file);
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const items = [
    {
      icon: "arrow-go-back-line",
      title: "되돌리기",
      action: () => editor.chain().focus().undo().run(),
    },
    {
      icon: "arrow-go-forward-line",
      title: "다시 실행",
      action: () => editor.chain().focus().redo().run(),
    },
    {
      type: "divider",
    },
    {
      icon: "bold",
      title: "굵게",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
    {
      icon: "italic",
      title: "기울임꼴",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
    },
    {
      icon: "strikethrough",
      title: "취소선",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
    },
    {
      icon: "code-view",
      title: "코드",
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive("code"),
    },
    {
      icon: "mark-pen-line",
      title: "Highlight",
      action: () => editor.chain().focus().toggleHighlight().run(),
      isActive: () => editor.isActive("highlight"),
    },
    {
      type: "divider",
    },
    {
      icon: "h-1",
      title: "Heading 1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
    },
    {
      icon: "h-2",
      title: "Heading 2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
    },
    // {
    //   icon: 'paragraph',
    //   title: 'Paragraph',
    //   action: () => editor.chain().focus().setParagraph().run(),
    //   isActive: () => {
    //     return editor.isActive('paragraph') && !editor.isActive('heading') && !editor.isActive('codeBlock');
    //   },
    // },
    {
      icon: "list-unordered",
      title: "불릿 목록",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
    },
    {
      icon: "list-ordered",
      title: "번호 목록",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
    },
    // {
    //   icon: "list-check-2",
    //   title: "작업 목록",
    //   action: () => editor.chain().focus().toggleTaskList().run(),
    //   isActive: () => editor.isActive("taskList"),
    // },
    {
      icon: "code-box-line",
      title: "코드 블럭",
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive("codeBlock"),
    },
    {
      type: "divider",
    },
    {
      icon: "double-quotes-l",
      title: "인용문",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive("blockquote"),
    },
    {
      icon: "separator",
      title: "수평선",
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      type: "divider",
    },
    {
      icon: "text-wrap",
      title: "강제 줄바꿈",
      action: () => editor.chain().focus().setHardBreak().run(),
    },
    {
      icon: "format-clear",
      title: "Clear Format",
      action: () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
    },
    {
      type: "divider",
    },
    {
      icon: "image-add-line", // RemixIcon에서 이미지 추가 아이콘
      title: "이미지 추가",
      action: openFileDialog,
    },
  ];

  return (
    <div className="editor__header">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={(e) => {addImage(e.target.files)}}
      />
      {items.map((item, index) => (
        <Fragment key={index}>
          {item.type === "divider" ? (
            <div className="divider" />
          ) : (
            <MenuItem {...item} />
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default MenuBar;
