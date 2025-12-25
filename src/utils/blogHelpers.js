export const WORDS_PER_MINUTE = 200;

export const getWordCountFromContent = (content) => {
  if (!Array.isArray(content)) return 0;

  return content.reduce((count, block) => {
    if (block?._type === "block" && Array.isArray(block.children)) {
      const text = block.children.map((child) => child?.text || "").join(" ");
      const words = text.trim().split(/\s+/).filter(Boolean);
      return count + words.length;
    }
    return count;
  }, 0);
};

export const calculateReadTimeMinutes = (content) => {
  const wordCount = getWordCountFromContent(content);
  if (!wordCount) return 0;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
};

export const formatPostDate = (dateString, locale = "en-US", format = "short") => {
  const options = format === "short"
    ? { year: "numeric", month: "short", day: "numeric" }
    : { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(locale, options);
};

export const normalizeTag = (tag) => {
  return tag.toLowerCase().trim().replace(/\s+/g, "-");
};

export const denormalizeTag = (tagSlug) => {
  return tagSlug.replace(/-/g, " ");
};
