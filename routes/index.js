var express = require('express');
var router = express.Router();

var convert = require('xml-js');
var fs = require('fs');
var xml = fs.readFileSync('xml/Sample01.xml', 'utf-8');
// var inspect = require('util').inspect;
var json = convert.xml2json(xml, {compact : true});

const tempData = fs.readFileSync('xml/TempData.xml', 'utf-8');
const tempData_json = JSON.parse(convert.xml2json(tempData, {compact : true}));
const data_json = convert.xml2json(tempData, {compact : true});

/* GET home page. */
router.get('/', function(req, res) {
    res.render('yesol', {
        layout: false,
        data : json
    });
});

router.get('/data', function(req, res) {

    res.render('yesol', {
        layout: false,
        data : json,
        // dataTableName : dataTableName,
        dt: tempData_json.DataSetName.dt,
        dt2: data_json
    });
});


module.exports = router;





