/***********************************************************
 기능 : 그룹 헤더/풋터 일 경우 데이터 밴드 길이 계산
 1. 그룹 헤더/풋터 일 경우 그룹 데이터의 길이 만큼의 데이터 길이
 2. th 길이 + td 길이 * 데이터 개수
 만든이 : 구영준
 * *********************************************************/
function getNumOfDataWithGroupField(band, avaHeight) {
    var tableSpacing = 0;
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
        var labels = dynamicTable.Labels.TableLabel;

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
// TODO 미구현된 부분임!!!
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
