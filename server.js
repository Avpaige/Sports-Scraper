const express = require("express");
const mongoose = require("mongoose");
const handle = require("express-handlebars")
const axios = require("axios");
const cheerio = require("cheerio");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";


axios.get("https://www.nba.com/").then(response => {

    let $ = cheerio.load(response.data);
    let results = [];

    $("div.content_list--item_wrapper").children().each(function (i, element) {

        let title = $(element).children().text();
        let link = $(element).attr("href");


        results.push({
            title: title,
            link: "nba.com"+link
        });
    })
    console.log(results);
});



//ESPN
//div.headlineStack - sort of worked headline but no link

// NOT WORK:  ul.headlineStack_list  div.headlineStack_listContainer section.headlineStack_listContainer ul.headlineStack_list