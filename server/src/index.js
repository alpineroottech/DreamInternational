import "dotenv/config";
import { app } from "./app.js";

const PORT = process.env.PORT || 4000;

// Neon WebSocket connections can drop transiently; log instead of crashing the whole API.
process.on("unhandledRejection", (reason) => {
  console.error("[api] Unhandled rejection (server kept running):", reason);
});

app.listen(PORT, () => {
  console.log(`Dream International CMS API running on http://localhost:${PORT}`);
});
