import type { DashboardResponse } from "./dashboard-types";

const NGROK_BYPASS_HEADER = "ngrok-skip-browser-warning";

export async function fetchDashboardData(sheetId: string): Promise<DashboardResponse> {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error("The dashboard webhook is not configured.");
  }

  const response = await fetch(
    `${webhookUrl.replace(/\/$/, "")}/webhook/dashboard-data?sheetId=${encodeURIComponent(sheetId)}`,
    {
      headers: {
        [NGROK_BYPASS_HEADER]: "69420",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Dashboard request failed with status ${response.status}.`);
  }

  const data: unknown = await response.json();

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("The dashboard webhook returned an invalid response.");
  }

  return data as DashboardResponse;
}
