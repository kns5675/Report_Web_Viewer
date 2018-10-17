/***********************************************************
 * 기능 : 데이터 밴드 하위의 모든 밴드 길이 합
 * 만든이 : 구영준
 * *********************************************************/
function getFooterHeight(bands, dataBand) {
    // footer_height = 0;
    var bandDataIndex;
    var dt = dataTable.DataSetName[dataBand.dataTableName];

    if (dt != undefined) {
        for (var i = 0; i < bands.length; i++) {
            if (bands[i].attributes["xsi:type"] === "BandData") {
                bandDataIndex = i;
            }
            if (i > bandDataIndex) {
                switch (bands[i].attributes['xsi:type']) {
                    case 'BandSummary' :
                        if (bands[i].isBottom == 'true') {
                            footer_height += Number(bands[i].rectangle.height);
                        } else if ((bands[i].isBottom == 'false' && curDatarowInDataBand > dt.length) || isDynamicTable == false) {
                            footer_height += Number(bands[i].rectangle.height);
                        }
                        break;
                    case 'BandSubReport' :
                        break;
                    default :
                        footer_height += Number(bands[i].rectangle.height);
                }
            }
        }
    }
}

/***********************************************************
 * 기능 : 데이터 밴드 하위의 모든 밴드 길이 합 (리전)
 * 만든이 : 안예솔
 * *********************************************************/
function getFooterHeightInRegion(bands, dataBand) {
    footerHeightInRegion = 0;
    var bandDataIndex;
    var dt = dataTable.DataSetName[dataBand.dataTableName];
    if (dt != undefined) {
        for (var i = 0; i < bands.length; i++) {
            if (bands[i].attributes["xsi:type"] === "BandData") {
                bandDataIndex = i;
            }
            if (i > bandDataIndex) {
                if (bands[i].attributes['xsi:type'] == 'BandSummary') { // 써머리 밴드는 isBottom이 true일 때만 매 페이지 반복
                    if (bands.isBottom == 'true') {
                        footerHeightInRegion += Number(bands[i].rectangle.height);
                    } else if ((bands[i].isBottom == 'false' && curDatarowInRegion > dt.length) || isDynamicTable == false) {
                        footerHeightInRegion += Number(bands[i].rectangle.height);
                    }
                } else {
                    footerHeightInRegion += Number(bands[i].rectangle.height);
                }
            }
        }
    }
}

/***********************************************************
 * 기능 : 데이터 밴드 밑의 풋터 길이를 제외한 여백을 구함
 * 만든이 : 구영준
 * *********************************************************/
function getAvaHeight(div_id, reportHeight) {
    var $divId = '#' + div_id;
    var avaHeight = 0;
    if ($($divId).hasClass('designLayer')) {
        avaHeight = reportHeight;
    } else {
        var siblings = $($divId).siblings();
        // var curr_height = parseInt($($divId).css('height').substring(0, $($divId).css('height').length - 2));
        var curr_height = 0;

        for (var i = 0; i < siblings.length; i++) {
            curr_height += parseInt(siblings.eq(i).css('height').substring(0, siblings.eq(i).css('height').length - 2));
        }
        if (isRegion) { // 리전일 때
            avaHeight = reportHeight - Math.ceil(curr_height) - Math.ceil(footerHeightInRegion);
        } else { // 리전이 아닐 떄
            avaHeight = reportHeight - Math.ceil(curr_height) - Math.ceil(footer_height);
        }
    }
    return Math.floor(avaHeight);
}

/***********************************************************
 기능 : 데이터밴드 childHeaderBand 길이 구함
 **********************************************************/
function getChildHeaderBandHeight(band) {
    var childHeaderBandsHeight = 0;
    var childBands = band.childHeaderBands;

    childBands.forEach(function (childBand) {
        switch (childBand.attributes["xsi:type"]) {
            case 'BandGroupHeader' :
                if (isRegion) { // 리전일 때
                    if (!remainDataInRegion) {
                        childHeaderBandsHeight += Number(childBand.rectangle.height);
                    } else {
                        if (band.fixPriorGroupHeader === 'true') { //그룹 헤더 고정
                            childHeaderBandsHeight += Number(childBand.rectangle.height);
                        }
                    }
                } else { // 리전이 아닐 때
                    if (!remainData) {
                        childHeaderBandsHeight += Number(childBand.rectangle.height);
                    } else {
                        if (band.fixPriorGroupHeader === 'true') { //그룹 헤더 고정
                            childHeaderBandsHeight += Number(childBand.rectangle.height);
                        }
                    }
                }
                break;
            case 'BandDataHeader' : // 데이터 헤더 밴드
                if (band.fixTitle == 'true') { // 데이터 헤더 밴드 고정 값이 '예'일 때
                    childHeaderBandsHeight += Number(childBand.rectangle.height); // 매 페이지마다 나와야 함
                } else { // 데이터 헤더 밴드 고정 값이 '아니오'일 때
                    if (reportPageCnt == 1) { // 첫 페이지만 나옴
                        childHeaderBandsHeight += Number(childBand.rectangle.height);
                    }
                }
                break;
            case 'BandDummyHeader' :
                var isGroupHeader = false;
                childBands.forEach(function (childBand) {
                    if (childBand.attributes["xsi:type"] == 'BandGroupHeader') {
                        isGroupHeader = true;
                    }
                });
                if (isGroupHeader) { // 그룹 헤더가 있을 때는 그룹의 맨 처음에 출력 O
                    if (isRegion) { // 리전일 때
                        if (groupDataRowInRegion == 1) {
                            childHeaderBandsHeight += Number(childBand.rectangle.height);
                        }
                    } else { // 리전이 아닐 때
                        if (groupDataRow == 1) {
                            childHeaderBandsHeight += Number(childBand.rectangle.height);
                        }
                    }
                } else { // 그룹 헤더가 없을 때는 인쇄물의 첫 페이지에만 출력
                    if (reportPageCnt == 1) {
                        childHeaderBandsHeight += Number(childBand.rectangle.height);
                    }
                }
                break;
        }
    });
    return childHeaderBandsHeight;
}

/***********************************************************
 기능 : 데이터 밴드의 자식 밴드의 출력 여부에 따라 길이를 구함
 만든이 : 구영준
 * *********************************************************/
function getChildBandHeight(band) {
    var childBandsHeight = 0;
    var childBands = band.childFooterBands;
    var dt = dataTable.DataSetName[band.dataTableName];

    childBands.forEach(function (childBand) {
        switch (childBand.attributes["xsi:type"]) {
            case 'BandGroupFooter' :
                if (isRegion) { // 리전일 때
                    if (!remainDataInRegion) {
                        childBandsHeight += Number(childBand.rectangle.height);
                    } else {
                        if (band.fixPriorGroupFooter == 'true') { //그룻 풋터 고정
                            childBandsHeight += Number(childBand.rectangle.height);
                        }
                    }
                } else { // 리전이 아닐 때
                    if (!remainData) { // remaindata = false 남은 데이터가 없을 때
                        childBandsHeight += Number(childBand.rectangle.height);
                    } else {
                        if (band.fixPriorGroupFooter == 'true') { //그룻 풋터 고정
                            childBandsHeight += Number(childBand.rectangle.height);
                        }
                    }
                }
                break;
            case 'BandDataFooter' : // 모든 데이터 출력이 끝난 후에 출력
                if (band.fixTitle == 'true') { // 데이터 헤더 밴드 고정 값이 '예'일 때
                    childBandsHeight += Number(childBand.rectangle.height);
                } else { // 데이터 헤더 밴드 고정 값이 '아니오'일 때
                    // TODO 수정 필요!!! dynamicTable이 페이지에 한 개만 있지 않음!!!
                    var lastPageDataCnt = $("#dynamicTable" + (pageNum - 1) + ' tr').length - 1;
                    if (isRegion) { // 리전일 때
                        if (curDatarowInRegion + lastPageDataCnt > dt.length) { // 데이터 출력이 끝났을 때 나옴
                            childBandsHeight += Number(childBand.rectangle.height);
                        }
                    } else { // 리전이 아닐 때
                        if (curDatarowInDataBand + lastPageDataCnt > dt.length) { // 데이터 출력이 끝났을 때 나옴
                            childBandsHeight += Number(childBand.rectangle.height);
                        }
                    }
                }
                break;
            case 'BandDummyFooter' :
                var isGroupFooter = false;
                childBands.forEach(function (childBand) {
                    if (childBand.attributes["xsi:type"] == 'BandGroupFooter') {
                        isGroupFooter = true;
                    }
                });
                if (isGroupFooter) { // 그룹 헤더가 있을 때는 그룹의 맨 마지막에 출력
                    if (isRegion) {
                        if (!remainDataInRegion) { // 출력할 그룹의 데이터가 남아있지 않을 때 O
                            childBandsHeight += Number(childBand.rectangle.height);
                        }
                    } else {
                        if (!remainData) { // 출력할 그룹의 데이터가 남아있지 않을 때 O
                            childBandsHeight += Number(childBand.rectangle.height);
                        }
                    }
                } else { // 그룹 헤더가 없을 때는 인쇄물의 마지막 페이지에만 출력
                    // TODO 수정 필요!!! dynamicTable이 페이지에 한 개만 있지 않음!!!
                    var lastPageDataCnt = $("#dynamicTable" + (pageNum - 1) + ' tr').length - 1;

                    if (isRegion) { // 리전일 때
                        if (curDatarowInRegion + numofData > dt.length) {
                            childBandsHeight += Number(childBand.rectangle.height);
                        }
                    } else { // 리전이 아닐 때
                        if (curDatarowInDataBand + lastPageDataCnt > dt.length) { // 데이터 출력이 끝났을 때 나옴
                            childBandsHeight += Number(childBand.rectangle.height);
                        }
                    }
                }
                break;
        }
    });
    return childBandsHeight;
}
