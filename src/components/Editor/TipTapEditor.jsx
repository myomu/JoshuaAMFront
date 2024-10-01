import React from "react";
import { EditorContent } from "@tiptap/react";
import MenuBar from "./MenuBar";

const TipTapEditor = ({ editor }) => {

  if (!editor) return <div>Loading ... </div>;

  return (
    <div className="editor">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTapEditor;

//rafce (React Arrow Function Component Exported)
