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

    setPage(report);
    setReport(report);

    pageNum++;
}

function setDesignLayer(report){
    $(('#page' + pageNum)).append('<div id="designLayer' + pageNum + '"class = designLayer></div>');

    setDesignLayerDirection(report);

    $('#designLayer' + pageNum).css('margin-top', report.margin.x+'px');
    $('#designLayer' + pageNum).css('margin-bottom', report.margin.y+'px');
    $('#designLayer' + pageNum).css('margin-right', report.margin.height+'px');
    $('#designLayer' + pageNum).css('margin-left', report.margin.width+'px');


}

function setDesignLayerDirection(report){
    if(report.paperDirection){
        $('#designLayer' + pageNum).css('width', report.rectangle.width+'px');
        $('#designLayer' + pageNum).css('height', report.rectangle.height + 'px');
    }else{
        $('#designLayer' + pageNum).css('width', report.rectangle.height + 'px');
        $('#designLayer' + pageNum).css('height', report.rectangle.width+'px');
    }
}



/******************************************************************
 기능 : 백그라운드레이어 세팅
 author : powerku
 ******************************************************************/
function setBackGroundLayer(report) {
    $(('#page' + pageNum)).append('<div id="backGroundLayer' + pageNum + '"class = backGroundLayer></div>');

    setBackGroundLayerDirection(report);

    $('#backGroundLayer' + pageNum).css('margin-top', report.margin.x+'px');
    $('#backGroundLayer' + pageNum).css('margin-bottom', report.margin.y+'px');
    $('#backGroundLayer' + pageNum).css('margin-right', report.margin.height+'px');
    $('#backGroundLayer' + pageNum).css('margin-left', report.margin.width+'px');

}

/******************************************************************
 기능 : 백그라운드레이어 방향 설정에 따른 크기 세팅
 author : powerku
 ******************************************************************/
function setBackGroundLayerDirection(report){

    if(report.paperDirection){
        $('#backGroundLayer' + pageNum).css('width', report.rectangle.width+'px');
        $('#backGroundLayer' + pageNum).css('height', report.rectangle.height + 'px');
    }else{
        $('#backGroundLayer' + pageNum).css('width', report.rectangle.height + 'px');
        $('#backGroundLayer' + pageNum).css('height', report.rectangle.width+'px');
    }

}


/******************************************************************
 기능 : 포그라운드 레이어 크기 세팅
 author : powerku
 ******************************************************************/
function setForeGroundLayer(report){
    $(('#page' + pageNum)).append('<div id="foreGroundLayer' + pageNum + '"class = foreGroundLayer></div>');

    setForeGroundLayerDirection(report);

    $('#foreGroundLayer' + pageNum).css('margin-top', report.margin.x+'px');
    $('#foreGroundLayer' + pageNum).css('margin-bottom', report.margin.y+'px');
    $('#foreGroundLayer' + pageNum).css('margin-right', report.margin.height+'px');
    $('#foreGroundLayer' + pageNum).css('margin-left', report.margin.width+'px');
}

/******************************************************************
 기능 : 포그라운드 레이어 방향 설정에 따른 크기 세팅
 author : powerku
 ******************************************************************/
function setForeGroundLayerDirection(report){

    if(report.paperDirection){
        $('#foreGroundLayer' + pageNum).css('width', report.rectangle.width+'px');
        $('#foreGroundLayer' + pageNum).css('height', report.rectangle.height + 'px');
    }else{
        $('#foreGroundLayer' + pageNum).css('width', report.rectangle.height + 'px');
        $('#foreGroundLayer' + pageNum).css('height', report.rectangle.width+'px');
    }

}

/******************************************************************
 기능 : 페이지안의 리포트를 만듬
 author : powerku
 ******************************************************************/
function setReport(report){
    $(('#page' + pageNum)).append('<div id="report' + reportNum + '"class = report' +'></div>');

    console.log(report);

    setReportDirection(report);

    $('#report' + reportNum).css('margin-top', report.margin.x+'px');
    $('#report' + reportNum).css('margin-bottom', report.margin.y+'px');
    $('#report' + reportNum).css('margin-right', report.margin.height+'px');
    $('#report' + reportNum).css('margin-left', report.margin.width+'px');

    setBackGroundLayer(report);
    setDesignLayer(report);
    setForeGroundLayer(report);

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

    $('#designLayer1').html(html);
    $('td:nth-child(' + fieldLength + '),th:nth-child('+fieldLength+')').hide(); //DRDSEQ 컬럼 숨기기
}

/******************************************************************
 기능 : 페이지안의 리포트 방향 설정
 author : powerku
 ******************************************************************/
function setReportDirection(report){

    if(report.paperDirection){
        $('#report' + reportNum).css('width', report.rectangle.width+'px');
        $('#report' + reportNum).css('height', report.rectangle.height + 'px');
    }else{
        $('#report' + reportNum).css('width', report.rectangle.height + 'px');
        $('#report' + reportNum).css('height', report.rectangle.width+'px');
    }
    $('#report' + reportNum).css('text-align', 'center'); // 추가 : 안예솔
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
        $('#page' + pageNum).css('width', report.paperSize.width + 'px');
        $('#page' + pageNum).css('height', report.paperSize.height + 'px');
    }else{
        $('#page' + pageNum).css('width', report.paperSize.height + 'px');
        $('#page' + pageNum).css('height', report.paperSize.width + 'px');
    }
}

