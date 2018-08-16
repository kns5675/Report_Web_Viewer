var express = require('express');
var router = express.Router();

var convert = require('xml-js');
var fs = require('fs');
var xml = fs.readFileSync('./xml/Sample01.xml', 'utf-8');
var json = convert.xml2json(xml, {compact : true});

/* GET home page. */
router.get('/', function(req, res) {
    res.render('jeon', {
        layout: false,
        data : json
    });
});

module.exports = router;





