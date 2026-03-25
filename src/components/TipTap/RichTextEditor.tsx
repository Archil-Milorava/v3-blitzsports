"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "./tiptap.css";
import { useEffect } from "react";
import MenuBar from "./MenuBar";

interface RichTextEditorProps {
  currentContent?: string;
  onContentChange: (content: string) => void;
}

const RichTextEditor = ({ onContentChange, currentContent }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: currentContent || "",
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
    immediatelyRender: false
  });

  useEffect(() => {
    if (editor && currentContent !== editor.getHTML()) {
      editor.commands.setContent(currentContent || ""); 
    }
  }, [currentContent, editor]);

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <MenuBar editor={editor} />
      <div className="container_editor">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
