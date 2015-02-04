var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  console.log("*** In index.js.");
  res.sendFile('index.html', {root: __dirname + '/../views/'}, function(err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    } else {
      console.log('Sent.');
    }
  });
});

module.exports = router;
