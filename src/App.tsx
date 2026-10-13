import { useEffect, useState } from "react";
import { PieChartWithLegend } from "@/components/ui/pie-chart-with-legend";
import { SampleDataTable } from "@/components/ui/sample-data-table";
import { applyTheme, getThemeByStreak, type Theme } from "@/lib/theme-generator";
import { fetchDashboardData } from "@/lib/dashboard-api";
import type { DashboardResponse } from "@/lib/dashboard-types";
import { fetchDemoDashboardData } from "@/lib/demo-dashboard-data";

export default function App() {
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    setMounted(true);

    const sheetId = new URLSearchParams(window.location.search).get("sheetId");
    const applyStreakTheme = (streakDays: number) => {
      const theme = getThemeByStreak(streakDays);
      applyTheme(theme);
      setCurrentTheme(theme);
    };

    const loadDashboard = async () => {
      try {
        const data = sheetId ? await fetchDashboardData(sheetId) : await fetchDemoDashboardData();
        setDashboardData(data);
        applyStreakTheme(data.account?.currentStreak ?? 0);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load dashboard data.";
        console.error("Failed to load dashboard data:", error);
        setErrorMsg(message);
        setDashboardData(null);
        applyStreakTheme(0);
      } finally {
        setIsLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  if (!mounted) {
    return null;
  }

  const fontUrl =
    currentTheme?.fontName === "JetBrains Mono"
      ? "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700;800&display=swap"
      : currentTheme && currentTheme.fontName !== "Geist Sans"
        ? `https://fonts.googleapis.com/css2?family=${currentTheme.fontName.replace(/ /g, "+")}:wght@300;400;500;600;700;800&display=swap`
        : null;

  return (
    <>
      {fontUrl && <link rel="stylesheet" href={fontUrl} />}
      <div className="dark">
        <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-4 mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Spending Insights Dashboard</h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Monitor streaks, category spending, and credit vs. debit trends
              </p>
            </div>
            <PieChartWithLegend
              data={dashboardData}
              isLoading={isLoading}
              errorMsg={errorMsg}
            />
          </div>
          <div className="w-full max-w-4xl mx-auto mt-6 mb-6 md:mb-8">
            <SampleDataTable data={dashboardData?.tableData ?? []} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </>
  );
}
