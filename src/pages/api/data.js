import { fetchData } from "./fetch";

let cachedData = null;
let cacheTimestamp = 0;

export default async function handler(req, res) {
  try {
    // Check if cached data exists and is not expired

    // Determine appropriate message based on whether data was fetched from cache or not
    let msg = "Data fetched from memory cache";

    if (!cachedData || Date.now() > cacheTimestamp + parseInt(process.env.CACHE_EXPIRES_AFTER_SECONDS || 3600) * 1000) {
      // Fetch fresh data if cache is expired or doesn't exist
      cachedData = await fetchData();
      cacheTimestamp = Date.now();
      msg = "Data fetched from API";
    }

    // Set Cache-Control header with s-maxage based on environment variable
    res.setHeader("Cache-Control", `public, s-maxage=${process.env.CACHE_EXPIRES_AFTER_SECONDS || 3600}`);

    // Respond with cached data
    return res.json({ data: cachedData, msg });
  } catch (error) {
    console.error("Request error:", error);
    return res.status(500).json({ error: error.message });
  }
}
