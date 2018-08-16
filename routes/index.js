var express = require('express');
var router = express.Router();

var convert = require('xml-js');
var fs = require('fs');
var xml = fs.readFileSync('Sample01.xml', 'utf-8');
// var inspect = require('util').inspect;
var json = convert.xml2json(xml, {compact : true});


const tempData = fs.readFileSync('TempData.xml', 'utf-8');
const tempData_json = JSON.parse(convert.xml2json(tempData, {compact : true}));

// var test = JSON.parse(json);
// console.log(test.ReportTemplate.ReportList.anyType.Layers.anyType[1].Bands.anyType[1].DataTableName._text);
// console.log(test.ReportTemplate.ReportList.anyType.Layers.anyType[1].Bands.anyType[1].DataTableName._text);
// var dataTableName = test.ReportTemplate.ReportList.anyType.Layers.anyType[1].Bands.anyType[1].DataTableName._text;

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        layout: false,
        data : json
    });
});

router.get('/data', function(req, res) {

    res.render('index', {
        layout: false,
        data : json,
        // dataTableName : dataTableName,
        dt: tempData_json.DataSetName.dt
    });
});


module.exports = router;





