var pageNum = 1;

function makeReportTemplate(data) {
    var reportTemplate = new ReportTemplate(data);

    reportTemplate.reportList.forEach(function(value, i){
        var report = reportTemplate.reportList[i];
        makeReport(report);
    });

    // var width = rectangle.children[0].content;
    // var height = rectangle.children[1].content;

    // console.log('width : ' + width);
    // console.log('height : ' + height);

    // add_report(width, height);
    // add_report(width, height);
}

function makeReport(report) {

    console.log(report);
    setPage(report.paperSize.width, report.paperSize.height);
    setReport(report);
    pageNum++
}
function setReport(report){
    // var nowPage = getNowPage();
    $(('#page' + pageNum)).append('<div id="report' + pageNum + '"></div>');

    console.log(report.margin.x);

    $('#report' + pageNum).css('width', report.rectangle.width);
    $('#report' + pageNum).css('height', report.rectangle.height);
    $('#report' + pageNum).css('background-color', 'blue');
    $('#report' + pageNum).css('border', 'solid black');
    $('#report' + pageNum).css('margin-top', report.margin.x+'px');
    $('#report' + pageNum).css('margin-bottom', report.margin.y+'px');
    $('#report' + pageNum).css('margin-left', report.margin.height+'px');
    $('#report' + pageNum).css('margin-right', report.margin.width+'px');

}


function setPage(width, height) {
    var curPage = pageNum;
    $('#reportTemplate').append('<div id="page' + pageNum + '" class="page"></div>');
    // $('#page2').css('width', width);
    // $('#page2').css('height', height);
    // $('#page2').css('background-color', 'yellow');
    // $('#page2').css('border', '2px solid blue');

    $('#page' + pageNum).css('width', width);
    $('#page' + pageNum).css('height', height);
    $('#page' + pageNum).css('background-color', 'yellow');
    $('#page' + pageNum).css('border', 'solid blue');

    // $('#report').append('<div id="margin' + curPage + '"><p>margin</p></div>');
    // $('#margin'+ curPage).css('height', '25px');
}

function getReportList(data) {
    return getReportTemplete(data).ReportList;
}

function getReportTemplete(data) {

    var reportTemplate = data.ReportTemplate;

    console.log(reportTemplate);

    this.PrintOder = reportTemplate.PrintOder;
    this.GridGap =  reportTemplate.GridGap


    return data.ReportTemplate;
}
