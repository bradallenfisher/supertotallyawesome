const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("css");
    eleventyConfig.addPassthroughCopy("media");

    eleventyConfig.addFilter("formatDate", (dateObj) => {
        return DateTime.fromJSDate(dateObj).toFormat("MM-dd-yyyy");
    });     

    // Create a tags collection
    eleventyConfig.addCollection("tagList", function(collection) {
        let tagSet = new Set();
        collection.getAll().forEach(item => {
            if ("tags" in item.data) {
                let tags = item.data.tags;
                if (typeof tags === "string") {
                    tags = [tags];
                }
                for (const tag of tags) {
                    tagSet.add(tag);
                }
            }
        });
        // Filter out "post" tag which is used to identify all posts
        return [...tagSet].filter(tag => tag !== "post").sort();
    });

    let markdownOptions = {
        html: true,
        breaks: true,
        linkify: true
    };
    let markdownLib = new markdownIt(markdownOptions);

    //Add div around tables
    markdownLib.renderer.rules.table_open = () => '<div class="table-wrapper">\n<table>\n',
    markdownLib.renderer.rules.table_close = () => '</table>\n</div>',

    eleventyConfig.setLibrary("md", markdownLib);
};