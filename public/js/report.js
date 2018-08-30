var pageNum = 1;
var reportNum = 1;
var curDatarow = 0;
var groupFieldArray = new Array();

/******************************************************************
 기능 : 페이지에서 Json 파일을 매개변수로 받아서 ReportTemplate를 만듬
 author : powerku
 ******************************************************************/
function makeReportTemplate(data) {
    var reportTemplate = new ReportTemplate(data);

    reportTemplate.reportList.forEach(function (value, i) {
        var report = reportTemplate.reportList[i];
        makeReport(report);
    });
}
/******************************************************************
 기능 : make report in function makeReportTemplate
 author : powerku
 ******************************************************************/
var reportPageCnt = 1;
function makeReport(report) {
    var dt = Object.values(dataTable.DataSetName)[0];
    if(pageNum == 1){

    }

    setPage(report);
    setReport(report);

    pageNum++;

    //현재 찍힌 데이터 로우 행이 전체 데이터 보다 작을 경우 재귀함수
    //클 경우 함수 종료 후 다음 리포트 생성
    if (curDatarow < dt.length) {
        reportPageCnt++;
        makeReport(report);
    }else{
        reportPageCnt = 1;
        return;
    }
}
/***********************************************************
 기능 : 페이지 계산
 전체 데이터 / 한페이지 데이터 = 페이지 개수
 만든이 : 구영준
 * *********************************************************/
function getNumOfPage(report) {
    var numOfAllData = dataTable.DataSetName.dt.length; //데이터 총 개수
    var bands = report.layers.designLayer.bands;
    var reportHeight = report.rectangle.height;
    var bandHeight = getBandHeight(bands, reportHeight); //데이터 밴드 길이
    var numOfDataInOnePage = 0; // 한 페이지에 들어갈 데이터 개수

    bands.forEach(function (band) {
        if (band.attributes["xsi:type"] == 'BandData') {
            if (!(band.controlList.anyType === undefined)) {
                if (band.controlList.anyType._attributes["xsi:type"] == "ControlDynamicTable") {
                    var tableLabels = band.controlList.anyType.Labels.TableLabel;
                    tableLabels.forEach(function (label, i) {
                        var tableLabel = new DynamicTableLabel(label, i);
                        tableLabelList.push(tableLabel);
                    });
                    numOfDataInOnePage = getNumOfDataInOnePage(tableLabelList, bandHeight);
                }
            }
        }
    });


    if (numOfAllData == 0) {
        return 1;
    } else {
        if (numOfDataInOnePage == 0) {
            return 1;
        } else {
            return Math.ceil(numOfAllData / numOfDataInOnePage);
        }
    }
}

/***********************************************************
 기능 : 그룹 헤더/풋터 일 경우 데이터 밴드 길이 계산 
 1. 그룹 헤더/풋터 일 경우 그룹 데이터의 길이 만큼의 데이터 길이
 2. th 길이 + td길이 * 데이터 개수
 만든이 : 구영준
 * *********************************************************/
function getBandHeightWithGroupField(band) {

    var dataCount = groupFieldArray[groupFieldNum].length;
    var labels = band.controlList.anyType.Labels.TableLabel;

    var titleHeight = Number(labels[0].Rectangle.Height._text);
    var valueHeight = Number(labels[labels.length - 1].Rectangle.Height._text);

    return titleHeight + valueHeight * dataCount;
}

/***********************************************************
 기능 : 데이터 밴드 길이 계산
 1. 데이터 밴드를 제외한 밴드 높이 계산
 2. Report Rectangle height - 데이터 밴드를 제외한 밴드높이 = dataBand 길이
 만든이 : 구영준
 * *********************************************************/
function getBandHeight(band, reportHeight) {

    var bandHeightWithoutBandData = 0;
    var bandDataHeight = 0;

    bands.forEach(function (band) {
        if (band.attributes["xsi:type"] != 'BandData') {
            bandHeightWithoutBandData += Number(band.rectangle.height);
        } else {
            if (Array.isArray(band.childFooterBands)) {
                band.childFooterBands.forEach(function (childFooterBand) {
                    bandHeightWithoutBandData += Number(childFooterBand.rectangle.height)
                });
                band.childHeaderBands.forEach(function (childHeaderBand) {
                    bandHeightWithoutBandData += Number(childHeaderBand.rectangle.height)
                });
            }
        }
    });

    bands.forEach(function (band) {
        if (band.attributes["xsi:type"] == 'BandData') {
            bandDataHeight = Number(reportHeight - bandHeightWithoutBandData)
        }
    });
    return bandDataHeight;
}
/***********************************************************
 기능 : 한 페이지에 들어갈 데이터 개수 구하기
 : (밴드 길이 - 첫 행 높이) / 데이터 라벨 높이 => 한페이지에 들어가야할 밴드 개수
 만든이 : 구영준
 * *********************************************************/
function getNumOfDataInOnePage(tableLabel, divId) {
    var bandDataHeight = 0;
    if (typeof divId == 'string') {
        bandDataHeight = $('#' + divId).height();
    } else if (typeof divId == 'number') {
        bandDataHeight = divId;
    }
    var firstLine = tableLabel[0].rectangle.height;
    var dataLine = Number(tableLabel[tableLabel.length - 1].rectangle.height);
    return Math.floor((bandDataHeight - firstLine) / dataLine);
}
/******************************************************************
 기능 : 디자인 레이어 세팅
 author : powerku
 ******************************************************************/
function setDesignLayer(report) {
    $(('#page' + pageNum)).append('<div id="designLayer' + pageNum + '"class = designLayer></div>');

    setDesignLayerDirection(report);

    var designLayer = $('#designLayer' + pageNum);
    designLayer.css({
        'margin-top': report.margin.x + 'px',
        'margin-bottom': report.margin.y + 'px',
        'margin-right': report.margin.height + 'px',
        'margin-left': report.margin.width + 'px',
    });

    var layerName = "designLayer" + pageNum;
    var reportHeight = report.rectangle.height;
    drawBand(report.layers.designLayer.bands, layerName, reportHeight); // 추가 - 전형준
}
/******************************************************************
 기능 : 디자인 레이어 방향 세팅
 author : powerku
 ******************************************************************/
function setDesignLayerDirection(report) {
    var designLayer = $('#designLayer' + pageNum);
    if (report.paperDirection) {
        designLayer.css({
            'width': report.rectangle.width + 'px',
            'height': report.rectangle.height + 'px'
        });
    } else {
        designLayer.css({
            'height': report.rectangle.width + 'px',
            'width': report.rectangle.height + 'px'
        });
    }
}
/******************************************************************
 기능 : 백그라운드레이어 세팅
 author : powerku
 ******************************************************************/
function setBackGroundLayer(report) {
    $(('#page' + pageNum)).append('<div id="backGroundLayer' + pageNum + '"class = backGroundLayer></div>');

    setBackGroundLayerDirection(report);

    var backGroundLayer = $('#backGroundLayer' + pageNum);

    backGroundLayer.css({
        'margin-top': report.margin.x + 'px',
        'margin-bottom': report.margin.y + 'px',
        'margin-right': report.margin.height + 'px',
        'margin-left': report.margin.width + 'px',
    });

    var layerName = "backGroundLayer" + pageNum;
    drawBand(report.layers.backGroundLayer.bands, layerName); // 추가 - 전형준
}
/******************************************************************
 기능 : 백그라운드레이어 방향 설정에 따른 크기 세팅
 author : powerku
 ******************************************************************/
function setBackGroundLayerDirection(report) {

    var backGroundLayer = $('#backGroundLayer' + pageNum);
    if (report.paperDirection) {
        backGroundLayer.css({
            'width': report.rectangle.width + 'px',
            'height': report.rectangle.height + 'px'
        });
    } else {
        backGroundLayer.css({
            'height': report.rectangle.width + 'px',
            'width': report.rectangle.height + 'px'
        });
    }
}
/******************************************************************
 기능 : 포그라운드 레이어 크기 세팅
 author : powerku
 ******************************************************************/
function setForeGroundLayer(report) {
    $(('#page' + pageNum)).append('<div id="foreGroundLayer' + pageNum + '"class = foreGroundLayer></div>');

    setForeGroundLayerDirection(report);

    var foreGroundLayer = $('#foreGroundLayer' + pageNum);

    foreGroundLayer.css({
        'margin-top': report.margin.x + 'px',
        'margin-bottom': report.margin.y + 'px',
        'margin-right': report.margin.height + 'px',
        'margin-left': report.margin.width + 'px',
    });

    var layerName = "foreGroundLayer" + pageNum;
    drawBand(report.layers.foreGroundLayer.bands, layerName); // 추가 - 전형준
}
/******************************************************************
 기능 : 포그라운드 레이어 방향 설정에 따른 크기 세팅
 author : powerku
 ******************************************************************/
function setForeGroundLayerDirection(report) {
    var foreGroundLayer = $('#foreGroundLayer' + pageNum);
    if (report.paperDirection) {
        foreGroundLayer.css({
            'width': report.rectangle.width + 'px',
            'height': report.rectangle.height + 'px'
        });
    } else {
        foreGroundLayer.css({
            'height': report.rectangle.width + 'px',
            'width': report.rectangle.height + 'px'
        });
    }

}

/******************************************************************
 기능 : 페이지안의 리포트를 만듬
 author : powerku
 ******************************************************************/
function setReport(report) {
    $(('#page' + pageNum)).append('<div id="forcopyratio' + reportNum + '"class = forcopyratio' + '></div>');//지연
    //지연 - 인쇄배율 조정을 위한 div 하나 더 생성.
    $(('#forcopyratio' + reportNum)).append('<div id="report' + reportNum + '"class = report' + '></div>');//지연

    setForCopyRatioDirection(report);//추가 - 지연
    setReportDirection(report);

    var reportInPage = $('#report' + reportNum);
    $('#forcopyratio' + reportNum).css("position", "absolute");

    /*reportInPage.css({
        'margin-top': report.margin.x + 'px',
        'margin-bottom': report.margin.y + 'px',
        'margin-right': report.margin.height + 'px',
        'margin-left': report.margin.width + 'px',
    });*/

    //  지연 수정
    $('#forcopyratio' + reportNum).css('margin-top', report.margin.x + 'px');
    $('#forcopyratio' + reportNum).css('margin-bottom', report.margin.y + 'px');
    $('#forcopyratio' + reportNum).css('margin-right', report.margin.height + 'px');
    $('#forcopyratio' + reportNum).css('margin-left', report.margin.width + 'px');

    setBackGroundLayer(report);
    setDesignLayer(report);
    setForeGroundLayer(report);

    // makeTableByData();

    // drawBand(report); // 추가 - 전형준

    reportNum++;
}
/******************************************************************
 기능 : 테이블안에 데이터를 바인딩함(사용 안함)
 author : powerku
 ******************************************************************/
function makeTableByData() {

    let html = '<table><thead>';
    var fieldLength = Object.keys(dataTable.DataSetName.dt[0]).length;

    Object.keys(dataTable.DataSetName.dt[0]).forEach(function (field) { //Header
        if (field == 'DRDSEQ') {
            html += '<th clsss = "DRDSEQ">' + field + '</th>';
        } else {
            html += '<th>' + field + '</th>';
        }

    });
    html += '</thead><tbody>';
    dataTable.DataSetName.dt.forEach(function (data) { //Body
        html += '<tr>';
        for (key in data) {
            html += '<td>' + data[key]._text + '</td>';
        }

        +'</tr>';
    });

    html += '</tbody></table>';

    $('#designLayer1').html(html);
    $('td:nth-child(' + fieldLength + '),th:nth-child(' + fieldLength + ')').hide(); //DRDSEQ 컬럼 숨기기
}

/******************************************************************
 기능 : 페이지안의 리포트 방향 설정
 author : powerku
 ******************************************************************/
function setReportDirection(report) {

    var reportInPage = $('#report' + reportNum);
    if (report.paperDirection) {// 지연 수정
        reportInPage.css({
            'width': '100%',
            'height': '100%'
        });
    } else {//지연 수정
        reportInPage.css({
            'height': $('#forcopyratio' + reportNum).width,
            'width': $('#forcopyratio' + reportNum).height
        });
    }

    reportInPage.css('text-align', 'center'); // 추가 : 안예솔
}
/******************************************************************
 기능 : 리포트 div의 부모 div인 forcopyratio div를 만든후 report의 크기로 지정하고, 방향지정.
 author : 하지연
 ******************************************************************/
function setForCopyRatioDirection(report) {  //지연 추가
    if (report.paperDirection) {
        $('#forcopyratio' + reportNum).css('width', report.rectangle.width + 'px');
        $('#forcopyratio' + reportNum).css('height', report.rectangle.height + 'px');
    } else {
        $('#forcopyratio' + reportNum).css('width', report.rectangle.height + 'px');
        $('#forcopyratio' + reportNum).css('height', report.rectangle.width + 'px');
    }
}
/******************************************************************
 기능 : 페이지 크기 렌더링
 author : powerku

 수정 : 하지연
 날짜 : 2018 - 08 23
 내용 : reportTemplate 자식 pageForCopyRatio를 만들고 그 아래 자식으로 page div 생성.

 수정 : 김학준
 날짜 : 2018 - 08 27
 내용 : 페이지 셋팅시 페이지 사이지
 ******************************************************************/
function setPage(report) {

    var paperType = report.paperType;

    $('#reportTemplate').append('<div id="pageForCopyRatio' + pageNum + '" class="pageforcopyratio paperType-' + paperType + '"></div>');//지연 수정
    $('#pageForCopyRatio' + pageNum).append('<div id="page' + pageNum + '" class="page paperType-' + paperType + '"></div>');//지연 수정
    // $(('#forcopyratio' + reportNum)).append('<div id="report' + reportNum + '"class = report' +'></div>');

    setPageDirection(report);
    setPageForCopyRatioDirection(report);//지연추가

    //학준추가.
    $("#pagesizeoptions").on("change", function () {
        pagesizeselect($(this).val());
    });
    $("#row_direction").on("click",function () {
        var test = $("#row_direction").val();
        console.log("test : ",test);
        // if(){
        //
        // }
    });

    var page = $('#page' + pageNum);
    page.css('border', 'solid green');
    page.css('background-color', 'transparent');

    var pageForCopyRatio = $('#pageForCopyRatio' + pageNum);
    pageForCopyRatio.css('border', 'solid red');
    pageForCopyRatio.css('background-color', 'lightgreen');

}

/******************************************************************
 기능 : 페이지 부모 div인 pageForCopyRatio의 방향 설정
 author : 하지연
 ******************************************************************/
function setPageForCopyRatioDirection(report) {
    var pageForCopyRatio = $('#pageForCopyRatio' + pageNum);

    if (report.paperDirection) { //세로
        pageForCopyRatio.css('width', report.paperSize.width + 'px');
        pageForCopyRatio.css('height', report.paperSize.height + 'px');
    } else { //가로
        pageForCopyRatio.css('width', report.paperSize.height + 'px');
        pageForCopyRatio.css('height', report.paperSize.width + 'px');
    }
}

/******************************************************************
 기능 : 페이지 방향 설정
 author : powerku

 수정 : 하지연
 날짜 : 2018 - 08 - 23
 내용 : page의 width, height값을 page의 부모인 pageForCopyRatio의 width, height값의 100%로 지정하고,
 방향 설정
 ******************************************************************/
function setPageDirection(report) {
    var page = $('#page' + pageNum);
    var pageForCopyRatio = $('#pageForCopyRatio' + pageNum);

    /*if (report.paperDirection) { //세로
        page.css('width', '100%');
        page.css('height', '100%');
    } else { //가로
        page.css('width', $('#pageForCopyRatio' + pageNum).height);
        page.css('height', $('#pageForCopyRatio' + pageNum).width);
        page.css('height',$('#pageForCopyRatio' + pageNum).width);
    }*/
    page.css('width', '100%');
    page.css('height','100%');
}
