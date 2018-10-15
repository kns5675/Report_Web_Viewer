/***********************************************************
 기능 : 그룹 헤더/풋터 일 경우 데이터 밴드 길이 계산
 1. 그룹 헤더/풋터 일 경우 그룹 데이터의 길이 만큼의 데이터 길이
 2. th 길이 + td 길이 * 데이터 개수
 만든이 : 구영준
 * *********************************************************/
function getNumOfDataWithGroupField(band, avaHeight) {
    if(groupFieldArray.length == 0){
        return Number(band.minimumRowCount);
    }

    var tableSpacing = 0;
    var titleHeight = 0;
    var valueHeight = 0;
    var dynamicTable;
    if (Array.isArray(band.controlList.anyType)) {
        band.controlList.anyType.forEach(function (anyType) {
            if (anyType._attributes['xsi:type'] === 'ControlDynamicTable') {
                dynamicTable = anyType;
            }
        });
    } else {
        dynamicTable = band.controlList.anyType;
    }
    if (isRegion) { // 리전일 때
        if (dynamicTable.Rectangle.Y !== undefined) {
            tableSpacing = Number(dynamicTable.Rectangle.Y._text);
        }
        var dataCount = groupFieldArrayInRegion[groupFieldNumInRegion].length;
        var tableLabels = dynamicTable.Labels.TableLabel;

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

        var avaDataInPage = Math.ceil((avaHeight - titleHeight - tableSpacing) / valueHeight);
        var groupRemainData = (dataCount - groupDataRowInRegion);


        if (avaDataInPage - groupDataRowInRegion > groupRemainData || groupDataRowInRegion >= avaDataInPage) { // 마지막 페이지
            return dataCount;
        } else { //마지막 페이지가 아닌 경우
            return avaDataInPage;
        }
    } else { // 리전이 아닐 때
        if (dynamicTable.Rectangle.Y !== undefined) {
            tableSpacing = Number(dynamicTable.Rectangle.Y._text);
        }
        var dataCount = groupFieldArray[groupFieldNum].length;
        var labels = dynamicTable.Labels.TableLabel;

        var titleHeight = Number(labels[0].Rectangle.Height._text);
        var valueHeight = Number(labels[labels.length - 1].Rectangle.Height._text);
        var bandGroupFooterHeight = 0;

        band.childFooterBands.forEach(function (child) {
            bandGroupFooterHeight = child.rectangle.height;
        });

        var avaDataInPage = Math.ceil((avaHeight - titleHeight - tableSpacing) / valueHeight);
        var groupRemainData = (dataCount - groupDataRow);

        if(groupDataRow >= avaDataInPage){
            if (avaDataInPage >= groupRemainData) { // 마지막 페이지
                return dataCount;
            }else if(groupDataRow == 1){
                return avaDataInPage
            } else { //마지막 페이지가 아닌 경우
                return avaDataInPage + groupDataRow;
            }
        }else{
            if (avaDataInPage + groupDataRow > dataCount) { // 마지막 페이지
                return dataCount;
            }else if(groupDataRow == 1){
                return avaDataInPage
            } else { //중간페이지
                return avaDataInPage + groupDataRow;
            }
        }
    }
}

/***********************************************************
 기능 : 고정 테이블에서 그룹 필드가 있을 때의 구현
 만든이 : 안예솔
 * *********************************************************/
function getNumOfDataWithGroupFieldInFixedTable(band, avaHeight) {
    var tableSpacing = 0;
    if (isRegion) { // 리전일 때
        if (band.controlList.anyType.Rectangle.Y !== undefined) {
            tableSpacing = Number(band.controlList.anyType.Rectangle.Y._text);
        }
        var dataCount = groupFieldArrayInRegion[groupFieldNumInRegion].length;
        var labels = band.controlList.anyType.Labels.TableLabel;

        // var titleHeight = Number(labels[0].Rectangle.Height._text);
        // var valueHeight = Number(labels[labels.length - 1].Rectangle.Height._text);

        var fixedTableHeight = Number();

        var bandGroupFooterHeight = 0;

        band.childFooterBands.forEach(function (child) {
            bandGroupFooterHeight = child.rectangle.height;
        });

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

        var numofData = Math.floor((avaHeight - titleHeight - tableSpacing) / valueHeight) + 1;
        var groupRemainData = (dataCount - groupDataRow);

        if (numofData - groupDataRow > groupRemainData || groupDataRow >= numofData) { // 마지막 페이지
            return dataCount;
        } else { //마지막 페이지가 아닌 경우
            return numofData;
        }
    }
}
