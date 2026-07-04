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

/**
 * Load a public CMS collection.
 * - `undefined` → still loading (do NOT show fallback yet)
 * - `null`      → loaded but empty / error (safe to use fallback)
 * - `array`     → CMS data
 */
export function useCollection(path, params) {
  const [data, setData] = useState(undefined);
  const key = JSON.stringify(params || {});
  useEffect(() => {
    let active = true;
    setData(undefined);
    publicApi
      .get(path, { params })
      .then((r) => {
        if (!active) return;
        const rows = Array.isArray(r.data) ? r.data : [];
        setData(rows.length ? rows : null);
      })
      .catch(() => active && setData(null));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, key]);
  return data;
}

/** Resolve CMS list vs fallback without flashing template defaults during load. */
export function resolveCmsList(cms, fallback = []) {
  if (cms === undefined) return { loading: true, items: [] };
  if (cms && cms.length) return { loading: false, items: cms };
  return { loading: false, items: fallback };
}

// Site settings, cached across the app (loaded once).
let settingsCache = null;
let settingsPromise = null;

/** Clear cached settings so the next useSettings() fetch picks up CMS changes. */
export function clearSettingsCache() {
  settingsCache = null;
  settingsPromise = null;
}

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

// Home page sections: returns { byKey, order, loaded }.
export function useHomeSections() {
  const [state, setState] = useState({ byKey: {}, order: null, loaded: false });
  useEffect(() => {
    let active = true;
    setState({ byKey: {}, order: null, loaded: false });
    publicApi
      .get("/public/sections", { params: { page: "home" } })
      .then((r) => {
        if (!active) return;
        if (!Array.isArray(r.data)) {
          setState({ byKey: {}, order: null, loaded: true });
          return;
        }
        const byKey = {};
        const sorted = [...r.data].sort((a, b) => a.order - b.order);
        sorted.forEach((s) => {
          byKey[s.key] = s.data || {};
        });
        setState({ byKey, order: sorted.map((s) => s.key), loaded: true });
      })
      .catch(() => active && setState({ byKey: {}, order: null, loaded: true }));
    return () => {
      active = false;
    };
  }, []);
  return state;
}

export function useSection(page, key) {
  const [data, setData] = useState(undefined);
  useEffect(() => {
    let active = true;
    setData(undefined);
    publicApi
      .get(`/public/sections/${page}/${key}`)
      .then((r) => active && setData(r.data?.data || null))
      .catch(() => active && setData(null));
    return () => {
      active = false;
    };
  }, [page, key]);
  return data;
}

export function useSlugItem(path, slug) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setData(null);
      setLoading(false);
      setNotFound(false);
      return undefined;
    }
    let active = true;
    setLoading(true);
    setNotFound(false);
    publicApi
      .get(`${path}/${slug}`)
      .then((r) => {
        if (!active) return;
        setData(r.data);
        setNotFound(false);
      })
      .catch(() => active && (setData(null), setNotFound(true)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [path, slug]);

  return { data, loading, notFound };
}
