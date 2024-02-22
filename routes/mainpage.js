var express = require('express');
var router = express.Router();

var db = require('../models/database');
db.connect();

router.get('/mainpage', function(req, res, next) {
    res.render('mainpage', { title: 'Express', authentication: req.isAuthenticated(), user: req.user  });
});

router.post('/search', function(req, res, next) {
    var searchTerm = req.body.searchTerm;
    var query = "SELECT * FROM books WHERE bookTitle LIKE '%" + searchTerm + "%' OR bookAuthor LIKE '%" + searchTerm + "%'";

    db.query(query, function(err, results) {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
});

router.get('/library', function(req, res, next) {
    const userId = req.user.id;
    var query = "SELECT * FROM books WHERE id IN (SELECT bookID FROM user_library WHERE userID LIKE '%"+userId+"%');";

    db.query(query, function(err, results) {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(results);
        }
    });
});

router.get('/bookid/:id', (req, res) => {
    const id = req.params.id;
  
    const query = `SELECT * FROM books WHERE id = ?`;
  
    db.query(query, [id], (error, results) => {
      if (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json(results);
      }
    });
  });

  router.post('/bookid/:id', (req, res) => {
    const bookId = req.params.id;
    const userId = req.user.id;
    const pagesNr = req.body.pagesNumber;
    const query = `INSERT INTO user_library(userID, bookID, pagesNumber) VALUES (?, ?, ?)`;
  
    db.query(query, [userId, parseInt(bookId), pagesNr], (error, results) => {
      if (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.status(200).send('Data inserted successfully');
        }
    });
  });

  router.post('/logout', function(req, res, next) {
    console.log('Logout');
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;