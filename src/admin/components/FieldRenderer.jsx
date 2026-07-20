import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import api from "../api/client";
import RichTextEditor from "./RichTextEditor";
import { MediaInput } from "./MediaPicker";
import { purposeForFieldName } from "../lib/imagePurpose";
import ItineraryDaysEditor from "./ItineraryDaysEditor";
import TourFaqsEditor from "./TourFaqsEditor";

const SOCIAL_KEYS = ["facebook", "instagram", "twitter", "linkedin", "youtube"];

function ReferenceField({ field, value, onChange }) {
  const [options, setOptions] = useState([]);
  useEffect(() => {
    api
      .get(`/admin/${field.refResource}`)
      .then(({ data }) => setOptions(data))
      .catch(() => setOptions([]));
  }, [field.refResource]);
  const selectedId =
    typeof value === "object" && value !== null && value.id ? value.id : value || "";

  return (
    <select className="form-select" value={selectedId} onChange={(e) => onChange(e.target.value || null)}>
      <option value="">— None —</option>
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o[field.refLabel] || o.name || o.title || o.id}
        </option>
      ))}
    </select>
  );
}

function StringList({ value, onChange }) {
  const list = Array.isArray(value) ? value : [];
  const asText = (item) =>
    typeof item === "string" ? item : item?.name || item?.title || item?.url || "";
  const setItem = (i, v) => onChange(list.map((x, idx) => (idx === i ? v : x)));
  const add = () => onChange([...list, ""]);
  const remove = (i) => onChange(list.filter((_, idx) => idx !== i));
  return (
    <div>
      {list.map((item, i) => (
        <div className="input-group mb-2" key={i}>
          <input className="form-control" value={asText(item)} onChange={(e) => setItem(i, e.target.value)} />
          <button type="button" className="btn btn-outline-danger" onClick={() => remove(i)}>
            <Icon icon="solar:trash-bin-trash-outline" />
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-sm btn-outline-secondary" onClick={add}>
        <Icon icon="solar:add-circle-outline" className="me-1" /> Add
      </button>
    </div>
  );
}

function isCategoryShape(item) {
  return (
    item &&
    typeof item === "object" &&
    "slug" in item &&
    "type" in item &&
    "isVisible" in item &&
    !("url" in item && typeof item.url === "string")
  );
}

/** Accept { url, alt }, { imageUrl, imageAlt }, plain URL strings; skip stray relation objects. */
export function normalizeGalleryList(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === "string") return { url: item, alt: "" };
      if (!item || typeof item !== "object" || isCategoryShape(item)) return null;
      return {
        url: item.url || item.imageUrl || "",
        alt: item.alt || item.imageAlt || "",
      };
    })
    .filter(Boolean);
}

function Gallery({ value, onChange }) {
  const list = normalizeGalleryList(value);
  const setItem = (i, patch) =>
    onChange(list.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  const add = () => onChange([...list, { url: "", alt: "" }]);
  const remove = (i) => onChange(list.filter((_, idx) => idx !== i));
  return (
    <div>
      {list.map((item, i) => (
        <div className="border rounded p-2 mb-2" key={i}>
          <MediaInput value={item.url} onChange={(url) => setItem(i, { url })} imagePurpose="gallery" />
          <div className="input-group mt-2">
            <span className="input-group-text">Alt</span>
            <input className="form-control" value={item.alt || ""} onChange={(e) => setItem(i, { alt: e.target.value })} />
            <button type="button" className="btn btn-outline-danger" onClick={() => remove(i)}>
              <Icon icon="solar:trash-bin-trash-outline" />
            </button>
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-sm btn-outline-secondary" onClick={add}>
        <Icon icon="solar:add-circle-outline" className="me-1" /> Add image
      </button>
    </div>
  );
}

function Socials({ value, onChange }) {
  const obj = value && typeof value === "object" ? value : {};
  return (
    <div className="row g-2">
      {SOCIAL_KEYS.map((k) => (
        <div className="col-md-6" key={k}>
          <div className="input-group">
            <span className="input-group-text text-capitalize" style={{ width: 110 }}>{k}</span>
            <input
              className="form-control"
              value={obj[k] || ""}
              onChange={(e) => onChange({ ...obj, [k]: e.target.value })}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FieldRenderer({ field, value, onChange, error }) {
  const common = "form-control";
  let control;

  switch (field.type) {
    case "textarea":
      control = (
        <textarea
          className={common}
          rows={field.rows || 3}
          maxLength={field.max}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
      break;
    case "richtext":
      control = <RichTextEditor value={value} onChange={onChange} />;
      break;
    case "number":
      control = (
        <input
          type="number"
          className={common}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
        />
      );
      break;
    case "switch": {
      const switchId = `di-switch-${field.name}`;
      control = (
        <div className="di-switch-wrap">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id={switchId}
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
            />
            <label
              className={`form-check-label fw-semibold di-switch-label--${value ? "on" : "off"}`}
              htmlFor={switchId}
            >
              {value ? "Yes — enabled" : "No — disabled"}
            </label>
          </div>
        </div>
      );
      break;
    }
    case "select":
      control = (
        <select className="form-select" value={value || ""} onChange={(e) => onChange(e.target.value)}>
          {!field.required && <option value="">— Select —</option>}
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
      break;
    case "image":
      control = (
        <MediaInput
          value={value}
          onChange={onChange}
          imagePurpose={field.imagePurpose || purposeForFieldName(field.name)}
        />
      );
      break;
    case "itineraryDays":
      control = <ItineraryDaysEditor value={value} onChange={onChange} />;
      break;
    case "tourFaqs":
      control = <TourFaqsEditor value={value} onChange={onChange} />;
      break;
    case "gallery":
      control = <Gallery value={value} onChange={onChange} />;
      break;
    case "stringList":
      control = <StringList value={value} onChange={onChange} />;
      break;
    case "socials":
      control = <Socials value={value} onChange={onChange} />;
      break;
    case "reference":
      control = <ReferenceField field={field} value={value} onChange={onChange} />;
      break;
    case "_hint":
      return (
        <div className="alert alert-info py-2 px-3 small mb-3" role="note">
          <Icon icon="solar:info-circle-outline" className="me-1" />
          {field.hint}
        </div>
      );
    case "slug":
      control = (
        <input className={common} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="auto-generated" />
      );
      break;
    default:
      control = (
        <input className={`${common} ${error ? "is-invalid" : ""}`} maxLength={field.max} value={value || ""} onChange={(e) => onChange(e.target.value)} />
      );
  }

  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">
        {field.label}
        {field.required && <span className="text-danger"> *</span>}
        {field.counter != null && (
          <span className="text-muted small ms-2">
            {(value || "").length}/{field.counter}
          </span>
        )}
      </label>
      {control}
      {error && (
        <div className="text-danger small mt-1">
          {typeof error === "string" ? error : "Please check this field."}
        </div>
      )}
    </div>
  );
}
