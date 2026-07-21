import { Router } from "express";
import { setPublicCache } from "../lib/publicCache.js";
import { fetchHomePayload } from "../lib/homeData.js";

export const publicHome = Router();

publicHome.get("/", async (_req, res, next) => {
  try {
    const payload = await fetchHomePayload();
    setPublicCache(res, { maxAge: 60, swr: 300 });
    res.json(payload);
  } catch (e) {
    next(e);
  }
});
