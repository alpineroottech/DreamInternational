import React from "react";
import { Icon } from "@iconify/react";

export default function TourFaqsEditor({ value, onChange }) {
  const faqs = Array.isArray(value) ? value : [];

  const setFaq = (index, patch) => {
    onChange(faqs.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  };

  const add = () => onChange([...faqs, { question: "", answer: "", order: faqs.length }]);
  const remove = (index) => onChange(faqs.filter((_, i) => i !== index));

  return (
    <div>
      {faqs.map((faq, i) => (
        <div className="border rounded p-3 mb-3" key={i}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <strong>FAQ {i + 1}</strong>
            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => remove(i)}>
              <Icon icon="solar:trash-bin-trash-outline" />
            </button>
          </div>
          <div className="mb-2">
            <label className="form-label small mb-0">Question</label>
            <input
              className="form-control form-control-sm"
              value={faq.question || ""}
              onChange={(e) => setFaq(i, { question: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label small mb-0">Answer</label>
            <textarea
              className="form-control form-control-sm"
              rows={3}
              value={faq.answer || ""}
              onChange={(e) => setFaq(i, { answer: e.target.value })}
            />
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-sm btn-outline-secondary" onClick={add}>
        <Icon icon="solar:add-circle-outline" className="me-1" /> Add FAQ
      </button>
    </div>
  );
}
