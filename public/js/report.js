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
    setReport(report);

    pageNum++;
}

/******************************************************************
 기능 : 페이지안의 리포트를 만듬
 author : powerku
 ******************************************************************/
function setReport(report){
    $(('#page' + pageNum)).append('<div id="report' + reportNum + '"class = report' + reportNum + '></div>');


    setReportDirection(report);
    $('#report' + reportNum).css('background-color', 'blue');
    $('#report' + reportNum).css('border', 'black');
    $('#report' + reportNum).css('margin-top', report.margin.x+'px');
    $('#report' + reportNum).css('margin-bottom', report.margin.y+'px');
    $('#report' + reportNum).css('margin-left', report.margin.height+'px');
    $('#report' + reportNum).css('margin-right', report.margin.width+'px');

    drawBand(report); // 추가 - 전형준

    reportNum++;
}

/******************************************************************
 기능 : 페이지안의 리포트 방향 설정
 author : powerku
 ******************************************************************/
function setReportDirection(report){

    if(report.paperDirection){
        $('#report' + reportNum).css('width', report.rectangle.width);
        $('#report' + reportNum).css('height', report.rectangle.height);
    }else{
        $('#report' + reportNum).css('height', report.rectangle.width);
        $('#report' + reportNum).css('width', report.rectangle.height);

    }

}

/******************************************************************
 기능 : 페이지 크기 렌더링
 author : powerku
 ******************************************************************/
function setPage(report) {
    $('#reportTemplate').append('<div id="page' + pageNum + '" class="page"></div>');

    setPageDirection(report);
    $('#page' + pageNum).css('background-color', 'yellow');
    $('#page' + pageNum).css('border', 'solid blue');



}

/******************************************************************
 기능 : 페이지 방향 설정
 author : powerku
 ******************************************************************/
function setPageDirection(report){
    if(report.paperDirection){
        $('#page' + pageNum).css('width', report.paperSize.width);
        $('#page' + pageNum).css('height', report.paperSize.height);
    }else{
        $('#page' + pageNum).css('height', report.paperSize.width);
        $('#page' + pageNum).css('width', report.paperSize.height);
    }
}

