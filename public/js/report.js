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

     numOfDataInOnePage(report);

    setPage(report);
    setReport(report);
    pageNum++;

}


/***********************************************************
 기능 : 밴드 길이 계산
 만든이 : 구영준
 * *********************************************************/
function numOfDataInOnePage(report){
    var bands = report.layers.designLayer.bands;
    var bandHeightWithoutBandData = 0;
    console.log(bands);

    bands.forEach(function(band){
        console.log(band.attributes["xsi:type"]);
        if(band.attributes["xsi:type"] != BandData){
        bandHeightWithoutBandData += Number(band.rectangle.height);
        }
    });

   console.log(bandHeightWithoutBandData);

    //데이터 밴드를 제외한 밴드 높이 계산
    //Report Rectangle height - 밴드 높이
    //데이터 밴드 높이 바꿔주기
    //동적 테이블 길이 계산 -> 한 페이지에 들어갈 수 있는 데이터 양 계산
    //페이지 계산
}


function setDesignLayer(report){
    $(('#page' + pageNum)).append('<div id="designLayer' + pageNum + '"class = designLayer></div>');

    setDesignLayerDirection(report);

    $('#designLayer' + pageNum).css('margin-top', report.margin.x+'px');
    $('#designLayer' + pageNum).css('margin-bottom', report.margin.y+'px');
    $('#designLayer' + pageNum).css('margin-right', report.margin.height+'px');
    $('#designLayer' + pageNum).css('margin-left', report.margin.width+'px');

    var layerName = "designLayer" + pageNum;
    drawBand(report.layers.designLayer.bands, layerName); // 추가 - 전형준
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

    var layerName = "backGroundLayer" + pageNum;
    drawBand(report.layers.backGroundLayer.bands, layerName); // 추가 - 전형준

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

    var layerName = "foreGroundLayer" + pageNum;
    drawBand(report.layers.foreGroundLayer.bands, layerName); // 추가 - 전형준
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
    /*$(('#page' + pageNum)).append('<div id="report' + reportNum + '"class = report' +'></div>'); 영준짱꺼*/

    $(('#page' + pageNum)).append('<div id="forcopyratio' + reportNum + '"class = forcopyratio' +'></div>');//지연
    //지연 - 인쇄배율 조정을 위한 div 하나 더 생성.
    $(('#forcopyratio' + reportNum)).append('<div id="report' + reportNum + '"class = report' +'></div>');//지연

    console.log(report);

    setForCopyRatioDirection(report);//추가 - 지연
    setReportDirection(report);

    $('#forcopyratio' + reportNum).css("position","absolute");


    /*$('#report' + reportNum).css('margin-top', report.margin.x+'px');
    $('#report' + reportNum).css('margin-bottom', report.margin.y+'px');
    $('#report' + reportNum).css('margin-right', report.margin.height+'px');
    $('#report' + reportNum).css('margin-left', report.margin.width+'px');*/
    //  지연 수정
    $('#forcopyratio' + reportNum).css('margin-top', report.margin.x+'px');
    $('#forcopyratio' + reportNum).css('margin-bottom', report.margin.y+'px');
    $('#forcopyratio' + reportNum).css('margin-right', report.margin.height+'px');
    $('#forcopyratio' + reportNum).css('margin-left', report.margin.width+'px');

    setBackGroundLayer(report);
    setDesignLayer(report);
    setForeGroundLayer(report);

    // makeTableByData();

    // drawBand(report); // 추가 - 전형준

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

    if(report.paperDirection){// 지연 수정
        $('#report' + reportNum).css('width', '100%');
        $('#report' + reportNum).css('height', '100%');
    }else{//지연 수정
        $('#report' + reportNum).css('width', $('#forcopyratio' + reportNum).height);
        $('#report' + reportNum).css('height', $('#forcopyratio' + reportNum).width);
    }
    $('#report' + reportNum).css('text-align', 'center'); // 추가 : 안예솔
}
/******************************************************************
 기능 : 리포트 div의 부모 div인 forcopyratio div를 만든후 report의 크기로 지정하고, 방향지정.
 author : 하지연
 ******************************************************************/
function setForCopyRatioDirection(report){  //지연 추가
    if(report.paperDirection){
        $('#forcopyratio' + reportNum).css('width', report.rectangle.width+'px');
        $('#forcopyratio' + reportNum).css('height', report.rectangle.height + 'px');
    }else{
        $('#forcopyratio' + reportNum).css('width', report.rectangle.height + 'px');
        $('#forcopyratio' + reportNum).css('height', report.rectangle.width+'px');
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
        $('#page' + pageNum).css('width', report.paperSize.width + 'px');
        $('#page' + pageNum).css('height', report.paperSize.height + 'px');
    }else{
        $('#page' + pageNum).css('width', report.paperSize.height + 'px');
        $('#page' + pageNum).css('height', report.paperSize.width + 'px');
    }
}