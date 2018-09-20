// 작성자 : 전형준
var bandNum = 1;
var footer_height = 0;
var footerHeightInRegion = 0;
var minGroupBandDataHeight = 0;
var remainData = false;
var remainDataInRegion = false;
var numofData = 0;
var groupDataRow = 1;
var groupDataRowInRegion = 1;
var SubReport_Report_YN = false;
var SubReport_Report_Count = 1;
var SubReport_Report_Size;
var isMaximumRowCount = false;
var isMinimumRowCount = false;
var isBandGroupHeader = false;

/***********************************************************
 * 기능 : 최소 그룹 데이터 길이
 *  그룹 헤더길이 + 테이블 타이틀 길이 + 테이블 Value 길이 + 테이블의 Y
 * 만든이 : 구영준
 * *********************************************************/
function getMinGroupBandDataHeight(band) {
    var tableSpacing = 0;

    if (band.controlList.anyType.Rectangle.Y !== undefined) {
        tableSpacing = Number(band.controlList.anyType.Rectangle.Y._text);
    }
    var bandGroupHeaderHeight = getChildHeaderBandHeight(band);
    var tableLabel = band.controlList.anyType.Labels.TableLabel;
    var tableTitleHeight = Number(tableLabel[0].Rectangle.Height._text);
    var tableValueHeight = Number(tableLabel[tableLabel.length - 1].Rectangle.Height._text);

    minGroupBandDataHeight = bandGroupHeaderHeight + tableTitleHeight + tableValueHeight + tableSpacing;
}

/***********************************************************
 * 기능 : 데이터 밴드 하위의 모든 밴드 길이 합
 * 만든이 : 구영준
 * *********************************************************/
function getFooterHeight(bands, dataBand) {
    footer_height = 0;
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
                        footer_height += Number(bands[i].rectangle.height);
                    } else if ((bands[i].isBottom == 'false' && curDatarowInDataBand > dt.length) || isDynamicTable == false) {
                        footer_height += Number(bands[i].rectangle.height);
                    }
                } else {
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
        if(isRegion) { // 리전일 때
            avaHeight = reportHeight - curr_height - footerHeightInRegion;
        } else { // 리전이 아닐 떄
            avaHeight = reportHeight - curr_height - footer_height;
        }
    }

    return avaHeight;
}

/***********************************************************
 기능 : 그룹 헤더/풋터 일 경우 데이터 밴드 길이 계산
 1. 그룹 헤더/풋터 일 경우 그룹 데이터의 길이 만큼의 데이터 길이
 2. th 길이 + td길이 * 데이터 개수
 만든이 : 구영준
 * *********************************************************/
function getNumOfDataWithGroupField(band, avaHeight) {
    var tableSpacing = 0;
    if (isRegion) { // 리전일 때
        if (band.controlList.anyType.Rectangle.Y !== undefined) {
            tableSpacing = Number(band.controlList.anyType.Rectangle.Y._text);
        }
        var dataCount = groupFieldArrayInRegion[groupFieldNumInRegion].length;
        var labels = band.controlList.anyType.Labels.TableLabel;

        var titleHeight = Number(labels[0].Rectangle.Height._text);
        var valueHeight = Number(labels[labels.length - 1].Rectangle.Height._text);
        var bandGroupFooterHeight = 0;

        band.childFooterBands.forEach(function (child) {
            bandGroupFooterHeight = child.rectangle.height;
        });

        //ToDo 확인 필요
        var numofData = Math.floor((avaHeight - titleHeight - tableSpacing) / valueHeight) + 1;
        var groupRemainData = (dataCount - groupDataRowInRegion);

        if (numofData - groupDataRowInRegion > groupRemainData || groupDataRowInRegion >= numofData) { // 마지막 페이지
            return dataCount;
        } else { //마지막 페이지가 아닌 경우
            return numofData;
        }
    } else { // 리전이 아닐 때
        if (band.controlList.anyType.Rectangle.Y !== undefined) {
            tableSpacing = Number(band.controlList.anyType.Rectangle.Y._text);
        }
        var dataCount = groupFieldArray[groupFieldNum].length;
        var labels = band.controlList.anyType.Labels.TableLabel;

        var titleHeight = Number(labels[0].Rectangle.Height._text);
        var valueHeight = Number(labels[labels.length - 1].Rectangle.Height._text);
        var bandGroupFooterHeight = 0;

        band.childFooterBands.forEach(function (child) {
            bandGroupFooterHeight = child.rectangle.height;
        });

        //ToDo 확인 필요
        var numofData = Math.floor((avaHeight - titleHeight - tableSpacing) / valueHeight) + 1;
        var groupRemainData = (dataCount - groupDataRow);

        if (numofData - groupDataRow > groupRemainData || groupDataRow >= numofData) { // 마지막 페이지
            return dataCount;
        } else { //마지막 페이지가 아닌 경우
            return numofData;
        }
    }

}

/***********************************************************
 * 리포트에 밴드들을 그려줌(ChildBands 들을 그려주기 위해 재귀함수로 사용)
 * 인자 bands : 그려줄 밴드들 // layerName : 어느 Layer에 그려줄 지
 *
 * 수정 : 2018-08-22
 * BandData일 경우 페이지 크기에 맞게 BandData Height 변경
 * from 구영준
 *
 * 수정 : 2018-08-31
 * 그룹 헤더 밴드 구현
 * from 구영준
 *
 * 수정 : 2018-09-07
 *  데이터밴드의 자식 밴드들을 함수로 빼서 구현
 * from 안예솔
 **********************************************************/
function drawBand(bands, dataBand, layerName, reportHeight, parentBand) {
    var avaHeight = 0;
    var dt = dataTable.DataSetName[dataBand.dataTableName];
    bands.some(function (band) {
        var doneDataBand = false;
        completeDataBand.forEach(function (compareDataBand) {
            if (compareDataBand == band.id) {
                doneDataBand = true;
            }
        });
        if (!doneDataBand) { // 출력이 끝난 데이터 밴드가 아닐 때
            switch (band.attributes["xsi:type"]) {
                case 'BandPageHeader' :
                    if (band.pageOutputSkip === "true" && reportPageCnt == 1) {
                        return false;
                    }
                    break;
                case 'BandTitle' :
                    if (reportPageCnt > 1) {
                        return false;
                    }
                    break;
                case 'BandData' :
                    // 180910 YeSol 추가
                    var controlLists = [];

                    controlLists.push(band.controlList.anyType); // dataBand의 controlList배열

                    isDynamicTable = false;
                    controlLists.forEach(function (controlList) {
                        if (controlList.length !== undefined) {
                            for (var i = 0; i < controlList.length; i++) {
                                if (controlList[i]._attributes['xsi:type'] == 'ControlDynamicTable') {
                                    isDynamicTable = true;
                                }
                            }
                        } else {
                            if (controlList._attributes['xsi:type'] == 'ControlDynamicTable') {
                                isDynamicTable = true;
                            }
                        }
                    });
                    break;
                case 'BandSummary' :
                    if (dt != undefined) {
                        if (band.isBottom == 'false') { // isBottom이 false면 맨 마지막 페이지에만 나옴
                            if (curDatarow < dt.length && isDynamicTable == true) {
                                return false;
                            }
                        }
                    }
                    break;
            }

            if (band.childHeaderBands !== null) { // 자식헤더밴드에서 재호출
                if (band.id === dataBand.id) {
                    drawChildHeaderBand(dataBand.childHeaderBands, dataBand, layerName, reportHeight); // 자식 밴드를 그려주는 함수 호출
                } else {
                    drawChildHeaderBand(band.childHeaderBands, dataBand, layerName, reportHeight); // 자식 밴드를 그려주는 함수 호출
                }
            }
            var div_id = 'band' + (bandNum++);

            $('#' + layerName).append("<div id='" + div_id + "' class='Band " + band.attributes["xsi:type"] + "'>" + band.name + "</div>");
            if (SubReport_Report_YN) {    //서브리포트가 있을 경우
                if (band.attributes["xsi:type"] === "BandData") {
                }
                if (band.joinString) { //디테일 Where절이 있을 경우 기존 데이터 라벨 밑에 붙여야함.
                    judgementControlList(band, div_id, numofData); // 라벨을 그려줌
                }
            }
            if (band.attributes["xsi:type"] === "BandSubReport") {  // 서브리포트가 있으면 서브리포트를 카운트하고 해당 페이지 다음 페이지부터 서브리포트에 들어갈 리포트로 판단.
                SubReport_Report_YN = true;
                SubReport_Report_Count++;
                SubReport_Report_Size = band.rectangle.height;
            }
            switch (band.attributes["xsi:type"]) {
                case 'BandDataHeader' :
                    if (getAvaHeight(div_id, reportHeight) < Number(band.rectangle.height)) {
                        $('#' + div_id).remove();
                        return true;
                    }
                    setWidthHeightInBand(div_id, band);
                    break;
                case 'BandDummyHeader' :
                    if (getAvaHeight(div_id, reportHeight) < Number(band.rectangle.height)) {
                        $('#' + div_id).remove();
                        return true;
                    }
                    setWidthHeightInBand(div_id, band);
                    break;
                case 'BandGroupHeader' :
                    if (getAvaHeight(div_id, reportHeight) < Number(band.rectangle.height)) {
                        $('#' + div_id).remove();
                        return true;
                    }
                    inVisible(div_id, band);
                    setWidthHeightInBand(div_id, band);
                    break;
                case 'BandData' :
                    if (getAvaHeight(div_id, reportHeight) < Number(dataBand.rectangle.height)) {
                        $('#' + div_id).remove();
                        return true;
                    }
                    if (bands.length > 1) {
                        if (isRegion) { // 리전일 때
                            getFooterHeightInRegion(bands, dataBand);
                        } else { // 리전이 아닐 때
                            getFooterHeight(bands, dataBand);
                        }
                    }
                    if (isRegion) { // 리전일 때
                        drawBandDataInRegion(groupFieldArrayInRegion, band, dataBand, layerName, reportHeight, parentBand, div_id, dt);
                    } else { // 리전이 아닐 때
                        drawBandData(groupFieldArray, band, dataBand, layerName, reportHeight, parentBand, div_id, dt);
                    }
                    break;
                case 'BandDummyFooter' :
                    avaHeight = getAvaHeight(div_id, reportHeight);
                    if (avaHeight < Number(band.rectangle.height)) {
                        if (isRegion) { // 리전일 때
                            remainFooterBandInRegion = (function (bands) {
                                var tempArr = [];
                                bands.forEach(function (band) {
                                    band.parentBand = dataBand;
                                    tempArr.push(band);
                                });
                                return tempArr;
                            }(bands));
                        } else { // 리전이 아닐 때
                            remainFooterBand = (function (bands) {
                                var tempArr = [];
                                bands.forEach(function (band) {
                                    band.parentBand = dataBand;
                                    tempArr.push(band);
                                });
                                return tempArr;
                            }(bands));
                            console.log(remainFooterBand)
                        }
                        $('#' + div_id).remove();
                        return true;
                    }
                    setWidthHeightInBand(div_id, band);

                    break;
                case 'BandGroupFooter' :
                    avaHeight = getAvaHeight(div_id, reportHeight);
                    if (avaHeight < Number(band.rectangle.height)) {
                        band.parentBand = dataBand;
                        if (isRegion) {
                            remainFooterBandInRegion.push(band);
                        } else {
                            remainFooterBand.push(band);
                        }
                        $('#' + div_id).remove();
                        return false;
                    }
                    inVisible(div_id, band);
                    setWidthHeightInBand(div_id, band);

                    break;
                case 'BandSubReport' :
                    setWidthHeightInBand(div_id, band);
                    $('#' + div_id).css({
                        'border-bottom': "1px solid red",
                        'zIndex': -10
                    });
                    break;
                case 'BandPageFooter' :
                    setWidthHeightInBand(div_id, band);
                    $('#' + div_id).css({
                        //ToDo position이 absolute로 먹지 않음
                        'position': 'absolute',
                        'bottom': 0 + "px",
                    });
                    break;
                case 'BandSummary' :
                    if (band.isBottom == 'true') {
                        setWidthHeightInBand(div_id, band);
                        $('#' + div_id).css({
                            'border-bottom': "1px solid red",
                            'zIndex': -10
                        });
                    } else {
                        setWidthHeightInBand(div_id, band);
                        $('#' + div_id).css({
                            'border-bottom': "1px solid red",
                            'zIndex': -10
                        });
                        if (dt != undefined) {
                            if (curDatarow > dt.length || isDynamicTable == false) { // 데이터 출력이 끝났을 때 나옴
                                setWidthHeightInBand(div_id, band);
                                $('#' + div_id).css({
                                    'border-bottom': "1px solid red",
                                    'zIndex': -10
                                });
                            }
                        }
                    }
                    break;
                default :
                    setWidthHeightInBand(div_id, band);
                    break;
            }
            if (band.attributes["xsi:type"] !== "BandSubReport") {
                if (band.attributes["xsi:type"] === "BandData") {
                    if (band.id == dataBand.id && !doneDataBand) {
                        judgementControlList(dataBand, div_id, numofData); // 라벨을 그려줌
                        afterjudgementControlListAction(dataBand, div_id, layerName, reportHeight, parentBand, dt);
                    }
                } else {
                    judgementControlList(band, div_id, numofData); // 라벨을 그려줌
                    afterjudgementControlListAction(band, div_id, layerName, reportHeight, dataBand, dt);
                }
            }

            if (band.childFooterBands !== null) { // 자식 풋터 밴드에서 재호출
                drawChildFooterBand(band.childFooterBands, dataBand, layerName, reportHeight); // 자식 밴드를 그려주는 함수 호출
            }
        }
    });
}

/***********************************************************
 기능 : drawBand에서 Switch문 중 BandData에 해당하는 내용을 뽑아옴
 만든이 : 안예솔
 * *********************************************************/
function drawBandData(groupFieldArray, band, dataBand, layerName, reportHeight, parentBand, div_id, dt) {
    if (groupFieldArray.length > 0 && dataBand.childHeaderBands !== null) { //그룹 필드가 있는 경우
        var dataBandHeight = 0;
        if (isDynamicTable == true && dt != undefined) {
            avaHeight = getAvaHeight(div_id, reportHeight);
            numofData = getNumOfDataWithGroupField(dataBand, avaHeight);
            if (dataBand.controlList.anyType.FixRowCount !== undefined) { // 최대 행 개수
                var maximumRowCount = Number(dataBand.controlList.anyType.FixRowCount._text);
                if (maximumRowCount != 0) {
                    if ((numofData - groupDataRow) > maximumRowCount) {
                        if (dataBand.controlList.anyType.IsForceOverRow._text == 'true') { // 최대행 이후 데이터가 페이지 넘기기 일 때
                            numofData = maximumRowCount + 1;
                            isMaximumRowCount = true;
                        }
                    }
                }
            }
            if (dataBand.controlList.anyType.MinimumRowCount !== undefined) {
                var minimumCnt = Number(dataBand.controlList.anyType.MinimumRowCount._text);
                if (minimumCnt != 1 && (numofData - groupDataRow) < minimumCnt) { // 최소행 개수 적용
                    dataBandHeight = getBandHeightOfDataBand(dataBand, minimumCnt);
                    isMinimumRowCount = true;
                } else {
                    if (remainData) {
                        dataBandHeight = getBandHeightOfDataBand(dataBand, numofData - groupDataRow);
                    } else {
                        dataBandHeight = getBandHeightOfDataBand(dataBand, numofData - 1);
                    }
                }
            } else {
                if (remainData) {
                    dataBandHeight = getBandHeightOfDataBand(dataBand, numofData - groupDataRow);
                } else {
                    dataBandHeight = getBandHeightOfDataBand(dataBand, numofData - 1);
                }
            }

            $('#' + div_id).css({
                'width': dataBand.rectangle.width,
                'height': dataBandHeight,
            });

            inVisible(div_id, dataBand);

        } else { // 동적 테이블이 없을 때
            setWidthHeightInBand(div_id, dataBand);
        }
    } else {  // 그룹 헤더/풋터가 없는 경우
        if (isDynamicTable == true && dt != undefined) {
            var dataBandFooterHeight = 0;

            dataBandHeight = getAvaHeight(div_id, reportHeight);

            if (dataBand.childFooterBands !== null) { // 자식 풋터 밴드에서 재호출
                dataBandFooterHeight = getChildBandHeight(dataBand);
            }

            $('#' + div_id).css({
                'width': dataBand.rectangle.width,
                'height': dataBandHeight - dataBandFooterHeight,
            });
            if (Array.isArray(dataBand.controlList.anyType)) {
                dataBand.controlList.anyType.forEach(function (anyType) {
                    if (anyType._attributes['xsi:type'] == 'ControlDynamicTable' && anyType.Labels !== undefined) {
                        numofData = getNumOfDataInOnePageNonObject(dataBand, div_id);
                        if (dataBand.controlList.anyType.MinimumRowCount !== undefined) { // 최소 행 개수
                            var minimumRowCount = Number(dataBand.controlList.anyType.MinimumRowCount._text);
                            if ((dt.length - curDatarowInDataBand) < minimumRowCount && minimumRowCount != 1) {
                                numofData = minimumRowCount;
                                isMinimumRowCount = false;
                            }
                        }
                        if (dataBand.controlList.anyType.FixRowCount !== undefined) { // 최대 행 개수
                            var maximumRowCount = Number(dataBand.controlList.anyType.FixRowCount._text);

                            if (maximumRowCount != 0) {
                                if (dataBand.controlList.anyType.IsForceOverRow._text == 'true') { // 최대행 이후 데이터가 페이지 넘기기 일 때
                                    numofData = maximumRowCount;
                                    isMaximumRowCount = true;
                                }
                            }
                        }
                    }
                });
            } else {
                if (dataBand.controlList.anyType.Labels !== undefined) {
                    numofData = getNumOfDataInOnePageNonObject(dataBand, div_id);
                    if (dataBand.controlList.anyType.MinimumRowCount !== undefined) { // 최소 행 개수
                        var minimumRowCount = Number(dataBand.controlList.anyType.MinimumRowCount._text);
                        if ((dt.length - curDatarowInDataBand) < minimumRowCount && minimumRowCount != 1) {
                            numofData = minimumRowCount;
                            isMinimumRowCount = true;
                        }
                    }
                    if (dataBand.controlList.anyType.FixRowCount !== undefined) { // 최대 행 개수
                        var maximumRowCount = Number(dataBand.controlList.anyType.FixRowCount._text);
                        if (maximumRowCount != 0) {
                            if (dataBand.controlList.anyType.IsForceOverRow._text == 'true') { // 최대행 이후 데이터가 페이지 넘기기 일 때
                                numofData = maximumRowCount;
                                isMaximumRowCount = true;
                            }
                        }
                    }
                }
            }
        } else { // 동적 테이블이 없을 때
            setWidthHeightInBand(div_id, band);
        }
    }
}


/***********************************************************
 기능 : drawBand에서 Switch문 중 BandData에 해당하는 내용을 뽑아옴 (리전)
 만든이 : 안예솔
 * *********************************************************/
function drawBandDataInRegion(groupFieldArrayInRegion, band, dataBand, layerName, reportHeight, parentBand, div_id, dt) {
    if (groupFieldArrayInRegion.length > 0 && dataBand.childHeaderBands !== null) { //그룹 필드가 있는 경우
        var dataBandHeight = 0;
        if (isDynamicTable == true && dt != undefined) {
            avaHeight = getAvaHeight(div_id, reportHeight);
            numofData = getNumOfDataWithGroupField(dataBand, avaHeight);
            if (dataBand.controlList.anyType.FixRowCount !== undefined) { // 최대 행 개수
                var maximumRowCount = Number(dataBand.controlList.anyType.FixRowCount._text);
                if (maximumRowCount != 0) {
                    if ((numofData - groupDataRowInRegion) > maximumRowCount) {
                        if (dataBand.controlList.anyType.IsForceOverRow._text == 'true') { // 최대행 이후 데이터가 페이지 넘기기 일 때
                            numofData = maximumRowCount + 1;
                            isMaximumRowCount = true;
                        }
                    }
                }
            }
            if (dataBand.controlList.anyType.MinimumRowCount !== undefined) {
                var minimumCnt = Number(dataBand.controlList.anyType.MinimumRowCount._text);
                if (minimumCnt != 1 && (numofData - groupDataRowInRegion) < minimumCnt) { // 최소행 개수 적용
                    dataBandHeight = getBandHeightWithGroupField(dataBand, minimumCnt);
                    isMinimumRowCount = true;
                } else {
                    if (remainDataInRegion) {
                        dataBandHeight = getBandHeightWithGroupField(dataBand, numofData - groupDataRowInRegion);
                    } else {
                        dataBandHeight = getBandHeightWithGroupField(dataBand, numofData - 1);
                    }
                }
            } else {
                if (remainDataInRegion) {
                    dataBandHeight = getBandHeightWithGroupField(dataBand, numofData - groupDataRowInRegion);
                } else {
                    dataBandHeight = getBandHeightWithGroupField(dataBand, numofData - 1);
                }
            }

            $('#' + div_id).css({
                'width': dataBand.rectangle.width,
                'height': dataBandHeight,
            });

            inVisible(div_id, dataBand);

        } else { // 동적 테이블이 없을 때
            setWidthHeightInBand(div_id, dataBand);
        }
    } else {  // 그룹 헤더/풋터가 없는 경우
        if (isDynamicTable == true && dt != undefined) {
            var dataBandFooterHeight = 0;

            dataBandHeight = getAvaHeight(div_id, reportHeight);

            if (dataBand.childFooterBands !== null) { // 자식 풋터 밴드에서 재호출
                dataBandFooterHeight = getChildBandHeight(dataBand);
            }

            $('#' + div_id).css({
                'width': dataBand.rectangle.width,
                'height': dataBandHeight - dataBandFooterHeight,
            });
            if (Array.isArray(dataBand.controlList.anyType)) {
                dataBand.controlList.anyType.forEach(function (anyType) {
                    if (anyType._attributes['xsi:type'] == 'ControlDynamicTable' && anyType.Labels !== undefined) {
                        numofData = getNumOfDataInOnePageNonObject(dataBand, div_id);
                        if (dataBand.controlList.anyType.MinimumRowCount !== undefined) { // 최소 행 개수
                            var minimumRowCount = Number(dataBand.controlList.anyType.MinimumRowCount._text);
                            if ((dt.length - curDatarowInDataBand) < minimumRowCount && minimumRowCount != 1) {
                                numofData = minimumRowCount;
                                isMinimumRowCount = false;
                            }
                        }
                        if (dataBand.controlList.anyType.FixRowCount !== undefined) { // 최대 행 개수
                            var maximumRowCount = Number(dataBand.controlList.anyType.FixRowCount._text);

                            if (maximumRowCount != 0) {
                                if (dataBand.controlList.anyType.IsForceOverRow._text == 'true') { // 최대행 이후 데이터가 페이지 넘기기 일 때
                                    numofData = maximumRowCount;
                                    isMaximumRowCount = true;
                                }
                            }
                        }
                    }
                });
            } else {
                if (dataBand.controlList.anyType.Labels !== undefined) {
                    numofData = getNumOfDataInOnePageNonObject(dataBand, div_id);
                    if (dataBand.controlList.anyType.MinimumRowCount !== undefined) { // 최소 행 개수
                        var minimumRowCount = Number(dataBand.controlList.anyType.MinimumRowCount._text);
                        if ((dt.length - curDatarowInRegion) < minimumRowCount && minimumRowCount != 1) {
                            numofData = minimumRowCount;
                            isMinimumRowCount = true;
                        }
                    }
                    if (dataBand.controlList.anyType.FixRowCount !== undefined) { // 최대 행 개수
                        var maximumRowCount = Number(dataBand.controlList.anyType.FixRowCount._text);
                        if (maximumRowCount != 0) {
                            if (dataBand.controlList.anyType.IsForceOverRow._text == 'true') { // 최대행 이후 데이터가 페이지 넘기기 일 때
                                numofData = maximumRowCount;
                                isMaximumRowCount = true;
                            }
                        }
                    }
                }
            }
        } else { // 동적 테이블이 없을 때
            setWidthHeightInBand(div_id, band);
        }
    }
}

/***********************************************************
 기능 : JudgementControlList 이후에 필요한 작업들
 만든이 : 구영준
 * *********************************************************/
function afterjudgementControlListAction(band, div_id, layerName, reportHeight, dataBand, dt) {
    switch (band.attributes["xsi:type"]) {
        case 'BandData' :
            isMaximumRowCount = false;
            isMinimumRowCount = false;
            if (isRegion) { // 리전일 때
                if (groupFieldArrayInRegion.length > 0 && band.childHeaderBands !== null) {
                    if (isDynamicTable == true && dt != undefined) {
                        var dataCount = groupFieldArrayInRegion[groupFieldNumInRegion].length;
                        var groupRemainData = (dataCount - groupDataRowInRegion);

                        if (numofData > groupRemainData) { // 마지막 페이지
                            curDatarow += groupFieldArrayInRegion[groupFieldNumInRegion].length - 1;
                            curDatarowInRegion += groupFieldArrayInRegion[groupFieldNumInRegion].length - 1;
                            remainDataInRegion = false;
                        } else { //마지막 페이지가 아닌 경우
                            remainDataInRegion = true;
                            if (numofData > groupDataRowInRegion) {
                                groupDataRowInRegion += (numofData - groupDataRowInRegion);
                            } else {
                                groupDataRowInRegion += numofData - 1;
                            }
                        }
                    }
                } else { //그룹 필드가 아닐 경우
                    if (isDynamicTable == true && dt != undefined) {
                        curDatarowInRegion += numofData;
                        curDatarow += numofData;
                        if(curDatarowInRegion > dt.length) {
                            remainDataInRegion = false;
                        } else {
                            remainDataInRegion = true;
                        }
                        if (band.controlList.anyType.MinimumRowCount !== undefined) {
                            var minimumRowCount = Number(band.controlList.anyType.MinimumRowCount._text);
                            if (minimumRowCount != 1 && (dt.length - curDatarowInRegion) < minimumRowCount) {
                                numofData = minimumRowCount;
                            }
                        }
                    }
                }
            } else { // 리전이 아닐 때
                if (groupFieldArray.length > 0 && band.childHeaderBands !== null) {
                    if (isDynamicTable == true && dt != undefined) {
                        var dataCount = groupFieldArray[groupFieldNum].length;
                        var groupRemainData = (dataCount - groupDataRow);

                        if (numofData > groupRemainData) { // 마지막 페이지
                            curDatarow += groupFieldArray[groupFieldNum].length - 1;
                            curDatarowInDataBand += groupFieldArray[groupFieldNum].length - 1;
                            remainData = false;
                        } else { //마지막 페이지가 아닌 경우
                            remainData = true;
                            if (numofData > groupDataRow) {
                                groupDataRow += (numofData - groupDataRow);
                            } else {
                                groupDataRow += numofData - 1;
                            }
                        }
                    }
                } else { //그룹 필드가 아닐 경우
                    if (isDynamicTable == true && dt != undefined) {
                        curDatarowInDataBand += numofData;
                        curDatarow += numofData;
                        if(curDatarowInDataBand > dt.length) {
                            remainData = false;
                        } else {
                            true;
                        }
                        if (band.controlList.anyType.MinimumRowCount !== undefined) {
                            var minimumRowCount = Number(band.controlList.anyType.MinimumRowCount._text);
                            if (minimumRowCount != 1 && (dt.length - curDatarowInDataBand) < minimumRowCount) {
                                numofData = minimumRowCount;
                            }
                        }
                    }
                }
            }
            break;
        case 'BandGroupFooter' :
            if (isRegion) { // 리전일 때
                if (groupFieldArrayInRegion.length > 0) /*&& band.childHeaderBands !== null)*/ {
                    if (isDynamicTable == true && dt != undefined) {
                        var dataCount = groupFieldArrayInRegion[groupFieldNumInRegion].length;
                        var groupRemainData = (dataCount - groupDataRowInRegion);

                        if (numofData >= groupRemainData) { // 마지막 페이지
                            groupFieldNumInRegion++;
                            groupDataRowInRegion = 1;
                            isBandGroupHeader = false;
                        }
                    }
                }

                if (dt != undefined) {
                    if (curDatarowInRegion < dt.length) {
                        if (band.forceNewPage === 'true') { //페이지 넘기기

                        } else {
                            if (!Array.isArray(dataBand)) {
                                var tempDataBand = [];
                                tempDataBand.push(dataBand);
                                drawBand(tempDataBand, dataBand, layerName, reportHeight);
                            }
                        }
                    }
                }
            } else { // 리전이 아닐 때
                if (groupFieldArray.length > 0) /*&& band.childHeaderBands !== null)*/ {
                    if (isDynamicTable == true && dt != undefined) {
                        var dataCount = groupFieldArray[groupFieldNum].length;
                        var groupRemainData = (dataCount - groupDataRow);

                        if (numofData >= groupRemainData) { // 마지막 페이지
                            groupFieldNum++;
                            groupDataRow = 1;
                            isBandGroupHeader = false;
                        }
                    }
                }

                /**************************************************************************************
                 * 그룹 풋터 일 경우
                 *
                 * 페이지 넘기기가 true 면 그룹 풋터 밴드가 그려지고 페이지가 끝
                 *                 false면 데이터 밴드가 다시 그려짐
                 *
                 * 데이터 밴드가 다시 그려질 때,
                 * 현재 페이지에서 여유 공간 = 리포트 길이 = 그룹 풋터 밴드 상위의 밴드 길이 - 풋터 밴들 길이
                 *
                 * 최소 그룹데이터 길이 = 그룹헤더길이 + 동적테이블 title Height  + 동적테이블 value Height 길이
                 *
                 * 여유 공간이 최소 그룹데이터 길이보다 클 경우
                 * 다시 데이터 밴드 그림
                 *
                 * 만든 사람 : 구영준...
                 *
                 **************************************************************************************/
                if (dt != undefined) {
                    if (curDatarowInDataBand < dt.length) {
                        if (band.forceNewPage === 'true') { //페이지 넘기기

                        } else {
                            if (!Array.isArray(dataBand)) {
                                var tempDataBand = [];
                                tempDataBand.push(dataBand);
                                drawBand(tempDataBand, dataBand, layerName, reportHeight);
                            }
                        }
                    }
                }
            }
            break;
    }
}

/***********************************************************
 기능 : 그룹 헤더/풋터 밴드들의 inVisible 속성 구현
 만든이 : 구영준
 **********************************************************/
function inVisible(div_id, band) {
    if (band.invisible === 'true') {
        $('#' + div_id).css({
            'width': band.rectangle.width,
            'height': 0,
            'display': 'none'
        });

    }
}

/***********************************************************
 기능 : 밴드들의 Width와 Height inVisible 속성 구현
 만든이 : 구영준
 **********************************************************/
function setWidthHeightInBand(div_id, band) {
    $('#' + div_id).css({
        'width': band.rectangle.width,
        'height': band.rectangle.height,
    });
}


/***********************************************************
 기능 : 밴드들의 childHeaderBand를 그린다.
 만든이 : 안예솔
 ***********************************************************/
function drawChildHeaderBand(childBands, dataBand, layerName, reportHeight) {
    var childHeaderBandArray = new Array();

    childBands.forEach(function (childBand) {
        switch (childBand.attributes["xsi:type"]) {
            case 'BandGroupHeader' :
                if (isRegion) { // 리전일 때
                    if (!remainDataInRegion) {
                        if (!isBandGroupHeader) {
                            childHeaderBandArray.push(childBand);
                        }
                        isBandGroupHeader = true;
                    } else {
                        if (dataBand.fixPriorGroupHeader === 'true') { //그룹 헤더 고정
                            childHeaderBandArray.push(childBand);
                        }
                    }
                } else { // 리전이 아닐 때
                    if (!remainData) {
                        if (!isBandGroupHeader) {
                            childHeaderBandArray.push(childBand);
                        }
                        isBandGroupHeader = true;
                    } else {
                        if (dataBand.fixPriorGroupHeader === 'true') { //그룹 헤더 고정
                            childHeaderBandArray.push(childBand);
                        }
                    }
                }
                break;
            case 'BandDataHeader' : // 데이터 헤더 밴드
                if (dataBand.fixTitle == 'true') { // 데이터 헤더 밴드 고정 값이 '예'일 때
                    childHeaderBandArray.push(childBand); // 매 페이지마다 나와야 함
                } else { // 데이터 헤더 밴드 고정 값이 '아니오'일 때
                    if (reportPageCnt == 1) { // 첫 페이지만 나옴
                        childHeaderBandArray.push(childBand);
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
                            childHeaderBandArray.push(childBand);
                        }
                    } else { // 리전이 아닐 때
                        if (groupDataRow == 1) {
                            childHeaderBandArray.push(childBand);
                        }
                    }
                } else { // 그룹 헤더가 없을 때는 인쇄물의 첫 페이지에만 출력
                    if (reportPageCnt == 1) {
                        childHeaderBandArray.push(childBand);
                    }
                }

                break;
        }
    });
    drawBand(childHeaderBandArray, dataBand, layerName, reportHeight);
}

/***********************************************************
 기능 : 밴드들의 childFooterBand를 그린다.
 만든이 : 안예솔
 * *********************************************************/
function drawChildFooterBand(childBands, dataBand, layerName, reportHeight) {
    var childFooterBandArray = new Array();
    var dt = dataTable.DataSetName[dataBand.dataTableName];

    childBands.forEach(function (childBand) {
        switch (childBand.attributes["xsi:type"]) {
            case 'BandGroupFooter' :
                if (isRegion) { // 리전일 때
                    if (!remainDataInRegion) {
                        childFooterBandArray.push(childBand);
                    } else {
                        if (dataBand.fixPriorGroupFooter == 'true') { //그룻 풋터 고정
                            childFooterBandArray.push(childBand);
                        }
                    }
                } else {
                    if (!remainData) { // 리전이 아닐 때
                        childFooterBandArray.push(childBand);
                    } else {
                        if (dataBand.fixPriorGroupFooter == 'true') { //그룻 풋터 고정
                            childFooterBandArray.push(childBand);
                        }
                    }
                }
                break;
            case 'BandDataFooter' : // 모든 데이터 출력이 끝난 후에 출력
                if (dt == undefined) {
                    childFooterBandArray.push(childBand); // 매 페이지마다 나와야 함
                } else {
                    if (dataBand.fixTitle == 'true') { // 데이터 헤더 밴드 고정 값이 '예'일 때
                        childFooterBandArray.push(childBand); // 매 페이지마다 나와야 함
                    } else { // 데이터 헤더 밴드 고정 값이 '아니오'일 때
                        if(isRegion) { // 리전일 때
                            if (curDatarowInRegion > dt.length || isDynamicTable == false) { // 데이터 출력이 끝났을 때 나옴
                                childFooterBandArray.push(childBand);
                            }
                        } else { // 리전이 아닐 때
                            if (curDatarowInDataBand > dt.length || isDynamicTable == false) { // 데이터 출력이 끝났을 때 나옴
                                childFooterBandArray.push(childBand);
                            }
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
                    if (isRegion) { // 리전일 때
                        if (!remainDataInRegion) { // 출력할 그룹의 데이터가 남아있지 않을 때 O
                            childFooterBandArray.push(childBand);
                        }
                    } else { // 리전이 아닐 때
                        if (!remainData && !remainDataInRegion) { // 출력할 그룹의 데이터가 남아있지 않을 때 O
                            childFooterBandArray.push(childBand);
                        }
                    }
                } else { // 그룹 헤더가 없을 때는 인쇄물의 마지막 페이지에만 출력
                    if (isRegion) { // 리전일 때
                        if (curDatarowInRegion > dt.length) { // 데이터 출력이 끝났을 때 나옴
                            childFooterBandArray.push(childBand);
                            }
                        }
                    } else { // 리전이 아닐 때
                        if (!remainData && !remainDataInRegion) { // 출력할 그룹의 데이터가 남아있지 않을 때 O
                            childFooterBandArray.push(childBand);
                        }
                    }
                }
                break;
        }
    });
    drawBand(childFooterBandArray, dataBand, layerName, reportHeight);
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
                        // if (!remainDataInRegion) { // 데이터 출력이 끝났을 때 나옴
                        //     console.log(numofData);
                        //     childBandsHeight += Number(childBand.rectangle.height);
                        // }
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
