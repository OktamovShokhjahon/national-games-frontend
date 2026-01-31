"use client";

import React, { forwardRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "../contexts/ThemeContext";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-32"></div>
  ),
});

import "react-quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor = forwardRef<any, RichTextEditorProps>(
  (
    { value, onChange, placeholder = "Enter description...", className = "" },
    ref,
  ) => {
    const { theme } = useTheme();
    const [editorValue, setEditorValue] = useState("");

    // Convert plain text to HTML for existing content
    useEffect(() => {
      if (value) {
        // Check if the value is plain text (no HTML tags) or already HTML
        const isPlainText = !/<[^>]*>/.test(value);
        if (isPlainText) {
          // Convert plain text to HTML with proper line breaks
          const htmlValue = value
            .split("\n")
            .map((line) => `<p>${line || "<br>"}</p>`)
            .join("");
          setEditorValue(htmlValue);
        } else {
          setEditorValue(value);
        }
      } else {
        setEditorValue("");
      }
    }, [value]);

    const handleChange = (content: string) => {
      setEditorValue(content);
      onChange(content);
    };

    const modules = {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ["clean"],
      ],
    };

    const formats = [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "bullet",
      "indent",
      "script",
      "align",
      "direction",
      "color",
      "background",
      "font",
    ];

    return (
      <div className={`rich-text-editor ${className}`}>
        <ReactQuill
          theme="snow"
          value={editorValue}
          onChange={handleChange}
          placeholder={placeholder}
          modules={modules}
          formats={formats}
          className={`bg-white dark:bg-gray-800 rounded-lg ${
            theme === "dark" ? "dark-editor" : ""
          }`}
        />
        <style jsx global>{`
          .dark-editor .ql-toolbar {
            border-color: #374151;
            background-color: #1f2937;
          }
          .dark-editor .ql-toolbar .ql-stroke {
            stroke: #9ca3af;
          }
          .dark-editor .ql-toolbar .ql-fill {
            fill: #9ca3af;
          }
          .dark-editor .ql-toolbar .ql-picker {
            color: #9ca3af;
          }
          .dark-editor .ql-container {
            border-color: #374151;
            background-color: #1f2937;
            color: #f3f4f6;
          }
          .dark-editor .ql-container .ql-editor {
            color: #f3f4f6;
          }
          .dark-editor .ql-container .ql-editor p {
            color: #f3f4f6;
          }
          .dark-editor .ql-container .ql-editor h1,
          .dark-editor .ql-container .ql-editor h2,
          .dark-editor .ql-container .ql-editor h3 {
            color: #f3f4f6;
          }
          .dark-editor .ql-container .ql-editor ul,
          .dark-editor .ql-container .ql-editor ol {
            color: #f3f4f6;
          }
          .ql-toolbar.ql-snow {
            border-radius: 0.5rem 0.5rem 0 0;
            border-top: 1px solid #d1d5db;
            border-left: 1px solid #d1d5db;
            border-right: 1px solid #d1d5db;
            border-bottom: none;
          }
          .ql-container.ql-snow {
            border-radius: 0 0 0.5rem 0.5rem;
            border-bottom: 1px solid #d1d5db;
            border-left: 1px solid #d1d5db;
            border-right: 1px solid #d1d5db;
            border-top: none;
            min-height: 150px;
            font-size: 16px;
            background-color: #ffffff;
          }
          .ql-editor {
            min-height: 150px;
            font-size: 16px;
            line-height: 1.6;
            color: #1f2937;
          }
          .ql-editor p {
            color: #1f2937;
          }
          .ql-editor h1,
          .ql-editor h2,
          .ql-editor h3 {
            color: #1f2937;
          }
          .ql-editor ul,
          .ql-editor ol {
            color: #1f2937;
          }
          .ql-editor.ql-blank::before {
            color: #9ca3af;
            font-style: normal;
          }
          /* Dark mode styles */
          .dark .ql-toolbar.ql-snow {
            border-color: #374151;
            background-color: #1f2937;
          }
          .dark .ql-toolbar.ql-snow .ql-stroke {
            stroke: #9ca3af;
          }
          .dark .ql-toolbar.ql-snow .ql-fill {
            fill: #9ca3af;
          }
          .dark .ql-toolbar.ql-snow .ql-picker {
            color: #9ca3af;
          }
          .dark .ql-container.ql-snow {
            border-color: #374151;
            background-color: #1f2937;
          }
          .dark .ql-editor {
            color: #f3f4f6;
          }
          .dark .ql-editor p {
            color: #f3f4f6;
          }
          .dark .ql-editor h1,
          .dark .ql-editor h2,
          .dark .ql-editor h3 {
            color: #f3f4f6;
          }
          .dark .ql-editor ul,
          .dark .ql-editor ol {
            color: #f3f4f6;
          }
        `}</style>
      </div>
    );
  },
);

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;
