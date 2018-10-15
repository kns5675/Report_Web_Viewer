// 작성자 : 전형준
var bandNum = 1;
var footer_height = 0;
var footerHeightInRegion = 0;
var remainData = false;
var remainDataInRegion = false;
var numofData = 0;
var groupDataRow = 1;
var groupDataRowInRegion = 1;
var SubReport_Report_YN = false;
var SubReport_Report_Count = 1;
var SubReport_Report_Size;
var isMaximumRowCount = false;
var dynamicTableIsForceOverRow = true;
var isMinimumRowCount = false;
var isBandGroupHeader = false;


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
function drawBand(bands, layerName, reportHeight, parentBand) {
    var avaHeight = 0;
    var dt;

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
                    dt = dataTable.DataSetName[band.dataTableName];
                    // 180910 YeSol 추가
                    var controlLists = [];
                    controlLists.push(band.controlList.anyType); // dataBand의 controlList배열

                    isDynamicTable = false;
                    isFixedTable = false;
                    controlLists.forEach(function (controlList) {
                        if (controlList.length !== undefined) {
                            for (var i = 0; i < controlList.length; i++) {
                                if (controlList[i]._attributes['xsi:type'] == 'ControlDynamicTable') {
                                    isDynamicTable = true;
                                    numofData = 0;
                                }
                                if (controlList[i]._attributes['xsi:type'] == 'ControlFixedTable') {
                                    isFixedTable = true;
                                    numofData = 0;
                                }
                            }
                        } else {
                            if (controlList._attributes['xsi:type'] == 'ControlDynamicTable') {
                                isDynamicTable = true;
                                numofData = 0;
                            }
                            if (controlList._attributes['xsi:type'] == 'ControlFixedTable') {
                                isFixedTable = true;
                                numofData = 0;
                            }
                        }
                    });
                    break;
                case 'BandSummary' :
                    if (dt != undefined) {
                        if (band.isBottom == 'false') { // isBottom이 false면 맨 마지막 페이지에만 나옴
                            var curDataRowTemp;

                            if (isRegion) {
                                curDataRowTemp = curDatarowInRegion;
                            } else {
                                curDataRowTemp = curDatarowInDataBand
                            }
                            if (curDataRowTemp < dt.length && isDynamicTable == true) {
                                return false;
                            } else if (curDataRowTemp < dt.length && isFixedTable == true) {
                                return false;
                            }
                        }
                    }
                    break;
                case 'BandSubReport' :
                    return false;
                    break;
            }

            if (band.childHeaderBands !== null) { // 자식헤더밴드에서 재호출
                drawChildHeaderBand(band, layerName, reportHeight); // 자식 밴드를 그려주는 함수 호출
            }
            var div_id = 'band' + (bandNum++);

            // if (band.attributes["xsi:type"] !== "BandSubReport") {

            $('#' + layerName).append("<div id='" + div_id + "' class='Band " + band.attributes["xsi:type"] + "'>" + band.name + "</div>");
            if (isRegion) {
                $('#' + div_id).addClass('regionBand');
            }
            // $("#"+div_id).css('pointer-events', 'none');
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
                    if (getAvaHeight(div_id, reportHeight) < Number(band.rectangle.height)) {
                        $('#' + div_id).remove();
                        return true;
                    }
                    if (bands.length >= 1) {
                        if (isRegion) { // 리전일 때
                            getFooterHeightInRegion(bands, band);
                        } else { // 리전이 아닐 때
                            getFooterHeight(bands, band);
                        }
                    }
                    if (band.masterBandName) {
                        dt = joinDt(band, band.masterBandObj);
                    }else {
                        dt = dataTable.DataSetName[band.dataTableName];
                    }
                    if (isRegion) { // 리전일 때
                        drawBandDataInRegion(groupFieldArrayInRegion, band, layerName, reportHeight, parentBand, div_id, dt);
                    } else { // 리전이 아닐 때
                        drawBandData(groupFieldArray, band, layerName, reportHeight, parentBand, div_id, dt);
                    }
                    break;
                case 'BandDummyFooter' :
                    avaHeight = getAvaHeight(div_id, reportHeight);
                    if (avaHeight < Number(band.rectangle.height)) {
                        var remainFooterBandTemp;
                        if (isRegion) {
                            remainFooterBandTemp = remainFooterBandInRegion;
                        } else {
                            remainFooterBandTemp = remainFooterBand;
                        }

                        remainFooterBandTemp = (function (bands) {
                            var tempArr = [];
                            bands.forEach(function (band) {
                                band.parentBand = parentBand;
                                tempArr.push(band);
                            });
                            return tempArr;
                        }(bands));

                        if (isRegion) {
                            remainFooterBandInRegion = remainFooterBandTemp;
                        } else {
                            remainFooterBand = remainFooterBandTemp;
                        }

                        $('#' + div_id).remove();
                        return true;
                    }
                    setWidthHeightInBand(div_id, band);

                    break;
                case 'BandGroupFooter' :
                    avaHeight = getAvaHeight(div_id, reportHeight);
                    if (avaHeight < Number(band.rectangle.height)) {
                        band.parentBand = parentBand;
                        remainFooterBand.push(band);
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
                            if (curDatarowInDataBand > dt.length || isDynamicTable == false) { // 데이터 출력이 끝났을 때 나옴
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
                    if (!doneDataBand) {
                        if (band.masterBandName) {
                            dt = joinDt(band, band.masterBandObj);
                        } else {
                            dt = dataTable.DataSetName[band.dataTableName];
                        }
                        judgementControlList(band, div_id, numofData, dt); // 라벨을 그려줌
                        afterjudgementControlListAction(band, div_id, layerName, reportHeight, parentBand, dt);
                    }
                } else {
                    dt = dataTable.DataSetName[band.dataTableName];
                    judgementControlList(band, div_id, numofData); // 라벨을 그려줌
                    afterjudgementControlListAction(band, div_id, layerName, reportHeight, parentBand, dt);
                }
            }

            if (band.childFooterBands !== null) { // 자식 풋터 밴드에서 재호출
                drawChildFooterBand(band, layerName, reportHeight); // 자식 밴드를 그려주는 함수 호출
            }

            if (band.attributes["xsi:type"] === "BandData") {
                if (!band.masterBandName) {
                    dataBandInitialize(band, dt);
                }
                dynamicTableIsForceOverRow = true;
                tableLabelList = [];
            }
        }
    });
}

/***********************************************************
 기능 : 데이터 밴드 출력이 끝난 뒤에 데이터 밴드 출력 필요한 변수 초기화
 만든이 : 구영준
 * *********************************************************/
function dataBandInitialize(band, dt) {
    if (dt != undefined && curDatarowInDataBand >= dt.length) {
        // curDatarowInDataBand = 1;
        tableLabelList = [];
        completeDataBand.push(band.id);
        ingDataTableName = undefined;
        dynamicTableIsForceOverRow = true;
    }
}

/***********************************************************
 기능 : drawBand에서 Switch문 중 BandData에 해당하는 내용을 뽑아옴
 만든이 : 안예솔
 * *********************************************************/
function drawBandData(groupFieldArray, band, layerName, reportHeight, parentBand, div_id, dt) {
    var haveGroupHeaderBand = checkGroupHeader(band);
    if (haveGroupHeaderBand){
        var dataBandHeight = 0;
        var dynamicTable = undefined;
        if (isDynamicTable == true && dt != undefined) {
            avaHeight = getAvaHeight(div_id, reportHeight);
            numofData = getNumOfDataWithGroupField(band, avaHeight);
            if(Array.isArray(band.controlList.anyType)){
                band.controlList.anyType.forEach(function(controlList){
                    if(controlList._attributes["xsi:type"] == "ControlDynamicTable"){
                        dynamicTable = controlList;
                    }
                });
            }else{
                if(band.controlList.anyType._attributes["xsi:type"] == "ControlDynamicTable"){
                    dynamicTable = band.controlList;
                }
            }

            if (dynamicTable.FixRowCount !== undefined) { // 최대 행 개수
                var maximumRowCount = Number(dynamicTable.FixRowCount._text);
                if (maximumRowCount != 0) {
                    if ((numofData - groupDataRow) > maximumRowCount) {
                        if (dynamicTable.IsForceOverRow._text == 'true') { // 최대행 이후 데이터가 페이지 넘기기 일 때
                            numofData = maximumRowCount + groupDataRow;
                            isMaximumRowCount = true;
                        }else{
                            numofData = maximumRowCount + 1
                            dynamicTableIsForceOverRow = false;
                            annexPagerDataTableName.push(band.dataTableName);
                        }
                    }
                }
            }
            inVisible(div_id, band);

        } else if (isFixedTable == true && dt != undefined) {
            avaHeight = getAvaHeight(div_id, reportHeight);
            numofData = 1;
            setWidthHeightInBand(div_id, band);
            inVisible(div_id, band);
        } else { // 테이블이 없을 때
            setWidthHeightInBand(div_id, band);
            inVisible(div_id, band);
        }
    } else {  // 그룹 헤더/풋터가 없는 경우
        if (isDynamicTable == true && dt != undefined) {
            var dynamicTable = undefined;

            avaHeight = getAvaHeight(div_id, reportHeight);
            numofData = getNumOfDataInOnePageNonObject(band, avaHeight, dt);

            if (Array.isArray(band.controlList.anyType)) {
                band.controlList.anyType.forEach(function (controlList) {
                    if (controlList._attributes["xsi:type"] == "ControlDynamicTable") {
                        dynamicTable = controlList;
                    }
                });
            } else {
                if (band.controlList.anyType._attributes["xsi:type"] == "ControlDynamicTable") {
                    dynamicTable = band.controlList.anyType;
                }
            }
            if (dynamicTable.FixRowCount !== undefined) { // 최대 행 개수
                var maximumRowCount = Number(dynamicTable.FixRowCount._text);
                if (maximumRowCount != 0) {
                    if (numofData > maximumRowCount) {
                        if (dynamicTable.IsForceOverRow._text == 'true') { // 최대행 이후 데이터가 페이지 넘기기 일 때
                            numofData = maximumRowCount + 1;
                        } else { // 제거(별지출력)
                            dynamicTableIsForceOverRow = false;
                            annexPagerDataTableName.push(band.dataTableName);
                            numofData = maximumRowCount + 1;
                        }
                    }
                }
                if (dynamicTable.MinimumRowCount !== undefined) { // 최소 행 개수
                    var minimumRowCount = Number(dynamicTable.MinimumRowCount._text);
                    if ((dt.length - curDatarowInDataBand) < minimumRowCount /*&& minimumRowCount != 1*/) {
                        // numofData = minimumRowCount+1;
                        isMinimumRowCount = false;
                    }
                }
            }
        } else if (isFixedTable == false && isDynamicTable == false) { // 테이블이 없을 때
            setWidthHeightInBand(div_id, band);

        }else{
            numofData = 1;
            setWidthHeightInBand(div_id, band);
        }
    }
}

/***********************************************************
 기능 : DataTable을 Join하기 위한 함수이다.
 만든이 : 구영준, 안예솔
 * *********************************************************/
function joinDt(band, parentBand) {
    var groupFieldArrayTemp;
    var groupFieldNumTemp;
    if (isRegion) {
        groupFieldArrayTemp = groupFieldArrayInRegion;
        groupFieldNumTemp = groupFieldNumInRegion;
    } else {
        groupFieldArrayTemp = groupFieldArray;
        groupFieldNumTemp = groupFieldNum;
    }
    band.whereTerms = undefined;
    band.subBandFieldName = undefined;
    var masterString;
    var subBandString;
    var joinDataTable = [];
    var joinStrings = band.joinString.split('=');
    joinStrings.forEach(function (joinString) {
        joinString = joinString.trim();
        joinString = joinString.split('.');
        if (joinString.length > 1) {
            masterString = joinString;
        } else {
            subBandString = joinString;
            subBandString = subBandString[0].toUpperCase();
        }
    });
    var parentColumnName = masterString[1].toUpperCase();
    dataTable.DataSetName[parentBand.dataTableName].forEach(function (masterBandData) {
        for (keyInMasterBand in masterBandData) {
            if (parentColumnName == keyInMasterBand) { // 인사기본.no_emp에서 no_emp부분
                if (Array.isArray(dataTable.DataSetName[band.dataTableName])) {
                    dataTable.DataSetName[band.dataTableName].forEach(function (subBandData) {
                        for (keyInSubBand in subBandData) {
                            if (subBandString == keyInSubBand) {
                                if (masterBandData[keyInMasterBand]._text == subBandData[keyInSubBand]._text) {
                                    if (groupFieldArrayTemp !== undefined && subBandData[keyInSubBand]._text == groupFieldArrayTemp[groupFieldNumTemp - 1][0]) {
                                        band.whereTerms = groupFieldArrayTemp[groupFieldNumTemp - 1][0];
                                        band.subBandFieldName = subBandString;
                                    } else if (groupFieldArrayTemp === undefined) {
                                        band.whereTerms = subBandData[keyInSubBand]._text;
                                        band.subBandFieldName = subBandString;
                                    }
                                }
                            }
                        }
                    });
                } else {
                    for (keyInSubBand in dataTable.DataSetName[band.dataTableName]) {
                        if (subBandString == keyInSubBand) {
                            if (masterBandData[keyInMasterBand]._text == dataTable.DataSetName[band.dataTableName][keyInSubBand]._text) {
                                if (groupFieldArrayTemp !== undefined && dataTable.DataSetName[band.dataTableName][keyInSubBand]._text == groupFieldArrayTemp[groupFieldNumTemp - 1][0]) {
                                    band.whereTerms = groupFieldArrayTemp[groupFieldNumTemp - 1][0];
                                    band.subBandFieldName = subBandString;
                                } else if (groupFieldArrayTemp === undefined) {
                                    band.whereTerms = dataTable.DataSetName[band.dataTableName][keyInSubBand]._text;
                                    band.subBandFieldName = subBandString;
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    dt = dataTable.DataSetName[band.dataTableName];
    if (Array.isArray(dt)) {
        dt.forEach(function (data) {
            for (key in data) {
                if (band.subBandFieldName == key && band.whereTerms == data[key]._text) {
                    joinDataTable.push(data);
                }
            }
        });
    } else {
        for (key in dt) {
            if (band.subBandFieldName == key && band.whereTerms == dt[key]._text) {
                joinDataTable.push(dt);
            }
        }
    }

    if (isRegion) {
        groupFieldArrayInRegion = groupFieldArrayTemp;
        groupFieldNumInRegion = groupFieldNumTemp;
    } else {
        groupFieldArray = groupFieldArrayTemp;
        groupFieldNum = groupFieldNumTemp;
    }
    return joinDataTable;
}


/***********************************************************
 기능 : drawBand에서 Switch문 중 BandData에 해당하는 내용을 뽑아옴 (리전)
 만든이 : 안예솔
 * *********************************************************/
function drawBandDataInRegion(groupFieldArrayInRegion, band, layerName, reportHeight, parentBand, div_id, dt) {
    if (groupFieldArrayInRegion.length > 0 && band.childHeaderBands !== null) { //그룹 필드가 있는 경우
        var dataBandHeight = 0;
        if (isDynamicTable == true && dt != undefined) {
            avaHeight = getAvaHeight(div_id, reportHeight);
            numofData = getNumOfDataWithGroupField(band, avaHeight);
            if (band.controlList.anyType.FixRowCount !== undefined) { // 최대 행 개수
                var maximumRowCount = Number(band.controlList.anyType.FixRowCount._text);
                if (maximumRowCount != 0) {
                    if ((numofData - groupDataRowInRegion) > maximumRowCount) {
                        if (band.controlList.anyType.IsForceOverRow._text == 'true') { // 최대행 이후 데이터가 페이지 넘기기 일 때
                            numofData = maximumRowCount + 1;
                            isMaximumRowCount = true;
                        }
                    }
                }
            }
            if (band.controlList.anyType.MinimumRowCount !== undefined) {
                var minimumCnt = Number(band.controlList.anyType.MinimumRowCount._text);
                if (minimumCnt != 1 && (numofData - groupDataRowInRegion) < minimumCnt) { // 최소행 개수 적용
                    dataBandHeight = getBandHeightOfDataBand(band, minimumCnt);
                    isMinimumRowCount = true;
                } else {
                    if (remainDataInRegion) {
                        dataBandHeight = getBandHeightOfDataBand(band, numofData - groupDataRowInRegion);
                    } else {
                        dataBandHeight = getBandHeightOfDataBand(band, numofData - 1);
                    }
                }
            } else {
                if (remainDataInRegion) {
                    dataBandHeight = getBandHeightOfDataBand(band, numofData - groupDataRowInRegion);
                } else {
                    dataBandHeight = getBandHeightOfDataBand(band, numofData - 1);
                }
            }
            $('#' + div_id).css({
                'width': band.rectangle.width,
                'height': dataBandHeight,
            });
            inVisible(div_id, band);
        } else if (isFixedTable == true && dt != undefined) {
            avaHeight = getAvaHeight(div_id, reportHeight);
            numofData = getNumOfDataWithGroupFieldInFixedTable(band, avaHeight);
        } else { // 동적 테이블이 없을 때
            setWidthHeightInBand(div_id, band);
        }
    } else {  // 그룹 헤더/풋터가 없는 경우
        if (isDynamicTable == true && dt != undefined) {
            var dataBandFooterHeight = 0;

            dataBandHeight = getAvaHeight(div_id, reportHeight);

            if (band.childFooterBands !== null) { // 자식 풋터 밴드에서 재호출
                dataBandFooterHeight = getChildBandHeight(band);
            }

            $('#' + div_id).css({
                'width': band.rectangle.width,
                'height': dataBandHeight - dataBandFooterHeight,
            });
            if (Array.isArray(band.controlList.anyType)) {
                band.controlList.anyType.forEach(function (anyType) {
                    if (anyType._attributes['xsi:type'] == 'ControlDynamicTable' && anyType.Labels !== undefined) {
                        numofData = getNumOfDataInOnePageNonObject(band, div_id);
                        if (band.controlList.anyType.MinimumRowCount !== undefined) { // 최소 행 개수
                            var minimumRowCount = Number(band.controlList.anyType.MinimumRowCount._text);
                            if ((dt.length - curDatarowInDataBand) < minimumRowCount && minimumRowCount != 1) {
                                numofData = minimumRowCount;
                                isMinimumRowCount = false;
                            }
                        }
                        if (band.controlList.anyType.FixRowCount !== undefined) { // 최대 행 개수
                            var maximumRowCount = Number(band.controlList.anyType.FixRowCount._text);

                            if (maximumRowCount != 0) {
                                if (band.controlList.anyType.IsForceOverRow._text == 'true') { // 최대행 이후 데이터가 페이지 넘기기 일 때
                                    numofData = maximumRowCount;
                                    isMaximumRowCount = true;
                                }
                            }
                        }
                    }
                });
            } else {
                if (band.controlList.anyType.Labels !== undefined) {
                    numofData = getNumOfDataInOnePageNonObject(band, div_id);
                    if (band.controlList.anyType.MinimumRowCount !== undefined) { // 최소 행 개수
                        var minimumRowCount = Number(band.controlList.anyType.MinimumRowCount._text);
                        if ((dt.length - curDatarowInRegion) < minimumRowCount && minimumRowCount != 1) {
                            numofData = minimumRowCount;
                            isMinimumRowCount = true;
                        }
                    }
                    if (band.controlList.anyType.FixRowCount !== undefined) { // 최대 행 개수
                        var maximumRowCount = Number(band.controlList.anyType.FixRowCount._text);
                        if (maximumRowCount != 0) {
                            if (band.controlList.anyType.IsForceOverRow._text == 'true') { // 최대행 이후 데이터가 페이지 넘기기 일 때
                                numofData = maximumRowCount;
                                isMaximumRowCount = true;
                            }
                        }
                    }
                }
            }
        } else if (isFixedTable == true && dt != undefined) { // 고정 테이블
            var dataBandFooterHeight = 0;
            avaHeight = getAvaHeight(div_id, reportHeight);
            numofData = getNumOfDataInOnePageNonObjectInFixedTable(band, avaHeight);
            dataBandHeight = (Number(band.rectangle.height._text)) * numofData;

            if (band.childFooterBands !== null) { // 자식 풋터 밴드에서 재호출
                dataBandFooterHeight = getChildBandHeight(band);
            }
            var divId = $('#' + div_id);
            divId.css({
                'width': band.rectangle.width,
                'height': dataBandHeight
            });

            if (numofData > 1) {
                for (var i = 0; i < numofData; i++) {
                    var fixedTableDivId = div_id + 'fixedTable' + (curDatarow + i);
                    divId.append("<div id='" + fixedTableDivId + "' class='Band " + band.attributes["xsi:type"] + "'>" + band.name + "</div>");
                    var fixedTableDiv = $('#' + fixedTableDivId);
                    fixedTableDiv.css({ // 만약에 top 을 줘야한다면  Number(band.Rectangle.Height._text) * i 를 top 값으로 주면 될 것 같음!
                        'width': band.rectangle.width,
                        'height': Number(band.rectangle.height._text),
                        'position': 'absolute',
                        'background-color': 'gray' // 잠시 넣었음 지워야햄
                    });
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
function afterjudgementControlListAction(band, div_id, layerName, reportHeight, parentBand, dt) {
    switch (band.attributes["xsi:type"]) {
        case 'BandData' :
            isMaximumRowCount = false;
            isMinimumRowCount = false;
            var groupFieldArrayTemp;
            var groupFieldNumTemp;
            var remainDataTemp;
            var groupDataRowTemp;
            var curDataRowTemp;
            if (isRegion) { // 리전일 때
                groupFieldArrayTemp = groupFieldArrayInRegion;
                groupFieldNumTemp = groupFieldNumInRegion;
                remainDataTemp = remainDataInRegion;
                groupDataRowTemp = groupDataRowInRegion;
                curDataRowTemp = curDatarowInRegion;
            } else {
                groupFieldArrayTemp = groupFieldArray;
                groupFieldNumTemp = groupFieldNum;
                remainDataTemp = remainData;
                groupDataRowTemp = groupDataRow;
                curDataRowTemp = curDatarowInDataBand;
            }
            if (groupFieldArrayTemp.length > 0 && band.childHeaderBands !== null) {
                if (isDynamicTable == true && dt != undefined && numofData > 0) { //그룹일 경우
                    var dataCount = groupFieldArrayTemp[groupFieldNumTemp].length;
                    var groupRemainData = (dataCount - groupDataRowTemp);
                    if (numofData - groupDataRowTemp >= groupRemainData) { // 마지막 페이지
                        var minRowCnt = $('#' + layerName).find('.minRow').length;
                        curDatarow += dataCount + minRowCnt;
                        curDataRowTemp += groupFieldArrayTemp[groupFieldNumTemp].length - 1;
                        remainDataTemp = false;
                        ingDataTableName = band.dataTableName;
                    } else { //마지막 페이지가 아닌 경우
                        if(!dynamicTableIsForceOverRow){
                            remainDataTemp = false;
                        }else{
                            remainDataTemp = true;
                        }
                        if (numofData > groupDataRowTemp) {
                            groupDataRowTemp += (numofData - groupDataRowTemp);
                        } else {
                            groupDataRowTemp += numofData - 1;
                        }
                        ingDataTableName = band.dataTableName;
                    }

                } else if (isFixedTable == true && dt != undefined && numofData > 0) {
                    curDataRowTemp += numofData;
                    ingDataTableName = band.dataTableName;
                }
            } else { //그룹 필드가 아닐 경우
                if (isDynamicTable == true && dt != undefined && numofData > 0) {
                    if (!band.masterBandName) {
                        curDataRowTemp += numofData;
                        ingDataTableName = band.dataTableName;
                    }

                    curDatarow += numofData;

                    if (band.controlList.anyType.MinimumRowCount !== undefined) {
                        var minimumRowCount = Number(band.controlList.anyType.MinimumRowCount._text);
                        if (minimumRowCount != 1 && (dt.length - curDataRowTemp) < minimumRowCount) {
                            numofData = minimumRowCount;
                        }
                    }
                } else if (isFixedTable == true && dt != undefined && numofData > 0) {
                    curDataRowTemp += numofData;
                    curDatarow += numofData;
                    if (curDataRowTemp >= dt.length) {
                        remainDataTemp = false;
                        curDataRowTemp = 0;
                        tableLabelList = [];
                        completeDataBand.push(band.id);
                    } else {
                        remainDataTemp = true;
                    }
                    if (band.controlList.anyType.MinimumRowCount !== undefined) {
                        var minimumRowCount = Number(band.controlList.anyType.MinimumRowCount._text);
                        if (minimumRowCount != 1 && (dt.length - curDataRowTemp) < minimumRowCount) {
                            numofData = minimumRowCount;
                        }
                    }
                }
            }

            if (isRegion) { // 리전일 때
                groupFieldArrayInRegion = groupFieldArrayTemp;
                groupFieldNumInRegion = groupFieldNumTemp;
                remainDataInRegion = remainDataTemp;
                groupDataRowInRegion = groupDataRowTemp;
                curDatarowInRegion = curDataRowTemp;
            } else {
                groupFieldArray = groupFieldArrayTemp;
                groupFieldNum = groupFieldNumTemp;
                remainData = remainDataTemp;
                groupDataRow = groupDataRowTemp;
                curDatarowInDataBand = curDataRowTemp;
            }
            break;
        case 'BandGroupFooter' :
            var groupFieldArrayTemp;
            var groupFieldNumTemp;
            var remainDataTemp;
            var groupDataRowTemp;
            var curDataRowTemp;
            if (isRegion) { // 리전일 때
                groupFieldArrayTemp = groupFieldArrayInRegion;
                groupFieldNumTemp = groupFieldNumInRegion;
                remainDataTemp = remainDataInRegion;
                groupDataRowTemp = groupDataRowInRegion;
                curDataRowTemp = curDatarowInRegion;
            } else {
                groupFieldArrayTemp = groupFieldArray;
                groupFieldNumTemp = groupFieldNum;
                remainDataTemp = remainData;
                groupDataRowTemp = groupDataRow;
                curDataRowTemp = curDatarowInDataBand;
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
            parentBand = (parentBand === undefined ? band.parentBand : parentBand);
            if (dt != undefined) {
                if (checkGroupHeader(band.parentBand)) {
                    if (isDynamicTable == true && dt != undefined && numofData > 0) {
                        var dataCount = groupFieldArrayTemp[groupFieldNumTemp].length;
                        var groupRemainData = (dataCount - groupDataRowTemp);
                        if (groupDataRowTemp >= numofData) {
                            if (numofData >= groupRemainData) { // 마지막 페이지
                                groupFieldNumTemp++;
                                groupDataRowTemp = 1;
                                isBandGroupHeader = false;
                                if (groupFieldNumTemp == groupFieldArrayTemp.length) {
                                    ingDataTableName = undefined;
                                }
                            } else { //첫 페이지 or 중간 페이지
                                ingDataTableName = band.dataTableName;
                            }
                        } else {
                            if (numofData + groupDataRowTemp >= dataCount) { // 마지막 페이지
                                groupFieldNumTemp++;
                                groupDataRowTemp = 1;
                                isBandGroupHeader = false;
                                if (groupFieldNumTemp == groupFieldArrayTemp.length) {
                                    ingDataTableName = undefined;
                                }
                            } else { //마지막 페이지가 아닌 경우
                                ingDataTableName = band.dataTableName;
                            }
                        }
                    } else if (isFixedTable == true && dt != undefined && numofData > 0) {
                        groupDataRowTemp += numofData;
                        if (groupFieldArrayTemp.length - 1 == groupFieldNumTemp) {
                            groupFieldNumTemp++;
                        } else {
                            if (groupFieldArrayTemp[groupFieldNumTemp].length - 1 <= groupDataRowTemp) {
                                groupFieldNumTemp++;
                                groupDataRowTemp = 0;
                                isBandGroupHeader = false;
                            } else {
                            }
                        }
                    }
                }
                if (curDataRowTemp < dt.length) {
                    if (band.forceNewPage === 'true') { //페이지 넘기기

                    } else {
                        if (getAvaHeight(div_id, reportHeight) - footer_height > Number(parentBand.childHeaderBands[0].rectangle.height)) {
                            parentBand = (function (arg) {
                                var band = [];
                                band.push(arg);
                                return band;
                            })(parentBand);
                            drawBand(parentBand, layerName, reportHeight, band);
                        }
                    }
                }
            }

            if (isRegion) { // 리전일 때
                groupFieldArrayInRegion = groupFieldArrayTemp;
                groupFieldNumInRegion = groupFieldNumTemp;
                remainDataInRegion = remainDataTemp;
                groupDataRowInRegion = groupDataRowTemp;
                curDatarowInRegion = curDataRowTemp;
            } else {
                groupFieldArray = groupFieldArrayTemp;
                groupFieldNum = groupFieldNumTemp;
                remainData = remainDataTemp;
                groupDataRow = groupDataRowTemp;
                curDatarowInDataBand = curDataRowTemp;
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
        'overflow': 'hidden'
    });
}

/***********************************************************
 기능 : 밴드들의 childHeaderBand를 그린다.
 만든이 : 안예솔
 ***********************************************************/
function drawChildHeaderBand(band, layerName, reportHeight) {
    var childHeaderBandArray = new Array();
    var childBands = band.childHeaderBands;

    childBands.forEach(function (childBand) {
        switch (childBand.attributes["xsi:type"]) {
            case 'BandGroupHeader' :
                var remainDataTemp;
                if (isRegion) {
                    remainDataTemp = remainDataInRegion;
                } else {
                    remainDataTemp = remainData;
                }

                if (!remainDataTemp) {
                    if (!isBandGroupHeader) {
                        childHeaderBandArray.push(childBand);
                    }
                    isBandGroupHeader = true;
                } else {
                    if (band.fixPriorGroupHeader === 'true') { //그룹 헤더 고정
                        childHeaderBandArray.push(childBand);
                    }
                }
                break;
            case 'BandDataHeader' : // 데이터 헤더 밴드
                if (band.fixTitle == 'true') { // 데이터 헤더 밴드 고정 값이 '예'일 때
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
                    if (isRegion) {
                        if (groupDataRowInRegion == 1) {
                            childHeaderBandArray.push(childBand);
                        }
                    } else {
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
    drawBand(childHeaderBandArray, layerName, reportHeight);
}

/***********************************************************
 기능 : 밴드들의 childFooterBand를 그린다.
 만든이 : 안예솔
 * *********************************************************/
function drawChildFooterBand(band, layerName, reportHeight) {
    var childFooterBandArray = new Array();
    var childBands = band.childFooterBands;
    var dt = dataTable.DataSetName[band.dataTableName];
    childBands.forEach(function (childBand) {
        switch (childBand.attributes["xsi:type"]) {
            case 'BandGroupFooter' :
                var remainDataTemp;

                if (isRegion) {
                    remainDataTemp = remainDataInRegion;
                } else {
                    remainDataTemp = remainData;
                }
                if (!remainDataTemp) { // 리전이 아닐 때
                    childFooterBandArray.push(childBand);
                } else {
                    if (band.fixPriorGroupFooter == 'true') { //그룻 풋터 고정
                        childFooterBandArray.push(childBand);
                    }
                }
                break;
            case 'BandDataFooter' : // 모든 데이터 출력이 끝난 후에 출력
                if (dt == undefined) {
                    childFooterBandArray.push(childBand); // 매 페이지마다 나와야 함
                } else {
                    var curDataRowTemp;

                    if (isRegion) {
                        curDataRowTemp = curDatarowInRegion;
                    } else {
                        curDataRowTemp = curDatarow;
                    }

                    if (curDataRowTemp >= dt.length || (isDynamicTable == false)) { // 데이터 출력이 끝났을 때 나옴
                        childFooterBandArray.push(childBand);
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
                    } else { // 리전이 아닐 때
                        if (!remainData && !remainDataInRegion) { // 출력할 그룹의 데이터가 남아있지 않을 때 O
                            if (groupFieldArrayInRegion != undefined && groupFieldArrayInRegion.length != 0) {
                                if ((groupFieldArrayInRegion.length - 1) == groupFieldNumInRegion) {
                                    childFooterBandArray.push(childBand);
                                }
                            } else {
                            }
                        }
                    }
                }
                break;
        }
    });
    drawBand(childFooterBandArray, layerName, reportHeight, band);
}

