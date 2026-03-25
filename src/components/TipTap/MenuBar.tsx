import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Undo,
  Redo,
  Link,
} from "lucide-react";
import { Editor } from "@tiptap/react";

interface MenuBarProps {
  editor: Editor | null;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("bold") ? "bg-violet-100 text-violet-800" : ""
        }`}
      >
        <Bold size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("italic") ? "bg-violet-100 text-violet-800" : ""
        }`}
      >
        <Italic size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("strike") ? "bg-violet-100 text-violet-800" : ""
        }`}
      >
        <Strikethrough size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("heading", { level: 1 })
            ? "bg-violet-100 text-violet-800"
            : ""
        }`}
      >
        <Heading1 size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("heading", { level: 3 })
            ? "bg-violet-100 text-violet-800"
            : ""
        }`}
      >
        <Heading3 size={18} />
      </button>
      {/* <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("bulletList") ? "bg-violet-100 text-violet-800" : ""
        }`}
      >
        <List size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("orderedList") ? "bg-violet-100 text-violet-800" : ""
        }`}
      >
        <ListOrdered size={18} />
      </button> */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("blockquote") ? "bg-violet-100 text-violet-800" : ""
        }`}
      >
        <Quote size={18} />
      </button>
      <button
        type="button"
        onClick={() => {
          const previousUrl = editor.getAttributes("link").href;
          const url = window.prompt("URL", previousUrl);
          if (url === null) return;
          if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
          }
          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
        }}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("link") ? "bg-violet-100 text-violet-800" : ""
        }`}
      >
        <Link size={18} />
      </button>
      <div className="border-l h-6 mx-2 border-gray-300"></div>
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
      >
        <Undo size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
      >
        <Redo size={18} />
      </button>
    </div>
  );
};

export default MenuBar;
