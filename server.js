var express = require("express");
// var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// // Use morgan logger for logging requests
// app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scrapeOS", { useNewUrlParser: true });

// Routes

app.get("/scrape", function(req, res) {
  axios.get("https://www.orlandosentinel.com").then(function(response) {
    var $ = cheerio.load(response.data);

    $("li.trb_outfit_group_list_item").each(function(i, element) {

      var result = {};

      result.title = $(this).children("section").children("h3").text();
      result.para = $(this).children("section").children("p").text();
      result.link = $(this).children("a").attr("href");
      
      db.Article.create(result)
        .then(function(dbArticle) {

          console.log(dbArticle);
        })
        .catch(function(err) {
          return res.json(err);
        });
    });
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
