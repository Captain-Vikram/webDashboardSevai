import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed. Use GET." });
    return;
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    res.status(400).json({ error: "Missing or invalid view id query parameter." });
    return;
  }

  try {
    const filePath = path.join(process.cwd(), ".data", "views", `${id}.json`);
    
    let fileContent;
    try {
      fileContent = await fs.readFile(filePath, "utf8");
    } catch (err: any) {
      if (err.code === "ENOENT") {
        res.status(404).json({ error: "View not found or expired." });
        return;
      }
      throw err;
    }

    const data = JSON.parse(fileContent);
    res.status(200).json(data);
  } catch (error) {
    console.error("API error fetching view:", error);
    res.status(500).json({ error: "Internal server error while fetching view data." });
  }
}
