var express = require('express');
var router = express.Router();

var convert = require('xml-js');
var fs = require('fs');
var xml = fs.readFileSync('xml/Region.xml', 'utf-8');

var json_origin = convert.xml2json(xml, {compact: true});
var json = json_origin.replace(/\\r/gi, '<br/>'); // 엔터키(\r)를 <br/>로 치환

var tempData = fs.readFileSync('xml/Region_Data.xml', 'utf-8');
var dataTable = convert.xml2json(tempData, {compact: true});

var paramData = fs.readFileSync('xml/GroupParameterData_Param.xml', 'utf-8');
var paramTable = convert.xml2json(paramData, {compact: true});


/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {
        layout: false,
        data: json,
        dataTable: dataTable,
        paramTable: paramTable
    });
});

module.exports = router;
