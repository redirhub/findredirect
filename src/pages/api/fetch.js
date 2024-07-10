import path from "node:path";
import { outputFileSync } from "fs-extra";
import axios from "axios";
import {console} from "next/dist/compiled/@edge-runtime/primitives";


async function fetchData() {
  const { API_BASE, API_KEY, SITES } = process.env;
  const sites = JSON.parse(SITES);
  
  axios.defaults.params = {
    ['api-key']: API_KEY
  }
  
  axios.defaults.baseURL = API_BASE;
  
  const sitesData = await Promise.all(
   sites.map( token => {
    return Promise.all([axios.get(`checks/${token}`), axios.get(`checks/${token}/metrics`)])
   })
  );
  
  // const nodes = await fetchNodes....
  
  return JSON.stringify({
    sites: sitesData.map( check => check.map( c => c.data) ),
    // nodes:
  });
}



export default async function handler( req, res ) {
  try {
   
    const content = await fetchData();
    
    outputFileSync(path.join(__dirname, '/checks.json'), content);
    
    return res.json({ msg: "Successfully saved"});
  } catch ( error ) {
    console.error( error )
    return res.status(500).json({ error: error.message })
  }
  
}