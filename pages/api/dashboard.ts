import type { NextApiRequest, NextApiResponse } from "next";
import { fetchUserDashboardData } from "@/lib/dashboard-service";
import { syncDashboardDataHandler } from "@/lib/sync-dashboard-data";

type ResponseData =
  | any
  | {
      error: string;
    };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { userId, sync } = req.query;

    if (!userId) {
      res.status(400).json({ error: "Missing userId query parameter" });
      return;
    }

    const userIdNum = parseInt(userId as string, 10);
    if (Number.isNaN(userIdNum)) {
      res.status(400).json({ error: "Invalid userId: must be a number" });
      return;
    }

    // If sync=true, update dashboard-data.json file
    if (sync === "true") {
      try {
        console.log(`[API] Syncing dashboard data for user ${userIdNum} to JSON...`);
        await syncDashboardDataHandler(userIdNum);
        res.status(200).json({
          message: "Dashboard data synced successfully",
          userId: userIdNum,
          syncedAt: new Date().toISOString(),
        });
        return;
      } catch (syncError) {
        console.error("[API] Sync error:", syncError);
        res.status(500).json({ error: "Failed to sync dashboard data to JSON" });
        return;
      }
    }

    // Otherwise, return the API response as normal
    const dashboardData = await fetchUserDashboardData(userIdNum);

    if (!dashboardData) {
      res
        .status(404)
        .json({ error: "User not found or failed to fetch dashboard data" });
      return;
    }

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
