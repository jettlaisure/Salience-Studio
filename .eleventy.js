module.exports = function(eleventyConfig) {

  // ── Ignore non-blog markdown ──
  eleventyConfig.ignores.add("demos/**");
  eleventyConfig.ignores.add("node_modules/**");

  // ── Passthrough: assets & existing HTML pages ──
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("demos");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
  eleventyConfig.addPassthroughCopy("index.html");
  eleventyConfig.addPassthroughCopy("services.html");
  eleventyConfig.addPassthroughCopy("deliverables.html");
  eleventyConfig.addPassthroughCopy("faq.html");
  eleventyConfig.addPassthroughCopy("contact.html");

  // ── Blog post collection (all .md files in /blog/) ──
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("blog/*.md")
      .sort((a, b) => new Date(b.data.publishedDate) - new Date(a.data.publishedDate));
  });

  // ── Date filter ──
  eleventyConfig.addFilter("readableDate", (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric"
    });
  });

  return {
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
    }
  };
};
