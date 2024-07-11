import path from "node:path";
import { readJsonSync, outputFileSync, ensureFileSync } from "fs-extra";
import { fetchData } from "./fetch";

export default async function handler(req, res) {
  // if data is not there
  // run fetchData
  const filePath = path.join(__dirname, "/checks.json");

  try {
    const content = readJsonSync(path.join(__dirname, "/checks.json"));

    if (!content.sites[0][0].token) {
      throw Error("Something went wrong!!!");
    }

    if (Date.now() > content.timestamp + parseInt(process.env.FETCH_INTERVAL || "5000")) {
      throw Error("Cache expired!");
    }

    return res.json({ data: content, msg: "Data read from file!" });
  } catch (error) {
    try {
      const content = await fetchData();

      outputFileSync(filePath, content);

      return res.json({ data: JSON.parse(content), msg: error.message });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}
