var express = require('express');
var router = express.Router();

/*db*/
var mysql = require('mysql2');
DB_HOST='localhost';
DB_USER='adix';
DB_PASSWORD='adix';
DB_DATABASE='projectwwwdb';

const db = mysql.createConnection({
    host:  DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    charset: 'utf8mb4'
})

db.connect();
/*db*/

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('authentication', { title: 'Authentication' });
});

module.exports = router;
