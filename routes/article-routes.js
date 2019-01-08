const express = require("express"),
      router = express.Router(),
      db = require("../models"),
      axios = require("axios"),
      cheerio = require("cheerio")

      // Routes

// Route to Scrape the Orlando Sentinel website
router.get("/scrape", function(req, res) {
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

// Home page if Articles exist
router.get("/", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for getting all Articles from the db
router.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for getting an Article by ID
router.get("/articles/:id", function(req, res) {
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
router.post("/articles/:id", function(req, res) {
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
router.get("/articles/delete/:id", function(req, res) {
  db.Note.deleteOne({ _id: req.params.id }, function(err, deleted) {
    if (err) {
      res.send(err);
    } else {
      res.send(deleted)
    }
  })
})

module.exports = router
