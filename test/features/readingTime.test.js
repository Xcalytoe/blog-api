const calculateReadingTime = require("../../src/utils/readingTime");

describe("calculateReadingTime", () => {
  test("should return 0 for empty text", () => {
    expect(calculateReadingTime("")).toBe(0);
    expect(calculateReadingTime(null)).toBe(0);
    expect(calculateReadingTime(undefined)).toBe(0);
  });

  test("should return 1 for short text under 200 words", () => {
    const text = "This is a short article.";
    expect(calculateReadingTime(text)).toBe(1);
  });

  test("should correctly calculate 1 minute for 200 words", () => {
    const text = Array(200).fill("word").join(" ");
    expect(calculateReadingTime(text)).toBe(1);
  });

  test("should correctly calculate 2 minutes for 300-400 words", () => {
    const text = Array(350).fill("word").join(" ");
    expect(calculateReadingTime(text)).toBe(2);
  });

  test("should handle leading and trailing spaces correctly", () => {
    const text = "   word ".repeat(200);
    expect(calculateReadingTime(text)).toBe(1);
  });

  test("should round up fractional minutes", () => {
    const text = Array(201).fill("word").join(" ");
    expect(calculateReadingTime(text)).toBe(2);
  });
});
