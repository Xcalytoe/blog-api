function calculateReadingTime(text) {
  if (!text) return 0;

  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wordsPerMinute);
  // in minutes
  return time;
}
module.exports = calculateReadingTime;
