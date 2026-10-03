/**
 * Sync Dashboard Data Utility
 * Usage: node scripts/sync.mjs [userId]
 */

import http from "http";

const userId = process.argv[2] || "2";
const url = `http://localhost:3000/api/dashboard?userId=${userId}&sync=true`;

console.log(`🔄 Syncing dashboard data for user ${userId}...`);

http.get(url, (res) => {
  let data = "";
  res.on("data", (chunk) => { data += chunk; });
  res.on("end", () => {
    const result = JSON.parse(data);
    if (res.statusCode === 200) {
      console.log(`✅ ${result.message}`);
      console.log(`📦 Data saved to: public/dashboard-data.json`);
    } else {
      console.error(`❌ Error: ${result.error}`);
    }
  });
}).on("error", (err) => {
  console.error(`❌ Connection failed: ${err.message}`);
  console.log("ℹ️  Make sure dev server is running: npm run dev");
});
