import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed. Use POST." });
    return;
  }

  try {
    const data = req.body;

    if (!data || typeof data !== 'object') {
      res.status(400).json({ error: "Invalid JSON body provided." });
      return;
    }

    const viewId = crypto.randomUUID();

    const viewsDir = path.join(process.cwd(), ".data", "views");

    // Ensure the directory exists
    try {
      await fs.access(viewsDir);
    } catch {
      await fs.mkdir(viewsDir, { recursive: true });
    }

    const filePath = path.join(viewsDir, `${viewId}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");

    // Construct the link
    const host = req.headers.host || "localhost:3000";
    const protocol = req.headers["x-forwarded-proto"] || (host.includes("localhost") ? "http" : "https");
    const link = `${protocol}://${host}/?viewId=${viewId}`;

    res.status(200).json({ link, viewId });
  } catch (error) {
    console.error("API error generating view:", error);
    res.status(500).json({ error: "Internal server error while generating view link." });
  }
}
