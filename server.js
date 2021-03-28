// CSCI 3916 Hwk 3
//Dillon Shaver
//File: Server.js
//Description: web Api scaffolding for movie Api

var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var authController = require('./auth');
var authJwtController = require('./auth_jwt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var User = require('./Users');
var Movie = require('./Movies')
var Review = require('./Reviews')

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

var router = express.Router();

function getJSONObjectForMovieRequirement(req) {
    var json = {
        headers: "No headers",
        body: "No body"
    };

    if (req.body != null) {
        json.body = req.body;
    }

    if (req.headers != null) {
        json.headers = req.headers;
    }

    return json;
}

router.post('/signup', function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please include both username and password to signup.'})
    } else {
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        user.save(function(err){
            if (err) {
                if (err.code == 11000)
                    return res.json({ success: false, message: 'A user with that username already exists.'});
                else{
                    res.json({success: false, msg: 'Unexpected error occured.'});
                    return res.json(err);
                }
            }

            res.json({success: true, msg: 'Successfully created new user.'})
        });
    }
});

router.post('/signin', function (req, res) {
    var userNew = new User();
    userNew.username = req.body.username;
    userNew.password = req.body.password;

    User.findOne({ username: userNew.username }).select('name username password').exec(function(err, user) {
        if (err) {
            res.send(err);
        }

        user.comparePassword(userNew.password, function(isMatch) {
            if (isMatch) {
                var userToken = { id: user.id, username: user.username };
                var token = jwt.sign(userToken, process.env.SECRET_KEY);
                res.json ({success: true, token: 'JWT ' + token});
            }
            else {
                res.status(401).send({success: false, msg: 'Authentication failed.'});
            }
        })
    })
});

router.route('/movies')
    .get(authJwtController.isAuthenticated, function (req, res) {
        if (!req.body.Title || !req.body.Genre || !req.body.Year || !req.body.Actors) {
            res.json({success: false, msg: 'Please include Title, Genre, Year, and Actors.'})
        }
        var movieFind = new Movie();
        movieFind.Title = req.body.Title;
        movieFind.Year = req.body.Year;
        movieFind.Genre = req.body.Genre;
        movieFind.Actors = req.body.Actors;



        Movie.findOne({Title: movieFind.Title},function(err, movi){
            if (err){
                res.status(401).send({success: false, msg: "an unexpected error occured"});
            }
            else{
                res.status(200).send({success: true, Title: movi.Title, Year: movi.Year, Genre: movi.Genre, Actors: movi.Actors});
            }
        })
        if(req.body.Reviews === true){
            var reviewFind = new Review();
            reviewFind.Title = req.body.Title;
            reviewFind.Name = req.body.Name;
            reviewFind.Quote = req.body.Quote;
            reviewFind.Rating = req.body.Rating;
            Review.findOne({Title: reviewFind.Title}, function(err,revi){
                if(err){
                    res.status(401).send({success: false, msg: "Error searching for review."});
                }
                else{
                    res.status(200).send({success: true, Title: revi.Title, Name: revi.Name, Quote: revi.Quote, Rating: revi.Rating});
                }
            })
        }

    })
    .post(authJwtController.isAuthenticated, function (req, res) {
        if (!req.body.Title || !req.body.Genre || !req.body.Year || !req.body.Actors) {
            res.json({success: false, msg: 'Please include Title, Genre, Year, and Actors.'})
        }
        var movieFind = new Movie();
        movieFind.Title = req.body.Title;
        movieFind.Year = req.body.Year;
        movieFind.Genre = req.body.Genre;
        movieFind.Actors = req.body.Actors;
        movieFind.save(function (err){
            if (err){
                res.status(401).send({success: false, msg: "an unexpected error occurred"});
                }
            else{
                    res.status(200).send({success: true, msg: "Movie successfully created."});
                }
            })

        if(req.body.Reviews === true){
            var reviewFind = new Review();
            reviewFind.Title = req.body.Title;
            reviewFind.Name = req.body.Name;
            reviewFind.Quote = req.body.Quote;
            reviewFind.Rating = req.body.Rating;
            reviewFind.save(function(err){
                if(err){
                    res.status(401).send({success: false, msg: "Error saving review."});
                }
                else{
                    res.status(200).send({success: true, msg: "Movie and review successfully created."});
                }
            })
        }
    })
    .put(authJwtController.isAuthenticated, function (req, res) {

        if (!req.body.Title || !req.body.Genre || !req.body.Year || !req.body.Actors) {
            res.json({success: false, msg: 'Please include Title, Genre, Year, and Actors.'})
        }
        var movieFind = new Movie();
        movieFind.Title = req.body.Title;
        movieFind.Year = req.body.Year;
        movieFind.Genre = req.body.Genre;
        movieFind.Actors = req.body.Actors;

        Movie.findOne({Title: movieFind.Title},function(err, movi){
            if (err){
                res.send(err);
            }
            else{
                movi.Title = movieFind.Title;
                movi.Year = movieFind.Year;
                movi.Genre = movieFind.Genre;
                movi.Actors = movieFind.Actors;
                movi.save(function(err){
                    if (err){
                        res.status(401).send({success: false, msg: "an unexpected error occurred"});
                    }
                    else{
                        res.status(200).send({success: true, msg: "Movie successfully updated."});
                    }
                })
            }
        })
    })
    .delete(authController.isAuthenticated, function (req, res) {
        if (!req.body.Title || !req.body.Genre || !req.body.Year || !req.body.Actors) {
            res.json({success: false, msg: 'Please include Title, Genre, Year, and Actors.'})
        }
        var movieFind = new Movie();
        movieFind.Title = req.body.Title;
        movieFind.Year = req.body.Year;
        movieFind.Genre = req.body.Genre;
        movieFind.Actors = req.body.Actors;

        Movie.findOneAndRemove({Title: movieFind.Title}, function (err, movi) {
            if (err) {
                res.status(401).send({success: false, msg: "an unexpected error occurred"});
            } else {
                res.status(200).send({success: true, msg: "Movie successfully deleted."});
            }
        })
    })


app.use('/', router);
app.listen(process.env.PORT || 8080);
module.exports = app; // for testing only
