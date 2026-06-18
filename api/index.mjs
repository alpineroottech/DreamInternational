import serverless from "serverless-http";
import { app } from "../server/src/app.js";

// Required for multer file uploads (multipart) on Vercel.
export const config = {
  api: {
    bodyParser: false,
  },
};

export default serverless(app);
