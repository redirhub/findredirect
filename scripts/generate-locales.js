require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https'); // Required for https.Agent

const TRANSLATION_URL = process.env.TRANSLATION_URL;
const allLanguages = [ "en", "de", "es", "fr", "it", "pt", "ja", "zh", "ko" ];
const outputDir = path.join(__dirname, '../public/locales');

function ensureDirExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function fetchTranslationsFromApi(locale) {
  const url = TRANSLATION_URL.replace('{{lng}}', locale);
  const response = await fetch(url, {
    agent: new https.Agent({ rejectUnauthorized: false }), // ✅ Now https is defined
  });
  const common = await response.json();
  return { common };
}

// Use for...of with await instead of map + async (to ensure serial execution)
(async () => {
  for (const lang of allLanguages) {
    const resources = await fetchTranslationsFromApi(lang);
    const langDir = path.join(outputDir, lang);
    ensureDirExists(langDir);
    
    const filePath = path.join(langDir, 'common.json');

    fs.writeFileSync(filePath, JSON.stringify(resources.common, null, 2), 'utf8');
    console.log(`✅ Saved translations to ${filePath}`);
  }
})();
