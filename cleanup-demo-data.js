require("dotenv").config();
const axios = require("axios");

const API_BASE = "http://localhost:3000/api";

async function cleanupDemoData() {
  try {
    console.log("🧹 Starting cleanup of demo data...");

    // Clean up demo stories
    console.log("Cleaning up demo stories...");
    const storiesResponse = await axios.delete(
      `${API_BASE}/stories/cleanup-demo`,
    );
    console.log("✅", storiesResponse.data.message);

    // Clean up demo daily updates
    console.log("Cleaning up demo daily updates...");
    const updatesResponse = await axios.delete(
      `${API_BASE}/daily-updates/cleanup-demo/all`,
    );
    console.log("✅", updatesResponse.data.message);

    console.log("🎉 Demo data cleanup completed successfully!");
    console.log(
      "📝 New stories and daily updates will now use your real S3 bucket (gsb-data)",
    );
  } catch (error) {
    console.error(
      "❌ Error during cleanup:",
      error.response?.data || error.message,
    );
  }
}

// Run the cleanup
cleanupDemoData();
