const axios = require("axios")
const db = require("../models/index.js");
const cheerio = require("cheerio");

module.exports = function (app) {
    // Load index page
    app.get("/", function (req, res) {
        res.render("index");
    });

    app.get("/scrape", function (req, res) {
        axios.get("https://www.nba.com/").then(request, response => {
            let $ = cheerio.load(response.data);
            let results = [];

            $("div.content_list--item_wrapper").children().each(function (i, element) {
                let title = $(element).children().text();
                let link = $(element).attr("href");
                let article = {
                    title: title,
                    link: "nba.com" + link,
                    saved: false
                };
            })
            console.log(results);
        });

        res.render("welcome");
    });

  
    // Render 404 page for any unmatched routes
    app.get("*", function (req, res) {
        res.render("404");
    });

};
