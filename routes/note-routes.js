const express = require("express"),
      router = express.Router(),
      db = require("../models")

// Routes

// Route for getting all Articles from the db
router.get("/notes", function(req, res) {
  db.Note.find({})
    .then(function(dbNote) {
      res.json(dbNote);
    })
    .catch(function(err) {
      res.json(err);
    });
});

module.exports = router
