import React from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [2, 3, 4, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "link"],
    ["clean"],
  ],
};

export default function RichTextEditor({ value, onChange }) {
  return (
    <div className="di-rte bg-white">
      <ReactQuill theme="snow" value={value || ""} onChange={onChange} modules={modules} />
    </div>
  );
}
