var express = require('express');
var router = express.Router();

var convert = require('xml-js');
var fs = require('fs');

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
    }
});
var upload = multer({ storage: storage });

var xml = fs.readFileSync('xml/TestSample.xml', 'utf-8');
var json_origin = convert.xml2json(xml, {compact: true});
var json = json_origin.replace(/\\r/gi, '<br/>'); // 엔터키(\r)를 <br/>로 치환
var test = convert.json2xml(json, {compact: true});
// var overlap =
// var temp_file_name = "message"+overlap+".xml";
// fs.writeFile('xml/'+, test, (err) => {
//     if (err) throw err;
//     console.log('The file has been saved!');
// });

var tempData = fs.readFileSync('xml/db_TestSample.xml', 'utf-8');
// var tempData = fs.readFileSync('xml/GroupParameterData.xml', 'utf-8');
var dataTable = convert.xml2json(tempData, {compact: true});

var paramData = fs.readFileSync('xml/GroupParameterData_Param.xml', 'utf-8');
var paramTable = convert.xml2json(paramData, {compact: true});


/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {
        layout: false,
        data: json,
        dataTable: dataTable,
        paramTable: paramTable,
        // subReport: dataTable2,
        // dataTable2: dataTable3
    });
});

router.post('/', upload.array('send_file', 3), function (req, res, next) {
    // res.send('Uploaded! : '+req.file); // object를 리턴함
    // console.log(req.files[0].filename);
    var file_name = 'uploads/'+req.files[0].filename;
    var db_name = 'uploads/'+req.files[1].filename;
    var param_name = 'uploads/'+req.files[2].filename;

    var xml = fs.readFileSync(file_name, 'utf-8');
    var json_origin = convert.xml2json(xml, {compact: true});
    var json = json_origin.replace(/\\r/gi, '<br/>');

    var tempData = fs.readFileSync(db_name, 'utf-8');
    var dataTable = convert.xml2json(tempData, {compact: true});

    var paramData = fs.readFileSync(param_name, 'utf-8');
    var paramTable = convert.xml2json(paramData, {compact: true});

    if(req.files[0]){
        res.render('index', {
            layout: false,
            data: json,
            dataTable: dataTable,
            paramTable: paramTable
        });
    }
});

module.exports = router;
