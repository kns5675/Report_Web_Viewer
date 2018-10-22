/******************************************************************
 기능 : DynamicTable(동적 테이블)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔

 수정 : DynamicTableValueLabel에 데이터 바인딩
 Date : 2018-08-20
 From 구영준

 수정 : DynamicTable의 th, td tag에 클래스 추가
 Date : 2018-08-24
 From 전형준

 수정 : 테이블의 크기 조정, 위치 이동, 내용 수정 추가.
 Date : 2018-08-27
 From hagdung-i
 ******************************************************************/
function drawingDynamicTable(table, tableLabel, divId, numOfData, band, dt) {
    var div = $('#' + divId);
    div.append('<div id = "Table' + tableNum + '"></div>');
    var divIdTable = $('#Table' + tableNum);
    divIdTable.append('<div id="dynamicTable_resizing_div_packing' + dynamicTableNum + '"></div>');
    var dynamicTable_resizing_div_packing = $("#dynamicTable_resizing_div_packing" + dynamicTableNum);
    dynamicTable_resizing_div_packing.append('<div id="dynamicTable_resizing_div' + dynamicTableNum + '"></div>');
    var dynamicTable_resizing_div = $("#dynamicTable_resizing_div" + dynamicTableNum);
    var temp_table_class = table.id.substring(0, 4); // 임시로 table을 인식하기 위한 번호 - 전형준
    dynamicTable_resizing_div.append('<table id="dynamicTable' + dynamicTableNum + '" class="table dynamicTable table-' + temp_table_class + '"></table>');
    // dynamicTable_resizing_div.addClass("NormalLabel_scope");
    div.css('position', 'relative');

    dynamicTable_resizing_div.css({
        'position': 'absolute',
        'left': table.rectangle.x + 'px',
        'top': table.rectangle.y + 'px',
    });

    var tableId = $('#dynamicTable' + dynamicTableNum);
    Lock_Check_Table(table, dynamicTable_resizing_div, tableId, div);
    // table_format_check(table, dynamicTable_resizing_div, tableId, div);

    /***************************************************************************************************************
     * 아래의 css를 지우면
     * 동적 테이블이 동적 테이블 안에서만 생김
     ****************************************************************************************************************/
    tableId.css({
        'width': table.rectangle.width + 'px',
        'height': table.rectangle.height + 'px'
    });

    // tableId.append('<tr id = "dynamicTitleLabel' + dynamicTitleLabelNum + '"></tr>');
    var header_Name_Number = 1;
    if (Array.isArray(tableLabel)) {
        tableLabel.forEach(function (label) {
            switch (label._attributes) {
                case "DynamicTableTitleLabel" :
                    drawingDynamicTableTitleLabel(label, header_Name_Number, band);
                    header_Name_Number++;
                    break;
                case "DynamicTableValueLabel" :
                    drawingDynamicTableValueLabel(label, dt, tableId, numOfData, table, band);
                    break;
            }
        });
        tableId.css({
            // 'border': '1px solid red',
            'border-collapse': 'collapse',
            'text-align': 'center',
        });

        if(!dynamicTableIsForceOverRow){
            dynamicTable_resizing_div_packing.append('<table><tr id =   "annexedPaperOutput' + annexPaperOutputNum + '"></tr></table>');
            var $trId = '#annexedPaperOutput' + annexPaperOutputNum++;
            var annextrId = $($trId);
            annextrId.append('<td id = "tableValueLabelNum' + tableValueLabelNum + '">'+ '별지출력' +'</td>');
            annextrId.css({
                'position' : 'absolute',
                'width': '100px',
                'height': '35px',
                'z-index' : '999',
                'left' : table.rectangle.width/2 - 50 + 'px',
                'top' : $('#dynamicTable' + dynamicTableNum).height() + 'px',
            });
            var annextdId = $('#tableValueLabelNum' + tableValueLabelNum++);
            annextdId.css({
                'width': '100px',
                'height': '35px',
                'position' : 'absolute',
                'z-index' : '999',
                'border' : '1px solid',
                'background-color' : 'white',
                'text-align' : 'center',
                'vertical-align' : 'middle',
                'font-size': 'x-large'
            });
            dynamicTableAnnexedPaperOutPut += numOfData;
        }

        tableNum++;
        dynamicTableNum++;
        thNum++;
        dynamicTitleLabelNum++;
        dynamicValueLabelNum++;

        var dataBandHeight = getBandDataHeight(band, tableId.css('height'));
        $('#' + divId).css({
            'width': band.rectangle.width,
            'height': dataBandHeight,
            'overflow': 'hidden'
        });
    }
}

/**********************************************************************************************************************
 기능 : 그룹 밴드 여부를 판단하는 함수
 만든이 : 구영준
 Data : 2018-10-15
 ********************************************************************************************************************/
function checkGroupHeader(band){
    var check = false;
    if(band.childHeaderBands != undefined && groupFieldArray.length > 0){
        if(Array.isArray(band.childHeaderBands)){
            band.childHeaderBands.forEach(function(childHeaderBand){
                if(childHeaderBand.attributes["xsi:type"] == "BandGroupHeader"){
                    check = true;
                }
            });
        }else{
            if(!(band.childHeaderBands == null)) {
                if (band.childHeaderBands.attributes["xsi:type"] == "BandGroupHeader") {
                    check = true;
                }
            }
        }
    }
    return check;
}
/******************************************************************
 기능 : DynamicTableValueLabel(동적 테이블 밸류 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 구영준

 수정 : 숫자 표시 형식 추가, 테이블 데이터 그러주는 방식 수정.
 Date : 2018-08-29
 From hagdung-i
 *******************************************************************/
function drawingDynamicTableValueLabel(label, dt, tableId, numOfData, table, band) {
    var haveGroupHeaderBand = checkGroupHeader(band);
    if (dt == undefined || dt.length == 0) { //without DataTable in DataBand
        drawingDynamicTableValueLabelWithOutDataTable(label, tableId, band);
    } else if (isRegion == true) {
        if(!haveGroupHeaderBand){ //리전 인 경우, 그룹 필드가 없는 경우
            drawingDynamicTableValueLabelWithoutGroupFieldArrayWithRegion(label, dt, tableId, numOfData, table, band);
        } else { //리전인 경우, 그룹필드가 있는 경우
            drawingDynamicTableValueLabelWithGroupFieldArrayWithRegion(label, dt, tableId, numOfData, table, band);
        }
    } else {
        if(!dynamicTableIsForceOverRow) {
            drawingDynamicTableAnnexedPaperOutPut(label, tableId, numOfData);
        }else{
            if(!haveGroupHeaderBand){
                drawingDynamicTableValueLabelWithoutGroupFieldArray(label, dt, tableId, numOfData, table, band, dt);
            } else {
                drawingDynamicTableValueLabelWithGroupFieldArray(label, dt, tableId, numOfData, table, band, dt);
            }
        }
    }
}

/**************************************************************************************
 기능 : 별지 출력시에 빈 칸의 데이터 바인딩
 만든이 : 구영준
 **************************************************************************************/
function drawingDynamicTableAnnexedPaperOutPut(label, tableId, numOfData) {
    for(var i=1; i<numOfData; i++) {
        var rowNum = dynamicTableAnnexedPaperOutPut + i;

        var valueTrId = $("#drawingDynamicTableAnnexedPaperOutPut" + rowNum );
        if (valueTrId.length < 1) {
            tableId.append('<tr id = "drawingDynamicTableAnnexedPaperOutPut' + rowNum + '"></tr>');
        }
        valueTrId = $("#drawingDynamicTableAnnexedPaperOutPut" + rowNum );

        valueTrId.append('<td id = "tableValueLabelNum' + tableValueLabelNum + '"></td>');

        var tdId = $('#tableValueLabelNum' + tableValueLabelNum++);
        tdId.append(label.text);
        tdId.addClass('Label');
        tdId.addClass(label._attributes);
        setCssInTable(label, tdId);
    }
}

/**************************************************************************************
 기능 : 동적테이블이에 데이터 테이블이 없을 경우 데이터 바인딩 없이 ValueLabel을 그려줌
 만든이 : 구영준
 **************************************************************************************/
function drawingDynamicTableValueLabelWithOutDataTable(label, tableId, band) {
    tableId.append('<tr id = "dynamicValueLabelWithOutDataTable' + dynamicValueLabelNum + '"></tr>');
    var valueTrId = $("#dynamicValueLabelWithOutDataTable" + dynamicValueLabelNum);
    // if(valueTrId.length < 1){
    //     tableId.append('<tr id = "dynamicValueLabelWithOutDataTable' + dynamicValueLabelNum + '"></tr>');
    // }
    valueTrId.append('<td id = "tableValueLabelNum' + tableValueLabelNum + '"></td>');
    valueTrId.css({
        'width': label.rectangle.width,
        'height': label.rectangle.height
    });
    var tdId = $('#tableValueLabelNum' + tableValueLabelNum++);
    setCssInTable(label, tdId);

    tdId.append(label.text);
    tdId.addClass('Label');
    tdId.addClass(label._attributes);
    // drd_javascript(label, tdId, label.startBindScript);

}

/******************************************************************
 기능 : DynamicTableTitleLabel(동적 테이블 타이틀 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 구영준

 수정 : 테이블 id 값 한글 생성되는 부분 수정.
 Date : 2018-08-28
 From hagdung-i

 수정 : TitleLabel 그려주는 함수 key값과 비교 없이 출력
 Date : 2018-09-18
 From 구영준
 *******************************************************************/
function drawingDynamicTableTitleLabel(label, header_Name_Number, band) {
    var tableId = $('#dynamicTable' + dynamicTableNum);

    var tr = document.createElement('tr');
    var trId = document.getElementById('dynamicTitleLabel' + dynamicTitleLabelNum);
    tr.id = "dynamicTitleLabel" + dynamicTitleLabelNum;
    if(trId == null){
        tableId.append(tr);
    }
    // tableId.append('<tr id = "dynamicTitleLabel' + dynamicTitleLabelNum + '"></tr>');

    var titleTrId = document.getElementById('dynamicTitleLabel' + dynamicTitleLabelNum);
    var th = document.createElement("th");
    var thId = 'DynamicTableTitleLabel' + header_Name_Number + '_View_Page_Number' + thNum;
    var className = "DynamicTableTitleLabel"+ header_Name_Number;
    var p = document.createElement("p");
    var pId = 'title_P_tag' + thNum;
    th.id = thId;
    th.className = className;
    th.className = 'Label DynamicTableHeader';
    th.className = label._attributes;

    if (label.dataType === 'ParameterLabel') {
        paramTable.NewDataSet.Table1.forEach(function (paramData) {

            if (label.parameterName == paramData.Key._text) {
                label.text = paramData.Value._text;
            }
        });
    }
    var table_reform = table_format_check(data, thId, label.text, label);

    titleTrId.appendChild(th);

    p.id = pId;
    p.innerHTML = table_reform;
    p.style.margin = "0px";
    th.appendChild(p);

    setCssInTableDomObject(label, th);

    if(label.editable !== "false"){
        th.className = "Editable";
    }
    table_column_controller(thId, titleTrId, label);
}


/**************************************************************************************
 기능 : GroupFieldArray가 없을 경우
 DynamicTableValueLabel(동적 테이블 밸류 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 구영준
 **************************************************************************************/
function drawingDynamicTableValueLabelWithoutGroupFieldArray(label, dt, tableId, numofData, table, band) {
    var tempCurDataRow = curDatarow;
    var temp = curDatarowInDataBand;

    if (band.masterBandName) {
        temp = 0;
    }
    var rowLength = numofData + temp; //한 페이지에 마지막으로 출력해야할 row
    for (var j = temp; j < rowLength; j++) {
        var data = dt[j];
        var minimumRow = false;
        var valueTrId = $("#dynamicValueLabel" + tempCurDataRow);
        if (valueTrId.length < 1) {
            tableId.append('<tr id = "dynamicValueLabel' + tempCurDataRow + '"></tr>');
        }
        if ((j >= dt.length) && table.minimumRowCount !== undefined) { // 최소행 개수
            if (table.minimumRowCount != 1) { // 최소행 개수 1이 기본 값임
                data = dt[1];
                minimumRow = true;
            }
        }
        if (label.dataType === 'ParameterLabel') {
            paramTable.NewDataSet.Table1.forEach(function (paramData) {
                if (label.parameterName == paramData.Key._text) {
                    label.text = paramData.Value._text;
                }
            });
            thId.append('<p id="value_P_tag' + tableValueLabelNum + '">' + label.text + '</p>');
            var valueTrId = $('#dynamicValueLabel' + tempCurDataRow);
            var tdId = 'tableValueLabelNum' + tableValueLabelNum++;
            var table_reform = table_format_check(data, valueTrId, label.text, label);
            var key = label.parameterName;
            if (!minimumRow) {  //td의 label 값을 p태그에 묶음.
                valueTrId.append('<td id = "' + tdId + '" class="' + key + ' Label ' + label._attributes + ' ' + label.dataType + '"><p id="value_P_tag' + tableValueLabelNum + '" style="margin: 0px;">' + table_reform + '</p></td>');
            } else { // 최소행 개수
                valueTrId.append('<td id = "' + tdId + '" class="' + key + ' Label ' + label._attributes + ' ' + label.dataType + '"></td>');
            }
            valueTrId.css({
                'width': label.rectangle.width,
                'height': label.rectangle.height
            });

            var tdId = $('#' + key);
            setCssInTable(label, tdId);

            // drd_javascript(label, tdId, label.startBindScript);
            tempCurDataRow++;
        } else {
            var isData = false;
            for (var key in data) {
                if (label.fieldName == key) {
                    isData = true;
                    var valueTrId = $('#dynamicValueLabel' + tempCurDataRow);
                    var key_data = data[key]._text;
                    var table_reform = table_format_check(data, valueTrId, key_data, label);
                    var tdId = 'tableValueLabelNum' + tableValueLabelNum++;
                    if (!minimumRow) {
                        if (label.labelTextType == 'Number' && label.format != undefined) { //td의 label 값을 p태그에 묶음.
                            valueTrId.append(
                                '<td id = "' + tdId + '" class="' + key + ' Label ' + label._attributes + ' ' + label.dataType + ' ' + "MoneySosu" + '">' +
                                    '<p id="value_P_tag' + tableValueLabelNum + '" style="margin: 0px;">' + table_reform + '</p>' +
                                '</td>'
                            );
                            isData = true;
                        } else {
                            valueTrId.append(
                                '<td id = "' + tdId + '" class="' + key + ' Label ' + label._attributes + ' ' + label.dataType + '">' +
                                    '<p id="value_P_tag' + tableValueLabelNum + '" style="margin: 0px; white-space: nowrap;">' + table_reform + '</p>' +
                                '</td>'
                            );
                            isData = true;
                        }
                    } else { // 최소행 개수
                        valueTrId.append('<td id = "' + tdId + '" class="' + key + ' Label ' + label._attributes + ' ' + label.dataType + '"></td>');
                        isData = true;
                    }
                    valueTrId.css({
                        'width': label.rectangle.width,
                        'height': label.rectangle.height
                    });

                    if (label.dataType == 'GroupLabel' && j == numOfData - 1 && label.grouppingRule == 'Merge') { // 그룹 라벨
                        var i = 0;
                        var tableValueLabelNum2 = tableValueLabelNum - 1;

                        for (i; i < j - groupDataRow; i++) {
                            var groupLabel = $('#tableValueLabelNum' + (tableValueLabelNum2 - i));
                            var priorGroupLabel = $('#tableValueLabelNum' + (tableValueLabelNum2 - (i + 1)));

                            if ((groupLabel.attr('class') == priorGroupLabel.attr('class')) && groupLabel.text() == priorGroupLabel.text()) {
                                groupLabelNum++;
                                groupLabel.remove();
                                if (groupLabelNum == (j - groupDataRow + 1)) {
                                    priorGroupLabel.attr('rowspan', groupLabelNum);
                                }
                            } else {
                                if (groupLabelNum != 1) {
                                    groupLabel.attr('rowspan', groupLabelNum);
                                    groupLabelNum = 1;
                                }
                            }
                        }
                    }
                    var tdId = $('#' + tdId);
                    setCssInTable(label, tdId);
                }
            }

            if(!isData){  // Label은 있지만 데이터가 없을 때
                var tdId = 'tableValueLabelNum' + tableValueLabelNum++;
                valueTrId.append(
                    '<td id = "' + tdId + '" class="' + label.fieldName + ' Label ' + label._attributes + ' ' + label.dataType + '"></td>'
                );
                var tdId = $('#' + tdId);
                setCssInTable(label, tdId);
            }
            // var td_inner_p_tag_width =
            //     tdId.find('p') === "undefined" ? undefined : stringToNumberByPx(tdId.find('p').css('width'));
            // if(td_inner_p_tag_width !== undefined && Number(label.rectangle.width)
            //     < (td_inner_p_tag_width)
            // ){
            //
            // }


            tempCurDataRow++;
        }
    }
}

/**************************************************************************************
 기능 : GroupFieldArray가 있을 경우
 DynamicTableValueLabel(동적 테이블 밸류 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 구영준
 **************************************************************************************/
function drawingDynamicTableValueLabelWithGroupFieldArray(label, dt, tableId, numOfData, table, band) {
    var minimumRow = false;
    var data = groupFieldArray[groupFieldNum];
    if (table.minimumRowCount !== undefined && isMinimumRowCount == true) {
        var minimumCnt = Number(table.minimumRowCount);
        if (minimumCnt != 1 && (numOfData - groupDataRow) < minimumCnt) { // 최소행 개수 적용
            numofData = numOfData + minimumCnt - (numOfData - groupDataRow);
            minimumRow = true;
        }
    }
    var groupLabelNum = 1;
    for (var j = groupDataRow; j < numofData; j++) {
        var temp = j;
        var rowNum = curDatarow + j;
        if (minimumRow && data[j] === undefined) {
            temp = data.length - 1;
            rowNum += 'min';

        }
         var $trId = '#dynamicValueLabel' + rowNum;
        var valueTrId = $($trId);

        if (valueTrId.length < 1) {
            tableId.append('<tr id =   "dynamicValueLabel' + rowNum + '"></tr>');
        }
        // TODO 수정 해야할 부분이 있을 것 같음
        switch (label.dataType) {
            case 'ParameterLabel':
                paramTable.NewDataSet.Table1.forEach(function (paramData) {
                    if (label.parameterName == paramData.Key._text) {
                        label.text = paramData.Value._text;
                    }
                });
                var tdId = 'tableValueLabelNum' + tableValueLabelNum++;
                var key = label.parameterName;
                var table_reform = table_format_check(data, valueTrId, label.text, label);
                if (!minimumRow) {
                    valueTrId.append('<td id = "' + tdId + '" class="' + key + ' Label ' + label._attributes + ' ' + label.dataType + '"><p id="value_P_tag' + tableValueLabelNum + '" style="margin: 0px;">' + table_reform + '</p></td>');
                } else { // 최소행 개수
                    valueTrId.append('<td id = "' + tdId + '" class="' + key + ' Label ' + label._attributes + ' ' + label.dataType + '"><p id="value_P_tag' + tableValueLabelNum + '" style="margin: 0px;">' + label.text + '</p></td>');
                    valueTrId.addClass('minRow');
                }
                tdId = $('#' + tdId);
                setCssInTable(label, tdId);
                break;
            case 'NormalLabel':
                var tdId = 'tableValueLabelNum' + tableValueLabelNum++;
                var labelText = label.text == undefined ? '' : label.text;
                var table_reform = table_format_check(data, valueTrId, labelText, label);
                valueTrId.append(
                    '<td id = "' + tdId + '" class="' + label.fieldName + ' Label ' + label._attributes + ' ' + label.dataType + '"><p id="value_P_tag' + tableValueLabelNum + '" style="margin: 0px;">' + table_reform + '</p></td>'
                );
                tdId = $('#' + tdId);
                setCssInTable(label, tdId);
                break;
            case "DataLabel":
                var isData = false; //Label과 DataTable Data값을 비교하는 변수
                for (var key in data[temp]) {
                    valueTrId = $($trId);
                    if (label.fieldName == key) {
                        isData = true;
                        var key_data = data[temp][key]._text;
                        var table_reform = table_format_check(data, valueTrId, key_data, label);
                        var tdId = 'tableValueLabelNum' + tableValueLabelNum++;
                        if (minimumRow && (j >= data.length)) {
                            valueTrId.append(
                                '<td id = "' + tdId + '" class="' + key + ' Label ' + label._attributes + ' ' + label.dataType + '"></td>'
                            );
                            valueTrId.addClass('minRow');
                        } else {
                            if (label.labelTextType == 'Number' && label.format != undefined) {
                                valueTrId.append(
                                    '<td id = "' + tdId + '" class="' + key + ' Label ' + label._attributes + ' ' + label.dataType + ' ' + "MoneySosu" + '"><p id="value_P_tag' + tableValueLabelNum + '" style="margin: 0px;">' + table_reform + '</p></td>'
                                );
                            } else {
                                valueTrId.append(
                                    '<td id = "' + tdId + '" class="' + key + ' Label ' + label._attributes + ' ' + label.dataType + '"><p id="value_P_tag' + tableValueLabelNum + '" style="margin: 0px;">' + table_reform + '</p></td>'
                                );
                            }
                        }
                        if (label.dataType == 'GroupLabel' && j == numOfData - 1 && label.grouppingRule == 'Merge') { // 그룹 라벨
                            var i = 0;
                            var tableValueLabelNum2 = tableValueLabelNum - 1;

                            for (i; i <= j - groupDataRow; i++) {
                                var groupLabel = $('#tableValueLabelNum' + (tableValueLabelNum2 - i));
                                var priorGroupLabel = $('#tableValueLabelNum' + (tableValueLabelNum2 - (i + 1)));

                                if ((groupLabel.attr('class') == priorGroupLabel.attr('class')) && groupLabel.text() == priorGroupLabel.text()) {
                                    groupLabelNum++;
                                    groupLabel.remove();
                                    if (groupLabelNum == (j - groupDataRow + 1)) {
                                        priorGroupLabel.attr('rowspan', groupLabelNum);
                                    }
                                } else {
                                    if (groupLabelNum != 1) {
                                        groupLabel.attr('rowspan', groupLabelNum);
                                        groupLabelNum = 1;
                                    }
                                }
                            }
                        }
                        var tdId = $('#' + tdId);
                        setCssInTable(label, tdId, table_reform);


                    }
                }
                if (!isData) {  // Label은 있지만 데이터가 없을 때
                    var tdId = 'tableValueLabelNum' + tableValueLabelNum++;
                    valueTrId.append(
                        '<td id = "' + tdId + '" class="' + label.fieldName + ' Label ' + label._attributes + ' ' + label.dataType + '"></td>'
                    );
                    tdId = $('#' + tdId);
                    setCssInTable(label, tdId);
                }
                break;
        }
    }
}


/**************************************************************************************
 기능 : 리전에서 GroupFieldArrayInRegion이 있을 경우
 DynamicTableValueLabel(동적 테이블 밸류 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 **************************************************************************************/
function drawingDynamicTableValueLabelWithGroupFieldArrayWithRegion(label, dt, tableId, numOfData, table, band) {
    var minimumRow = false;
    var data = groupFieldArrayInRegion[groupFieldNumInRegion];
    if (table.minimumRowCount !== undefined && isMinimumRowCount == true) {
        var minimumCnt = Number(table.minimumRowCount);
        if (minimumCnt != 1 && (numOfData - groupDataRowInRegion) < minimumCnt) { // 최소행 개수 적용
            numOfData = numOfData + minimumCnt - (numOfData - groupDataRowInRegion);
            minimumRow = true;
        }
    }
    var groupLabelNum = 1;
    for (var j = groupDataRowInRegion; j < numOfData; j++) {
        var temp = j;

        var rowNum = curDatarow + j;
        if (minimumRow && data[j] === undefined) {
             temp = data.length - 1;
            rowNum += 'min';
        }

        var $trId = '#dynamicValueLabel' + rowNum;

        var valueTrId = $($trId);

        if (valueTrId.length < 1) {
            tableId.append('<tr id =   "dynamicValueLabel' + rowNum + '"></tr>');
            if (minimumRow && data[j] === undefined) {
                $('#dynamicValueLabel' + rowNum).addClass('minRow');
            }
        }

        if (label.dataType === 'ParameterLabel') {
            paramTable.NewDataSet.Table1.forEach(function (paramData) {
                if (label.parameterName == paramData.Key._text) {
                    label.text = paramData.Value._text;
                }
            });
            var tdId = 'tableValueLabelNum' + tableValueLabelNum++;
            var key = label.parameterName;
            if (!minimumRow) {
                valueTrId.append('<td id = "' + tdId + '" class="' + key + ' Label ' + label._attributes + ' ' + label.dataType + '">' + label.text + '</td>');
            } else { // 최소행 개수
                valueTrId.append('<td id = "' + tdId + '" class="' + key + ' Label ' + label._attributes + ' ' + label.dataType + '"></td>');
            }
            valueTrId.css({
                'width': label.rectangle.width,
                'height': label.rectangle.height
            });

            var tdId = $('#' + tdId);
            setCssInTable(label, tdId);
        } else {
            var isData = false;
            for (var key in data[temp]) {
                valueTrId = $($trId);
                if (label.fieldName == key) {
                    isData = true;
                    var key_data = data[temp][key]._text;
                    var table_reform = table_format_check(data, valueTrId, key_data, label);

                    var tdId = 'tableValueLabelNum' + tableValueLabelNum++;
                    if (minimumRow && (j >= data.length)) {
                        valueTrId.append(
                            '<td id = "' + tdId + '" class="' + key + ' Label' + label._attributes + ' ' + label.dataType + '"></td>'
                        );
                    } else {
                        if (label.labelTextType == 'Number' && label.format != undefined) {
                            valueTrId.append(
                                '<td id = "' + tdId + '" class="' + key + ' Label ' + label._attributes + ' ' + label.dataType + ' ' + "MoneySosu" + '">' + table_reform + '</td>'
                            );
                        } else {
                            valueTrId.append(
                                '<td id = "' + tdId + '" class="' + key + ' Label ' + label._attributes + ' ' + label.dataType + '">' + table_reform + '</td>'
                            );
                        }
                    }
                    valueTrId.css({
                        'width': label.rectangle.width,
                        'height': label.rectangle.height,

                    });
                    if (label.dataType == 'GroupLabel' && j == numOfData - 1 && label.grouppingRule == 'Merge') { // 그룹 라벨
                        var i = 0;
                        var tableValueLabelNum2 = tableValueLabelNum - 1;

                        for (i; i <= j - groupDataRow; i++) {
                            var groupLabel = $('#tableValueLabelNum' + (tableValueLabelNum2 - i));
                            var priorGroupLabel = $('#tableValueLabelNum' + (tableValueLabelNum2 - (i + 1)));

                            if ((groupLabel.attr('class') == priorGroupLabel.attr('class')) && groupLabel.text() == priorGroupLabel.text()) {
                                groupLabelNum++;
                                groupLabel.remove();
                                if (groupLabelNum == (j - groupDataRow + 1)) {
                                    priorGroupLabel.attr('rowspan', groupLabelNum);
                                }
                            } else {
                                if (groupLabelNum != 1) {
                                    groupLabel.attr('rowspan', groupLabelNum);
                                    groupLabelNum = 1;
                                }
                            }
                        }
                    }
                    var tdId = $('#' + tdId);
                    setCssInTable(label, tdId);
                }
            }
            if(!isData){  // Label은 있지만 데이터가 없을 때
                var tdId = 'tableValueLabelNum' + tableValueLabelNum++;
                valueTrId.append(
                    '<td id = "' + tdId + '" class="' + label.fieldName + ' Label ' + label._attributes + ' ' + label.dataType + '"></td>'
                );
                var tdId = $('#' + tdId);
                setCssInTable(label, tdId);
            }
        }
    }
}

/**************************************************************************************
 기능 : 리전 안에 GroupFieldArrayInRegion이 없을 경우
 DynamicTableValueLabel(동적 테이블 밸류 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 **************************************************************************************/
function drawingDynamicTableValueLabelWithoutGroupFieldArrayWithRegion(label, dt, tableId, numOfData, table, band) {
    var rowLength = curDatarowInRegion + numOfData; //한 페이지에 마지막으로 출력해야할 row
    var tempCurDataRow = curDatarow;
    for (var j = curDatarowInRegion; j < rowLength; j++) {
        var data = dt[j];

        var minimumRow = false;
        var valueTrId = $("#dynamicValueLabel" + tempCurDataRow);
        if (valueTrId.length < 1) {
            tableId.append('<tr id = "dynamicValueLabel' + tempCurDataRow + '"></tr>');
        }
        if ((j >= dt.length) && table.minimumRowCount !== undefined) { // 최소행 개수
            if (table.minimumRowCount != 1) { // 최소행 개수 1이 기본 값임
                data = dt[j - table.minimumRowCount];
                minimumRow = true;
            }
        }
        if (label.dataType === 'ParameterLabel') {
            paramTable.NewDataSet.Table1.forEach(function (paramData) {
                if (label.parameterName == paramData.Key._text) {
                    label.text = paramData.Value._text;
                }
            });
            var valueTrId = $('#dynamicValueLabel' + tempCurDataRow);
            var tdId = 'tableValueLabelNum' + tableValueLabelNum++;
            var key = label.parameterName;
            if (!minimumRow) {
                valueTrId.append('<td id = "' + tdId + '" class="' + key + ' Label ' + label._attributes + ' ' + label.dataType + '">' + label.text + '</td>');
            } else { // 최소행 개수
                valueTrId.append('<td id = "' + tdId + '" class="' + key + ' Label ' + label._attributes + ' ' + label.dataType + '"></td>');
            }
            valueTrId.css({
                'width': label.rectangle.width,
                'height': label.rectangle.height
            });
            var td = $('#' + tdId);
            setCssInTable(label, td);
            tempCurDataRow++;
        } else {
            var isData = false;
            for (var key in data) {
                if (label.fieldName == key) {
                    isData = true;
                    var valueTrId = $('#dynamicValueLabel' + tempCurDataRow);
                    var key_data = data[key]._text;
                    var table_reform = table_format_check(data, valueTrId, key_data, table);
                    var tdId = 'tableValueLabelNum' + tableValueLabelNum++;
                    if (!minimumRow) {
                        if (label.labelTextType == 'Number' && label.format != undefined) {
                            valueTrId.append('<td id = "' + tdId + '" class="' + key + ' Label ' + label._attributes + ' ' + label.dataType + ' ' + "MoneySosu" + '">' + table_reform + '</td>');
                        } else {
                            valueTrId.append('<td id = "' + tdId + '" class="' + key + ' Label ' + label._attributes + ' ' + label.dataType + '">' + table_reform + '</td>');
                        }
                    } else { // 최소행 개수
                        valueTrId.append('<td id = "' + tdId + '" class="' + key + ' Label ' + label._attributes + ' ' + label.dataType + '"></td>');
                    }
                    valueTrId.css({
                        'width': label.rectangle.width,
                        'height': label.rectangle.height
                    });

                    if (label.dataType == 'GroupLabel' && j == numOfData - 1 && label.grouppingRule == 'Merge') { // 그룹 라벨
                        var i = 0;
                        var tableValueLabelNum2 = tableValueLabelNum - 1;

                        for (i; i < j - groupDataRow; i++) {
                            var groupLabel = $('#tableValueLabelNum' + (tableValueLabelNum2 - i));
                            var priorGroupLabel = $('#tableValueLabelNum' + (tableValueLabelNum2 - (i + 1)));

                            if ((groupLabel.attr('class') == priorGroupLabel.attr('class')) && groupLabel.text() == priorGroupLabel.text()) {
                                groupLabelNum++;
                                groupLabel.remove();
                                if (groupLabelNum == (j - groupDataRow + 1)) {
                                    priorGroupLabel.attr('rowspan', groupLabelNum);
                                }
                            } else {
                                if (groupLabelNum != 1) {
                                    groupLabel.attr('rowspan', groupLabelNum);
                                    groupLabelNum = 1;
                                }
                            }
                        }
                    }
                    var td = $('#' + tdId);
                    setCssInTable(label, td);
                    // drd_javascript(label, tdId, label.startBindScript);
                }
            }
            if (!isData) {  // Label은 있지만 데이터가 없을 때
                var tdId = 'tableValueLabelNum' + tableValueLabelNum++;
                valueTrId.append(
                    '<td id = "' + tdId + '" class="' + label.fieldName + ' Label ' + label._attributes + ' ' + label.dataType + '"></td>'
                );
                var tdId = $('#' + tdId);
                setCssInTable(label, tdId);
            }
            tempCurDataRow++;
        }
    }
}



/**************************************************************************************
 기능 : 동적테이블이에 Css  세팅
 만든이 : 구영준
 **************************************************************************************/
function setCssInTable(label, tdId, text) {
    if (label.noBorder == 'true') {
        tdId.css('border', 'none');
    } else {
        if (label.borderThickness !== undefined) {
            var leftBorder = borderDottedLine(label.borderDottedLines.leftDashStyle);
            var rightBorder = borderDottedLine(label.borderDottedLines.rightDashStyle);
            var bottomBorder = borderDottedLine(label.borderDottedLines.bottomDashStyle);
            var topBorder = borderDottedLine(label.borderDottedLines.topDashStyle);
            tdId.css({
                'border-left': label.borderThickness.left + 'px ' + leftBorder + ' ' + label.leftBorderColor,
                'border-right': label.borderThickness.right + 'px ' + rightBorder + ' ' + label.rightBorderColor,
                'border-bottom': label.borderThickness.bottom + 'px ' + bottomBorder + ' ' + label.bottomBorderColor,
                'border-top': label.borderThickness.top + 'px ' + topBorder + ' ' + label.topBorderColor,
                'border-spacing': '0px'
            });
        } else {
            tdId.css('border', '1px solid black');
        }
    }
    tdId.css({
        'background-color': label.backGroundColor,
        'font-size': label.fontSize,
        'font-family': label.fontFamily,
        'font-weight': label.fontStyle,
        'font-color': label.textColor,
        'width': label.rectangle.width + 'px',
        'height': label.rectangle.height + 'px',
        'box-sizing' : 'border-box',
        'padding' :'0px 3px',
        'text-align' : label.horizontalTextAlignment,
    });
}

/**************************************************************************************
 기능 : 동적테이블이에 Css  세팅
 만든이 : 구영준
 **************************************************************************************/
function setCssInTableDomObject(label, tdId, text) {
    if (label.noBorder == 'true') {
        tdId.style.border =  'none';
    } else {
        if (label.borderThickness !== undefined) {
            var leftBorder = borderDottedLine(label.borderDottedLines.leftDashStyle);
            var rightBorder = borderDottedLine(label.borderDottedLines.rightDashStyle);
            var bottomBorder = borderDottedLine(label.borderDottedLines.bottomDashStyle);
            var topBorder = borderDottedLine(label.borderDottedLines.topDashStyle);
            tdId.style.borderLeft = label.borderThickness.left + 'px ' + leftBorder + ' ' + label.leftBorderColor;
            tdId.style.borderRight = label.borderThickness.right + 'px ' + rightBorder + ' ' + label.leftBorderColor;
            tdId.style.borderBottom = label.borderThickness.bottom + 'px ' + bottomBorder + ' ' + label.leftBorderColor;
            tdId.style.borderTop = label.borderThickness.top + 'px ' + topBorder + ' ' + label.leftBorderColor;
            tdId.style.borderSpacing = '0px';

        } else {
            tdId.style.border = '1px solid black';
        }
    }
    tdId.style.backgroundColor = label.backGroundColor;
    tdId.style.fontSize = label.fontSize;
    tdId.style.fontFamily = label.fontFamily;
    tdId.style.fontWeight = label.fontStyle;
    tdId.style.color = label.textColor;
    tdId.style.width = label.rectangle.width + 'px';
    tdId.style.height = label.rectangle.height + 'px';
    tdId.style.boxSizing = 'border-box';
    tdId.style.padding = '0px 3px';
    tdId.style.textAlign = label.horizontalTextAlignment;

}

