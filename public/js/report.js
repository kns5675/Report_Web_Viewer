var pageNum = 1;
var reportNum = 1;

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
function makeReport(report) {

    var numOfPage = getNumOfPage(report);

    for (var i = 0; i < numOfPage; i++) {

        setPage(report);
        setReport(report);

        pageNum++;
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
 기능 : 밴드 길이 계산
 1. 데이터 밴드를 제외한 밴드 높이 계산
 2. Report Rectangle height - 데이터 밴드를 제외한 밴드높이 = dataBand 길이
 만든이 : 구영준
 * *********************************************************/
function getBandHeight(bands, reportHeight) {
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
    $(('#page' + pageNum)).append('<div id="forcopyratio' + reportNum + '"class = forcopyratio' +'></div>');//지연
    //지연 - 인쇄배율 조정을 위한 div 하나 더 생성.
    $(('#forcopyratio' + reportNum)).append('<div id="report' + reportNum + '"class = report' +'></div>');//지연

    setForCopyRatioDirection(report);//추가 - 지연
    setReportDirection(report);

    var reportInPage = $('#report' + reportNum);
    $('#forcopyratio' + reportNum).css("position","absolute");

    /*reportInPage.css({
        'margin-top': report.margin.x + 'px',
        'margin-bottom': report.margin.y + 'px',
        'margin-right': report.margin.height + 'px',
        'margin-left': report.margin.width + 'px',
    });*/

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
    if(report.paperDirection){// 지연 수정
        reportInPage.css({
            'width': '100%',
            'height': '100%'
        });
    }else{//지연 수정
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

 수정 : 하지연
 날짜 : 2018 - 08 23
 내용 : reportTemplate 자식 pageForCopyRatio를 만들고 그 아래 자식으로 page div 생성.
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
    page.css('background-color','transparent');

    var pageForCopyRatio = $('#pageForCopyRatio' + pageNum);
    pageForCopyRatio.css('border','solid red');
    pageForCopyRatio.css('background-color','lightgreen');

}
/******************************************************************
 기능 : 페이지 부모 div인 pageForCopyRatio의 방향 설정
 author : 하지연
 ******************************************************************/
function setPageForCopyRatioDirection(report){
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
        page.css('height','100%');
    } else { //가로
        page.css('width', $('#pageForCopyRatio' + pageNum).height);
        page.css('height',$('#pageForCopyRatio' + pageNum).width);
    }*/
    page.css('width', '100%');
    page.css('height','100%');
}

//학준추가.
function pagesizeselect(paper) {
    var pageForCopyRatio = $('.pageforcopyratio');
    if(paper === "Letter"){
        pageForCopyRatio.css('width', 816.3779527559 + 'px');
        pageForCopyRatio.css('height', 1054.488188976 + 'px');
    }else if(paper === "Tabloid"){
        pageForCopyRatio.css('width', 1054.488188976 + 'px');
        pageForCopyRatio.css('height', 1632.755905512 + 'px');
    }else if(paper === "Legal"){
        pageForCopyRatio.css('width', 816.3779527559 + 'px');
        pageForCopyRatio.css('height', 1345.511811024 + 'px');
    }else if(paper === "Statement"){
        pageForCopyRatio.css('width', 529.1338582677 + 'px');
        pageForCopyRatio.css('height', 816.3779527559 + 'px');
    }else if(paper === "Executive"){
        pageForCopyRatio.css('width', 695.4330708661 + 'px');
        pageForCopyRatio.css('height', 1009.133858268 + 'px');
    }else if(paper === "A3"){
        pageForCopyRatio.css('width', 1122.519685039 + 'px');
        pageForCopyRatio.css('height', 1587.401574803 + 'px');
    }else if(paper === "A4"){
        console.log("pagesizeselect A4 test");
        pageForCopyRatio.css('width', 793.7007874016 + 'px');
        pageForCopyRatio.css('height', 1122.519685039 + 'px');
    }else if(paper === "A5"){
        pageForCopyRatio.css('width', 793.7007874016 + 'px');
        pageForCopyRatio.css('height', 559.3700787402 + 'px');
    }else if(paper === "B4 (JIS)"){
        pageForCopyRatio.css('width', 971.3385826772 + 'px');
        pageForCopyRatio.css('height', 1375.748031496 + 'px');
    }else if(paper === "B5 (JIS)"){
        pageForCopyRatio.css('width', 687.874015748 + 'px');
        pageForCopyRatio.css('height', 971.3385826772 + 'px');
    }
}
function paperDirection() {
    $(".pageforcopyratio").each(function (i, e) {
        var temp = e.style.width;
        e.style.width = e.style.height;
        e.style.height = temp;
    });
}
function datePrinting() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDay();
    const hour = date.getHours();
    const seconds = date.getSeconds();
    console.log("date : ",year+"-"+month+"-"+day+" "+hour +":"+seconds);
    const nowpage = $("#NowPage").val();
    const time_area = document.createElement("div");
    time_area.id = "time_area"+nowpage;
    time_area.style.position = "absolute";
    time_area.style.left = "950px";
    time_area.style.top = "1300px";
    time_area.style.zIndex = "999";
    const time = document.createElement("div");
    time.className = "SystemDate";
    time.style.width = "100px";
    time.style.height = "50px";

    document.getElementById("page"+nowpage).appendChild(time_area);
    document.getElementById(time_area.id).appendChild(time);
}