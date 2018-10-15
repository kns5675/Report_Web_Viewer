
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

function getBandDataHeight(band, dynamicTableHeight) {
    var controlLists = band.controlList.anyType;
    // var bandHeight = Number(band.rectangle.height);
    var tableSpacing = 0;
    var labels = [];
    var labelHeight = 0;
    var valueHeight = 0;
    var titleBorderTopThickness = 0;
    var titleBorderBottomThickness = 0;
    var valueBorderBottomThickness = 0;
    var isDynamicTable = false;
    var dynamicTableY = 0;
    dynamicTableHeight = dynamicTableHeight.split('px');
    if (controlLists.length > 1) {
        controlLists.forEach(function (controlList) {
            if (controlList._attributes["xsi:type"] == "ControlDynamicTable") {
                isDynamicTable = true;
                labels.push(controlList);
                if (controlList.Rectangle.Y !== undefined) {
                    tableSpacing = Number(controlList.Rectangle.Y._text);
                    dynamicTableY = Number(controlList.Rectangle.Y._text);
                } else {
                    tableSpacing = 0;
                }
            }else if (controlList._attributes["xsi:type"] == "ControlFixedTable") {
                if(controlList.Rectangle.Y != undefined){
                    if(controlList.Labels.TableLabel !== undefined){
                        if (dynamicTableY < Number(controlList.Rectangle.Y._text)){
                            isDynamicTable = false;
                        }
                    }
                }
            }
        });
    } else {
        if (controlLists._attributes["xsi:type"] == "ControlDynamicTable") {
            isDynamicTable = true;
            labels.push(controlLists);
            if (controlLists.Rectangle.Y !== undefined) {
                tableSpacing = Number(controlLists.Rectangle.Y._text);
            }else if (controlLists._attributes["xsi:type"] == "ControlFixedTable") {
                isDynamicTable = false;
            }
        }
    }
    labels.forEach(function (label) {
        var tableLabels = label.Labels.TableLabel;

        tableLabels.forEach(function (tableLabel) {
            tableLabel = new DynamicTableLabel(tableLabel, i);
            if (tableLabel._attributes == "DynamicTableTitleLabel") {
                if(labelHeight < Number(tableLabel.rectangle.height)){
                    labelHeight = Number(tableLabel.rectangle.height);
                }
                var labelBottom = Number(tableLabel.borderThickness.bottom);
                var labelTop = Number(tableLabel.borderThickness.top);

                if (titleBorderBottomThickness < Number(tableLabel.borderThickness.bottom))
                    titleBorderBottomThickness = labelBottom;

                if (titleBorderTopThickness < Number(tableLabel.borderThickness.top))
                    titleBorderTopThickness = labelTop;
            } else {
                if(valueHeight < Number(tableLabel.rectangle.height)){
                    valueHeight = Number(tableLabel.rectangle.height);
                }
                if (Number(tableLabel.borderThickness) === undefined) {
                    valueBorderBottomThickness = 0;
                } else {
                    var labelBottom = Number(tableLabel.borderThickness.bottom);
                    if (valueBorderBottomThickness < Number(tableLabel.borderThickness.bottom))
                        valueBorderBottomThickness = labelBottom;
                }
            }
        });
    });

    //ToDo 테이블 두께에 따라 1px 정도씩 오차가 생김
    if (isDynamicTable) {
        return tableSpacing + Number(dynamicTableHeight[0]) + 1;
    } else {
        return band.rectangle.height;
    }
}


/********************************************************************************************
 기능 :  데이터 밴드 길이 계산
 1. 데이터밴드가 데이터에 따라 동적으로 늘어나는 길이를 계산
 2. 데이터 밴드 길이 + 라벨 두께 + TableValueLabel 길이 + 한 페이지에 들어가는 데이터 갯수
 만든이 : 구영준

 수정 : 동적 테이블 일 경우  -> 동적 테이블.y + 라벨 두께 +  + TableTitleLabel 길이 + TableValueLabel 길이 + 한 페이지에 들어가는 데이터 갯수
 고정 테이블 일 경우  -> DataBand.rectangle.height 길이
 만든이 : 구영준
 날짜 : 2018-10-01
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
    var isDynamicTable = false;
    var dynamicTableY = 0;
    if (controlLists.length > 1) {
        controlLists.forEach(function (controlList) {
            if (controlList._attributes["xsi:type"] == "ControlDynamicTable") {
                isDynamicTable = true;
                labels.push(controlList);
                if (controlList.Rectangle.Y !== undefined) {
                    tableSpacing = Number(controlList.Rectangle.Y._text);
                    dynamicTableY = Number(controlList.Rectangle.Y._text);
                } else {
                    tableSpacing = 0;
                }
            } else if (controlList._attributes["xsi:type"] == "ControlFixedTable") {
                isDynamicTable = false;
            }else if (controlList._attributes["xsi:type"] == "ControlFixedTable") {
                if(controlList.Rectangle.Y != undefined){
                    if (dynamicTableY < Number(controlList.Rectangle.Y._text)){
                        isDynamicTable = false;
                    }
                }
            }
        });
    } else {
        if (controlLists._attributes["xsi:type"] == "ControlDynamicTable") {
            isDynamicTable = true;
            labels.push(controlLists);
            if (controlLists.Rectangle.Y !== undefined) {
                tableSpacing = Number(controlLists.Rectangle.Y._text);
            } else if (controlLists._attributes["xsi:type"] == "ControlFixedTable") {
                isDynamicTable = false;
            }
        }
    }
    labels.forEach(function (label) {
        var tableLabels = label.Labels.TableLabel;

        tableLabels.forEach(function (tableLabel) {
            tableLabel = new DynamicTableLabel(tableLabel, i);
            if (tableLabel._attributes == "DynamicTableTitleLabel") {
                if(labelHeight < Number(tableLabel.rectangle.height)){
                    labelHeight = Number(tableLabel.rectangle.height);
                }
                var labelBottom = Number(tableLabel.borderThickness.bottom);
                var labelTop = Number(tableLabel.borderThickness.top);

                if (titleBorderBottomThickness < Number(tableLabel.borderThickness.bottom))
                    titleBorderBottomThickness = labelBottom;

                if (titleBorderTopThickness < Number(tableLabel.borderThickness.top))
                    titleBorderTopThickness = labelTop;
            } else {
                if(valueHeight < Number(tableLabel.rectangle.height)){
                    valueHeight = Number(tableLabel.rectangle.height);
                }
                if (Number(tableLabel.borderThickness) === undefined) {
                    valueBorderBottomThickness = 0;
                } else {
                    var labelBottom = Number(tableLabel.borderThickness.bottom);
                    if (valueBorderBottomThickness < labelBottom) {
                        valueBorderBottomThickness = labelBottom;
                    }
                }
            }
        });
    });

    allLabelBorderThickness = valueBorderBottomThickness * numOfData + titleBorderBottomThickness + titleBorderTopThickness;
    //ToDo 테이블 두께에 따라 1px 정도씩 오차가 생김
    if (isDynamicTable) {
        return Math.round(tableSpacing + labelHeight + (valueHeight * numOfData) + allLabelBorderThickness);
    } else {
        return band.rectangle.height;
    }
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
function getNumOfDataInOnePageNonObject(band, avaHeight, dt) {
    // var dt = dataTable.DataSetName[band.dataTableName];
    var tableSpacing = 0;
    var tableLabels;
    var dynamicTable;
    var titleHeight = 0;
    var valueHeight = 0;
    var dtLength = dt == undefined ? 0 : dt.length;

    if (dtLength == 0) {
        return Number(band.minimumRowCount);
    }

    if (typeof avaHeight == 'string') {
        avaHeight = $('#' + avaHeight).height();
    } else if (typeof avaHeight == 'number') {
        avaHeight = avaHeight;
    }

    if (Array.isArray(band.controlList.anyType)) {
        band.controlList.anyType.forEach(function (anyType) {
            if (anyType._attributes['xsi:type'] === 'ControlDynamicTable') {
                dynamicTable = anyType;
            }
        });
    } else {
        dynamicTable = band.controlList.anyType;
    }

    tableLabels = dynamicTable.Labels.TableLabel;
    if (dynamicTable.Rectangle.Y !== undefined) {
        tableSpacing = Number(dynamicTable.Rectangle.Y._text);
    }

    tableLabels.forEach(function(tableLabel){
        if(tableLabel._attributes["xsi:type"] == "DynamicTableTitleLabel"){
            if(titleHeight < Number(tableLabel.Rectangle.Height._text)){
                titleHeight = Number(tableLabel.Rectangle.Height._text);
            }
        }else{
            if(valueHeight < Number(tableLabel.Rectangle.Height._text)){
                valueHeight = Number(tableLabel.Rectangle.Height._text);
            }
        }
    });

    var numofData = Math.ceil((avaHeight - titleHeight - tableSpacing) / valueHeight);

    if (numofData > dtLength || dynamicTable.IsForceOverRow._text == 'false') {
        return dtLength;
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
