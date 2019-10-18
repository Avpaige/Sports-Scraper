const express = require("express");
const mongoose = require("mongoose");
const handle = require("express-handlebars")
const axios = require("axios");
const cheerio = require("cheerio");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

const databaseUrl = "scaraperdb";
const collections = ["articles"];

const db = require("./models");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.engine(
    "handlebars",
    exphbs({
      defaultLayout: "main"
    })
  );
  app.set("view engine", "handlebars");

