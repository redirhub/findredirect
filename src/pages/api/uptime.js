import axios from "axios";
import corsMiddleware from "@/middleware/corsMiddleware";
import { UPTIME_API_BASE, UPTIME_API_KEY, UPTIME_CACHE_EXPIRES } from "@/configs/constant";

// Set axios instance defaults
axios.defaults.params = {
  [ "api-key" ]: UPTIME_API_KEY,
};
axios.defaults.baseURL = UPTIME_API_BASE;


let cachedData = null;
let cacheTimestamp = 0;

async function fetchData(services) {
  try {
    const now = new Date();
    const yesterday = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    const formattedYesterday = yesterday.toISOString().replace('T', ' ').replace(/\..*$/, '') + ' UTC';

    const sitesData = await Promise.all(
      services.map((token) => {
        return Promise.all([
          axios.get(`checks/${token}`),
          axios.get(`checks/${token}/metrics`, { params: { from: formattedYesterday } }),
        ]);
      })
    );
    const nodes = await axios.get(`/nodes`);

    return {
      sites: sitesData.map((check) => check.map((c) => c.data)),
      nodes: nodes.data,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

async function handler(req, res) {
  try {
    // Validate services parameter is provided
    if (!req.query.services) {
      return res.status(400).json({
        error: "Missing required parameter: services",
        usage: "Use ?services=token1,token2,token3"
      });
    }

    // Parse and validate services
    const services = req.query.services.split(',').map(s => s.trim()).filter(Boolean);

    if (services.length === 0) {
      return res.status(400).json({
        error: "Invalid services parameter: must contain at least one service token",
        usage: "Use ?services=token1,token2,token3"
      });
    }

    const cacheExpirationTime = parseInt(UPTIME_CACHE_EXPIRES) * 1000;
    let msg = "Data fetched from memory cache";

    // Note: Current implementation uses single-entry cache
    // For production with multiple comparison pages, consider implementing
    // multi-entry cache keyed by service combination
    if (!cachedData || Date.now() > cacheTimestamp + cacheExpirationTime) {
      cachedData = await fetchData(services);
      cacheTimestamp = Date.now();
      msg = "Data fetched from API";
    }

    res.setHeader("Cache-Control", `public, s-maxage=${UPTIME_CACHE_EXPIRES}`);
    return res.json({ data: cachedData, msg, services: services.join(',') });
  } catch (error) {
    console.error("Request error:", error);
    return res.status(500).json({ error: error.message });
  }
}

export default corsMiddleware(handler);