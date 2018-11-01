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

var db_name;
var param_name;

var xml = fs.readFileSync('xml/연말정산.xml', 'utf-8');
var json_origin = convert.xml2json(xml, {compact: true});
var json = json_origin.replace(/\\r/gi, '<br/>'); // 엔터키(\r)를 <br/>로 치환

var tempData = fs.readFileSync('xml/연말정산_Data.xml', 'utf-8');
var dataTable = convert.xml2json(tempData, {compact: true});

var paramData = fs.readFileSync('xml/대차대조표_Param.xml', 'utf-8');
var paramTable = convert.xml2json(paramData, {compact: true});


/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {
        layout: false,
        data: json,
        dataTable: dataTable,
        paramTable: paramTable,
    });
});

router.get('/test', function (req, res) {
    res.render('test', {
        layout: false,
        data: json,
        dataTable: dataTable,
        paramTable: paramTable,
    });
});

router.post('/', upload.array('send_file', 3), function (req, res, next) {
    if(req.body.file_open_click){
        file_name = 'uploads/'+req.files[0].filename;
        db_name = 'uploads/'+req.files[1].filename;
        param_name = 'uploads/'+req.files[2].filename;

        xml = fs.readFileSync(file_name, 'utf-8');
        json_origin = convert.xml2json(xml, {compact: true});
        json = json_origin.replace(/\\r/gi, '<br/>');

        tempData = fs.readFileSync(db_name, 'utf-8');
        dataTable = convert.xml2json(tempData, {compact: true});

        paramData = fs.readFileSync(param_name, 'utf-8');
        paramTable = convert.xml2json(paramData, {compact: true});

        if(req.files[0]){
            res.render('index', {
                layout: false,
                data: json,
                dataTable: dataTable,
                paramTable: paramTable
            });
        }
    }else{  //file 저장 버튼 클릭시
        var file_name = req.body.send_file;
        var file_data = req.body.file_data;

        json_origin = convert.json2xml(file_data, {compact: true});
        xml = fs.writeFileSync("file_save/"+file_name+".xml", json_origin, 'utf-8');
    }
});

module.exports = router;
