import { useEffect, useState } from "react";
import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";
export const API_ORIGIN = baseURL.replace(/\/api$/, "");

export const publicApi = axios.create({ baseURL });

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function resolveAssetUrl(url) {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("/assets") || url.startsWith("data:")) return url;
  if (url.startsWith("/uploads")) return `${API_ORIGIN}${url}`;
  return url;
}

// Generic collection loader. Returns `null` while loading / on error so callers
// can fall back to their bundled template defaults.
export function useCollection(path, params) {
  const [data, setData] = useState(null);
  const key = JSON.stringify(params || {});
  useEffect(() => {
    let active = true;
    publicApi
      .get(path, { params })
      .then((r) => active && setData(Array.isArray(r.data) ? r.data : null))
      .catch(() => active && setData(null));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, key]);
  return data;
}

// Site settings, cached across the app (loaded once).
let settingsCache = null;
let settingsPromise = null;
export function useSettings() {
  const [settings, setSettings] = useState(settingsCache);
  useEffect(() => {
    if (settingsCache) {
      setSettings(settingsCache);
      return undefined;
    }
    let active = true;
    if (!settingsPromise) {
      settingsPromise = publicApi.get("/public/settings").then((r) => {
        settingsCache = isPlainObject(r.data) ? r.data : {};
        return settingsCache;
      });
    }
    settingsPromise
      .then((s) => active && setSettings(s))
      .catch(() => active && setSettings({}));
    return () => {
      active = false;
    };
  }, []);
  return isPlainObject(settings) ? settings : {};
}

// Home page sections: returns { byKey, order } where order is enabled keys sorted.
export function useHomeSections() {
  const [state, setState] = useState({ byKey: {}, order: null });
  useEffect(() => {
    let active = true;
    publicApi
      .get("/public/sections", { params: { page: "home" } })
      .then((r) => {
        if (!active) return;
        if (!Array.isArray(r.data)) {
          setState({ byKey: {}, order: null });
          return;
        }
        const byKey = {};
        const sorted = [...r.data].sort((a, b) => a.order - b.order);
        sorted.forEach((s) => {
          byKey[s.key] = s.data || {};
        });
        setState({ byKey, order: sorted.map((s) => s.key) });
      })
      .catch(() => active && setState({ byKey: {}, order: null }));
    return () => {
      active = false;
    };
  }, []);
  return state;
}

export function useSection(page, key) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let active = true;
    publicApi
      .get(`/public/sections/${page}/${key}`)
      .then((r) => active && setData(r.data?.data || {}))
      .catch(() => active && setData(null));
    return () => {
      active = false;
    };
  }, [page, key]);
  return data;
}
