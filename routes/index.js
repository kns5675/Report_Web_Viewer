var express = require('express');
var router = express.Router();

var convert = require('xml-js');
var fs = require('fs');
var xml = fs.readFileSync('xml/TestSample.xml', 'utf-8');
// var inspect = require('util').inspect;
var json_origin = convert.xml2json(xml, {compact : true});
var json = json_origin.replace(/\\r/gi, '<br/>'); // 엔터키(\r)를 <br/>로 치환

var tempData = fs.readFileSync('xml/db_TestSample.xml', 'utf-8');
// var tempData = fs.readFileSync('xml/TestSample.xml', 'utf-8');
var dataTable = convert.xml2json(tempData, {compact : true});

// var bmp = require("bmp-js");
// var Printer = require('node-printer');

var options = {
    media: 'Custom.200x600mm',
    n: 3
};

// Get available printers list
Printer.list();
// Create a new Pinter from available devices
// var printer = new Printer('Microsoft Print to PDF');
//
// // Print from a buffer, file path or text
// var fileBuffer = fs.readFileSync('xml/TestSample.xml');
// var jobFromBuffer = printer.printBuffer(fileBuffer);
//
// var filePath = 'package.json';
// var jobFromFile = printer.printFile(filePath);
//
// var text = 'Print text directly, when needed: e.g. barcode printers'
// var jobFromText = printer.printText(text);
//
// // Cancel a job
// jobFromFile.cancel();
//
// // Listen events from job
// jobFromBuffer.once('sent', function() {
//     jobFromBuffer.on('completed', function() {
//         console.log('Job ' + jobFromBuffer.identifier + 'has been printed');
//         jobFromBuffer.removeAllListeners();
//     });
// });

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        layout: false,
        data : json,
        dataTable: dataTable
    });
});

module.exports = router;