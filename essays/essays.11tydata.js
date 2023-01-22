const { DateTime } = require("luxon")
module.exports = async () => {
    return {
        layout: 'base.njk',
        tags: ['essays'],
        author: 'Bipana Gurung',
        eleventyComputed:{
        dateString: ({ page }) => DateTime.fromJSDate(page.date, { zone: 'utc' }).toLocaleString(DateTime.DATE_FULL)
    }
}
};