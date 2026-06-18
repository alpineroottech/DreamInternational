import "@prisma/client";
import "@prisma/adapter-neon";
import "@neondatabase/serverless";
import "ws";
import serverless from "serverless-http";
import { app } from "../../server/src/app.js";

export const handler = serverless(app);
