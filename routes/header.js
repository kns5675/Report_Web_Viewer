var express = require('express');
var router = express.Router();

var convert = require('xml-js');
var fs = require('fs');
var xml = fs.readFileSync('Testsample.xml', 'utf-8');
var inspect = require('util').inspect;
var json = convert.xml2json(xml, {compact : true});

router.get('/', function(req, res){
    res.render('index', {
        layout: false,
        data : json
    });
});

module.exports = router;

