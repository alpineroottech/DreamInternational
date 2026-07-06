import React from "react";
import { Icon } from "@iconify/react";

const EMPTY_DAY = {
  dayNumber: 1,
  title: "",
  description: "",
  startLocation: "",
  endLocation: "",
  altitudeM: "",
  notes: "",
};

export default function ItineraryDaysEditor({ value, onChange }) {
  const days = Array.isArray(value) ? value : [];

  const setDay = (index, patch) => {
    onChange(days.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  };

  const add = () => {
    onChange([...days, { ...EMPTY_DAY, dayNumber: days.length + 1 }]);
  };

  const remove = (index) => {
    onChange(
      days
        .filter((_, i) => i !== index)
        .map((d, i) => ({ ...d, dayNumber: i + 1 }))
    );
  };

  const move = (index, dir) => {
    const next = [...days];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((d, i) => ({ ...d, dayNumber: i + 1, order: i })));
  };

  return (
    <div>
      {days.length === 0 && (
        <p className="text-muted small mb-3">No itinerary days yet. Add the first day below.</p>
      )}
      {days.map((day, i) => (
        <div className="border rounded p-3 mb-3 bg-light" key={i}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <strong>Day {day.dayNumber || i + 1}</strong>
            <div className="btn-group btn-group-sm">
              <button type="button" className="btn btn-outline-secondary" onClick={() => move(i, -1)} disabled={i === 0} title="Move up">
                <Icon icon="solar:alt-arrow-up-outline" />
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => move(i, 1)} disabled={i === days.length - 1} title="Move down">
                <Icon icon="solar:alt-arrow-down-outline" />
              </button>
              <button type="button" className="btn btn-outline-danger" onClick={() => remove(i)} title="Remove day">
                <Icon icon="solar:trash-bin-trash-outline" />
              </button>
            </div>
          </div>
          <div className="row g-2">
            <div className="col-md-2">
              <label className="form-label small mb-0">Day #</label>
              <input
                type="number"
                className="form-control form-control-sm"
                min={1}
                value={day.dayNumber ?? i + 1}
                onChange={(e) => setDay(i, { dayNumber: Number(e.target.value) || i + 1 })}
              />
            </div>
            <div className="col-md-10">
              <label className="form-label small mb-0">Title</label>
              <input
                className="form-control form-control-sm"
                value={day.title || ""}
                onChange={(e) => setDay(i, { title: e.target.value })}
                placeholder="e.g. Kathmandu to Lukla — trek to Phakding"
              />
            </div>
            <div className="col-12">
              <label className="form-label small mb-0">Description</label>
              <textarea
                className="form-control form-control-sm"
                rows={3}
                value={day.description || ""}
                onChange={(e) => setDay(i, { description: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label small mb-0">Start location</label>
              <input
                className="form-control form-control-sm"
                value={day.startLocation || ""}
                onChange={(e) => setDay(i, { startLocation: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label small mb-0">End location</label>
              <input
                className="form-control form-control-sm"
                value={day.endLocation || ""}
                onChange={(e) => setDay(i, { endLocation: e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label small mb-0">Altitude (m)</label>
              <input
                type="number"
                className="form-control form-control-sm"
                value={day.altitudeM ?? ""}
                onChange={(e) => setDay(i, { altitudeM: e.target.value === "" ? null : Number(e.target.value) })}
              />
            </div>
            <div className="col-12">
              <label className="form-label small mb-0">Activities / notes (one per line)</label>
              <textarea
                className="form-control form-control-sm"
                rows={2}
                value={day.notes || ""}
                onChange={(e) => setDay(i, { notes: e.target.value })}
                placeholder="Morning flight to Lukla&#10;Trek to Phakding (3–4 hrs)"
              />
            </div>
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-sm btn-outline-secondary" onClick={add}>
        <Icon icon="solar:add-circle-outline" className="me-1" /> Add day
      </button>
    </div>
  );
}
