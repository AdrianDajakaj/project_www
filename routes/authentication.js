var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
var mysql = require('mysql2');

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
});

var router = express.Router();
var db = require('../models/database');
db.connect();

var query1= `SET NAMES 'utf8mb4';`;
var query2= `SET CHARACTER SET utf8mb4;`;


db.query(query1, (err, rows, fields) => {
    if (err) throw err;
    return;
});

db.query(query2, (err, rows, fields) => {
    if (err) throw err;
    return;
});

passport.use(new LocalStrategy(function verify(username, password, cb) {
    db.get('SELECT * FROM users WHERE username = ?', [ username ], function(err, row) {
      if (err) { return cb(err); }
      if (!row) { return cb(null, false, { message: 'Niepoprawny adres e-mail lub hasło.' }); }
      
      crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
        if (err) { return cb(err); }
        if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
          return cb(null, false, { message: 'Niepoprawny adres e-mail lub hasło.' });
        }
        return cb(null, row);
      });
    });
  }));

  passport.use(new LocalStrategy(function verify(username, password, cb) {
    db.query('SELECT * FROM users WHERE email = ?', [username], function(err, rows) {
      if (err) {
        return cb(err);
      }
  
      // Check if any rows were found
      if (!rows.length) {
        return cb(null, false, { message: 'Niepoprawny adres e-mail lub hasło.' });
      }
  
      const row = rows[0];  // Assuming you expect only one user with a given username
  
      // Check if the row has a valid 'salt' property
      if (!row || !row.salt) {
        return cb(null, false, { message: 'Niepoprawny adres e-mail lub hasło.' });
      }
  
      crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
        if (err) {
          return cb(err);
        }
  
        // Check if the hashedPassword matches the stored hashed password
      if (hashedPassword.toString('hex') !== row.hashedPassword.toString('hex')) {
          return cb(null, false, { message: 'Niepoprawny adres e-mail lub hasło.' });
        }
  
        return cb(null, row);
      });
    });
  }));
  



  router.get('/', function(req, res, next) {
    res.render('authentication', { title: 'authentication' , message: req.flash('error')});
  });

  router.post('/password', passport.authenticate('local', {
    successRedirect: '/mainpage',
    failureRedirect: '/',
    failureFlash: true
}));






router.post('/signup', function(req, res, next) {
    var salt = crypto.randomBytes(16);
    crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
        if (err) { return next(err); }
  
        
      db.query('INSERT INTO users (firstName, lastName, email, hashedPassword, salt) VALUES (?, ?, ?, ?, ?)', [
        req.body.firstname,
        req.body.lastname,
        req.body.username,
        hashedPassword,
        salt
      ], function(err) {
        if (err) { return next(err); }
        var user = {
          id: this.lastID,
          username: req.body.email
        };
        req.login(user, function(err) {
          if (err) { return next(err); }
          res.redirect('/');
        });
      });
    });
  });

module.exports = router;
