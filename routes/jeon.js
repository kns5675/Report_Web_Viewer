var express = require('express');
var router = express.Router();

var convert = require('xml-js');
var fs = require('fs');

var design_xml = fs.readFileSync('./xml/Sample01.xml', 'utf-8'); // design-xml
var data_xml = fs.readFileSync('xml/TempData.xml', 'utf-8'); // data tree-xml

var design_json = convert.xml2json(design_xml, {compact : true}); // design, xml to json
var dataTable_json = convert.xml2json(data_xml, {compact : true}); // data tree, xml to json

/* GET home page. */
router.get('/', function(req, res) {
    res.render('jeon', {
        layout: false,
        design_json : design_json,
        dataTable: dataTable_json
    });
});

module.exports = router;