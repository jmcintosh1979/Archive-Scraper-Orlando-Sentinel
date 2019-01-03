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

// Route to Scrape the Orlando Sentinel website
app.get("/scrape", function(req, res) {
  axios.get("https://www.orlandosentinel.com").then(function(response) {
    var $ = cheerio.load(response.data);

    $("li.trb_outfit_group_list_item").each(function(i, element) {

      var title = $(this).children("section").children("h3").text();
      var para = $(this).children("section").children("p").text();
      var link = $(this).children("a").attr("href");

      if (title && para && link) {
        db.Article.create({
          title: title,
          para: para,
          link: link
        })
          .then(function(dbArticle) {

            console.log(dbArticle);
          })
          .catch(function(err) {
            return res.json(err);
          });
        };
    });
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for getting an Article by ID
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route to add a Note to an Article
app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
  .then(function(dbNote) {
    return db.Article.findOneAndUpdate(
      {_id: req.params.id},
      {note: dbNote._id},
      {new: true}
    );
  })
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err)
  });
});



// Route to delete a Note attached to an Article
app.get("/articles/delete/:id", function(req, res) {
  db.Note.deleteOne({ _id: req.params.id }, function(err, deleted) {
    if (err) {
      res.send(err);
    } else {
      res.send(deleted)
    }
  })
})


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
