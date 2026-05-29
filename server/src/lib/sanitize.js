import sanitizeHtml from "sanitize-html";

// Allowlist tuned for rich-text content coming from the admin editor.
const OPTIONS = {
  allowedTags: [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "a", "ul", "ol", "li", "blockquote",
    "b", "i", "strong", "em", "u", "s", "br", "hr", "span", "div",
    "img", "figure", "figcaption", "table", "thead", "tbody", "tr", "td", "th",
  ],
  allowedAttributes: {
    a: ["href", "name", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
    span: ["style"],
    div: ["style"],
    "*": ["class"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  // Force safe rel on links that open in a new tab.
  transformTags: {
    a: (tagName, attribs) => {
      if (attribs.target === "_blank") {
        attribs.rel = "noopener noreferrer";
      }
      return { tagName, attribs };
    },
  },
  allowedStyles: {
    "*": {
      "text-align": [/^left$/, /^right$/, /^center$/, /^justify$/],
      color: [/^#(0x)?[0-9a-f]+$/i, /^rgb\(/],
    },
  },
};

export function sanitizeRichText(html) {
  if (html == null) return html;
  return sanitizeHtml(String(html), OPTIONS);
}

// Sanitize a set of HTML fields on a payload object (mutates a copy).
export function sanitizeFields(data, htmlFields = []) {
  if (!htmlFields.length) return data;
  const out = { ...data };
  for (const f of htmlFields) {
    if (out[f] != null) out[f] = sanitizeRichText(out[f]);
  }
  return out;
}
