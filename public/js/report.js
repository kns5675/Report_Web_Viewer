var reportTemplate = null;
var pageNum = 1;
var reportNum = 0;
var reportPageCnt = 0;
var curDatarow = 0;
var curDatarowInDataBand = 0;
var curDatarowInRegion = 0;
var groupFieldArray = [];
var remainFooterBand = [];
var remainFooterBandInRegion = [];
var isDynamicTable = false;
var isRegion = false;
var tableLabelList = [];
var report_wrap_arr_html = null;
var completeDataBand = []; // 0918 예솔 추가 : 출력이 끝난 데이터 밴드의 id를 담는 배열

/******************************************************************
 기능 : 하나의 리포트를 다 출력 시킨 후에 사용한 전역 변수들 초기화
 만든이 : 구영준
 ******************************************************************/
function initializeVariable() {
    curDatarowInDataBand = 0;
    groupFieldArray = [];
    groupFieldNum = 0;
    tableLabelList = [];
}

/******************************************************************
 기능 : 페이지에서 Json 파일을 매개변수로 받아서 ReportTemplate를 만듬
 author : powerku

 기능 : 서브 리포트 1번째 루트 많은 양의 데이터 리포트를 삽입할 경우
 페이지를 새로 만들어서 기존 리포트를 모두 출력 후 출력한다.
 날짜 : 2018-09-10
 만든이 : 김학준
 ******************************************************************/
function makeReportTemplate(data, subReport) {
    reportTemplate = new ReportTemplate(data);
    var subReport_click;
    var subReport_yes = false;

    reportTemplate.reportList.forEach(function (value, i) {
        ++reportNum;
        $('#temp_reportTemplate').append("<div id='report_wrap" + reportNum + "' class='report_wrap'></div>");

        var report = reportTemplate.reportList[i];
        var bands = report.layers.designLayer.bands;
        var dataBands = [];
        var arrRegion = [];

        bands.forEach(function (band) {
            if (band.attributes['xsi:type'] == 'BandData') {
                dataBands.push(band);
            }
        });

        // subReport_click = report.layers.designLayer.bands;
        //         subReport_click.forEach(function (value, j) {
        //             if(subReport_click[j].attributes["xsi:type"] === "BandSubReport"){
        //                 console.log("subReport_click[j] : ",subReport_click[j]);
        //                 subReport_yes = subReport_click[j];
        //                 console.log("subReport_yes : ",subReport_yes);
        //             }
        //         });
        //         if(subReport_yes){
        //             dataBands.forEach(function(dataBand, index){
        //                 makeReport(report, dataBand);
        //                 completeDataBand.push(dataBand.id);
        //                 initializeVariable();
        //             });
        //         }

        //ToDo 하나의 페이지에 여러개의 데이터 밴드 가능 수정 필요
        dataBands.forEach(function(dataBand) {
            var controlLists = dataBand.controlList.anyType;

            if (controlLists.length !== undefined) {
                controlLists.forEach(function(controlList) {
                    if(controlList._attributes["xsi:type"] == "ControlRegion"){
                        arrRegion.push(controlList.anyType);
                    }
                });
            }else{
                console.log(controlLists);
                if(controlLists._attributes["xsi:type"] == "ControlRegion"){
                    arrRegion.push(controlLists.anyType);
                }
            }
        });

            makeReport(report, arrRegion);

            // var isDataBand = completeDataBand.find(function(completeData){
            //     return dataBand.id = completeData;
            // });
            // if(isDataBand == undefined){
            //     completeDataBand.push(dataBand.id);
            // }
            initializeVariable();
        // });
    });
    // 서브리포트 밴드가 있을 경우 사이즈를 확인해서 너무 큰 경우 마지막 페이지에 추가됨.
    // if(subReport_yes){
    //     var SubreportTemplate = new ReportTemplate(subReport);
    //
    //     SubreportTemplate.reportList.forEach(function (value, i) {
    //         ++reportNum;
    //         var report = reportTemplate.reportList[i];
    //         var bands = report.layers.designLayer.bands;
    //         var dataBands = [];
    //         bands.forEach(function (band) {
    //             if (band.attributes['xsi:type'] == 'BandData') {
    //                 dataBands.push(band);
    //             }
    //         });
    //
    //         var report = SubreportTemplate.reportList[i];
    //         dataBands.forEach(function(dataBand, index){
    //             makeReport(report, dataBand);
    //             initializeVariable();
    //         });
    //     });
    // }

}

/******************************************************************
 기능 : make report in function makeReportTemplate
 author : powerku
 ******************************************************************/
function makeReport(report, arrRegion) {
    reportPageCnt++;
    if (pageNum === '1') {

    }
    setPage(report);
    setReport(report);

    pageNum++;
    // 현재 찍힌 데이터 로우 행이 전체 데이터 보다 작을 경우 재귀함수
    // 클 경우 함수 종료 후 다음 리포트 생성
    if (dataTable.DataSetName["dt"] != undefined) {
        if (curDatarowInDataBand < dataTable.DataSetName["dt"].length && isDynamicTable == true) {
            reportPageCnt++;
            if(arrRegion[0] != undefined){
                if(curDatarowInRegion < dataTable.DataSetName[arrRegion[0].Layers.anyType.Bands.anyType.DataTableName._text].length && isDynamicTable == true){
                    makeReport(report, arrRegion);
                } else {
                    reportPageCnt = 1;
                    completeDataBand.push(arrRegion[0].Id._text);
                }
            } else {
                makeReport(report, arrRegion);
            }
        } else {
            reportPageCnt = 1;
        }
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

/********************************************************************************************
 기능 :  데이터 밴드 길이 계산
 1. 데이터밴드가 데이터에 따라 동적으로 늘어나는 길이를 계산
 2. 데이터 밴드 길이 + 라벨 두께 + TableValueLabel 길이 + 한 페이지에 들어가는 데이터 갯수
 만든이 : 구영준
 ********************************************************************************************/
function getBandHeightOfDataBand(band, numOfData) {
    var controlLists = band.controlList.anyType;
    // var bandHeight = Number(band.rectangle.height);
    var tableSpacing = 0;
    var labels = [];
    var labelHeight = 0;
    var valueHeight = 0;
    var titleBorderTopThickness = 0;
    var titleBorderBottomThickness = 0;
    var valueBorderBottomThickness = 0;
    var allLabelBorderThickness;

    if (controlLists.length > 1) {
        controlLists.forEach(function (controlList) {
            if (controlList._attributes["xsi:type"] == "ControlDynamicTable") {
                labels.push(controlList);
                tableSpacing = Number(controlList.Rectangle.Y._text);
            }
        });
    } else {
        if (controlLists._attributes["xsi:type"] == "ControlDynamicTable") {
            labels.push(controlLists);
            if (controlLists.Rectangle.Y !== undefined) {
                tableSpacing = Number(controlLists.Rectangle.Y._text);
            }
        }
    }
    labels.forEach(function (label) {
        var tableLabels = label.Labels.TableLabel;
        labelHeight += Number(tableLabels[0].Rectangle.Height._text);
        valueHeight += Number(tableLabels[tableLabels.length - 1].Rectangle.Height._text);
        tableLabels.forEach(function (tableLabel) {
            if (tableLabel._attributes["xsi:type"] == "DynamicTableTitleLabel") {
                var labelBottom = Number(tableLabel.BorderThickness.Bottom._text);
                var labelTop = Number(tableLabel.BorderThickness.Top._text);

                if (titleBorderBottomThickness < Number(tableLabel.BorderThickness.Bottom._text))
                    titleBorderBottomThickness = labelBottom;

                if (titleBorderTopThickness < Number(tableLabel.BorderThickness.Top._text))
                    titleBorderTopThickness = labelTop;
            } else {
                var labelBottom = Number(tableLabel.BorderThickness.Bottom._text)
                if (valueBorderBottomThickness < Number(tableLabel.BorderThickness.Bottom._text))
                    valueBorderBottomThickness = labelBottom;
            }
        });
    });

    allLabelBorderThickness = titleBorderBottomThickness * numOfData + titleBorderBottomThickness + titleBorderTopThickness;
    return tableSpacing + labelHeight + (valueHeight * numOfData) + allLabelBorderThickness;
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

/***********************************************************
 기능 : 객체 생성 없이 한 페이지에 들어갈 데이터 개수 구하기
 : (밴드 길이 - 첫 행 높이) / 데이터 라벨 높이 => 한페이지에 들어가야할 밴드 개수
 만든이 : 구영준
 * *********************************************************/
function getNumOfDataInOnePageNonObject(band, divId) {

    var dt = dataTable.DataSetName[band.dataTableName];
    var bandDataHeight = 0;
    if (typeof divId == 'string') {
        bandDataHeight = $('#' + divId).height();
    } else if (typeof divId == 'number') {
        bandDataHeight = divId;
    }

    var tableSpacing = 0;
    var tableLabel;
    if (Array.isArray(band.controlList.anyType)) {
        band.controlList.anyType.forEach(function (anyType) {
            if (anyType._attributes['xsi:type'] == 'ControlDynamicTable' && anyType.Labels !== undefined) {
                tableLabel = anyType.Labels.TableLabel;
                if (anyType.Rectangle.Y !== undefined) {
                    tableSpacing = Number(anyType.Rectangle.Y._text);
                }
            }
        });
    } else {
        tableLabel = band.controlList.anyType.Labels.TableLabel;
        if (band.controlList.anyType.Rectangle.Y !== undefined) {
            tableSpacing = Number(band.controlList.anyType.Rectangle.Y._text);
        }
    }
    var firstLine = Number(tableLabel[0].Rectangle.Height._text);
    var dataLine = Number(tableLabel[tableLabel.length - 1].Rectangle.Height._text);

    var numofData = Math.floor((bandDataHeight - firstLine - tableSpacing) / dataLine);

    if (numofData > dt.length) {
        return dt.length;
    } else {
        return numofData;
    }
}

/****************************************************************
 * 배열에 배열을 추가하는 메서드
 * 만든이 : 구영준
 * 2018-09-11
 ********************************************************************* */
Array.prototype.injectArray = function (idx, arr) {
    return this.slice(0, idx).concat(arr).concat(this.slice(idx));
};

/******************************************************************
 기능 : 디자인 레이어 세팅
 author : powerku

 수정 : 하지연
 날짜 : 2018 - 09 - 03
 내용 : 디자인 레이어에 position지정
 ******************************************************************/
function setDesignLayer(report, dataBand) {
    $(('#page' + pageNum)).append('<div id="designLayer' + pageNum + '"class = designLayer></div>');

    setDesignLayerDirection(report);

    var designLayer = $('#designLayer' + pageNum);
    designLayer.css({
        'margin-top': report.margin.x + 'px',
        'margin-bottom': report.margin.y + 'px',
        'margin-right': report.margin.height + 'px',
        'margin-left': report.margin.width + 'px',
        'position': 'absolute',
        'background-color': 'rgba(255, 0, 0, 0)',
        'z-index': 0
        // 'pointer-events': 'none'
    });//추가 - 하지연

    var layerName = "designLayer" + pageNum;
    var reportHeight = report.rectangle.height;


    if (remainFooterBand.length > 0) {
        var bands = report.layers.designLayer.bands;
        var dataBandIndex = 0;

        //ToDo BandData가 n개 있을 때 에러날 수도 있을 것 같음
        // 아마 아이디로 비교하면 될 것 같은데 Test 해보고 수정 예정
        bands.forEach(function (band, i) {
            if (band.attributes["xsi:type"] == "BandData") {
                dataBandIndex = i;
            }
        });

        var returnBands = bands.injectArray(dataBandIndex, remainFooterBand);

        returnBands.forEach(function (band, i) {
            if (band.attributes["xsi:type"] == "BandData") {
                dataBandIndex = i;
            }
        });

        returnBands.splice(dataBandIndex, 1);

        drawBand(returnBands, layerName, reportHeight);
        remainFooterBand = [];
    } else {
        drawBand(report.layers.designLayer.bands, layerName, reportHeight); // 추가 - 전형준
    }
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

 수정 : 하지연
 날짜 : 2018 - 09 - 03
 내용 : 백그라운드 레이어에 position 지정
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
        'background-color': 'rgba(255, 0, 0, 0)',
        'z-index': 0,
        'position': 'absolute'
        // 'pointer-events': 'none'
    });// 추가 - 하지연

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

 수정 : 하지연
 날짜 : 2018 - 09 - 03
 내용 : 포그라운드 레이어에 position지정
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
        'background-color': 'rgba(255, 0, 0, 0)',
        'position': 'absolute',
        "z-index": 0,
        'pointer-events': 'none'
    });// 수정, 추가 - 하지연

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

 수정 : 하지연
 날짜 : 2018 - 09 - 03
 내용 : #page 하위에 forcopyratio라는 인쇄배율 조정을 위한 div를 생성하고
 forcopyratio라는 클래스 부여 & 스타일 생성
 ******************************************************************/
function setReport(report) {
    $(('#page' + pageNum)).append('<div id="forcopyratio' + pageNum + '"class = forcopyratio' + '></div>');//추가 - 하지연
    $(('#forcopyratio' + pageNum)).append('<div id="report' + pageNum + '"class = report' + '></div>');//추가 - 하지연
    // $("#report"+pageNum).css('pointer-events', 'none');//학준추가
    // $("#forcopyratio"+pageNum).css('pointer-events', 'none');//학준추가
    $('#forcopyratio' + pageNum).css("position", "absolute");//학준추가

    setForCopyRatioDirection(report);//추가 - 하지연
    setReportDirection(report);

    var reportInPage = $('#report' + pageNum);
    $('#forcopyratio' + pageNum).css("position", "absolute");

    /*reportInPage.css({
        'margin-top': report.margin.x + 'px',
        'margin-bottom': report.margin.y + 'px',
        'margin-right': report.margin.height + 'px',
        'margin-left': report.margin.width + 'px',
    });*/

    //  추가 - 하지연
    $('#forcopyratio' + pageNum).css('margin-top', report.margin.x + 'px');
    $('#forcopyratio' + pageNum).css('margin-bottom', report.margin.y + 'px');
    $('#forcopyratio' + pageNum).css('margin-right', report.margin.height + 'px');
    $('#forcopyratio' + pageNum).css('margin-left', report.margin.width + 'px');
    $('#forcopyratio' + pageNum).css('position', 'absolute');
    $('#forcopyratio' + pageNum).css('zIndex', -11);//학준추가

    // setBackGroundLayer(report);
    setDesignLayer(report);
    // setForeGroundLayer(report);

    // makeTableByData();

    // drawBand(report); // 추가 - 전형준

    // reportNum++; // pageNum으로 대체되어 본 함수 빠져나간 뒤에 pageNum++만 - 형준
}

/******************************************************************
 기능 : 페이지안의 리포트 방향 설정
 author : powerku

 수정 : 하지연
 내용 : page의 가로, 세로 값을 100%로 지정해, 부모의 변경값에
 유동적으로 변하도록 설정.
 ******************************************************************/
function setReportDirection(report) {

    var reportInPage = $('#report' + pageNum);
    if (report.paperDirection) {//수정 - 하지연
        reportInPage.css({
            'width': '100%',
            'height': '100%'
        });
    } else {//수정 - 하지연
        reportInPage.css({
            'height': $('#forcopyratio' + pageNum).width,
            'width': $('#forcopyratio' + pageNum).height
        });
    }

    reportInPage.css('text-align', 'center'); // 추가 : 안예솔
}

/******************************************************************
 기능 : 리포트 div의 부모 div인 forcopyratio div를 만든후 report의
 크기로 지정하고, 방향지정.
 author : 하지연
 ******************************************************************/
function setForCopyRatioDirection(report) {  //추가 - 하지연
    if (report.paperDirection) {
        $('#forcopyratio' + pageNum).css('width', report.rectangle.width + 'px');
        $('#forcopyratio' + pageNum).css('height', report.rectangle.height + 'px');
    } else {
        $('#forcopyratio' + pageNum).css('width', report.rectangle.height + 'px');
        $('#forcopyratio' + pageNum).css('height', report.rectangle.width + 'px');
    }
}

/******************************************************************
 기능 : 페이지 크기 렌더링
 author : powerku

 수정 : 하지연
 날짜 : 2018 - 08 - 23
 내용 : - reportTemplate 자식 pageForCopyRatio를 만들고 그 아래 자식page div 생성.
 - page의 position을 relative로 설정.

 수정 : 김학준
 날짜 : 2018 - 08 27
 내용 : 페이지 셋팅시 페이지 사이즈 변경.
 ******************************************************************/
function setPage(report, width, height) {
    var paperType = report.paperType;

    $('#report_wrap' + reportNum).append('<div id="pageForCopyRatio' + pageNum + '" class="pageforcopyratio paperType-' + paperType + '"></div>');//수정 - 하지연
    $('#pageForCopyRatio' + pageNum).append('<div id="page' + pageNum + '" class="page paperType-' + paperType + '"></div>');//수정 - 하지연
    // $(('#forcopyratio' + pageNum)).append('<div id="report' + pageNum + '"class = report' +'></div>');
    // $(document.html).css('pointer-events', 'none');//학준추가
    // $(document.body).css('pointer-events', 'none');//학준추가
    // $("#reportTemplate").css('pointer-events', 'none');//학준추가
    // $("#pageForCopyRatio"+pageNum).css('pointer-events', 'none');//학준추가
    // $("#page"+pageNum).css('pointer-events', 'none');//학준추가
    $('#pageForCopyRatio' + pageNum).addClass('report' + reportNum); // 형준추가

    setPageDirection(report);
    setPageForCopyRatioDirection(report);//추가 - 하지연

    //학준추가.
    $("#pagesizeoptions").on("change", function () {
        pagesizeselect($(this).val());
    });
    $("#row_direction").on("click", function () {
        var test = $("#row_direction").val();
    });

    var page = $('#page' + pageNum);
    page.css('border', 'solid green');
    page.css('background-color', 'transparent');
    page.css('position', 'relative');//추가 - 하지연

    var pageForCopyRatio = $('#pageForCopyRatio' + pageNum);
    pageForCopyRatio.css('border', 'solid red');
    pageForCopyRatio.css('background-color', 'lightgrey');

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
 내용 : page의 width, height값을 page의 부모인 pageForCopyRatio의 width,
 height값의 100%로 지정하고, 방향 설정
 ******************************************************************/
function setPageDirection(report) {
    var page = $('#page' + pageNum);
    var pageForCopyRatio = $('#pageForCopyRatio' + pageNum);

    page.css('width', '100%');
    page.css('height', '100%');
}

/***********************************************************************
 기능 : temp_reportTemplate div에 담은 엘리먼트들을 reportTemplate div에 넣어줌
 ( 리포트 넘기기, 리포트 선택 기능 구현을 위함 )
 만든이 : 전형준
 ***********************************************************************/
function temp_to_reportTemplate() {
    var reportTemplate_div = $('#reportTemplate');
    var wrap_arr_clone = report_backup(); // report_wrap_arr_html 변수 세팅
    var str = "";

    for (var i = 0; i < wrap_arr_clone.length; i++) {
        if (wrap_arr_clone[i].length > 0 && check_forceNextReport(reportTemplate.reportList[i])) { // 리포트 넘기기일 때
            str += wrap_arr_clone[i][0];
            wrap_arr_clone[i].shift();
        } else {
            for (var j = 0; j < wrap_arr_clone[i].length; j++) {
                str += wrap_arr_clone[i][j];
            }
            wrap_arr_clone[i] = [];
        }

        var remain_wrap_count = 0;
        for (var j = 0; j < wrap_arr_clone.length; j++) {
            remain_wrap_count += wrap_arr_clone[j].length;
        }
        if ((i === wrap_arr_clone.length - 1) && (remain_wrap_count > 0)) {
            i = -1;
        }
    }
    $('#temp_reportTemplate').remove();
    reportTemplate_div.html(str);
    reNumbering();
}

/***********************************************************************
 기능 : 리포트 넘기기와 리포트 선택 기능 구현 중,
 리포트 백업 기능 구현(html 따로 저장)
 만든이 : 전형준
 ***********************************************************************/
function report_backup() {
    var temp_arr = [];
    var report_wrap_arr = $('.report_wrap');
    var pageInReport;

    for (var i = 0; i < report_wrap_arr.length; i++) {
        temp_arr[i] = [];
        pageInReport = report_wrap_arr.eq(i).find('.pageforcopyratio');
        for (var j = 0; j < pageInReport.length; j++) {
            temp_arr[i].push(
                $('<div>').append(pageInReport.eq(j).clone()).html()
            );
        }
    }

    report_wrap_arr_html = temp_arr;
    return report_wrap_arr_html;
}

/***********************************************************************
 기능 : '리포트 넘기기' 속성이 true 인지 확인
 >> 속성이 리포트에만 있는 것이 아니라,
 '그룹풋터밴드'에도 존재하며 그 속성이 true라면
 리포트 넘기기의 기능이 정상작동 하므로 둘 모두 체크해줌
 만든이 : 전형준
 ***********************************************************************/
function check_forceNextReport(report) {
    var bandGroupFooterIsTrue = false;
    report.layers.designLayer.bands.forEach(function (band) {
        if (band instanceof BandData && band.childFooterBands !== null) {
            band.childFooterBands.forEach(function (childBand) {
                if (childBand instanceof BandGroupFooter && childBand.forceNextReport === true)
                    bandGroupFooterIsTrue = true;
                else
                    bandGroupFooterIsTrue = false;
            });
        }
    });
    return report.forceNextReport + bandGroupFooterIsTrue > 0 ? true : false;
}

/***********************************************************************
 기능 : 리포트 넘기기가 됐을시 temp_reportTemplate에서 생성되어 뒤섞인
 pageforcopyratio와 page를 다시 새로 넘버링해줌
 만든이 : 전형준
 ***********************************************************************/
function reNumbering() {
    var pageforcopyratio_div_arr = $('.pageforcopyratio');
    var page_div_arr = $('.page');

    for (var i = 0; i < pageforcopyratio_div_arr.length; i++) {
        pageforcopyratio_div_arr.eq(i).attr('id', 'pageforcopyratio' + (i + 1));
        page_div_arr.eq(i).attr('id', 'page' + (i + 1));
    }
}