var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");
var path = require('path');
var handlebars = require('express-handlebars');

var PORT = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./public"));
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1/mongoScraper";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

var db = require("./models");

app.get(['/', '/home'], function (req, res) {
    db.Article.find({ saved: false })
        .then(function (results) {
            res.render('home', { articles: results })
        })
})

app.get('/saved', function (req, res) {
    db.Article.find({ saved: true })
        .populate('comments')
        .then(function (results) {
            res.render('saved', { articles: results })
        })
})

app.post('/saved', function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.body.id }, { saved: true })
        .then(function (results) {
            res.render('home', { articles: results })
        })
})

app.delete('/saved', function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.body.id }, { saved: false })
        .then(function (results) {
            res.sendStatus(200);
        })
})

app.post('/comments', function (req, res) {
    console.log(req.body)
    db.Article.findOneAndUpdate({ _id: req.body.id }, { $push: { arrayOfComments: req.body.comment } })
        .then(function (dbUser) {
            res.json(dbUser);
        })
        .catch(function (err) {
            res.json(err);
        });;

})

app.delete('/comments', function (req, res) {
    console.log(req.body)
    db.Article.updateOne({ _id: req.body.articleId }, { $pull: { arrayOfComments: req.body.comment } },
        function removeConnectionsCB(err, obj) {
            res.json(obj);
        })
})

app.get("/articles", function (req, res) {
    request("https://npr.org/sections/arts/", function (error, response, html) {
        var $ = cheerio.load(html);
        var results = [];

        $("article").each(function (i, element) {
            let result = {};

            result.title = $(element)
                .children('.item-info')
                .children('.title')
                .children('a')
                .text();
            result.link = $(element)
                .children('.item-info')
                .children('.title')
                .children('a')
                .attr('href');
            result.summary = $(element)
                .children('.item-info')
                .children('.teaser')
                .children('a')
                .text();
            result.saved = false;
            if (result.title !== "" && result.summary !== "") {
                db.Article.create(result, function (err, data) {
                    if (err) {
                        console.log(err);
                    }
                })
            }
        });
        res.json(results)
    });
});

app.delete('/articles', function (req, res) {
    db.Article.deleteMany()
        .then(function (results) {
            res.render('home', { articles: results })
        })
})

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});

// result.title = $(element)
//                 .children('.story-wrap')
//                 .children('.story-text')
//                 .children('a')
//                 .first()
//                 .children('.title')
//                 .text();
//             result.link = $(element)
//                 .children('.story-wrap')
//                 .children('.story-text')
//                 .children('a')
//                 .first()
//                 .attr('href');
//             result.summary = $(element)
//                 .children('.story-wrap')
//                 .children('.story-text')
//                 .children('a')
//                 .last()
//                 .children('.teaser')
//                 .text();