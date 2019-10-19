const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = app => {

    app.get("/", function (req, res) {
        res.render("index");
    });

    app.get("/scrape", function (req, res) {
        // First, we grab the body of the html with axios
        axios.get("https://www.nba.com/").then(response => {
            let $ = cheerio.load(response.data);

            $("div.content_list--item_wrapper").children().each(function (i, element) {
                let result = {}
                result.title = $(this).children().text();
                result.link = $(this).attr("href");
                result.link = "www.nba.com" + result.link;
                result.saved = false

                db.Article.find({ link: result.title})
                    .then(foundArticle => {
                        if (!foundArticle.length) {
                            db.Article.create(result)
                                .then(result =>{
                                    console.log(result)
                                    // res.render("scrape")
                                    res.json(result)
                                })
                                .catch(error => console.log(error));
                        }
                    })
            })
        })
    })
  
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
        app.post("/articles/:id", function (req, res) {
            db.Note.create(req.body)
                .then(function (dbNote) {
                    return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
                })
                .then(function (dbArticle) {
                    res.json(dbArticle);
                })
                .catch(function (err) {
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
};

