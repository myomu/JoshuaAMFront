import React from "react";
import { EditorContent } from "@tiptap/react";
import MenuBar from "./MenuBar";

const TipTapEditor = ({ editor }) => {


  const handleSave = async () => {
    const content = editor.getHTML();
    try {
      console.log(content);
    } catch (error) {
      console.error(`${error}`);
    }
  };

  // useEffect(() => {
  //   if (editor) {
  //     editor.on('update', ({ editor }) => {
  //       console.log('Editor content updated: ', editor.getHTML());
  //     });
  //   }
  // }, [editor]);

  return (
    <div className="editor">
      <MenuBar editor={editor} onSave={handleSave} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTapEditor;

//rafce (React Arrow Function Component Exported)
