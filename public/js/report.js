var pageNum = 1;

function makeReportTemplate(data) {
    var reportTemplate = new ReportTemplate(data);

    reportTemplate.reportList.forEach(function(value, i){
        var report = reportTemplate.reportList[i];
        makeReport(report);
    });

}

/******************************************************************
 기능 : 페이지를 만든다.
 만든이 : 구영준
 ******************************************************************/
function makeReport(report) {

    console.log(report);
    setPage(report.paperSize.width, report.paperSize.height);
    setReport(report);
    pageNum++
}
function setReport(report){
    $(('#page' + pageNum)).append('<div id="report' + pageNum + '"></div>');

    $('#report' + pageNum).css('width', report.rectangle.width);
    $('#report' + pageNum).css('height', report.rectangle.height);
    $('#report' + pageNum).css('background-color', 'blue');
    $('#report' + pageNum).css('border', 'black');
    $('#report' + pageNum).css('margin-top', report.margin.x+'px');
    $('#report' + pageNum).css('margin-bottom', report.margin.y+'px');
    $('#report' + pageNum).css('margin-left', report.margin.height+'px');
    $('#report' + pageNum).css('margin-right', report.margin.width+'px');

}


function setPage(width, height) {
    $('#reportTemplate').append('<div id="page' + pageNum + '" class="page"></div>');

    $('#page' + pageNum).css('width', width);
    $('#page' + pageNum).css('height', height);
    $('#page' + pageNum).css('background-color', 'yellow');
    $('#page' + pageNum).css('border', 'solid blue');

}

