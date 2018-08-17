var pageNum = 1;
var reportNum = 1;

/******************************************************************
 기능 : 페이지에서 Json 파일을 매개변수로 받아서 ReportTemplate를 만듬
 author : powerku
 ******************************************************************/
function makeReportTemplate(data) {
    var reportTemplate = new ReportTemplate(data);

    reportTemplate.reportList.forEach(function(value, i){
        var report = reportTemplate.reportList[i];
        makeReport(report);
    });

}

/******************************************************************
 기능 : make report in function makeReportTemplate
 author : powerku
 ******************************************************************/

 function makeReport(report) {

     console.log(report);

    setPage(report);
    setBackGroundLayer(report);
    setForeGroundLayer(report);
    setReport(report);

    pageNum++;
}

function setBackGroundLayer(report) {
    $(('#page' + pageNum)).append('<div id="backGroundLayer' + pageNum + '"class = backGroundLayer></div>');

    console.log(report);
    console.log(report.layers.backGroundLayer.bands[0]);

    setBackGroundLayerDirection(report);

}

function setBackGroundLayerDirection(report){

    if(report.paperDirection){
        $('#backGroundLayer' + pageNum).css('width', 722+'px');
        $('#backGroundLayer' + pageNum).css('height', 1052.6 + 'px');
    }else{
        $('#backGroundLayer' + pageNum).css('width', 1052.6 + 'px');
        $('#backGroundLayer' + pageNum).css('height', 722+'px');
    }

}

function setForeGroundLayer(report){
    $(('#page' + pageNum)).append('<div id="foreGroundLayer' + pageNum + '"class = foreGroundLayer></div>');

    setForeGroundLayerDirection(report);

}

function setForeGroundLayerDirection(report){

    if(report.paperDirection){
        $('#foreGroundLayer' + pageNum).css('width', 200+'px');
        // $('#foreGroundLayer' + pageNum).css('width', 722+'px');
        // $('#foreGroundLayer' + pageNum).css('height', 1052.6 + 'px');
        $('#foreGroundLayer' + pageNum).css('height', 200 + 'px');
    }else{
        $('#foreGroundLayer' + pageNum).css('width', 1052.6 + 'px');
        $('#foreGroundLayer' + pageNum).css('height', 722+'px');
    }

}

/******************************************************************
 기능 : 페이지안의 리포트를 만듬
 author : powerku
 ******************************************************************/
function setReport(report){
    $(('#page' + pageNum)).append('<div id="report' + reportNum + '"class = report report' + reportNum + '></div>');


    setReportDirection(report);
    $('#report' + reportNum).css('border', 'black');

    makeTableByData();

    drawBand(report); // 추가 - 전형준

    reportNum++;
}
/******************************************************************
 기능 : 테이블안에 데이터를 바인딩함
 author : powerku
 ******************************************************************/
function makeTableByData() {

    let html = '<table><thead>';
    var fieldLength = Object.keys(dataTable.DataSetName.dt[0]).length;

    Object.keys(dataTable.DataSetName.dt[0]).forEach(function(field){ //Header
        if(field == 'DRDSEQ'){
            html += '<th clsss = "DRDSEQ">' + field + '</th>';
        }else{
            html += '<th>' + field + '</th>';
        }

    });
    html  +='</thead><tbody>';
    dataTable.DataSetName.dt.forEach(function (data) { //Body
        html += '<tr>';
        for(key in data){
            html+='<td>' + data[key]._text + '</td>';
        }

        + '</tr>';
    });

    html +='</tbody></table>';

    $('#test').html(html);
    $('td:nth-child(' + fieldLength + '),th:nth-child('+fieldLength+')').hide(); //DRDSEQ 컬럼 숨기기
}

/******************************************************************
 기능 : 페이지안의 리포트 방향 설정
 author : powerku
 ******************************************************************/
function setReportDirection(report){

    if(report.paperDirection){
        $('#report' + reportNum).css('width', 400+'px');
        // $('#report' + reportNum).css('width', 722+'px');
        // $('#report' + reportNum).css('height', 1052.6 + 'px');
        $('#report' + reportNum).css('height', 400 + 'px');
    }else{
        $('#report' + reportNum).css('width', 1052.6 + 'px');
        $('#report' + reportNum).css('height', 722+'px');

    }

}

/******************************************************************
 기능 : 페이지 크기 렌더링
 author : powerku
 ******************************************************************/
function setPage(report) {

    var paperType = report.paperType;

    $('#reportTemplate').append('<div id="page' + pageNum + '" class="page paperType-' + paperType + '"></div>');

    setPageDirection(report);
    $('#page' + pageNum).css('border', 'solid blue');

}

/******************************************************************
 기능 : 페이지 방향 설정
 author : powerku
 ******************************************************************/
function setPageDirection(report){
    if(report.paperDirection){
        $('#page' + pageNum).css('width', 798 + 'px');
        $('#page' + pageNum).css('height', 1128.6 + 'px');
    }else{
        $('#page' + pageNum).css('width', 1128.6 + 'px');
        $('#page' + pageNum).css('height', 798 + 'px');
    }
}

