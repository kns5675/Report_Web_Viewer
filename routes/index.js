var express = require('express');
var router = express.Router();

var convert = require('xml-js');
var fs = require('fs');
var xml = fs.readFileSync('xml/TestSample.xml', 'utf-8');
// var inspect = require('util').inspect;
var json = convert.xml2json(xml, {compact : true});
console.log(json);
var json2 = json.replace(/\\r/gi, '<br/>');
console.log(json2);

var tempData = fs.readFileSync('xml/TempData.xml', 'utf-8');
var dataTable = convert.xml2json(tempData, {compact : true});

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        layout: false,
        data2 : json2,
        data : json2,
        dataTable: dataTable
    });
});

module.exports = router;