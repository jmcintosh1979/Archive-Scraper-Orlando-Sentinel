const express = require("express"),
      mongoose = require("mongoose"),
      articleRoutes = require("./routes/article-routes.js"),
      noteRoutes = require("./routes/note-routes.js"),
      PORT = process.env.PORT || 3000,
      app = express(),
      exphbs = require("express-handlebars")

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Accessing the Routes created
app.use("/", articleRoutes)
app.use("/", noteRoutes)

// Make public a static folder
app.use(express.static("public"))

// Setting Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")


// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scrapeOS", { useNewUrlParser: true });

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
