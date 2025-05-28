"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import FontFamily from "@tiptap/extension-font-family";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Heading } from "@tiptap/extension-heading";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import HardBreak from "@tiptap/extension-hard-break";


import {
  FaUndo,
  FaRedo,
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaImage,
  FaLink,
  FaCode,
  FaTable,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaQuora,
  FaList,
  FaListOl,
  FaListAlt,
  FaEraser,
} from "react-icons/fa";
import { GrReturn } from "react-icons/gr";

import { FiMinimize, FiMaximize } from "react-icons/fi";
import {
  MdHorizontalRule,
  MdOutlineSuperscript,
  MdSelectAll,
  MdSubscript,
} from "react-icons/md";
import axios from "axios";
import { upload_image_api } from "@/utils/api_url";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";

const TiptapEditor: React.FC<{
  editorContent: string;
  setEditorContent: React.Dispatch<React.SetStateAction<string>>;
}> = ({ editorContent, setEditorContent }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCode, setShowCode] = useState<boolean>(false);

  const token = useSelector((state: RootState) => state.user.token);

  const CustomHeading = Heading.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        id: {
          default: null,
          parseHTML: (element) => element.getAttribute("id") || uuidv4(),
          renderHTML: (attributes) => {
            return attributes.id ? { id: attributes.id } : {};
          },
        },
      };
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        blockquote: {},
        bulletList: {},
        orderedList: {},
        strike: {},
      }),
     
      HorizontalRule,
      Superscript,
      Subscript,
      Underline,
      TextStyle,
      Color,
      HardBreak,
      Highlight.configure({ multicolor: true }),
      FontFamily,
      Link.configure({
        openOnClick: true,
      }),
      Image.configure({
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      TaskList,
      TaskItem,
      CustomHeading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
    ],
    content: <p>this is your editor</p>,
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && editorContent !== editor.getHTML()) {
      editor.commands.setContent(editorContent);
    }
  }, [editorContent, editor]);

  if (!editor) return null;

  // Utility Functions
  const addTable = () =>
    editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run();
  const addRow = () => editor.chain().focus().addRowAfter().run();
  const addColumn = () => editor.chain().focus().addColumnAfter().run();
  const deleteRow = () => editor.chain().focus().deleteRow().run();
  const deleteColumn = () => editor.chain().focus().deleteColumn().run();
  const undo = () => editor.chain().focus().undo().run();
  const redo = () => editor.chain().focus().redo().run();
  const selectAll = () => editor.chain().focus().selectAll().run();
  const setFontFamily = (font: string) =>
    editor.chain().focus().setFontFamily(font).run();
  const setColor = (color: string) =>
    editor.chain().focus().setColor(color).run();
  const addLink = () => {
    const url = prompt("Enter URL");
    if (url)
      editor.chain().focus().setLink({ href: url, target: "_blank" }).run();
  };
  const addImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (event) => {
      const target = event.target as HTMLInputElement;
      if (!target.files || target.files.length === 0) return;

      const file = target.files[0];

      const formData = new FormData();
      formData.append("image", file);
      formData.append("file_name", "editor_folder");

      try {
        const { data } = await axios.post(upload_image_api, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        if (data.responce.url) {
          editor.chain().focus().setImage({ src: data.responce.url }).run();
        } else {
          alert("Failed to upload image");
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("Error uploading image");
      }
    };

    input.click();
  };

  const setHighlight = (color: string) =>
    editor.chain().focus().toggleHighlight({ color }).run();
  const clearMarks = () => editor.chain().focus().unsetAllMarks().run();
  const setTextAlign = (align: "left" | "center" | "right" | "justify") =>
    editor.chain().focus().setTextAlign(align).run();



  return (
    <div
      className={
        isFullscreen
          ? "fixed w-[vw] overflow-y-auto p-8 h-full top-0 left-0 right-0 bottom-0 bg-white z-[9999]"
          : "border p-4 bg-white rounded-md shadow-md"
      }
    >
      <div className="mb-4 p-2 editor_tool_bar sticky top-0 z-[9] bg-white">
        {/* Toolbar */}
        <div className="mb-2 flex flex-wrap gap-2">
          <button
            type="button"
            title="undo"
            onClick={undo}
            className="bg-gray-200 text-black px-2 py-1 rounded"
          >
            <FaUndo />
          </button>
          <button
            title="redo"
            type="button"
            onClick={redo}
            className="bg-gray-200 text-black px-2 py-1 rounded"
          >
            <FaRedo />
          </button>

          <button
            title="bold"
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="bg-gray-200 text-black px-2 py-1 rounded"
          >
            <FaBold />
          </button>
          <button
            title="italic"
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="bg-gray-200 text-black px-2 py-1 rounded"
          >
            <FaItalic />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="underline"
            className="bg-gray-200 text-black px-2 py-1 rounded"
          >
            <FaUnderline />
          </button>
          <button
            type="button"
            title="strike through"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className="bg-gray-200 text-black px-2 py-1 rounded"
          >
            <FaStrikethrough />
          </button>

          <button
            type="button"
            title="add link"
            onClick={addLink}
            className="bg-gray-200 text-black px-2 py-1 rounded"
          >
            <FaLink />
          </button>
          <button
            type="button"
            title="add image"
            onClick={addImage}
            className="bg-gray-200 text-black px-2 py-1 rounded"
          >
            <FaImage />
          </button>

          {/* Font Family */}
          <select
            onChange={(e) => setFontFamily(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="">Font Family</option>
            <option value="Arial">Arial</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Verdana">Verdana</option>
          </select>

          <select
            onChange={(e) => {
              const level = Number(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6;
              editor.chain().focus().toggleHeading({ level }).run();
            }}
            className="border px-2 py-1 rounded"
          >
            <option value="">Heading</option>
            <option value="1">H1</option>
            <option value="2">H2</option>
            <option value="3">H3</option>
            <option value="4">H4</option>
            <option value="5">H5</option>
            <option value="6">H6</option>
          </select>

          {/* Text Color */}
          <div className="flex flex-nowrap items-center gap-2">
            <label htmlFor="text_color">Text Color</label>
            <input
              type="color"
              id="text_color"
              onChange={(e) => setColor(e.target.value)}
              title="Text Color"
            />
          </div>

          <div className="flex flex-nowrap items-center gap-2">
            <label htmlFor="bg_color">Background</label>
            <input
              type="color"
              id="bg_color"
              onChange={(e) => setHighlight(e.target.value)}
              title="Background Color"
            />
          </div>

          {/* List Buttons */}
          <button
            type="button"
            title="un ordered list"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="bg-gray-200 text-black px-2 py-1 rounded"
          >
            <FaList />
          </button>
          <button
            type="button"
            title="order list"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className="bg-gray-200 text-black px-2 py-1 rounded"
          >
            <FaListOl />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            title="Task list"
            type="button"
            className="bg-gray-200 text-black px-2 py-1 rounded"
          >
            <FaListAlt />
          </button>
          <button
            title="Set hard break"
            className="bg-gray-200 text-black px-2 py-1 rounded"
            type="button"
            onClick={() => editor.chain().focus().setHardBreak().run()}
          >
            <GrReturn />
          </button>
          <button
            title="Superscript"
            type="button"
            className="bg-gray-200 text-black px-2 py-1 rounded"
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
          >
            <MdOutlineSuperscript />
          </button>
          <button
            title="Subscript"
            type="button"
            className="bg-gray-200 text-black px-2 py-1 rounded"
            onClick={() => editor.chain().focus().toggleSubscript().run()}
          >
            <MdSubscript />
          </button>

          {/* Blockquote */}
          <button
            type="button"
            title="blockquote"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className="bg-gray-200 text-black px-2 py-1 rounded"
          >
            <FaQuora />
          </button>

          {/* Text Align */}
          <button
            type="button"
            onClick={() => setTextAlign("left")}
            className="bg-gray-200 text-black px-2 py-1 rounded"
          >
            <FaAlignLeft />
          </button>
          <button
            type="button"
            onClick={() => setTextAlign("center")}
            className="bg-gray-200 text-black px-2 py-1 rounded"
          >
            <FaAlignCenter />
          </button>
          <button
            type="button"
            onClick={() => setTextAlign("right")}
            className="bg-gray-200 text-black px-2 py-1 rounded"
          >
            <FaAlignRight />
          </button>
          <button
            type="button"
            onClick={() => setTextAlign("justify")}
            className="bg-gray-200 text-black px-2 py-1 rounded"
          >
            <FaAlignJustify />
          </button>
          <button
            type="button"
            title="Add Horizontal Line"
            className="bg-gray-200 text-black px-2 py-1 rounded"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <MdHorizontalRule />
          </button>
          <button
            type="button"
            title="select all"
            onClick={selectAll}
            className="bg-gray-200 text-black px-2 py-1 rounded"
          >
            <MdSelectAll />
          </button>
          <span className="inline-flex justify-between gap-2">
            <button
              type="button"
              onClick={addTable}
              title="Insert table"
              className="bg-gray-200 text-black px-2 py-1 rounded"
            >
              <FaTable />
            </button>
            <button
              type="button"
              title="Table add row"
              onClick={addRow}
              className="bg-gray-200 text-black px-2 py-1 rounded"
            >
              TAR
            </button>
            <button
              type="button"
              title="Table add column"
              onClick={addColumn}
              className="bg-gray-200 text-black px-2 py-1 rounded"
            >
              TAC
            </button>
            <button
              type="button"
              title="table delete row"
              onClick={deleteRow}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              TDR
            </button>
            <button
              title="Table delete column"
              type="button"
              onClick={deleteColumn}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              TDC
            </button>
          </span>

          <button
            type="button"
            title={`${showCode ? "Hide" : "Show"} Code`}
            onClick={() => setShowCode(!showCode)}
            className={` ${
              showCode ? "bg-gray-600" : "bg-gray-200"
            } text-black px-2 py-1 rounded`}
          >
            <FaCode />
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="bg-purple-500 text-white px-2 py-1 rounded"
          >
            {isFullscreen ? <FiMinimize /> : <FiMaximize />}
          </button>
          <button
            type="button"
            onClick={clearMarks}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            <FaEraser />
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="" />

      {showCode && (
        <div className="mt-4 p-2 border-t">
          <h3 className="font-semibold">Editor Output (HTML):</h3>
          <div className="text-sm">{editorContent}</div>
        </div>
      )}
    </div>
  );
};

export default TiptapEditor;
