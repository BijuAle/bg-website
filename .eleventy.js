module.exports = function (eleventyConfig) {

  require("dotenv").config();
  const cloudinary = require("cloudinary").v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Copy CSS to output as-is
  eleventyConfig.addPassthroughCopy("src/style.css");
  eleventyConfig.addPassthroughCopy("src/assets");

  // Human-friendly date: "Jan 10, 2026"
  eleventyConfig.addFilter("dateReadable", (dateVal) => {
    const d = new Date(dateVal);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC"
    });
  });

  // Add getAllTags filter
  eleventyConfig.addFilter("getAllTags", (collectionsObj) => {
    let tagSet = new Set();
    Object.keys(collectionsObj).forEach((tag) => {
      if (tag !== "all" && tag !== "post" && (collectionsObj[tag] && collectionsObj[tag].length > 0)) {
        tagSet.add(tag);
      }
    });
    return [...tagSet];
  });

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data"
    }
  };
};
