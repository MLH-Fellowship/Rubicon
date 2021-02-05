var express = require('express');
var router = express.Router();
var D = require('development');
/* GET home page. */
router.get('/pull', function(req, res) {

  D.pull('.', function(err, resp) {
    if (err) {
      res.send(resp);
    } else {
      res.send(resp);
    }
  })
});

router.get('/fetch', function(req, res) {

  D.fetch('.', function(err, resp) {
    if (err) {
      res.send(resp);
    } else {
      res.send(resp);
    }
  })
});


router.get('/checkout', function(req, res) {

  var params = {
    tags: 'v1.0.5',
    branch: 'master',
    path: '.',
  }

  D.checkout(params, function(err, resp) {
    if (err) {
      res.send(resp);
    } else {
      res.send(resp);
    }
  })
});


router.get('/npminstall', function(req, res) {
  var params = {
    path: '.',
  };
  D.npmInstall(params, function(err, resp) {
    if (err) {
      res.send(resp);
    } else {
      res.send(resp);
    }
  })
});

router.get('/bowerinstall', function(req, res) {
  var params = {
    path: '.',
  };
  D.bowerInstall(params, function(err, resp) {
    if (err) {
      res.send(resp);
    } else {
      res.send(resp);
    }
  })
});

module.exports = router;
