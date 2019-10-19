const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = app => {

    app.get("/", function (req, res) {
        res.render("index");
    });

    app.get("/scrape", function (req, res) {
        // First, we grab the body of the html with axios
        axios.get("https://www.nba.com/").then(function (response) {

            $("div.content_list--item_wrapper").children().each(function (i, element) {
                let result = {}
                result.title = $(this).children().text();
                result.link = $(this).attr("href");
                result.link = "www.nba.com" + result.link
                result.saved = false

                db.Article.create(result)
                    .then(function (dbArticle) {
                        console.log(dbArticle);
                        res.render("scrape");
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            });



            app.get("/notes", function (req, res) {
                app.get("/articles/:id", function (req, res) {
                    db.Article.findOne({ _id: req.params.id })
                        .populate("note")
                        .then(function (dbArticle) {
                            res.render("notes");
                            //   res.json(dbArticle);
                        })
                        .catch(function (err) {
                            res.json(err);
                        });
                });

            });


            app.get("/notes", function (req, res) {
                // Route for saving/updating an Article's associated Note
                app.post("/articles/:id", function (req, res) {
                    // Create a new note and pass the req.body to the entry
                    db.Note.create(req.body)
                        .then(function (dbNote) {
                            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
                            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
                        })
                        .then(function (dbArticle) {
                            // If we were able to successfully update an Article, send it back to the client
                            res.json(dbArticle);
                        })
                        .catch(function (err) {
                            // If an error occurred, send it to the client
                            res.json(err);
                        });
                });

            });

            app.get("/saved", function (req, res) {
                res.render("saved");
            });

            app.get("*", function (req, res) {
                res.render("404");
            });
        });
    });
};