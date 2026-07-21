import { useEffect, useState } from "react";
import axios from "axios";
import { resolveApiBaseUrl } from "../lib/apiBaseUrl";

const baseURL = resolveApiBaseUrl();
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

// Multiple components on the same page often request the same collection
// (e.g. /public/categories is used by both the category carousel and the
// booking search bar). Cache resolved responses for the session and share
// in-flight requests so the same data is never fetched twice in parallel.
const collectionCache = new Map();

function collectionKey(path, params) {
  return `${path}?${JSON.stringify(params || {})}`;
}

/** Pre-fill the session cache (e.g. from the homepage aggregate endpoint). */
export function seedCollectionCache(path, params, items) {
  const key = collectionKey(path, params);
  const value = Array.isArray(items) && items.length ? items : null;
  collectionCache.set(key, { status: "resolved", value });
}

function applyHomePayload(data) {
  if (!data || typeof data !== "object") return;

  if (isPlainObject(data.settings)) {
    settingsCache = data.settings;
    settingsPromise = Promise.resolve(settingsCache);
  }

  if (Array.isArray(data.collections)) {
    for (const entry of data.collections) {
      if (!entry?.path) continue;
      seedCollectionCache(entry.path, entry.params, entry.items);
    }
  }
}

let homeBootstrapPromise = null;

/**
 * Load a public CMS collection.
 * - `undefined` → still loading (do NOT show fallback yet)
 * - `null`      → loaded but empty / error (safe to use fallback)
 * - `array`     → CMS data
 */
export function useCollection(path, params) {
  const key = collectionKey(path, params);
  const cached = collectionCache.get(key);
  const [data, setData] = useState(
    cached && cached.status === "resolved" ? cached.value : undefined
  );

  useEffect(() => {
    let active = true;
    const existing = collectionCache.get(key);

    if (existing && existing.status === "resolved") {
      setData(existing.value);
      return () => {
        active = false;
      };
    }

    if (!existing) {
      setData(undefined);
      const promise = publicApi
        .get(path, { params })
        .then((r) => {
          const rows = Array.isArray(r.data) ? r.data : [];
          const value = rows.length ? rows : null;
          collectionCache.set(key, { status: "resolved", value });
          return value;
        })
        .catch(() => {
          collectionCache.set(key, { status: "resolved", value: null });
          return null;
        });
      collectionCache.set(key, { status: "pending", promise });
      promise.then((value) => active && setData(value));
    } else {
      setData(undefined);
      existing.promise.then((value) => active && setData(value));
    }

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return data;
}

/** Drop cached collection responses (e.g. after an admin save) so the next mount refetches. */
export function clearCollectionCache() {
  collectionCache.clear();
  homeBootstrapPromise = null;
}

/**
 * The site must render CMS content only — never template/demo fallback data,
 * in development or production. A slower first paint while the real data
 * loads is acceptable; showing fake placeholder content is not.
 *
 * - `loading: true`  → still fetching, render a skeleton/spinner, not content
 * - `loading: false, items: []` → fetch finished with nothing published yet;
 *   render a genuine empty state, never the `fallback` argument
 *
 * The `fallback` parameter is kept only for call-site readability/back-compat
 * and is intentionally never returned.
 */
export function resolveCmsList(cms, _fallback = []) {
  if (cms === undefined) return { loading: true, items: [] };
  return { loading: false, items: Array.isArray(cms) ? cms : [] };
}

// Site settings, cached across the app (loaded once).
let settingsCache = null;
let settingsPromise = null;

/** Clear cached settings so the next useSettings() fetch picks up CMS changes. */
export function clearSettingsCache() {
  settingsCache = null;
  settingsPromise = null;
  homeBootstrapPromise = null;
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

function loadHomeSectionsFallback(active, setState) {
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
}

/**
 * Homepage bootstrap: one request loads settings, sections, and all homepage
 * collections, then seeds the session cache so child components skip their
 * own fetches.
 */
export function useHomeBootstrap() {
  const [state, setState] = useState({ byKey: {}, order: null, loaded: false });

  useEffect(() => {
    let active = true;
    setState({ byKey: {}, order: null, loaded: false });

    if (!homeBootstrapPromise) {
      homeBootstrapPromise = publicApi
        .get("/public/home")
        .then((r) => r.data)
        .catch(() => null);
    }

    homeBootstrapPromise.then((payload) => {
      if (!active) return;
      if (payload?.sections) {
        applyHomePayload(payload);
        setState({
          byKey: payload.sections.byKey || {},
          order: payload.sections.order || null,
          loaded: true,
        });
        return;
      }
      loadHomeSectionsFallback(active, setState);
    });

    return () => {
      active = false;
    };
  }, []);

  return state;
}

// Home page sections: returns { byKey, order, loaded }.
export function useHomeSections() {
  const [state, setState] = useState({ byKey: {}, order: null, loaded: false });
  useEffect(() => {
    let active = true;
    setState({ byKey: {}, order: null, loaded: false });
    loadHomeSectionsFallback(active, setState);
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
