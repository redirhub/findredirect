import axios from "axios";

// Set axios instance defaults
axios.defaults.params = {
  [ "api-key" ]: process.env.API_KEY,
};
axios.defaults.baseURL = process.env.API_BASE;

export async function fetchData() {
  try {
    const { SITES } = process.env;
    const sites = JSON.parse(SITES);

    // Fetch data for each site and metrics asynchronously
    const sitesData = await Promise.all(
      sites.map((token) => {
        return Promise.all([
          axios.get(`checks/${token}`),
          axios.get(`checks/${token}/metrics`),
        ]);
      })
    );

    // Fetch nodes data
    const nodes = await axios.get(`/nodes`);

    // Construct data object with fetched data and timestamp
    const data = {
      sites: sitesData.map((check) => check.map((c) => c.data)),
      nodes: nodes.data,
      timestamp: Date.now(),
    };

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Throw error to be handled by caller
  }
}
