import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import api from "../api/client";
import FieldRenderer from "../components/FieldRenderer";
import { MediaInput } from "../components/MediaPicker";

// Which editable fields each section type exposes.
// "collectionNote" sections show a helper hint instead of empty fields.
const SECTION_FIELDS = {
  hero: "heroSlides",
  categories: [
    { name: "subTitle", label: "Sub title", type: "text" },
    { name: "title", label: "Title", type: "text" },
    { name: "_hint", label: "hint", type: "_hint", hint: "Items are managed under Tour Categories in the sidebar." },
  ],
  featuredDestination: [
    { name: "subTitle", label: "Sub title", type: "text" },
    { name: "title", label: "Section heading (leave blank to use destination name)", type: "text" },
    { name: "destinationSlug", label: "Destination slug to feature (e.g. pokhara-city)", type: "text" },
    { name: "_hint", label: "hint", type: "_hint", hint: "Leave destination slug blank to auto-show the first destination marked 'Featured'. To mark a destination featured, edit it in Destinations." },
  ],
  about: [
    { name: "_hintAbout", label: "hint", type: "_hint", hint: "This section appears on the homepage (not the /about page). The dedicated About page is edited under Settings → About page content." },
    { name: "subTitle", label: "Sub title", type: "text" },
    { name: "title", label: "Title", type: "text" },
    { name: "text", label: "Text", type: "richtext" },
    { name: "_hintImages", label: "hint", type: "_hint", hint: "Photo collage on the left: one large primary image, plus two smaller images stacked on the right. Use Browse to pick from the media library, or Remove to leave a slot empty." },
    { name: "image", label: "Primary image (large, left)", type: "image" },
    { name: "imageAlt", label: "Primary image alt text", type: "text" },
    { name: "image2", label: "Secondary image (top right)", type: "image" },
    { name: "image2Alt", label: "Secondary image alt text", type: "text" },
    { name: "image3", label: "Tertiary image (bottom right)", type: "image" },
    { name: "image3Alt", label: "Tertiary image alt text", type: "text" },
    { name: "featureOneTitle", label: "Feature one title", type: "text" },
    { name: "featureOneText", label: "Feature one text", type: "textarea" },
    { name: "featureTwoTitle", label: "Feature two title", type: "text" },
    { name: "featureTwoText", label: "Feature two text", type: "textarea" },
    { name: "ctaLabel", label: "CTA label", type: "text" },
    { name: "ctaUrl", label: "CTA URL", type: "text" },
  ],
  featuredTours: [
    { name: "subTitle", label: "Sub title", type: "text" },
    { name: "title", label: "Title", type: "text" },
    { name: "_hint", label: "hint", type: "_hint", hint: "Tours displayed here are the ones marked as 'Featured' in the Tours section. Open Tours → edit a tour → toggle 'Is Featured' to control which appear here." },
  ],
  gallery: [
    { name: "subTitle", label: "Sub title", type: "text" },
    { name: "title", label: "Title", type: "text" },
    { name: "_hint", label: "hint", type: "_hint", hint: "Gallery images are managed under Gallery in the sidebar." },
  ],
  counters: [
    { name: "bgImage", label: "Background image", type: "image" },
    { name: "_hint", label: "hint", type: "_hint", hint: "Counter values (years, travelers, etc.) are managed under Counters in the sidebar." },
  ],
  team: [
    { name: "subTitle", label: "Sub title", type: "text" },
    { name: "title", label: "Title", type: "text" },
    { name: "_hint", label: "hint", type: "_hint", hint: "Team members are managed under Team in the sidebar." },
  ],
  testimonials: [
    { name: "subTitle", label: "Sub title", type: "text" },
    { name: "title", label: "Title", type: "text" },
    { name: "_hint", label: "hint", type: "_hint", hint: "Reviews are managed under Reviews in the sidebar. Mark a review as 'Featured' to show it here." },
  ],
  brands: [
    { name: "subTitle", label: "Sub title", type: "text" },
    { name: "title", label: "Title", type: "text" },
    { name: "_hint", label: "hint", type: "_hint", hint: "Partner logos are managed under Partner Brands in the sidebar." },
  ],
  blog: [
    { name: "subTitle", label: "Sub title", type: "text" },
    { name: "title", label: "Title", type: "text" },
    { name: "_hint", label: "hint", type: "_hint", hint: "Blog posts are managed under Blog in the sidebar. Published posts appear here automatically." },
  ],
};

function HeroSlidesEditor({ data, onChange }) {
  const slides = Array.isArray(data.slides) ? data.slides : [];
  const setSlide = (i, patch) =>
    onChange({ ...data, slides: slides.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });
  const add = () =>
    onChange({ ...data, slides: [...slides, { image: "", subtitle: "", title: "", text: "", primaryCta: { label: "", url: "" }, secondaryCta: { label: "", url: "" } }] });
  const remove = (i) => onChange({ ...data, slides: slides.filter((_, idx) => idx !== i) });

  return (
    <div>
      {slides.map((s, i) => (
        <div className="border rounded p-3 mb-3" key={i}>
          <div className="d-flex justify-content-between mb-2">
            <strong>Slide {i + 1}</strong>
            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => remove(i)}>
              <Icon icon="solar:trash-bin-trash-outline" />
            </button>
          </div>
          <label className="form-label small fw-semibold">Background image</label>
          <MediaInput value={s.image} onChange={(url) => setSlide(i, { image: url })} />
          <div className="row g-2 mt-1">
            <div className="col-md-6"><input className="form-control" placeholder="Sub title" value={s.subtitle || ""} onChange={(e) => setSlide(i, { subtitle: e.target.value })} /></div>
            <div className="col-md-6"><input className="form-control" placeholder="Title" value={s.title || ""} onChange={(e) => setSlide(i, { title: e.target.value })} /></div>
            <div className="col-12"><textarea className="form-control" placeholder="Text" rows={2} value={s.text || ""} onChange={(e) => setSlide(i, { text: e.target.value })} /></div>
            <div className="col-md-3"><input className="form-control" placeholder="Button 1 label" value={s.primaryCta?.label || ""} onChange={(e) => setSlide(i, { primaryCta: { ...s.primaryCta, label: e.target.value } })} /></div>
            <div className="col-md-3"><input className="form-control" placeholder="Button 1 URL" value={s.primaryCta?.url || ""} onChange={(e) => setSlide(i, { primaryCta: { ...s.primaryCta, url: e.target.value } })} /></div>
            <div className="col-md-3"><input className="form-control" placeholder="Button 2 label" value={s.secondaryCta?.label || ""} onChange={(e) => setSlide(i, { secondaryCta: { ...s.secondaryCta, label: e.target.value } })} /></div>
            <div className="col-md-3"><input className="form-control" placeholder="Button 2 URL" value={s.secondaryCta?.url || ""} onChange={(e) => setSlide(i, { secondaryCta: { ...s.secondaryCta, url: e.target.value } })} /></div>
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-sm btn-outline-secondary" onClick={add}>
        <Icon icon="solar:add-circle-outline" className="me-1" /> Add slide
      </button>
    </div>
  );
}

function SectionRow({ section, index, total, onMove, onToggle, onSave }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(section.data || {});
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const fields = SECTION_FIELDS[section.key];

  const save = async () => {
    setSaving(true);
    await onSave(section.id, { data });
    setSaving(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 1500);
  };

  return (
    <div className="di-card mb-2">
      <div className="di-section-row mb-0 border-0">
        <div className="d-flex flex-column">
          <button type="button" className="btn btn-sm p-0 di-section-row__handle" disabled={index === 0} onClick={() => onMove(index, -1)}>
            <Icon icon="solar:alt-arrow-up-outline" />
          </button>
          <button type="button" className="btn btn-sm p-0 di-section-row__handle" disabled={index === total - 1} onClick={() => onMove(index, 1)}>
            <Icon icon="solar:alt-arrow-down-outline" />
          </button>
        </div>
        <div className="flex-grow-1">
          <span className="fw-semibold">{section.label || section.key}</span>
          <span className="text-muted small ms-2">({section.key})</span>
        </div>
        <div className="form-check form-switch me-2">
          <input className="form-check-input" type="checkbox" checked={section.enabled} onChange={(e) => onToggle(section.id, e.target.checked)} />
        </div>
        {fields !== undefined && (
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setOpen((v) => !v)}>
            <Icon icon={open ? "solar:alt-arrow-up-outline" : "solar:pen-outline"} /> {open ? "Close" : "Edit"}
          </button>
        )}
      </div>
      {open && (
        <div className="p-3 border-top">
          {fields === "heroSlides" ? (
            <HeroSlidesEditor data={data} onChange={setData} />
          ) : (
            fields.filter((f) => f.type !== "_hint").map((f) => (
              <FieldRenderer key={f.name} field={f} value={data[f.name]} onChange={(v) => setData({ ...data, [f.name]: v })} />
            ))
          )}
          {/* Always render hint fields, even outside the editable list */}
          {fields !== "heroSlides" && fields.filter((f) => f.type === "_hint").map((f) => (
            <FieldRenderer key={f.name} field={f} value={undefined} onChange={() => {}} />
          ))}
          {fields === "heroSlides" || fields.filter((f) => f.type !== "_hint").length > 0 ? (
            <button type="button" className="btn di-btn-primary btn-sm mt-2" onClick={save} disabled={saving}>
              {saving ? "Saving…" : savedMsg ? "Saved ✓" : "Save Changes"}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default function HomepageBuilder() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/admin/sections?page=home");
    setSections(data.sort((a, b) => a.order - b.order));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const move = async (index, dir) => {
    const next = [...sections];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    const reordered = next.map((s, i) => ({ ...s, order: i }));
    setSections(reordered);
    await api.patch("/admin/sections/reorder", reordered.map((s) => ({ id: s.id, order: s.order })));
  };

  const toggle = async (id, enabled) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, enabled } : s)));
    await api.patch(`/admin/sections/${id}`, { enabled });
  };

  const saveSection = async (id, payload) => {
    const { data } = await api.patch(`/admin/sections/${id}`, payload);
    setSections((prev) => prev.map((s) => (s.id === id ? data : s)));
  };

  if (loading) return <div className="text-muted">Loading…</div>;

  return (
    <div>
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Homepage Builder</h4>
        <p className="text-muted mb-0">Reorder sections, turn them on/off, and edit their content. Use <strong>About Section</strong> to change the homepage about collage (3 photos + text).</p>
      </div>
      {sections.map((s, i) => (
        <SectionRow
          key={s.id}
          section={s}
          index={i}
          total={sections.length}
          onMove={move}
          onToggle={toggle}
          onSave={saveSection}
        />
      ))}
    </div>
  );
}
