import { ALL_LOCALES, APP_BASE_URL } from "@/configs/constant";

/**
 * Generates a UUID in the version 4 format.
 * @returns {string} A UUID string.
 */
export function getRandomUUID() {
  // Create an array of hexadecimal digits
  const hexDigits = "0123456789abcdef".split("");

  // Create an array of 36 characters
  const chars = new Array(36);

  // Loop through the characters array
  for (let i = 0; i < 36; i++) {
    // If the index is 8, 13, 18, or 23, insert a hyphen
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      chars[i] = "-";
    } else {
      // Otherwise, insert a random hexadecimal digit
      chars[i] = hexDigits[Math.floor(Math.random() * 16)];
    }
  }

  return chars.join("");
}

/**
 * Returns a clamp expression for fluid typography based on the given parameters.
 * @param {string} minFontSize - The minimum font size in pixels.
 * @param {string} maxFontSize - The maximum font size in pixels.
 * @param {string} [minViewport='768px'] - The minimum viewport width in pixels.
 * @param {string} [maxViewport='1400px'] - The maximum viewport width in pixels.
 * @returns {string} A clamp expression that can be used in CSS.
 */
export function getFluidFontSize(minFontSize, maxFontSize, minViewport = "768px", maxViewport = "1400px") {
  // Convert the parameters to numbers
  minFontSize = parseFloat(minFontSize);
  maxFontSize = parseFloat(maxFontSize);
  minViewport = parseFloat(minViewport);
  maxViewport = parseFloat(maxViewport);

  let fontSizeInRem = minFontSize / 16;
  let fontSizeDiff = maxFontSize - minFontSize;
  let viewportDiff = maxViewport - minViewport;

  // Return the clamp expression as a string
  return `clamp(${minFontSize}px, calc(${fontSizeInRem}rem + ${fontSizeDiff} * ((100vw - ${minViewport}px) / ${viewportDiff})), ${maxFontSize}px)`;
}

export const fontSizes = {
  text140: getFluidFontSize("70px", "140px"),
  text100: getFluidFontSize("50px", "100px"),
  text90: getFluidFontSize("45px", "90px"),
  text80: getFluidFontSize("40px", "80px"),
  text70: getFluidFontSize("35px", "70px"),
  text60: getFluidFontSize("30px", "60px"),
  text50: getFluidFontSize("25px", "50px"),
  text40: getFluidFontSize("22px", "40px"),
  text30: getFluidFontSize("20px", "30px"),
  text20: getFluidFontSize("18px", "20px"),
  text16: getFluidFontSize("15px", "16px"),
  text14: "14px",
};

/**
 * Converts a datetime string into to a formatted date compared to current time.
 *
 * @param {string} inputDatetime A datetime string in the format YYYY-MM-DDTHH:MM:SS.fffZ
 * @returns {string} A string representing the time difference in a readable format.
 */
export function getFormattedTimeDiff(inputDatetime) {
  let inputDt;
  try {
    // Parse the input datetime string
    inputDt = new Date(inputDatetime);
  } catch (ValueError) {
    return "Invalid datetime format.";
  }

  const now = new Date();
  const delta = Math.abs(now - inputDt); // Take absolute value of difference
  const seconds = delta / 1000;

  // Define units and their corresponding thresholds
  const units = [
    ["years", 31536000],
    ["months", 2592000],
    ["weeks", 604800],
    ["days", 86400],
    ["hours", 3600],
    ["minutes", 60],
  ];

  // Iterate through units to find the best fit
  for (const [unit, threshold] of units) {
    if (seconds >= threshold) {
      const value = Math.floor(seconds / threshold);
      if (unit === "months") {
        // Format date for "June 28, 2018" format
        const options = { year: "numeric", month: "long", day: "numeric" };
        return inputDt.toLocaleDateString("en-US", options);
      } else {
        return `${value} ${unit} ago`;
      }
    }
  }

  // If less than a minute, return "just now"
  return "just now";
}

export function getHrefForLocale(loc, asPath) {
  return loc === 'en' 
    ? `${APP_BASE_URL}${asPath}` 
    : `${APP_BASE_URL}/${loc}${asPath}`;
};

export function generateHrefLangsAndCanonicalTag(locale, asPath) {
  const hrefLangTags = ALL_LOCALES.map((loc) => (
    <link
      key={loc}
      rel="alternate"
      hrefLang={loc}
      href={getHrefForLocale(loc, asPath)}
    />
  ));

  const canonicalTag = (
    <link
      key="canonical"
      rel="canonical"
      href={getHrefForLocale(locale ?? 'en', asPath)}
    />
  );

  return [...hrefLangTags, canonicalTag];
}