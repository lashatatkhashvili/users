"use strict";
require('dotenv').config()
const express = require("express");
let dotenv = require("dotenv").config()
const myDB = require('./connection');
const fccTesting = require("./freeCodeCamp/fcctesting.js");





let passport = require("passport")
let session = require("express-session")
let ObjectId = require("mongodb").ObjectId
let mongo = require("mongodb");
let uri = "mongodb+srv://freecodecamp:FAoBMs3ZVyFamkOL@freecodecmamp.udy32.mongodb.net/db1?retryWrites=true&w=majority"
let LocalStrategy = require("passport-local");
let bodyParser = require("body-parser");
let bcrypt = require("bcrypt");
const { profile } = require('console');
const app = express();

fccTesting(app); //For FCC testing purposes
app.use("/public", express.static(process.cwd() + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.set('view engine', 'ejs');
app.set('views', './views/pug')



app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize())
app.use(passport.session())




  
    
  
  
     
    app.post(
      "/loginn",
      (request, response) => {
        response.redirect("/loginn");
        
        
      }
    );
      app.route("/loginn").get((req, res) => {
        res.render("index");
      });  
      
      app.post(
        "/registerr",
        (request, response) => {
          response.redirect("/registerr");
          
          
        }
      );
        app.route("/registerr").get((req, res) => {
          res.render("register");
        });  
      

      
        mongo.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
          if (err) {
            console.log("Database error: " + err);
          } else {
            let db = client.db("db1")
            console.log("Successful database connection");
          
            app.listen(process.env.PORT || 3000, () => {
              console.log("Listening on port " + process.env.PORT);
            });
          
            app.route("/").get((req, res) => {
              res.render("mainsite", { title: "Home Page", message: "Please login", showLogin: true, showRegistration: true });
            });
          
            /* Save User Id to a cookie */
            passport.serializeUser((user, done) => {
              done(null, user._id);
            });
          
            /* Retrieve User details from cookie */
            passport.deserializeUser((userId, done) => {
              db.collection("users").findOne(
                { _id: new ObjectId(userId) },
                (error, doc) => {
                  done(null, doc);
                }
              );
            });
        
            let findUserDocument = new LocalStrategy((username, password, done) => {
              db.collection("users").findOne({ username: username }, (err, user) => {
                console.log("User " + username + " attempted to log in.");
                if (err) {
                  return done(err);
                }
                if (!user) {
                  return done(null, false);
                }
                if (!bcrypt.compareSync(password, user.password)) {
                  return done(null, false);
                }
                return done(null, user);
              });
              });
              
              passport.use(findUserDocument);
        
              app.post(
                "/login",
                bodyParser.urlencoded({ extended: false }),
                passport.authenticate("local", { failureRedirect: "/" }),
                (request, response) => {
                  response.redirect("/profile");
                  console.log(request.user)
                  
                }
              );
                
              app.get('/profile', (request, response) => {
                response.render("profile", {username: request.user.name});
              })
        
        
              function ensureAuthenticated(req, res, next) {
                if (req.isAuthenticated()) {
                  return next();
                }
                res.redirect("/");
              }
              
              app.route("/profile").get(ensureAuthenticated, (req, res) => {
                res.render(process.cwd() + "/views/pug/profile");
              });
        
              app.route("/profile").get(ensureAuthenticated, (req, res) => {
                res.render(process.cwd() + "/views/pug/profile", {
                  username: req.user.username
                });
              });
        
              app.route("/logout").get((req, res) => {
                req.logout();
                res.redirect("/");
              });
        
              app.route("/register").post(
          bodyParser.urlencoded({ extended: false }),
          (req, res, next) => {
            /* Check if user exists */
            db.collection("users").findOne(
              { username: req.body.username },
              (error, user) => {
                if (!error && user) {
                  res.redirect("/");
                }
              }
            );
            
            let hash = bcrypt.hashSync(req.body.password, 12)
            /* Create User Document */
            db.collection("users").insertOne(
              {
                username: req.body.username,
                password: hash
              },
              (error, createdUser) => {
                if (!error && createdUser) {
                  next();
                }
              }
            );
          },
          passport.authenticate("local", { failureRedirect: "/" }),
          (req, res) => {
            res.redirect("/profile");
          }
        );
        
              app.use((req, res, next) => {
                res
                  .status(404)
                  .type("text")
                  .send("Not Found");
              });
          }
          });