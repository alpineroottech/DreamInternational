import React from "react";
import DOMPurify from "dompurify";

// Renders admin-authored HTML after sanitizing it in the browser
// (defense-in-depth; the API also sanitizes on write).
export default function SafeHtml({ html, className, as: Tag = "div" }) {
  const clean = DOMPurify.sanitize(html || "");
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: clean }} />;
}
