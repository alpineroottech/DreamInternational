const { createProxyMiddleware } = require("http-proxy-middleware");

/** Fallback when REACT_APP_API_URL=/api — forwards API calls to the CMS server in dev. */
module.exports = function setupProxy(app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:4000",
      changeOrigin: true,
    }),
  );
};
