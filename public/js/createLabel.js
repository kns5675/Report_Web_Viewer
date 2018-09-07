document.write("<script type='text/javascript' src='/js/label.js' ><" + "/script>");
document.write("<script type='text/javascript' src='/js/figure.js' ><" + "/script>");

var labelList = [];
var tableLabelList = [];
var tableList = [];
var systemLabelNum = 1;
var summaryLabelNum = 1;
var dataLabelNum = 1;
var normalLabelNum = 1;
var expressionNum = 1;
var groupLabelNum = 1;
var parameterLabelNum = 1;
var dateNum = 1;
var timeNum = 1;
var dateTimeNum = 1;
var pageNumberNum = 1;
var pageNumTotalPageNum = 1;
var totalPageNum = 1;
var groupFieldNum = 0; // 그룹으로 묶었을 경우 BandGroupHeader에서 DataLabel을 사용했을 때 몇 번째 그룹이 출력중인지 알 수 있는 변수
var tableNum = 1;
var dynamicTableNum = 1;
var dynamicTitleLabelNum = 1;
var thNum = 1;
var dynamicValueLabelNum = 1;
var groupFieldArray = [];
var titleArray = []; // 그룹으로 묶었을 경우 titleName으로만 접근이 가능해져서 그 titleName을 담을 배열

var row = 0;
var verticalPNum = 0;

/******************************************************************
 기능 : ControlList의 유무를 판단하는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function judgementControlList(band, divId, numOfData) {
    if (band.groupFieldArray !== undefined) {
        groupFieldArray = band.groupFieldArray;
    }
    if (!(band.controlList.anyType === undefined)) { // ControlList 태그 안에 뭔가가 있을 때
        var controlList = band.controlList.anyType;
        if (Array.isArray(controlList)) {
            controlList.forEach(function (list) {
                judgementLabel(list, divId, numOfData);
            });
        } else {
            judgementLabel(controlList, divId, numOfData);
        }
    } else {
    }
}

/******************************************************************
 기능 : 어떤 Label인지를 판단하여 객체를 생성해주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function judgementLabel(data, divId, numOfData) {
    var attr = data._attributes["xsi:type"];
    if (attr == "ControlDynamicTable") { // 동적 테이블
        var controlDynamicTable = new Table(data);
        tableList.push(controlDynamicTable);
        var tableLabels = data.Labels.TableLabel;

        tableLabels.forEach(function (label, i) {
            var tableLabel = new DynamicTableLabel(label, i);
            if (tableLabelList.length < tableLabels.length) { //영준 수정
                tableLabelList.push(tableLabel);
            }
        });
        drawingDynamicTable(controlDynamicTable, tableLabelList, divId, numOfData);
    } else if (attr == "ControlFixedTable") { // 고정 테이블

        /*
        ToDo : 하나의 페이지에 고정테이블이 2개 이상 있을 경우 fixTableLabelList에 겹침
         */
        var controlFixedTable = new Table(data);
        tableList.push(controlFixedTable);

        var fixTableLabels = data.Labels.TableLabel;
        var fixTableLabelList = [];

        fixTableLabels.forEach(function (label, i) {
            var fixtableLabel = new FixedTableLabel(label, i);
            fixTableLabelList.push(fixtableLabel);
        });
        drawingFixedTable(controlFixedTable, fixTableLabelList, divId);
    } else if (attr == "ControlLabel") {
        if (!(data.DataType === undefined)) {
            switch (data.DataType._text) {
                case "SummaryLabel" : // 요약 라벨
                    var label = new SummaryLabel(data);
                    labelList.push(label);
                    drawingSummaryLabel(label, divId);
                    break;
                case "DataLabel" : // 데이터 라벨
                    var label = new DataLabel(data);
                    labelList.push(label);
                    drawingDataLabel(label, divId);
                    break;
                case "Expression" : // 수식 라벨
                    var label = new Expression(data);
                    labelList.push(label);
                    drawingExpression(label, divId);
                    break;
                case "GroupLabel" : // 그룹 라벨
                    var label = new GroupLabel(data);
                    labelList.push(label);
                    drawingGroupLabel(label, divId);
                    break;
                case "ParameterLabel" : // 파라미터 라벨
                    var label = new ParameterLabel(data);
                    labelList.push(label);
                    drawingParameterLabel(label, divId);
                    break;
                case "SystemLabel" : // 시스템 라벨
                    var label = new SystemLabel(data);
                    labelList.push(label);
                    drawingSystemLabel(label, divId);
                    break;
            }
        } else {
            var label = new NormalLabel(data);
            labelList.push(label);
            drawingNormalLabel(label, divId);
        }
    } else if (attr == 'ControlRectangle') { // 사각형
        var figure = new ControlRectangle(data);
        drawingRectangle(figure, divId);
    } else if (attr == 'ControlCircle') { // 원
        var figure = new ControlCircle(data);
        drawingCircle(figure, divId);
    } else if (attr == 'ControlLine') { // 선
        var figure = new ControlLine(data);
        drawingLine(figure, divId);
    } else if (attr == 'ControlArrow') { // 화살표
        var figure = new ControlArrow(data);
        drawingArrow(figure, divId);
    }
}

/******************************************************************
 부모의 position이 relative이고 자식의 position이 absolute일 때
 부모를 기준으로 자식의 위치를 잡을 수 있다.
 ******************************************************************/

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
function drawingDynamicTable(table, tableLabel, divId, numOfData) {
    var div = $('#' + divId);
    div.append('<div id = "Table' + tableNum + '"></div>');
    var divIdTable = $('#Table' + tableNum);
    divIdTable.append('<div id="dynamicTable_resizing_div_packing'+dynamicTableNum + '"></div>');
    var dynamicTable_resizing_div_packing = $("#dynamicTable_resizing_div_packing"+dynamicTableNum);
    dynamicTable_resizing_div_packing.append('<div id="dynamicTable_resizing_div'+dynamicTableNum + '"></div>');

    var dynamicTable_resizing_div = $("#dynamicTable_resizing_div"+dynamicTableNum);
    var temp_table_class = table.id.substring(0, 4); // 임시로 table을 인식하기 위한 번호 - 전형준
    dynamicTable_resizing_div.append('<table id="dynamicTable' + dynamicTableNum + '" class="table table-' + temp_table_class + '"></table>');
    // dynamicTable_resizing_div.addClass("NormalLabel_scope");
    div.css('position', 'relative');

    dynamicTable_resizing_div.css({
        'position': 'absolute',
        'left': table.rectangle.x + 'px',
        'top': table.rectangle.y + 'px'
    });
    var tableId = $('#dynamicTable' + dynamicTableNum);
    Lock_Check_Table(table, dynamicTable_resizing_div, tableId, div);
    // table_format_check(table, dynamicTable_resizing_div, tableId, div);
    tableId.css({
        'width': table.rectangle.width + 'px',
        'height': table.rectangle.height + 'px'
    });
    tableId.append('<tr id = "dynamicTitleLabel' + dynamicTitleLabelNum + '"></tr>');
    if(groupFieldArray.length < 1) {
        numOfData = getNumOfDataInOnePage(tableLabel, divId); //한 페이지에 들어갈 데이터 개수
    }
    var dt = Object.values(dataTable.DataSetName)[0];
    if (Array.isArray(tableLabel)) {
        tableLabel.forEach(function (label) {
            switch (label._attributes) {
                case "DynamicTableTitleLabel" :
                    drawingDynamicTableTitleLabel(label, dt);
                    break;
                case "DynamicTableValueLabel" :
                    drawingDynamicTableValueLabel(label, dt, tableId, numOfData, table);
                    break;
            }
        });
        tableId.css({
            'border': '1px solid black',
            'border-collapse': 'collapse',
            'text-align': 'center'
        });

        tableNum++;
        dynamicTableNum++;
        thNum++;
        dynamicTitleLabelNum++;
        dynamicValueLabelNum++;
    }
}
/**************************************************************************************
 기능 : GroupFieldArray가 없을 경우
 DynamicTableValueLabel(동적 테이블 밸류 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 구영준
 **************************************************************************************/
function drawingDynamicTableValueLabelWithoutGroupFieldArray(label, dt, tableId, numOfData, table){
    row = (pageNum - 1) * numOfData; //한 페이지 출력 해야할 시작 row
    var rowLength = row + numOfData; //한 페이지에 마지막으로 출력해야할 row
    for (var curDatarow = row; curDatarow < rowLength; curDatarow++) {
        var data = dt[curDatarow];
        var valueTrId = $("#dynamicValueLabel" + curDatarow);
        if(valueTrId.length < 1)
            tableId.append('<tr id = "dynamicValueLabel' + curDatarow + '"></tr>');
        for (var key in data) {
            if (label.fieldName == key) {
                // var valueTrId = document.getElementById("dynamicValueLabel" + curDatarow);
                var valueTrId = $('#dynamicValueLabel' + curDatarow);
                var key_data = data[key]._text;
                var table_reform = table_format_check(data, valueTrId, key_data, table);
                if(label.labelTextType == 'Number' && label.format != undefined){
                    valueTrId.append('<td class="' + key + ' Label ' + label._attributes + ' ' + label.dataType + ' ' + "MoneySosu" + '">' + table_reform + '</td>');
                }else{
                    valueTrId.append('<td class="' + key + ' Label ' + label._attributes + ' ' + label.dataType + '">' + table_reform + '</td>');
                }

                valueTrId.css({
                    'width': label.rectangle.width,
                    'height': label.rectangle.height
                });
                var td = $('.' + key);
                //// 추가 부분 18.08.28 YeSol
                if (label.noBorder == 'true') {
                    td.css('border', 'none');
                } else {
                    if (label.borderThickness !== undefined) {
                        var leftBorder = borderDottedLine(label.borderDottedLines.leftDashStyle);
                        var rightBorder = borderDottedLine(label.borderDottedLines.rightDashStyle);
                        var bottomBorder = borderDottedLine(label.borderDottedLines.bottomDashStyle);
                        var topBorder = borderDottedLine(label.borderDottedLines.topDashStyle);
                        td.css({
                            'border-left': label.borderThickness.left + 'px ' + leftBorder + ' ' + label.leftBorderColor,
                            'border-right': label.borderThickness.right + 'px ' + rightBorder + ' ' + label.rightBorderColor,
                            'border-bottom': label.borderThickness.bottom + 'px ' + bottomBorder + ' ' + label.bottomBorderColor,
                            'border-top': label.borderThickness.top + 'px ' + topBorder + ' ' + label.topBorderColor
                        });
                    } else {
                        td.css('border', '1px solid black');
                    }
                }
                td.css({
                    // 'border' : '1px solid black',
                    'font-size': label.fontSize,
                    'font-family': label.fontFamily,
                    'font-weight': label.fontStyle,
                    'background-color': label.backGroundColor
                });
            }
        }
    }
}
/**************************************************************************************
 기능 : GroupFieldArray가 있을 경우
 DynamicTableValueLabel(동적 테이블 밸류 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 구영준
 **************************************************************************************/
function drawingDynamicTableValueLabelWithGroupFieldArray(label, dt, tableId, numOfData){
    for (var j = groupDataRow; j < numOfData; j++) {
        var data = groupFieldArray[groupFieldNum];
        var rowNum = curDatarow + j;
        var $trId = '#dynamicValueLabel' + rowNum;
        var valueTrId = $($trId);
        if (valueTrId.length < 1)
            tableId.append('<tr id =   "dynamicValueLabel' + rowNum + '"></tr>');
        for (var key in data[j]) {
            valueTrId = $($trId);
            if (label.fieldName == key) {
                var key_data = data[j][key]._text;
                var table_reform = table_format_check(data, valueTrId, key_data, label);

                if(label.labelTextType == 'Number' && label.format != undefined){
                    valueTrId.append(
                        '<td class="' + key + ' Label ' + label._attributes + ' ' + label.dataType + ' ' + "MoneySosu" + '">' + table_reform + '</td>'
                    );
                }else{
                    valueTrId.append(
                        '<td class="' + key + ' Label ' + label._attributes + ' ' + label.dataType + '">' + table_reform + '</td>'
                    );
                }
                valueTrId.css({
                    'width': label.rectangle.width,
                    'height': label.rectangle.height,

                });
                var td = $('.' + key);
                //// 추가 부분 18.08.28 YeSol
                if (label.noBorder == 'true') {
                    td.css('border', 'none');
                } else {
                    if (label.borderThickness !== undefined) {
                        var leftBorder = borderDottedLine(label.borderDottedLines.leftDashStyle);
                        var rightBorder = borderDottedLine(label.borderDottedLines.rightDashStyle);
                        var bottomBorder = borderDottedLine(label.borderDottedLines.bottomDashStyle);
                        var topBorder = borderDottedLine(label.borderDottedLines.topDashStyle);

                        td.css({
                            'border-left': label.borderThickness.left + 'px ' + leftBorder + ' ' + label.leftBorderColor,
                            'border-right': label.borderThickness.right + 'px ' + rightBorder + ' ' + label.rightBorderColor,
                            'border-bottom': label.borderThickness.bottom + 'px ' + bottomBorder + ' ' + label.bottomBorderColor,
                            'border-top': label.borderThickness.top + 'px ' + topBorder + ' ' + label.topBorderColor
                        });
                    } else {
                        td.css('border', '1px solid black');
                    }
                }

                td.css({
                    // 'border': '1px solid black',
                    'font-size': label.fontSize,
                    'font-family': label.fontFamily,
                    'font-weight': label.fontStyle,
                    'background-color': label.backGroundColor
                });
            }
        }
    }
}

/******************************************************************
 기능 : DynamicTableValueLabel(동적 테이블 밸류 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 구영준

 수정 : 숫자 표시 형식 추가, 테이블 데이터 그러주는 방식 수정.
 Date : 2018-08-29
 From hagdung-i
 *******************************************************************/
function drawingDynamicTableValueLabel(label, dt, tableId, numOfData, table) {
    if (groupFieldArray == undefined || groupFieldArray.length == 0) {
        drawingDynamicTableValueLabelWithoutGroupFieldArray(label, dt, tableId, numOfData, table);
    } else {
        drawingDynamicTableValueLabelWithGroupFieldArray(label, dt, tableId, numOfData);
    }
}

/******************************************************************
 기능 : DynamicTableTitleLabel(동적 테이블 타이틀 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 구영준

 수정 : 테이블 id 값 한글 생성되는 부분 수정.
 Date : 2018-08-28
 From hagdung-i
 *******************************************************************/
function drawingDynamicTableTitleLabel(label, dt) {
    var temp = Object.keys(dt[0]);
    var titleTrId = $('#dynamicTitleLabel' + dynamicTitleLabelNum);
    var header_Name_Number = 1;
    temp.forEach(function (titleName) {
        if (label.text == titleName) {
            titleArray.push(titleName);
            titleTrId.append('<th id = "DynamicTableTitleLabel' + header_Name_Number + '_View_Page_Number' + thNum + '"></th>');
            titleTrId.css({
                'width': label.rectangle.width,
                'height': label.rectangle.height
            });
            var thId = $('#DynamicTableTitleLabel' + header_Name_Number + "_View_Page_Number" + thNum);

            //// 추가 부분 18.08.28 YeSol
            if (label.noBorder == 'true') {
                thId.css('border', 'none');
            } else {
                if (label.borderThickness !== undefined) {
                    var leftBorder = borderDottedLine(label.borderDottedLines.leftDashStyle);
                    var rightBorder = borderDottedLine(label.borderDottedLines.rightDashStyle);
                    var bottomBorder = borderDottedLine(label.borderDottedLines.bottomDashStyle);
                    var topBorder = borderDottedLine(label.borderDottedLines.topDashStyle);
                    thId.css({
                        'border-left': label.borderThickness.left + 'px ' + leftBorder + ' ' + label.leftBorderColor,
                        'border-right': label.borderThickness.right + 'px ' + rightBorder + ' ' + label.rightBorderColor,
                        'border-bottom': label.borderThickness.bottom + 'px ' + bottomBorder + ' ' + label.bottomBorderColor,
                        'border-top': label.borderThickness.top + 'px ' + topBorder + ' ' + label.topBorderColor
                    });
                } else {
                    thId.css('border', '1px solid black');
                }
            }

            thId.css({
                'background-color': label.backGroundColor,
                'font-size': label.fontSize,
                'font-family': label.fontFamily,
                'font-weight': label.fontStyle,
                'font-color': label.textColor
            });
            thId.append(titleName);
            thId.addClass('Label DynamicTableHeader');
            thId.addClass(label._attributes);
            table_column_controller(thId, titleTrId);
        }
        header_Name_Number++;
    });
}

/******************************************************************
 기능 : FixedTable(고정 테이블)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingFixedTable(table, tableLabel, divId) {
    var div = $('#' + divId);
    div.append('<div id="Table"></div>');

    var divIdTable = $('#Table');
    divIdTable.append('<table id="fixedTable"></table>');
    div.css('position', 'relative');
    divIdTable.css('position', 'absolute');

    var tableId = $('#fixedTable');

    tableId.css({
        'width': table.rectangle.width,
        'height': table.rectangle.height,
        'left': table.rectangle.x + 'px',
        'top': table.rectangle.y + 'px'
    });

    tableId.append('<tr id = "fixedTitleLabel"></tr>');
    tableId.append('<tr id = "fixedValueLabel"></tr>');

    var titleTrId = $('#fixedTitleLabel');
    var valueTrId = $('#fixedValueLabel');

    if (Array.isArray(tableLabel)) {
        tableLabel.forEach(function (label) {
            switch (label._attributes["xsi:type"]) {
                case "FixedTableTitleLabel" :
                    titleTrId.append('<th></th>');
                    titleTrId.css({
                        'width': label.rectangle.width,
                        'height': label.rectangle.height,
                        'font-size': label.fontSize,
                        'font-family': label.fontFamily,
                        'font-weight': label.fontStyle,
                        'background-color': label.backGroundColor
                    });
                    break;
                case "FixedTableValueLabel" :
                    valueTrId.append('<td></td>');
                    valueTrId.css({
                        'width': label.rectangle.width,
                        'height': label.rectangle.height,
                        'font-size': label.fontSize,
                        'font-family': label.fontFamily,
                        'font-weight': label.fontStyle,
                        'background-color': label.backGroundColor
                    });
                    break;
            }
        })
    }
    tableId.css({
        'border': '1px solid black',
        'border-collapse': 'collapse',
        'text-align': 'center'
    });
}

/******************************************************************
 기능 : SystemLabel(시스템 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔

 수정 : Label에 'Label', 각자의 DataType 클래스 추가
 Date : 2018-08-24
 From 전형준

 수정 : 라벨의 크기 조정, 위치 이동, 내용 수정 추가.
 Date : 2018-08-27
 From hagdung-i
 ******************************************************************/
function drawingSystemLabel(data, divId) {
    var div = $('#' + divId);
    var pId;
    div.css('position', 'relative');
    div.append('<div id = "SystemLabel' + systemLabelNum + '"></div>');

    var systemLabelId = $('#SystemLabel' + systemLabelNum);

    // visible 속성
    if (data.visible == 'false') {
        systemLabelId.css('display', 'none');
    }

    //// 추가 부분 18.08.28 YeSol
    if (data.noBorder == 'true') {
        systemLabelId.css('border', 'none');
    } else {
        if (data.borderThickness !== undefined) {
            var leftBorder = borderDottedLine(data.borderDottedLines.leftDashStyle);
            var rightBorder = borderDottedLine(data.borderDottedLines.rightDashStyle);
            var bottomBorder = borderDottedLine(data.borderDottedLines.bottomDashStyle);
            var topBorder = borderDottedLine(data.borderDottedLines.topDashStyle);
            systemLabelId.css({
                'border-left': data.borderThickness.left + 'px ' + leftBorder + ' ' + data.leftBorderColor,
                'border-right': data.borderThickness.right + 'px ' + rightBorder + ' ' + data.rightBorderColor,
                'border-bottom': data.borderThickness.bottom + 'px ' + bottomBorder + ' ' + data.bottomBorderColor,
                'border-top': data.borderThickness.top + 'px ' + topBorder + ' ' + data.topBorderColor
            });
        } else {
            systemLabelId.css('border', '1px solid black');
        }
    }
    systemLabelId.addClass("NormalLabel_scope");
    systemLabelId.css({
        'width': data.rectangle.width,
        'height': data.rectangle.height,
        'position': 'absolute',
        'left': data.rectangle.x + 'px',
        'top': data.rectangle.y + 'px',
        'text-align': 'center',
        'white-space': 'nowrap', // 줄바꿈 안되게하는거
        'background-color': data.backGroundColor, // 배경색
        'color': data.textColor // 글자 색
    });
    Lock_check(data, systemLabelId, div);

    // 라벨 형태 -> 원
    if (data.labelShape == 'Circle') {
        systemLabelId.css({
            'border-radius': '100%', // LabelShape가 원일 때
            'border': data.circleLineThickness + 'px solid ' + data.circleLineColor // 원 테두리 두께
        });
    }

    // 그라데이션을 사용할 때
    if (data.gradientLB.isUseGradient == 'true') {
        gradientCase(data.gradientLB.startGradientDirection, data.gradientLB.gradientDirection, data.gradientLB.gradientColor, data.backGroundColor, 'SystemLabel' + systemLabelNum);
    }

    // 자동 줄바꾸기
    if (data.wordWrap == 'true') {
        systemLabelId.css('white-space', 'normal');
    }

    var date = new Date();
    switch (data.systemFieldName) {
        case 'Date' :
            var year = date.getFullYear();
            var month = plusZero(date.getMonth() + 1); // month는 0부터 시작
            var day = plusZero(date.getDate());
            var dateStr = year + '-' + month + '-' + day;

            systemLabelId.append('<p id = "PDate' + dateNum + '"></p>');

            pId = $('#PDate' + dateNum);

            // fontSize의 단위를 통일하기위해
            var fontSizePt = changeFontUnit(data.fontSize);

            pId.css({
                'font-size': fontSizePt,
                'font-family': data.fontFamily,
                'font-weight': data.fontStyle
            });

            if (data.textDirection == 'Vertical') {
                textAlignVertical(dateStr, "PDate" + dateNum); // 아직 구현 안함
            } else if (data.textDirection == 'Horizontal') {
                toStringFn(dateStr, "PDate" + dateNum); // 한 글자씩 찍기
            }

            // 자간 속성
            if (data.characterSpacing !== undefined) {
                characterSpacing(dateStr, data.characterSpacing, "PDate" + dateNum);
            }

            // 줄 간격 속성
            if (data.lineSpacing !== undefined) {
                lineSpacing(dateStr, data.lineSpacing, "PDate" + dateNum);
            }

            // Clipping 속성
            if (data.clipping == 'true') {
                systemLabelId.css({
                    'text-overflow': 'clip',
                    'overflow': 'hidden'
                });
                clipping(dateStr, 'SystemLabel' + dateNum, 'PDate' + dateNum);
            }

            if (data.autosize == true) { // 자동 높이 조절
                autoSizeTrue('PDate' + dateNum);
            } else {
                switch (data.horizontalTextAlignment) {
                    case 'Center' :
                        textAlignCenter(dateStr, 'PDate' + dateNum, data.wordWrap, data.textDirection);
                        break;
                    case 'Left' :
                        pId.css('text-align', 'left');
                        break;
                    case 'Right' :
                        pId.css('text-align', 'right');
                        break;
                    case 'Distributed' :
                        pId.text('');
                        textEqualDivision(dateStr, "PDate" + dateNum); // 텍스트 수평 정렬이 균등 분할인 경우
                        break;
                }
                switch (data.verticalTextAlignment) {
                    case 'Center' :
                        verticalCenter('PDate' + dateNum); // 텍스트 수직 정렬이 중간인 경우
                        break;
                    case 'Top' :
                        verticalTop('PDate' + dateNum); // 텍스트 수직 정렬이 위쪽인 경우
                        break;
                    case 'Bottom' :
                        verticalBottom('PDate' + dateNum); // 텍스트 수직 정렬이 아래쪽인 경우
                        break;
                    case 'Distributed' :
                        verticalCenterEqualDivision(dateStr, 'PDate' + dateNum, data.textDirection); // 텍스트 수직 정렬이 균등 분할인 경우
                        break;
                }
            }

            // 폰트크기 자동 줄어듦
            if (data.autoFontType == 'AutoSmall') {
                fontSizeAutoSmall(dateStr, 'PDate' + dateNum);
            }

            // 기본 여백 미사용
            if (data.isUseBasicInnerMargin == 'false') {
                pId.css({
                    'margin-left': data.interMargin.left + 'px',
                    'margin-right': data.interMargin.right + 'px',
                    'margin-top': data.interMargin.top + 'px',
                    'margin-bottom': data.interMargin.bottom + 'px',
                })
            }

            // 중간 줄 그리기
            if (data.isDrawStrikeOutLine == 'true') {
                pId.css('text-decoration', 'line-through');
            }

            // 밑줄 그리기
            if (data.isDrawUnderLine == 'true') {
                pId.css('text-decoration', 'underline');
            }

            // 중간 줄과 밑줄 모두 그릴 때
            if (data.isDrawStrikeOutLine == 'true' && data.isDrawUnderLine == 'true') {
                pId.css('text-decoration', 'line-through underline');
            }

            // 글자 크기 동일하게 하기
            if (data.isSameWidth == 'true') {
                var fontSize = (pId.css('font-size')).split('p');
                pId.css('word-spacing', (fontSize[0] - 1.181) + 'px');
            }

            dateNum++;
            break;
        case 'Date/time' :
            var year = date.getFullYear();
            var month = plusZero(date.getMonth() + 1); // month는 0부터 시작
            var day = plusZero(date.getDate());
            var hour = plusZero(date.getHours());
            var min = plusZero(date.getMinutes());
            var sec = plusZero(date.getSeconds());
            var dateTimeStr = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;

            systemLabelId.append('<p id = "PDateTime' + dateTimeNum + '"></p>');

            pId = $('#PDateTime' + dateTimeNum);

            // fontSize의 단위를 통일하기위해
            var fontSizePt = changeFontUnit(data.fontSize);

            pId.css({
                'font-size': fontSizePt,
                'font-family': data.fontFamily,
                'font-weight': data.fontStyle
            });

            if (data.textDirection == 'Vertical') {
                textAlignVertical(dateTimeStr, "PDateTime" + dateTimeNum); // 아직 구현 안함
            } else if (data.textDirection == 'Horizontal') {
                toStringFn(dateTimeStr, "PDateTime" + dateTimeNum); // 한 글자씩 찍기
            }

            // 자간 속성
            if (data.characterSpacing !== undefined) {
                characterSpacing(dateTimeStr, data.characterSpacing, "PDateTime" + dateTimeNum);
            }

            // 줄 간격 속성
            if (data.lineSpacing !== undefined) {
                lineSpacing(dateTimeStr, data.lineSpacing, "PDateTime" + dateTimeNum);
            }

            // Clipping 속성
            if (data.clipping == 'true') {
                systemLabelId.css({
                    'text-overflow': 'clip',
                    'overflow': 'hidden'
                });
                clipping(dateTimeStr, 'SystemLabel' + dateTimeNum, 'PDateTime' + dateTimeNum);
            }

            if (data.autosize == true) { // 자동 높이 조절
                autoSizeTrue('PDateTime' + dateTimeNum);
            } else {
                switch (data.horizontalTextAlignment) {
                    case 'Center' :
                        textAlignCenter(dateTimeStr, 'PDateTime' + dateTimeNum, data.wordWrap, data.textDirection);
                        break;
                    case 'Left' :
                        pId.css('text-align', 'left');
                        break;
                    case 'Right' :
                        pId.css('text-align', 'right');
                        break;
                    case 'Distributed' :
                        pId.text('');
                        textEqualDivision(dateTimeStr, "PDateTime" + dateTimeNum); // 텍스트 수평 정렬이 균등 분할인 경우
                        break;
                }
                switch (data.verticalTextAlignment) {
                    case 'Center' :
                        verticalCenter('PDateTime' + dateTimeNum); // 텍스트 수직 정렬이 중간인 경우
                        break;
                    case 'Top' :
                        verticalTop('PDateTime' + dateTimeNum); // 텍스트 수직 정렬이 위쪽인 경우
                        break;
                    case 'Bottom' :
                        verticalBottom('PDateTime' + dateTimeNum); // 텍스트 수직 정렬이 아래쪽인 경우
                        break;
                    case 'Distributed' :
                        verticalCenterEqualDivision(dateTimeStr, 'PDateTime' + dateTimeNum, data.textDirection); // 텍스트 수직 정렬이 균등 분할인 경우
                        break;
                }
            }

            // 폰트크기 자동 줄어듦
            if (data.autoFontType == 'AutoSmall') {
                fontSizeAutoSmall(dateTimeStr, 'PDateTime' + dateTimeNum);
            }

            // 기본 여백 미사용
            if (data.isUseBasicInnerMargin == 'false') {
                pId.css({
                    'margin-left': data.interMargin.left + 'px',
                    'margin-right': data.interMargin.right + 'px',
                    'margin-top': data.interMargin.top + 'px',
                    'margin-bottom': data.interMargin.bottom + 'px',
                });
            }

            // 중간 줄 그리기
            if (data.isDrawStrikeOutLine == 'true') {
                pId.css('text-decoration', 'line-through');
            }

            // 밑줄 그리기
            if (data.isDrawUnderLine == 'true') {
                pId.css('text-decoration', 'underline');
            }

            // 중간 줄과 밑줄 모두 그릴 때
            if (data.isDrawStrikeOutLine == 'true' && data.isDrawUnderLine == 'true') {
                pId.css('text-decoration', 'line-through underline');
            }

            // 글자 크기 동일하게 하기
            if (data.isSameWidth == 'true') {
                var fontSize = (pId.css('font-size')).split('p');
                pId.css('word-spacing', (fontSize[0] - 1.181) + 'px');
            }

            dateTimeNum++;
            break;
        case 'Time' :
            var hour = plusZero(date.getHours());
            var min = plusZero(date.getMinutes());
            var sec = plusZero(date.getSeconds());
            var timeStr = hour + ':' + min + ':' + sec;

            systemLabelId.append('<p id = "PTime' + timeNum + '"></p>');

            pId = $('#PTime' + timeNum);

            // fontSize의 단위를 통일하기위해
            var fontSizePt = changeFontUnit(data.fontSize);

            pId.css({
                'font-size': fontSizePt,
                'font-family': data.fontFamily,
                'font-weight': data.fontStyle
            });

            if (data.textDirection == 'Vertical') {
                textAlignVertical(timeStr, "PTime" + timeNum); // 아직 구현 안함
            } else if (data.textDirection == 'Horizontal') {
                toStringFn(timeStr, "PTime" + timeNum); // 한 글자씩 찍기
            }

            // 자간 속성
            if (data.characterSpacing !== undefined) {
                characterSpacing(timeStr, data.characterSpacing, "PTime" + timeNum);
            }

            // 줄 간격 속성
            if (data.lineSpacing !== undefined) {
                lineSpacing(timeStr, data.lineSpacing, "PTime" + timeNum);
            }

            // Clipping 속성
            if (data.clipping == 'true') {
                systemLabelId.css({
                    'text-overflow': 'clip',
                    'overflow': 'hidden'
                });
                clipping(timeStr, 'SystemLabel' + timeNum, 'PTime' + timeNum);
            }


            if (data.autosize == true) { // 자동 높이 조절
                autoSizeTrue('PTime' + timeNum);
            } else {
                switch (data.horizontalTextAlignment) {
                    case 'Center' :
                        textAlignCenter(timeStr, 'PTime' + timeNum, data.wordWrap, data.textDirection);
                        break;
                    case 'Left' :
                        pId.css('text-align', 'left');
                        break;
                    case 'Right' :
                        pId.css('text-align', 'right');
                        break;
                    case 'Distributed' :
                        pId.text('');
                        textEqualDivision(timeStr, "PTime" + timeNum); // 텍스트 수평 정렬이 균등 분할인 경우
                        break;
                }
                switch (data.verticalTextAlignment) {
                    case 'Center' :
                        verticalCenter('PTime' + timeNum); // 텍스트 수직 정렬이 중간인 경우
                        break;
                    case 'Top' :
                        verticalTop('PTime' + timeNum); // 텍스트 수직 정렬이 위쪽인 경우
                        break;
                    case 'Bottom' :
                        verticalBottom('PTime' + timeNum); // 텍스트 수직 정렬이 아래쪽인 경우
                        break;
                    case 'Distributed' :
                        verticalCenterEqualDivision(timeStr, 'PTime' + timeNum, data.textDirection); // 텍스트 수직 정렬이 균등 분할인 경우
                        break;
                }
            }
            // 폰트크기 자동 줄어듦
            if (data.autoFontType == 'AutoSmall') {
                fontSizeAutoSmall(timeStr, 'PTime' + timeNum);
            }

            // 기본 여백 미사용
            if (data.isUseBasicInnerMargin == 'false') {
                pId.css({
                    'margin-left': data.interMargin.left + 'px',
                    'margin-right': data.interMargin.right + 'px',
                    'margin-top': data.interMargin.top + 'px',
                    'margin-bottom': data.interMargin.bottom + 'px',
                });
            }

            // 중간 줄 그리기
            if (data.isDrawStrikeOutLine == 'true') {
                pId.css('text-decoration', 'line-through');
            }

            // 밑줄 그리기
            if (data.isDrawUnderLine == 'true') {
                pId.css('text-decoration', 'underline');
            }

            // 중간 줄과 밑줄 모두 그릴 때
            if (data.isDrawStrikeOutLine == 'true' && data.isDrawUnderLine == 'true') {
                pId.css('text-decoration', 'line-through underline');
            }

            // 글자 크기 동일하게 하기
            if (data.isSameWidth == 'true') {
                var fontSize = (pId.css('font-size')).split('p');
                pId.css('word-spacing', (fontSize[0] - 1.181) + 'px');
            }

            timeNum++;
            break;
        case 'PageNumber' : // 현재 페이지 번호
            var PPageNumber = "PPageNumber";
            systemLabelId.append('<p id ="' + PPageNumber + pageNumberNum + '" class="pageNumber">1</p>');

            pId = $('#' + PPageNumber + pageNumberNum);

            // fontSize의 단위를 통일하기위해
            var fontSizePt = changeFontUnit(data.fontSize);

            pId.css({
                'font-size': fontSizePt,
                'font-family': data.fontFamily,
                'font-weight': data.fontStyle
            });

            verticalCenter(PPageNumber + pageNumberNum);

            pageNumberNum++;
            break;
        case 'TotalPage' : // 전체 페이지 번호
            var PTotalPage = "PTotalPage";
            systemLabelId.append('<p id ="' + PTotalPage + totalPageNum + '" class="totalPage">1</p>');

            pId = $('#' + PTotalPage + totalPageNum);

            // fontSize의 단위를 통일하기위해
            var fontSizePt = changeFontUnit(data.fontSize);

            pId.css({
                'font-size': fontSizePt,
                'font-family': data.fontFamily,
                'font-weight': data.fontStyle
            });

            verticalCenter(PTotalPage + totalPageNum);
            totalPageNum++;
            break;
        case 'PageNumber / TotalPage' :  // 현재 페이지 번호 / 전체 페이지 정보
            var PPageNumberNTotalPage = "PPageNumberNTotalPage";
            systemLabelId.append('<p id ="' + PPageNumberNTotalPage + pageNumTotalPageNum + '" class="pageNumberTotalPage">1</p>');

            pId = $('#' + PPageNumberNTotalPage + pageNumTotalPageNum);

            // fontSize의 단위를 통일하기위해
            var fontSizePt = changeFontUnit(data.fontSize);

            pId.css({
                'font-size': fontSizePt,
                'font-family': data.fontFamily,
                'font-weight': data.fontStyle
            });

            verticalCenter(PPageNumberNTotalPage + pageNumTotalPageNum);

            pageNumTotalPageNum++;
            break;
    }
    systemLabelNum++;
    pId.addClass('Label');
    pId.addClass(data.dataType);
}


/******************************************************************
 기능 : SummaryLabel(요약 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔

 수정 : Label에 'Label', 각자의 DataType 클래스 추가
 Date : 2018-08-24
 From 전형준

 수정 : SummaryLabel의 크기 조정, 위치 이동, 내용 수정 추가.
 Date : 2018-08-27
 From hagdung-i
 ******************************************************************/
function drawingSummaryLabel(data, divId) {
    var div = $('#' + divId);
    div.css('position', 'relative');
    div.append('<div id = "SummaryLabel' + summaryLabelNum + '">SummaryLabel</div>');
    var summaryLabelId = $('#SummaryLabel' + summaryLabelNum);

    // visible 속성
    if (data.visible == 'false') {
        summaryLabelId.css('display', 'none');
    }

    //// 추가 부분 18.08.28 YeSol
    if (data.noBorder == 'true') {
        summaryLabelId.css('border', 'none');
    } else {
        if (data.borderThickness !== undefined) {
            var leftBorder = borderDottedLine(data.borderDottedLines.leftDashStyle);
            var rightBorder = borderDottedLine(data.borderDottedLines.rightDashStyle);
            var bottomBorder = borderDottedLine(data.borderDottedLines.bottomDashStyle);
            var topBorder = borderDottedLine(data.borderDottedLines.topDashStyle);
            summaryLabelId.css({
                'border-left': data.borderThickness.left + 'px ' + leftBorder + ' ' + data.leftBorderColor,
                'border-right': data.borderThickness.right + 'px ' + rightBorder + ' ' + data.rightBorderColor,
                'border-bottom': data.borderThickness.bottom + 'px ' + bottomBorder + ' ' + data.bottomBorderColor,
                'border-top': data.borderThickness.top + 'px ' + topBorder + ' ' + data.topBorderColor
            });
        } else {
            summaryLabelId.css('border', '1px solid black');
        }
    }

    summaryLabelId.addClass("NormalLabel_scope");
    summaryLabelId.css({
        'width': data.rectangle.width,
        'height': data.rectangle.height,
        'position': 'absolute',
        'left': data.rectangle.x + 'px',
        'top': data.rectangle.y + 'px',
        'text-align': 'center',
        'white-space': 'nowrap', // 줄바꿈 안되게하는거
        'background-color': data.backGroundColor, // 배경색
        'color': data.textColor // 글자 색
    });

    // 라벨 형태 -> 원
    if (data.labelShape == 'Circle') {
        summaryLabelId.css({
            'border-radius': '100%', // LabelShape가 원일 때
            'border': data.circleLineThickness + 'px solid ' + data.circleLineColor // (원 테두리 두께) 속성이 뭔지 모르겠땀
        });
    }

    // 그라데이션을 사용할 때
    if (data.gradientLB.isUseGradient == 'true') {
        gradientCase(data.gradientLB.startGradientDirection, data.gradientLB.gradientDirection, data.gradientLB.gradientColor, data.backGroundColor, 'SummaryLabel' + summaryLabelNum);
    }

    // 자동 줄바꾸기
    if (data.wordWrap == 'true') {
        summaryLabelId.css('white-space', 'normal');
    }

    summaryLabelId.append('<p id = "PSummaryLabel' + summaryLabelNum + '"></p>');
    Lock_check(data, summaryLabelId, div);
    var pId = $('#PSummaryLabel' + summaryLabelNum);

    /////////////////// 샘플 받으면 수정하기 ///////////////////////////
    switch (data.summaryType) {
        case 'Sum' :
            break;
        case 'Avg' :
            break;
        case 'Max' :
            break;
        case 'Min' :
            break;
        case 'Cnt' :
            break;
    }

    // fontSize의 단위를 통일하기위해
    var fontSizePt = changeFontUnit(data.fontSize);

    pId.css({
        'font-size': fontSizePt,
        'font-family': data.fontFamily,
        'font-weight': data.fontStyle
    });

    // // 금액 표시 방법 한글
    // if(data.numberToTextType == 'KOR') {
    //     var KOR = numberToKOR((data.text).replace(/[^0-9]/g, ""));
    // }
    //
    // // 금액 표시 방법 한자
    // if(data.numberToTextType == 'CHN') {
    //     var CHN = numberToCHN((data.text).replace(/[^0-9]/g, ""));
    // }

    // 0값 표시 여부가 NoShow(표시하지 않음) 이고 문자 형식이 숫자 일 때
    if (data.showZeroState == 'NoShow' && data.labelTextType == 'Number') {
        data.text = (data.text).replace(/(^0+)/, '');
    }

    if (data.text !== undefined) {
        if (data.textDirection == 'Vertical') {
            textAlignVertical(data.text, "PSummaryLabel" + summaryLabelNum); // 아직 구현 안함
        } else if (data.textDirection == 'Horizontal') {
            toStringFn(data.text, "PSummaryLabel" + summaryLabelNum); // 한 글자씩 찍기
        }
    }

    // 자간 속성
    if (data.characterSpacing !== undefined) {
        characterSpacing(data.text, data.characterSpacing, "PSummaryLabel" + summaryLabelNum);
    }

    // 줄 간격 속성
    if (data.lineSpacing !== undefined) {
        lineSpacing(data.text, data.lineSpacing, "PSummaryLabel" + summaryLabelNum);
    }

    // Clipping 속성
    if (data.clipping == 'true') {
        summaryLabelId.css({
            'text-overflow': 'clip',
            'overflow': 'hidden'
        });
        clipping(data.text, 'SummaryLabel' + summaryLabelNum, 'PSummaryLabel' + summaryLabelNum);
    }

    if (data.autosize == true) { // 자동 높이 조절
        autoSizeTrue('PSummaryLabel' + summaryLabelNum);
    } else {
        if (data.text !== undefined) {
            switch (data.horizontalTextAlignment) {
                case 'Center' :
                    textAlignCenter(data.text, 'PSummaryLabel' + summaryLabelNum, data.wordWrap, data.textDirection);
                    break;
                case 'Left' :
                    pId.css('text-align', 'left');
                    break;
                case 'Right' :
                    pId.css('text-align', 'right');
                    break;
                case 'Distributed' :
                    pId.text('');
                    textEqualDivision(data.text, "PSummaryLabel" + summaryLabelNum); // 텍스트 수평 정렬이 균등 분할인 경우
                    break;
            }
            switch (data.verticalTextAlignment) {
                case 'Center' :
                    verticalCenter('PSummaryLabel' + summaryLabelNum); // 텍스트 수직 정렬이 중간인 경우
                    break;
                case 'Top' :
                    verticalTop('PSummaryLabel' + summaryLabelNum); // 텍스트 수직 정렬이 위쪽인 경우
                    break;
                case 'Bottom' :
                    verticalBottom('PSummaryLabel' + summaryLabelNum); // 텍스트 수직 정렬이 아래쪽인 경우
                    break;
                case 'Distributed' :
                    verticalCenterEqualDivision(data.text, 'PSummaryLabel' + summaryLabelNum, data.textDirection); // 텍스트 수직 정렬이 균등 분할인 경우
                    break;
            }
        }
    }

    // 폰트크기 자동 줄어듦
    if (data.autoFontType == 'AutoSmall') {
        fontSizeAutoSmall(data.text, 'PSummaryLabel' + summaryLabelNum);
    }

    // 기본 여백 미사용
    if (data.isUseBasicInnerMargin == 'false') {
        pId.css({
            'margin-left': data.interMargin.left + 'px',
            'margin-right': data.interMargin.right + 'px',
            'margin-top': data.interMargin.top + 'px',
            'margin-bottom': data.interMargin.bottom + 'px',
        });
    }

    // 중간 줄 그리기
    if (data.isDrawStrikeOutLine == 'true') {
        pId.css('text-decoration', 'line-through');
    }

    // 밑줄 그리기
    if (data.isDrawUnderLine == 'true') {
        pId.css('text-decoration', 'underline');
    }

    // 중간 줄과 밑줄 모두 그릴 때
    if (data.isDrawStrikeOutLine == 'true' && data.isDrawUnderLine == 'true') {
        pId.css('text-decoration', 'line-through underline');
    }

    // 글자 크기 동일하게 하기
    if (data.isSameWidth == 'true') {
        var fontSize = (pId.css('font-size')).split('p');
        pId.css('word-spacing', (fontSize[0] - 1.181) + 'px');
    }

    //pId.append(data.text);
    pId.addClass('Label');
    pId.addClass(data.dataType);

    summaryLabelNum++;
}

/******************************************************************
 기능 : DataLabel(데이터 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔

 수정 : Label에 'Label', 각자의 DataType 클래스 추가
 Date : 2018-08-24
 From 전형준

 수정 : DataLabel의 크기 조정, 위치 이동, 내용 수정 추가.
 Date : 2018-08-27
 From hagdung-i

 수정 : DataLabel의 크기 조정, 위치 이동이 lock 속성이 있을 경우 수정 불가한 로직 추가.
 Date : 2018-08-28
 From hagdung-i
 ******************************************************************/
function drawingDataLabel(data, divId) {
    var div = $('#' + divId);
    div.css('position', 'relative');
    div.append('<div id = "DataLabel' + dataLabelNum + '"></div>');
    var dataLabelId = $('#DataLabel' + dataLabelNum);

    // visible 속성
    if (data.visible == 'false') {
        dataLabelId.css('display', 'none');
    }

    //// 추가 부분 18.08.28 YeSol border 속성 관련
    if (data.noBorder == 'true') {
        dataLabelId.css('border', 'none');
    } else {
        if (data.borderThickness !== undefined) {
            var leftBorder = borderDottedLine(data.borderDottedLines.leftDashStyle);
            var rightBorder = borderDottedLine(data.borderDottedLines.rightDashStyle);
            var bottomBorder = borderDottedLine(data.borderDottedLines.bottomDashStyle);
            var topBorder = borderDottedLine(data.borderDottedLines.topDashStyle);
            dataLabelId.css({
                'border-left': data.borderThickness.left + 'px ' + leftBorder + ' ' + data.leftBorderColor,
                'border-right': data.borderThickness.right + 'px ' + rightBorder + ' ' + data.rightBorderColor,
                'border-bottom': data.borderThickness.bottom + 'px ' + bottomBorder + ' ' + data.bottomBorderColor,
                'border-top': data.borderThickness.top + 'px ' + topBorder + ' ' + data.topBorderColor
            });
        } else {
            dataLabelId.css('border', '1px solid black');
        }
    }

    dataLabelId.css({
        'width': data.rectangle.width,
        'height': data.rectangle.height,
        'position': 'absolute',
        'left': data.rectangle.x + 'px',
        'top': data.rectangle.y + 'px',
        'text-align': 'center',
        'white-space': 'nowrap', // 줄바꿈 안되게하는거
        'background-color': data.backGroundColor, // 배경색
        'color': data.textColor // 글자 색
    });


    // 라벨 형태 -> 원
    if (data.labelShape == 'Circle') {
        dataLabelId.css({
            'border-radius': '100%', // LabelShape가 원일 때
            'border': data.circleLineThickness + 'px solid ' + data.circleLineColor // (원 테두리 두께) 속성이 뭔지 모르겠땀
        });
    }

    // 그라데이션을 사용할 때
    if (data.gradientLB.isUseGradient == 'true') {
        gradientCase(data.gradientLB.startGradientDirection, data.gradientLB.gradientDirection, data.gradientLB.gradientColor, data.backGroundColor, 'DataLabel' + dataLabelNum);
    }

    // 자동 줄바꾸기
    if (data.wordWrap == 'true') {
        dataLabelId.css('white-space', 'normal');
    }

    dataLabelId.append('<p id = "PDataLabel' + dataLabelNum + '"></p>');
    Lock_check(data, dataLabelId, div);

    var pId = $('#PDataLabel' + dataLabelNum);

    // fontSize의 단위를 통일하기위해
    var fontSizePt = changeFontUnit(data.fontSize);

    pId.css({
        'font-size': fontSizePt,
        'font-family': data.fontFamily,
        'font-weight': data.fontStyle
    });

    // // 금액 표시 방법 한글
    // if(data.numberToTextType == 'KOR') {
    //     var KOR = numberToKOR((data.text).replace(/[^0-9]/g, ""));
    // }
    //
    // // 금액 표시 방법 한자
    // if(data.numberToTextType == 'CHN') {
    //     var CHN = numberToCHN((data.text).replace(/[^0-9]/g, ""));
    // }

    /********************************************
     한 그룹의 데이터 출력이 끝나면 groupFieldNum++를 어디선가 해줘야함..어떻게해야하지..모르겠담
     *******************************************/
    if (groupFieldArray !== undefined) {
        pId.append(groupFieldArray[groupFieldNum][0]);
        data.text = pId.text();
    }

    // 0값 표시 여부가 NoShow(표시하지 않음) 이고 문자 형식이 숫자 일 때
    if (data.showZeroState == 'NoShow' && data.labelTextType == 'Number') {
        data.text = (data.text).replace(/(^0+)/, '');
    }

    // if(data.text !== undefined) {
    //     if(data.textDirection == 'Vertical') {
    //         textAlignVertical(data.text, "PNormalLabel" + normalLabelNum); // 아직 구현 안함
    //     } else if(data.textDirection == 'Horizontal') {
    //         toStringFn(data.text, "PNormalLabel" + normalLabelNum); // 한 글자씩 찍기
    //     }
    // }
    //fontSizeAutoLessen(groupFieldArray[groupFieldNum][0], '#DataLabel' + dataLabelNum);

    // 자간 속성
    if (data.characterSpacing !== undefined) {
        characterSpacing(data.text, data.characterSpacing, "PDataLabel" + dataLabelNum);
    }

    // 줄 간격 속성
    if (data.lineSpacing !== undefined) {
        lineSpacing(data.text, data.lineSpacing, "PDataLabel" + dataLabelNum);
    }

    // Clipping 속성
    if (data.clipping == 'true') {
        dataLabelId.css({
            'text-overflow': 'clip',
            'overflow': 'hidden'
        });
        clipping(data.text, 'DataLabel' + dataLabelNum, 'PDataLabel' + dataLabelNum);
    }

    if (data.autosize == true) { // 자동 높이 조절
        autoSizeTrue('PDataLabel' + dataLabelNum);
    } else {
        if (data.text !== undefined) {
            switch (data.horizontalTextAlignment) {
                case 'Center' :
                    textAlignCenter(data.text, 'PDataLabel' + dataLabelNum, data.wordWrap, data.textDirection);
                    break;
                case 'Left' :
                    pId.css('text-align', 'left');
                    break;
                case 'Right' :
                    pId.css('text-align', 'right');
                    break;
                case 'Distributed' :
                    pId.text('');
                    textEqualDivision(data.text, "PDataLabel" + dataLabelNum); // 텍스트 수평 정렬이 균등 분할인 경우
                    break;
            }
            switch (data.verticalTextAlignment) {
                case 'Center' :
                    verticalCenter('PDataLabel' + dataLabelNum); // 텍스트 수직 정렬이 중간인 경우
                    break;
                case 'Top' :
                    verticalTop('PDataLabel' + dataLabelNum); // 텍스트 수직 정렬이 위쪽인 경우
                    break;
                case 'Bottom' :
                    verticalBottom('PDataLabel' + dataLabelNum); // 텍스트 수직 정렬이 아래쪽인 경우
                    break;
                case 'Distributed' :
                    verticalCenterEqualDivision(data.text, 'PDataLabel' + dataLabelNum, data.textDirection); // 텍스트 수직 정렬이 균등 분할인 경우
                    break;
            }
        }
    }
    // 폰트크기 자동 줄어듦
    if (data.autoFontType == 'AutoSmall') {
        fontSizeAutoSmall(data.text, 'PDataLabel' + dataLabelNum);
    }

    // 기본 여백 미사용
    if (data.isUseBasicInnerMargin == 'false') {
        pId.css({
            'margin-left': data.interMargin.left + 'px',
            'margin-right': data.interMargin.right + 'px',
            'margin-top': data.interMargin.top + 'px',
            'margin-bottom': data.interMargin.bottom + 'px',
        })
    }

    // 중간 줄 그리기
    if (data.isDrawStrikeOutLine == 'true') {
        pId.css('text-decoration', 'line-through');
    }

    // 밑줄 그리기
    if (data.isDrawUnderLine == 'true') {
        pId.css('text-decoration', 'underline');
    }

    // 중간 줄과 밑줄 모두 그릴 때
    if (data.isDrawStrikeOutLine == 'true' && data.isDrawUnderLine == 'true') {
        pId.css('text-decoration', 'line-through underline');
    }

    // 글자 크기 동일하게 하기
    if (data.isSameWidth == 'true') {
        var fontSize = (pId.css('font-size')).split('p');
        pId.css('word-spacing', (fontSize[0] - 1.181) + 'px');
    }

    pId.addClass('Label');
    pId.addClass(data.dataType);

    dataLabelNum++;
}

/******************************************************************
 기능 : NormalLabel(일반 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔

 수정 : Label에 'Label', 각자의 DataType 클래스 추가
 Date : 2018-08-24
 From 전형준

 수정 : NormalLabel의 크기 조정, 위치 이동, 내용 수정 추가.
 Date : 2018-08-27
 From hagdung-i

 수정 : 크기 조정, 위치 이동, 내용 수정 추가 기능 함수화 및 p 태그 내부 데이터 넣는 방식 변경.
 Date : 2018-08-28
 From hagdung-i
 ******************************************************************/
function drawingNormalLabel(data, divId) {
    var div = $('#' + divId);
    div.css('position', 'relative');
    div.append('<div id = "NormalLabel' + normalLabelNum + '"></div>');
    var normalLabelId = $('#NormalLabel' + normalLabelNum);

    normalLabelId.addClass("NormalLabel_scope");

    // console.log("div[0].id : ",div[0].id);

    // visible 속성
    if (data.visible == 'false') {
        normalLabelId.css('display', 'none');
    }
    // border 속성 관련
    if (data.noBorder == 'true') {
        normalLabelId.css('border', 'none');
    } else {
        if (data.borderThickness !== undefined) {
            var leftBorder = borderDottedLine(data.borderDottedLines.leftDashStyle);
            var rightBorder = borderDottedLine(data.borderDottedLines.rightDashStyle);
            var bottomBorder = borderDottedLine(data.borderDottedLines.bottomDashStyle);
            var topBorder = borderDottedLine(data.borderDottedLines.topDashStyle);
            normalLabelId.css({
                'border-left': data.borderThickness.left + 'px ' + leftBorder + ' ' + data.leftBorderColor,
                'border-right': data.borderThickness.right + 'px ' + rightBorder + ' ' + data.rightBorderColor,
                'border-bottom': data.borderThickness.bottom + 'px ' + bottomBorder + ' ' + data.bottomBorderColor,
                'border-top': data.borderThickness.top + 'px ' + topBorder + ' ' + data.topBorderColor
            });
        } else {
            normalLabelId.css('border', '1px solid black');
        }
    }
    normalLabelId.css({
        'width': data.rectangle.width,
        'height': data.rectangle.height,
        'position': 'absolute',
        'left': data.rectangle.x + 'px',
        'top': data.rectangle.y + 'px',
        // 'text-align': 'center',
        // 'overflow': 'visible',
        'background-color': data.backGroundColor,
        'zIndex': 999,
        'white-space': 'nowrap', // 줄바꿈 안되게하는거
        'background-color': data.backGroundColor, // 배경색
        'color': data.textColor // 글자 색
    });

    // 라벨 형태 -> 원
    if (data.labelShape == 'Circle') {
        normalLabelId.css({
            'border-radius': '100%', // LabelShape가 원일 때
            'border': data.circleLineThickness + 'px solid ' + data.circleLineColor // (원 테두리 두께) 속성이 뭔지 모르겠땀
        });
    }

    // 그라데이션을 사용할 때
    if (data.gradientLB.isUseGradient == 'true') {
        gradientCase(data.gradientLB.startGradientDirection, data.gradientLB.gradientDirection, data.gradientLB.gradientColor, data.backGroundColor, 'NormalLabel' + normalLabelNum);
    }

    // 자동 줄바꾸기
    if (data.wordWrap == 'true') {
        normalLabelId.css('white-space', 'normal');
    }

    normalLabelId.append('<p id = "PNormalLabel' + normalLabelNum + '"></p>');
    Lock_check(data, normalLabelId, div);

    var pId = $('#PNormalLabel' + normalLabelNum);

    // fontSize의 단위를 통일하기위해
    var fontSizePt = changeFontUnit(data.fontSize);

    pId.css({
        'font-size': fontSizePt,
        'font-family': data.fontFamily,
        'font-weight': data.fontWeight,
        'font-style': data.fontStyle
    });

    // 금액 표시 방법 한글
    // if (data.numberToTextType == 'KOR') {
    //     var KOR = numberToKOR((data.text).replace(/[^0-9]/g, ""));
    //     var tempKOR = (data.text).match(/[0-9]/gi);
    //     var toStringKOR = tempKOR[0];
    //     for (var i = 1; i < tempKOR.length; i++) {
    //         toStringKOR += tempKOR[i];
    //     }
    //     toStringKOR = toStringKOR.toString();
    // }
    //
    // // 금액 표시 방법 한자
    // if (data.numberToTextType == 'CHN') {
    //     var CHN = numberToCHN((data.text).replace(/[^0-9]/g, ""));
    // }

    // 0값 표시 여부가 NoShow(표시하지 않음) 이고 문자 형식이 숫자 일 때
    if (data.showZeroState == 'NoShow' && data.labelTextType == 'Number') {
        data.text = (data.text).replace(/(^0+)/, '');
    }

    if (data.text !== undefined) {
        if (data.textDirection == 'Vertical') {
            textAlignVertical(data.text, "PNormalLabel" + normalLabelNum);
        } else if (data.textDirection == 'Horizontal') {
            toStringFn(data.text, "PNormalLabel" + normalLabelNum);
        }
    }

    // 자간 속성
    if (data.characterSpacing !== undefined) {
        characterSpacing(data.text, data.characterSpacing, "PNormalLabel" + normalLabelNum);
    }

    // 줄 간격 속성
    if (data.lineSpacing !== undefined) {
        lineSpacing(data.text, data.lineSpacing, "PNormalLabel" + normalLabelNum);
    }
    var test = $('#' + "PNormalLabel" + normalLabelNum + ' br');
    // Clipping 속성
    if (data.clipping == 'true') {
        normalLabelId.css({
            'text-overflow': 'clip',
            'overflow': 'hidden'
        });
        clipping(data.text, 'NormalLabel' + normalLabelNum, 'PNormalLabel' + normalLabelNum);
    }

    if (data.autosize == true) { // 자동 높이 조절
        autoSizeTrue('PNormalLabel' + normalLabelNum);
    } else {
        if (data.text !== undefined) {
            switch (data.horizontalTextAlignment) {
                case 'Center' :
                    textAlignCenter(data.text, 'PNormalLabel' + normalLabelNum, data.wordWrap, data.textDirection);
                    break;
                case 'Left' :
                    pId.css('text-align', 'left');
                    break;
                case 'Right' :
                    pId.css('text-align', 'right');
                    break;
                case 'Distributed' :
                    pId.text('');
                    textEqualDivision(data.text, "PNormalLabel" + normalLabelNum); // 텍스트 수평 정렬이 균등 분할인 경우
                    break;
            }
            switch (data.verticalTextAlignment) {
                case 'Center' :
                    verticalCenter('PNormalLabel' + normalLabelNum); // 텍스트 수직 정렬이 중간인 경우
                    break;
                case 'Top' :
                    verticalTop('PNormalLabel' + normalLabelNum); // 텍스트 수직 정렬이 위쪽인 경우
                    break;
                case 'Bottom' :
                    verticalBottom('PNormalLabel' + normalLabelNum); // 텍스트 수직 정렬이 아래쪽인 경우
                    break;
                case 'Distributed' :
                    verticalCenterEqualDivision(data.text, 'PNormalLabel' + normalLabelNum, data.textDirection); // 텍스트 수직 정렬이 균등 분할인 경우
                    break;
            }
        }
    }
    // 폰트크기 자동 줄어듦
    if (data.autoFontType == 'AutoSmall') {
        fontSizeAutoSmall(data.text, 'PNormalLabel' + normalLabelNum);
    }

    // 기본 여백 미사용
    if (data.isUseBasicInnerMargin == 'false') {
        pId.css({
            'margin-left': data.interMargin.left + 'px',
            'margin-right': data.interMargin.right + 'px',
            'margin-top': data.interMargin.top + 'px',
            'margin-bottom': data.interMargin.bottom + 'px',
        });
    }

    // 중간 줄 그리기
    if (data.isDrawStrikeOutLine == 'true') {
        pId.css('text-decoration', 'line-through');
    }

    // 밑줄 그리기
    if (data.isDrawUnderLine == 'true') {
        pId.css('text-decoration', 'underline');
    }

    // 중간 줄과 밑줄 모두 그릴 때
    if (data.isDrawStrikeOutLine == 'true' && data.isDrawUnderLine == 'true') {
        pId.css('text-decoration', 'line-through underline');
    }

    // 글자 크기 동일하게 하기
    if (data.isSameWidth == 'true') {
        var fontSize = (pId.css('font-size')).split('p');
        pId.css('word-spacing', (fontSize[0] - 1.181) + 'px');
    }

    pId.addClass('Label');
    pId.addClass('NormalLabel');
    normalLabelNum++;

}

/******************************************************************
 기능 : Expression(수식 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔

 수정 : Label에 'Label', 각자의 DataType 클래스 추가
 Date : 2018-08-24
 From 전형준

 수정 : 수식 라벨의 크기 조정, 위치 이동, 내용 수정 추가.
 Date : 2018-08-27
 From hagdung-i
 ******************************************************************/
function drawingExpression(data, divId) {
    var div = $('#' + divId);
    div.css('position', 'relative');
    div.append('<div id = "Expression' + expressionNum + '">Expression</div>');
    var expressionId = $('#Expression' + expressionNum);
    expressionId.addClass("NormalLabel_scope");

    // visible 속성
    if (data.visible == 'false') {
        expressionId.css('display', 'none');
    }

    //// 추가 부분 18.08.28 YeSol
    if (data.noBorder == 'true') {
        expressionId.css('border', 'none');
    } else {
        if (data.borderThickness !== undefined) {
            var leftBorder = borderDottedLine(data.borderDottedLines.leftDashStyle);
            var rightBorder = borderDottedLine(data.borderDottedLines.rightDashStyle);
            var bottomBorder = borderDottedLine(data.borderDottedLines.bottomDashStyle);
            var topBorder = borderDottedLine(data.borderDottedLines.topDashStyle);
            expressionId.css({
                'border-left': data.borderThickness.left + 'px ' + leftBorder + ' ' + data.leftBorderColor,
                'border-right': data.borderThickness.right + 'px ' + rightBorder + ' ' + data.rightBorderColor,
                'border-bottom': data.borderThickness.bottom + 'px ' + bottomBorder + ' ' + data.bottomBorderColor,
                'border-top': data.borderThickness.top + 'px ' + topBorder + ' ' + data.topBorderColor
            });
        } else {
            expressionId.css('border', '1px solid black');
        }
    }
    expressionId.css({
        'width': data.rectangle.width,
        'height': data.rectangle.height,
        'position': 'absolute',
        'left': data.rectangle.x + 'px',
        'top': data.rectangle.y + 'px',
        'text-align': 'center',
        'white-space': 'nowrap', // 줄바꿈 안되게하는거
        'background-color': data.backGroundColor, // 배경색
        'color': data.textColor // 글자 색
    });


    // 라벨 형태 -> 원
    if (data.labelShape == 'Circle') {
        expressionId.css({
            'border-radius': '100%', // LabelShape가 원일 때
            'border': data.circleLineThickness + 'px solid ' + data.circleLineColor // (원 테두리 두께) 속성이 뭔지 모르겠땀
        })
    }

    // 그라데이션을 사용할 때
    if (data.gradientLB.isUseGradient == 'true') {
        gradientCase(data.gradientLB.startGradientDirection, data.gradientLB.gradientDirection, data.gradientLB.gradientColor, data.backGroundColor, 'Expression' + expressionNum);
    }

    // 자동 줄바꾸기
    if (data.wordWrap == 'true') {
        expressionId.css('white-space', 'normal');
    }
    expressionId.append('<p id = "PExpression' + expressionNum + '"></p>');
    Lock_check(data, expressionId, div);
    var pId = $('#PExpression' + expressionNum);

    // fontSize의 단위를 통일하기위해
    var fontSizePt = changeFontUnit(data.fontSize);

    pId.css({
        'font-size': fontSizePt,
        'font-family': data.fontFamily,
        'font-weight': data.fontStyle
    });
    //$('#PExpression' + expressionNum).append(data.text);
    // // 금액 표시 방법 한글
    // if(data.numberToTextType == 'KOR') {
    //     var KOR = numberToKOR((data.text).replace(/[^0-9]/g, ""));
    // }
    //
    // // 금액 표시 방법 한자
    // if(data.numberToTextType == 'CHN') {
    //     var CHN = numberToCHN((data.text).replace(/[^0-9]/g, ""));
    // }

    // 0값 표시 여부가 NoShow(표시하지 않음) 이고 문자 형식이 숫자 일 때
    if (data.showZeroState == 'NoShow' && data.labelTextType == 'Number') {
        data.text = (data.text).replace(/(^0+)/, '');
    }

    if (data.text !== undefined) {
        if (data.textDirection == 'Vertical') {
            textAlignVertical(data.text, "PExpression" + expressionNum); // 아직 구현 안함
        } else if (data.textDirection == 'Horizontal') {
            toStringFn(data.text, "PExpression" + expressionNum); // 한 글자씩 찍기
        }
    }

    // 자간 속성
    if (data.characterSpacing !== undefined) {
        characterSpacing(data.text, data.characterSpacing, "PExpression" + expressionNum);
    }

    // 줄 간격 속성
    if (data.lineSpacing !== undefined) {
        lineSpacing(data.text, data.lineSpacing, "PExpression" + expressionNum);
    }

    // Clipping 속성
    if (data.clipping == 'true') {
        expressionId.css({
            'text-overflow': 'clip',
            'overflow': 'hidden'
        });
        clipping(data.text, 'Expression' + expressionNum, 'PExpression' + expressionNum);
    }

    if (data.autosize == true) { // 자동 높이 조절
        autoSizeTrue('PExpression' + expressionNum);
    } else {
        if (data.text !== undefined) {
            switch (data.horizontalTextAlignment) {
                case 'Center' :
                    textAlignCenter(data.text, 'PExpression' + expressionNum, data.wordWrap, data.textDirection);
                    break;
                case 'Left' :
                    pId.css('text-align', 'left');
                    break;
                case 'Right' :
                    pId.css('text-align', 'right');
                    break;
                case 'Distributed' :
                    pId.text('');
                    textEqualDivision(data.text, "PExpression" + expressionNum); // 텍스트 수평 정렬이 균등 분할인 경우
                    break;
            }
            switch (data.verticalTextAlignment) {
                case 'Center' :
                    verticalCenter('PExpression' + expressionNum); // 텍스트 수직 정렬이 중간인 경우
                    break;
                case 'Top' :
                    verticalTop('PExpression' + expressionNum); // 텍스트 수직 정렬이 위쪽인 경우
                    break;
                case 'Bottom' :
                    verticalBottom('PExpression' + expressionNum); // 텍스트 수직 정렬이 아래쪽인 경우
                    break;
                case 'Distributed' :
                    verticalCenterEqualDivision(data.text, 'PExpression' + expressionNum, data.textDirection); // 텍스트 수직 정렬이 균등 분할인 경우
                    break;
            }
        }
    }
    // 폰트크기 자동 줄어듦
    if (data.autoFontType == 'AutoSmall') {
        fontSizeAutoSmall(data.text, 'PExpression' + expressionNum);
    }

    // 기본 여백 미사용
    if (data.isUseBasicInnerMargin == 'false') {
        pId.css({
            'margin-left': data.interMargin.left + 'px',
            'margin-right': data.interMargin.right + 'px',
            'margin-top': data.interMargin.top + 'px',
            'margin-bottom': data.interMargin.bottom + 'px',
        });
    }

    // 중간 줄 그리기
    if (data.isDrawStrikeOutLine == 'true') {
        pId.css('text-decoration', 'line-through');
    }

    // 밑줄 그리기
    if (data.isDrawUnderLine == 'true') {
        pId.css('text-decoration', 'underline');
    }

    // 중간 줄과 밑줄 모두 그릴 때
    if (data.isDrawStrikeOutLine == 'true' && data.isDrawUnderLine == 'true') {
        pId.css('text-decoration', 'line-through underline');
    }

    // 글자 크기 동일하게 하기
    if (data.isSameWidth == 'true') {
        var fontSize = (pId.css('font-size')).split('p');
        pId.css('word-spacing', (fontSize[0] - 1.181) + 'px');
    }

    pId.addClass('Label');
    pId.addClass(data.dataType);

    expressionNum++;
}

/******************************************************************
 테이블의 TitleLabel 에서만 그룹핑을 할 수 있음
 ******************************************************************/
/******************************************************************
 기능 : GroupLabel(그룹 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔

 수정 : GroupLabel의 크기 조정, 위치 이동, 내용 수정 추가.
 Date : 2018-08-27
 From hagdung-i
 ******************************************************************/
function drawingGroupLabel(data, divId) {
    var div = $('#' + divId);
    div.css('position', 'relative');
    div.append('<div id = "GroupLabel' + groupLabelNum + '">GroupLabel</div>');

    var groupLabelId = $('#GroupLabel' + groupLabelNum);
    groupLabelId.addClass("NormalLabel_scope");

    // visible 속성
    if (data.visible == 'false') {
        groupLabelId.css('display', 'none');
    }

    //// 추가 부분 18.08.28 YeSol
    if (data.noBorder == 'true') {
        groupLabelId.css('border', 'none');
    } else {
        if (data.borderThickness !== undefined) {
            var leftBorder = borderDottedLine(data.borderDottedLines.leftDashStyle);
            var rightBorder = borderDottedLine(data.borderDottedLines.rightDashStyle);
            var bottomBorder = borderDottedLine(data.borderDottedLines.bottomDashStyle);
            var topBorder = borderDottedLine(data.borderDottedLines.topDashStyle);
            groupLabelId.css({
                'border-left': data.borderThickness.left + 'px ' + leftBorder + ' ' + data.leftBorderColor,
                'border-right': data.borderThickness.right + 'px ' + rightBorder + ' ' + data.rightBorderColor,
                'border-bottom': data.borderThickness.bottom + 'px ' + bottomBorder + ' ' + data.bottomBorderColor,
                'border-top': data.borderThickness.top + 'px ' + topBorder + ' ' + data.topBorderColor
            });
        } else {
            groupLabelId.css('border', '1px solid black');
        }
    }

    groupLabelId.css({
        'width': data.rectangle.width,
        'height': data.rectangle.height,
        'position': 'absolute',
        'left': data.rectangle.x + 'px',
        'top': data.rectangle.y + 'px',
        'text-align': 'center',
        'white-space': 'nowrap', // 줄바꿈 안되게하는거
        'background-color': data.backGroundColor, // 배경색
        'color': data.textColor // 글자 색
    });

    // 그라데이션을 사용할 때
    if (data.gradientLB.isUseGradient == 'true') {
        gradientCase(data.gradientLB.startGradientDirection, data.gradientLB.gradientDirection, data.gradientLB.gradientColor, data.backGroundColor, 'GroupLabel' + groupLabelNum);
    }

    // 자동 줄바꾸기
    if (data.wordWrap == 'true') {
        groupLabelId.css('white-space', 'normal');
    }

    groupLabelId.append('<p id = "PGroupLabel' + groupLabelNum + '"></p>');
    Lock_check(data, groupLabelId, div);
    var pId = $('#PGroupLabel' + groupLabelNum);

    // fontSize의 단위를 통일하기위해
    var fontSizePt = changeFontUnit(data.fontSize);

    pId.css({
        'font-size': fontSizePt,
        'font-family': data.fontFamily,
        'font-weight': data.fontStyle
    });
    //$('#PGroupLabel' + groupLabelNum).append(data.text);

    // // 금액 표시 방법 한글
    // if(data.numberToTextType == 'KOR') {
    //     var KOR = numberToKOR((data.text).replace(/[^0-9]/g, ""));
    // }
    //
    // // 금액 표시 방법 한자
    // if(data.numberToTextType == 'CHN') {
    //     var CHN = numberToCHN((data.text).replace(/[^0-9]/g, ""));
    // }

    // 자간 속성
    if (data.characterSpacing !== undefined) {
        characterSpacing(data.text, data.characterSpacing, "PGroupLabel" + groupLabelNum);
    }

    // 줄 간격 속성
    if (data.lineSpacing !== undefined) {
        lineSpacing(data.text, data.lineSpacing, "PGroupLabel" + groupLabelNum);
    }

    // Clipping 속성
    if (data.clipping == 'true') {
        groupLabelId.css({
            'text-overflow': 'clip',
            'overflow': 'hidden'
        });
        clipping(data.text, 'GroupLabel' + groupLabelNum, 'PGroupLabel' + groupLabelNum);
    }

    if (data.autosize == true) { // 자동 높이 조절
        autoSizeTrue('PGroupLabel' + groupLabelNum);
    } else {
        if (data.text !== undefined) {
            switch (data.horizontalTextAlignment) {
                case 'Center' :
                    textAlignCenter(data.text, 'PGroupLabel' + groupLabelNum, data.wordWrap, data.textDirection);
                    break;
                case 'Left' :
                    pId.css('text-align', 'left');
                    break;
                case 'Right' :
                    pId.css('text-align', 'right');
                    break;
                case 'Distributed' :
                    pId.text('');
                    textEqualDivision(data.text, "PGroupLabel" + groupLabelNum); // 텍스트 수평 정렬이 균등 분할인 경우
                    break;
            }
            switch (data.verticalTextAlignment) {
                case 'Center' :
                    verticalCenter('PGroupLabel' + groupLabelNum); // 텍스트 수직 정렬이 중간인 경우
                    break;
                case 'Top' :
                    verticalTop('PGroupLabel' + groupLabelNum); // 텍스트 수직 정렬이 위쪽인 경우
                    break;
                case 'Bottom' :
                    verticalBottom('PGroupLabel' + groupLabelNum); // 텍스트 수직 정렬이 아래쪽인 경우
                    break;
                case 'Distributed' :
                    verticalCenterEqualDivision(data.text, 'PGroupLabel' + groupLabelNum, data.textDirection); // 텍스트 수직 정렬이 균등 분할인 경우
                    break;
            }
        }
    }

    // 폰트크기 자동 줄어듦
    if (data.autoFontType == 'AutoSmall') {
        fontSizeAutoSmall(data.text, 'PGroupLabel' + groupLabelNum);
    }

    // 기본 여백 미사용
    if (data.isUseBasicInnerMargin == 'false') {
        pId.css({
            'margin-left': data.interMargin.left + 'px',
            'margin-right': data.interMargin.right + 'px',
            'margin-top': data.interMargin.top + 'px',
            'margin-bottom': data.interMargin.bottom + 'px',
        })
    }

    // 중간 줄 그리기
    if (data.isDrawStrikeOutLine == 'true') {
        pId.css('text-decoration', 'line-through');
    }

    // 밑줄 그리기
    if (data.isDrawUnderLine == 'true') {
        pId.css('text-decoration', 'underline');
    }

    // 중간 줄과 밑줄 모두 그릴 때
    if (data.isDrawStrikeOutLine == 'true' && data.isDrawUnderLine == 'true') {
        pId.css('text-decoration', 'line-through underline');
    }

    // 글자 크기 동일하게 하기
    if (data.isSameWidth == 'true') {
        var fontSize = (pId.css('font-size')).split('p');
        pId.css('word-spacing', (fontSize[0] - 1.181) + 'px');
    }

    pId.addClass('Label');
    pId.addClass(data.dataType);

    groupLabelNum++;
}

/******************************************************************
 기능 : ParameterLabel(파라미터 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔

 수정 : ParameterLabel의 크기 조정, 위치 이동, 내용 수정 추가.
 Date : 2018-08-27
 From hagdung-i
 ******************************************************************/
function drawingParameterLabel(data, divId) {
    var div = $('#' + divId);
    div.css('position', 'relative');
    div.append('<div id = "ParameterLabel' + parameterLabelNum + '"></div>');

    var parameterLabelId = $('#ParameterLabel' + parameterLabelNum);

    parameterLabelId.addClass("NormalLabel_scope");

    // visible 속성
    if (data.visible == 'false') {
        parameterLabelId.css('display', 'none');
    }

    //// 추가 부분 18.08.28 YeSol
    if (data.noBorder == 'true') {
        parameterLabelId.css('border', 'none');
    } else {
        if (data.borderThickness !== undefined) {
            var leftBorder = borderDottedLine(data.borderDottedLines.leftDashStyle);
            var rightBorder = borderDottedLine(data.borderDottedLines.rightDashStyle);
            var bottomBorder = borderDottedLine(data.borderDottedLines.bottomDashStyle);
            var topBorder = borderDottedLine(data.borderDottedLines.topDashStyle);
            parameterLabelId.css({
                'border-left': data.borderThickness.left + 'px ' + leftBorder + ' ' + data.leftBorderColor,
                'border-right': data.borderThickness.right + 'px ' + rightBorder + ' ' + data.rightBorderColor,
                'border-bottom': data.borderThickness.bottom + 'px ' + bottomBorder + ' ' + data.bottomBorderColor,
                'border-top': data.borderThickness.top + 'px ' + topBorder + ' ' + data.topBorderColor
            });
        } else {
            parameterLabelId.css('border', '1px solid black');
        }
    }

    parameterLabelId.css({
        'width': data.rectangle.width,
        'height': data.rectangle.height,
        'position': 'absolute',
        'left': data.rectangle.x + 'px',
        'top': data.rectangle.y + 'px',
        'text-align': 'center',
        'white-space': 'nowrap', // 줄바꿈 안되게하는거
        'background-color': data.backGroundColor, // 배경색
        'color': data.textColor // 글자 색
    });

    // 라벨 형태 -> 원
    if (data.labelShape == 'Circle') {
        parameterLabelId.css({
            'border-radius': '100%', // LabelShape가 원일 때
            'border': data.circleLineThickness + 'px solid ' + data.circleLineColor // (원 테두리 두께) 속성이 뭔지 모르겠땀
        })
    }

    // 그라데이션을 사용할 때
    if (data.gradientLB.isUseGradient == 'true') {
        gradientCase(data.gradientLB.startGradientDirection, data.gradientLB.gradientDirection, data.gradientLB.gradientColor, data.backGroundColor, 'ParameterLabel' + parameterLabelNum);
    }

    // 자동 줄바꾸기
    if (data.wordWrap == 'true') {
        parameterLabelId.css('white-space', 'normal');
    }

    parameterLabelId.append('<p id = "PParameterLabel' + parameterLabelNum + '"></p>');
    Lock_check(data, parameterLabelId, div);
    var pId = $('#PParameterLabel' + parameterLabelNum);

    // fontSize의 단위를 통일하기위해
    var fontSizePt = changeFontUnit(data.fontSize);

    pId.css({
        'font-size': fontSizePt,
        'font-family': data.fontFamily,
        'font-weight': data.fontStyle
    });
    //$('#PParameterLabel' + parameterLabelNum).append(data.text);

    // // 금액 표시 방법 한글
    // if(data.numberToTextType == 'KOR') {
    //     var KOR = numberToKOR((data.text).replace(/[^0-9]/g, ""));
    // }
    //
    // // 금액 표시 방법 한자
    // if(data.numberToTextType == 'CHN') {
    //     var CHN = numberToCHN((data.text).replace(/[^0-9]/g, ""));
    // }

    paramTable.NewDataSet.Table1.forEach(function (paramData) {
        if (data.parameterName == paramData.Key._text) {
            data.text = paramData.Value._text;
        }
    });

    // 0값 표시 여부가 NoShow(표시하지 않음) 이고 문자 형식이 숫자 일 때
    if (data.showZeroState == 'NoShow' && data.labelTextType == 'Number') {
        data.text = (data.text).replace(/(^0+)/, '');
    }

    if (data.text !== undefined) {
        if (data.textDirection == 'Vertical') {
            textAlignVertical(data.text, "PParameterLabel" + parameterLabelNum); // 아직 구현 안함
        } else if (data.textDirection == 'Horizontal') {
            toStringFn(data.text, "PParameterLabel" + parameterLabelNum); // 한 글자씩 찍기
        }
    }

    // 자간 속성
    if (data.characterSpacing !== undefined) {
        characterSpacing(data.text, data.characterSpacing, "PParameterLabel" + parameterLabelNum);
    }

    // 줄 간격 속성
    if (data.lineSpacing !== undefined) {
        lineSpacing(data.text, data.lineSpacing, "PParameterLabel" + parameterLabelNum);
    }

    // Clipping 속성
    if (data.clipping == 'true') {
        parameterLabelId.css({
            'text-overflow': 'clip',
            'overflow': 'hidden'
        });
        clipping(data.text, 'ParameterLabel' + parameterLabelNum, 'PParameterLabel' + parameterLabelNum);
    }

    if (data.autosize == true) { // 자동 높이 조절
        autoSizeTrue('PParameterLabel' + parameterLabelNum);
    } else {
        if (data.text !== undefined) {
            switch (data.horizontalTextAlignment) {
                case 'Center' :
                    textAlignCenter(data.text, 'PParameterLabel' + parameterLabelNum, data.wordWrap, data.textDirection);
                    break;
                case 'Left' :
                    pId.css('text-align', 'left');
                    break;
                case 'Right' :
                    pId.css('text-align', 'right');
                    break;
                case 'Distributed' :
                    pId.text('');
                    textEqualDivision(data.text, "PParameterLabel" + parameterLabelNum); // 텍스트 수평 정렬이 균등 분할인 경우
                    break;
            }
            switch (data.verticalTextAlignment) {
                case 'Center' :
                    verticalCenter('PParameterLabel' + parameterLabelNum); // 텍스트 수직 정렬이 중간인 경우
                    break;
                case 'Top' :
                    verticalTop('PParameterLabel' + parameterLabelNum); // 텍스트 수직 정렬이 위쪽인 경우
                    break;
                case 'Bottom' :
                    verticalBottom('PParameterLabel' + parameterLabelNum); // 텍스트 수직 정렬이 아래쪽인 경우
                    break;
                case 'Distributed' :
                    verticalCenterEqualDivision(data.text, 'PParameterLabel' + parameterLabelNum, data.textDirection); // 텍스트 수직 정렬이 균등 분할인 경우
                    break;
            }
        }
    }

    // 폰트크기 자동 줄어듦
    if (data.autoFontType == 'AutoSmall') {
        fontSizeAutoSmall(data.text, 'PParameterLabel' + parameterLabelNum);
    }

    // 기본 여백 미사용
    if (data.isUseBasicInnerMargin == 'false') {
        pId.css({
            'margin-left': data.interMargin.left + 'px',
            'margin-right': data.interMargin.right + 'px',
            'margin-top': data.interMargin.top + 'px',
            'margin-bottom': data.interMargin.bottom + 'px',
        })
    }

    // 중간 줄 그리기
    if (data.isDrawStrikeOutLine == 'true') {
        pId.css('text-decoration', 'line-through');
    }

    // 밑줄 그리기
    if (data.isDrawUnderLine == 'true') {
        pId.css('text-decoration', 'underline');
    }

    // 중간 줄과 밑줄 모두 그릴 때
    if (data.isDrawStrikeOutLine == 'true' && data.isDrawUnderLine == 'true') {
        pId.css('text-decoration', 'line-through underline');
    }

    // 글자 크기 동일하게 하기
    if (data.isSameWidth == 'true') {
        var fontSize = (pId.css('font-size')).split('p');
        pId.css('word-spacing', (fontSize[0] - 1.181) + 'px');
    }

    pId.addClass('Label');
    pId.addClass(data.dataType);

    parameterLabelNum++;
}

/******************************************************************
 기능 : 시간 또는 날짜를 출력할 때 한 자리 숫자일 경우 0을 붙여줘서 두 자리 숫자로 출력 해주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function plusZero(data) {
    var str = data.toString();
    if (str.length == 1) {
        data = '0' + data;
    }
    return data;
}

/******************************************************************
 기능 : 한 글자씩 출력하는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function toStringFn(text, pTagId) {
    var tag = $('#' + pTagId);
    var str = text.toString();
    var appendStr = str[0];
    for (var i = 1; i < str.length; i++) {
        appendStr += str[i];
    }
    tag.append(appendStr);
}

/******************************************************************
 기능 : 가운데 정렬 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function textAlignCenter(text, pTagId, wordWrap, textDirection) {
    var tag = $('#' + pTagId);

    var fontSize = (tag.css('font-size')).split('px');
    if (wordWrap == false && textDirection == 'Horizontal') {
        var parentWidth = (tag.parent().css('width')).split('px');
        var str = text.toString();
        var temp = str.split('<br/>');

        var space = temp[0].match(/\s/gi); // 공백 찾기
        var eng = temp[0].match(/[a-z]/gi); // 영문 찾기

        var max = temp[0].length; // 한 줄에 있는 텍스트 길이 중 제일 긴 길이를 넣을 변수
        var maxExceptSpace; // 길이가 제일 긴 텍스트에서 공백을 제외한 길이를 넣을 변수
        if (space != null) {
            maxExceptSpace = max - space.length;
        }
        if (eng != null) {
            maxExceptSpace = maxExceptSpace - eng.length * 0.5;
        }
        if (temp.length > 1) {
            for (var i = 1; i < temp.length; i++) {
                temp[i] = temp[i].trim();
                space = temp[i].match(/\s/gi); // 공백 찾기
                eng = temp[i].match(/[a-z]/gi); // 영문 찾기
                if (temp[i].length > max) {
                    if (space != null) {
                        max = temp[i].length;
                        maxExceptSpace = max - space.length;
                    } else {
                        max = temp[i].length;
                        maxExceptSpace = max;
                    }
                    if (eng != null) {
                        maxExceptSpace = maxExceptSpace - eng.length * (0.5);
                    }
                }
            }
        }

        maxExceptSpace = parseInt(maxExceptSpace);

        fontSize[0] = parseInt(fontSize[0]);
        parentWidth[0] = parseInt(parentWidth[0]);

        if (maxExceptSpace * fontSize[0] > parentWidth[0]) {
            var spacing = (parentWidth[0] - fontSize[0] * maxExceptSpace) / 2;

            tag.css({
                'left': spacing + 'px',
                'right': spacing + 'px',
                'position': 'absolute',
                'overflow': 'visible',
                'white-space': 'nowrap',
                'text-align': 'center'
            });
        } else {
            tag.css('text-align', 'center');
        }
    } else if (textDirection == 'Vertical') {
        var children = tag.children().text().length;
        var parentHeight = (tag.css('height')).split('p');
        var margin = (parentHeight[0] - children * fontSize[0]) / 2;
        tag.children().css({
            'margin-top': margin + 'px',
            'margin-bottom': margin + 'px'
        });
    } else {
        tag.css('text-align', 'center');
    }
}

//////////////// 왠지 야매로 만든 느낌
/******************************************************************
 기능 : 폰트 크기가 자동으로 줄어드는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function fontSizeAutoSmall(text, pTagId) {
    var tag = $('#' + pTagId);
    var parentWidth = (tag.parent().css('width')).split('p');
    var fontSize = (tag.css('font-size')).split('p');
    var str = text.toString();
    var temp = str.split('<br/>');

    var space = temp[0].match(/\s/gi);

    var max = temp[0].length;

    if (temp.length > 1) {
        for (var i = 1; i < temp.length; i++) {
            temp[i] = temp[i].trim();
            space = temp[i].match(/\s/gi); // 공백 찾기
            if (temp[i].length > max) {
                max = temp[i].length;
            }
        }
    }
    if ((max * fontSize[0]) > parentWidth[0]) {
        var smallFontSize = 0;
        if (space != null) {
            max = max - space.length;
            smallFontSize = Math.floor(parentWidth[0] / (max + space.length * 0.5) * 1.333);
        } else {
            smallFontSize = Math.floor(parentWidth[0] / max * 1.333); // 왜 1.333을 곱해주는거지..?
        }
        tag.css('font-size', smallFontSize + 'pt');
    }
}

/******************************************************************
 기능 : 텍스트 방향이 수직인 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function textAlignVertical(text, pTagId) {
    var pTag = $('#' + pTagId);
    var parentHeight = pTag.parent().css('height').split('p');
    var parentWidth = pTag.parent().css('width').split('p');
    pTag.css({
        'width': parentWidth[0] + 'px',
        'height': parentHeight[0] + 'px'
    });

    var str = text.toString();
    var strSplitByBr = str.split('<br/>');
    var fontSize = (pTag.css('font-size')).split('p');
    strSplitByBr.forEach(function (data, j) {
        data = data.trim();
        var appendStr = data[0];
        for (var i = 1; i < data.length; i++) {
            if (data[i] == ' ') {
                appendStr += '<br/>';
            } else {
                appendStr += data[i];
            }
        }

        var sonHeight = fontSize[0] * data.length;

        var sonTop = (parentHeight[0] - sonHeight) / 2;
        var style = 'white-space : normal; float : left; height : ' + parentHeight[0] + 'px; width : ' + fontSize[0] + 'px;/* margin-top : ' + sonTop + 'px; margin-bottom : ' + sonTop + 'px;*/ line-height : ' + fontSize[0] + 'px;';

        pTag.append('<p style = "' + style + '">' + appendStr + '</p>');
    });
    var marginLeft = (parentWidth[0] - strSplitByBr.length * fontSize[0]) / 2;
    pTag.css({
        'width': (strSplitByBr.length * fontSize[0]) + 'px',
        'height': parentHeight[0] + 'px',
        'margin-left': marginLeft + 'px'
    });
}

/******************************************************************
 기능 : 텍스트 수평 정렬이 균등분할인 속성을 구현한다.
 만든이 : 안예솔
 ******************************************************************/
function textEqualDivision(text, pTagId) {
    var tag = $('#' + pTagId);
    var str = text.toString();
    var fontSize = (tag.css('font-size')).split('p');
    var parentWidth = tag.css('width').split('p');
    var temp = str.split('<br/>');

    for (var i = 0; i < temp.length; i++) {
        temp[i] = temp[i].trim();
        var space = temp[i].match(/\s/gi);
        var num = 0;
        if (space != null) {
            num = temp[i].length - space.length;
        } else {
            num = temp[i].length
        }
        temp[i] = temp[i].replace(/\s/gi, '');
        var spacing = (parentWidth[0] - fontSize[0] * num) / (num - 1);
        tag.append('<p style = "letter-spacing : ' + spacing + 'px; margin:0px;">' + temp[i] + '</p>');
    }
}

/******************************************************************
 기능 : 텍스트 수직 정렬이 가운데인 속성을 구현한다.
 만든이 : 안예솔
 ******************************************************************/
function verticalCenter(pTagId) {
    var tag = $('#' + pTagId);
    var height = (tag.css('height')).split('p');

    var parentHeightString = tag.parent().css('height');
    var parentHeight = parentHeightString.split('p');

    if (parseInt(height[0]) >= parseInt(parentHeight[0])) {
        tag.css({
            'margin-top': '0px',
            'margin-bottom': '0px'
        });
    } else {
        var mid = (parentHeight[0] - height[0]) / 2;

        tag.css({
            'margin-top': mid + 'px',
            'margin-bottom': mid + 'px'
        });
    }
}

/******************************************************************
 기능 : 텍스트 수직 정렬이 위쪽인 속성을 구현한다.
 만든이 : 안예솔
 ******************************************************************/
function verticalTop(pTagId) {
    var tag = $('#' + pTagId);

    tag.css({
        'margin-top': '0px'
    });
}

/******************************************************************
 기능 : 텍스트 수직 정렬이 아래쪽인 속성을 구현한다.
 만든이 : 안예솔
 ******************************************************************/
function verticalBottom(pTagId) {
    var tag = $('#' + pTagId);
    var height = (tag.css('height')).split('p');

    var parentHeightString = tag.parent().css('height');
    var parentHeight = parentHeightString.split('p');

    var spacing = parentHeight[0] - height[0];

    tag.css({
        'margin-top': spacing + 'px',
        'margin-bottom': '0px'
    });
}

/******************************************************************
 기능 : 텍스트 수직 정렬이 균등분할인 속성을 구현한다.
 만든이 : 안예솔
 ******************************************************************/
function verticalCenterEqualDivision(text, pTagId, textDirection) {
    var tag = $('#' + pTagId);
    tag.css({
        'margin-top': '0px',
        'margin-bottom': '0px',
    });
    if (textDirection == 'Horizontal') { // 글자가 가로 방향일 때
        var fontSize = (tag.css('font-size')).split('p');
        // 16pt 이런 식으로 값이 받아져서 p앞으로 끊어서 숫자만 받아오려고 한 문자열 자르기 작업
        var brTag = $('#' + pTagId + ' br');
        var brCount = brTag.length;
        // text중에서 <br/>의 개수를 구함

        var parentHeightString = tag.parent().css('height');
        var parentHeight = parentHeightString.split('p');

        if (brCount == 0) {
            var mid = (parentHeight[0] - fontSize[0] * (brCount + 1)) / 2 - brCount;
            tag.css({
                'margin-top': mid + 'px',
                'margin-bottom': mid + 'px'
            });
        } else {
            var spacing = (parentHeight[0] - fontSize[0] * (brCount + 1)) / brCount - brCount;
            brTag.before('<p style = "height : ' + spacing + 'px; margin-top : 0px; margin-bottom : 0px;"></p>'); // <br/>이 나오기 전에 p태그를 삽입한 후 remove()로 삭제 (줄 바꿈을 위함)
            brTag.remove();
        }
    } else { // 글자가 세로 방향일 때
        tag.text('');
        var str = text.toString();
        var fontSize = (tag.css('font-size')).split('p');
        // // 16pt 이런 식으로 값이 받아져서 p앞으로 끊어서 숫자만 받아오려고 한 문자열 자르기 작업
        var parentHeight = (tag.css('height')).split('p');
        var temp = str.split('<br/>'); // <br/>태그를 중심으로 자름
        for (var i = 0; i < temp.length; i++) {
            temp[i] = temp[i].trim(); // 공백 제거
            var spacing = Math.ceil((parentHeight[0] - temp[i].length * fontSize[0]) / (temp[i].length - 1)) + 1; //
            var appendStr = temp[i][0];
            appendStr += '<p style = "height : ' + spacing + 'px; width: ' + fontSize[0] + 'px; margin-top : 0px; margin-bottom : 0px;"></p>';
            for (var j = 1; j < temp[i].length; j++) {
                if (j == (temp[i].length - 1)) {
                    appendStr += temp[i][j];
                    // appendStr += '<p style = "height : 22.669px; margin-top : 0px; margin-bottom : 0px"></p>';
                } else {
                    appendStr += temp[i][j];
                    appendStr += '<p style = "height : ' + Math.ceil(spacing) + 'px; width : ' + fontSize[0] + 'px; margin-top : 0px; margin-bottom : 0px;"></p>';
                }
            }
            tag.css({
                'margin-top': '0px',
                'margin-bottom': '0px'
            });
            tag.append('<p id = "vertical' + verticalPNum + '" style = width:' + fontSize[0] + 'px; height : ' + parentHeight[0] + 'px; margin-top:0px; margin-bottom:0px"></p>');
            var verticalPId = $('#vertical' + verticalPNum);
            verticalPId.css({
                'float': 'left',
                'margin-top': '0px',
                'margin-bottom': '0px'
            });
            verticalPId.append(appendStr);
            verticalPNum++;
        }
    }
}

/******************************************************************
 기능 : 자동 높이 조정 속성이 '예'일 경우를 구현한다.
 만든이 : 안예솔
 ******************************************************************/
function autoSizeTrue(pTagId) {
    var tag = $('#' + pTagId);
    var fontSize = (tag.css('font-size')).split('p');
    // 16pt 이런 식으로 값이 받아져서 p앞으로 끊어서 숫자만 받아오려고 한 문자열 자르기 작업

    var brTag = $('#' + pTagId + ' br');
    var brCount = brTag.length;
    // text중에서 <br/>의 개수를 구함

    var height = fontSize[0] * (brCount + 1) + brCount;
    tag.parent().css({
        'height': height,
        'top': height + fontSize[0] + 'px'
    });
    tag.css({
        'margin-top': '0px',
        'margin-bottom': '0px'
    });
}

/******************************************************************
 기능 : 줄 간격 속성을 구현한다.
 만든이 : 안예솔
 ******************************************************************/
function lineSpacing(text, spacing, pTagId) {
    var tag = $('#' + pTagId);
    tag.css({
        'margin-top': '0px',
        'margin-bottom': '0px',
    });

    var brTag = $('#' + pTagId + ' br');
    var brCount = brTag.length;
    // text중에서 <br/>의 개수를 구함

    var parentHeightString = tag.parent().css('height');
    var parentHeight = parentHeightString.split('p');
    var fontSize = (tag.css('font-size')).split('p');

    var mid = (parentHeight[0] - (fontSize[0] * (brCount + 1) + spacing * brCount)) / 2 - brCount;

    if (brCount == 0) {
        verticalCenter(pTagId);
    } else {
        tag.css({
            'margin-top': mid + 'px',
            'margin-bottom': mid + 'px'
        });
        brTag.before('<p style = "height : ' + spacing + 'px; margin-top : 0px; margin-bottom : 0px;"></p>'); // <br/>이 나오기 전에 p태그를 삽입한 후 remove()로 삭제 (줄 바꿈을 위함)
        brTag.remove();
    }
}

/******************************************************************
 기능 : 각각의 형태의 Label id와 데이터를 받아서 lock이 걸려있는 라벨을 제외한 라벨들의 위치 이동, 크기 조정 기능 추가.
 Date : 2018-08-24
 만든이 : hagdung-i
 ******************************************************************/
function Lock_check(data, Label_id, div) { //라벨 데이터, 드래그 리사이즈 영역, 벗어나면 안되는 영역
    var Lock_check;
    if (data.Lock === undefined) {
        Lock_check = data.Lock;
    } else {
        Lock_check = data.Lock._text;
    }
    if (!Lock_check) {
        Label_id.draggable({containment: "#" + div[0].id, zIndex: 999});
        Label_id.resizable({containment: "#" + div[0].id, autoHide: true});
    }
}

/******************************************************************
 기능 : 각각의 형태의 테이블의 id와 데이터를 받아서 lock이 걸려있는 라벨을 제외한 라벨들의 위치 이동, 크기 조정 기능 추가.
 Date : 2018-08-24
 만든이 : hagdung-i
 ******************************************************************/
function Lock_Check_Table(data, drag, resize, div) { //테이블 데이터, 드래거블 지정할 영역, 리사이즈 영역, 위치 이동시 벗어나면 안되는 영역
    var Lock_check;
    if (data.Lock === undefined) {
        Lock_check = data.Lock;
    } else {
        Lock_check = data.Lock._text;
    }
    if (!Lock_check) {
        drag.draggable({containment: "#" + div[0].id, zIndex: 999});
        resize.resizable({
            containment: "#" + div[0].id, autoHide: true,
            resize: function (event, ui) {   //테이블사이즈는 가로만 조정 가능하도록.
                ui.size.height = ui.originalSize.height;
            }
        });
    }
}

/******************************************************************
 기능 : 라벨 데이터 포맷을 확인해서 소수점 자릿수 설정 값에 따라 해당 형태로 변경 로직 추가.
 Date : 2018-08-24
 만든이 : hagdung-i
 ******************************************************************/
function format_check(data) {
    var test = data.formatType;
    var num_check = data.text.replace(/[^0-9]/g, ""); //데이터에서 숫자만 추출.
    var data_text = data.text;
    if (test == "AmountSosu") {   //추후, 다른 7가지의 속성을 알게되면 else if로 추가해야함.
        if (num_check != "") { //해당 데이터가 숫자인 경우내려
            data_text = num_check.replace(/\B(?=(\d{3})+(?!\d))/g, ","); //천단위로 콤마를 찍어줌.
        }
        return data_text;
    } else {
        return data_text;
    }
}

/******************************************************************
 기능 : 테이블 안의 데이터 포맷을 확인해서 소수점 자릿수 설정 값에 따라 해당 형태로 변경 로직 추가.
 Date : 2018-08-24
 만든이 : hagdung-i
 ******************************************************************/
function table_format_check(data, Label_id, key, table) {
    var test = table.formatType;
    var data_text;
    if (key != NaN) { //해당 데이터가 숫자일 경우
        if (test === "AmountSosu" || test === "MoneySosu" || test === "MoneySosu") {   //수량, 금액 소숫점 자리수 ###,###
            var parts = key.toString().split(".");
            if (parts[1]) {
                var decimal_cutting = parts[1].substring(0, 2);
                console.log("decimal_cutting : ", decimal_cutting);
                return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + decimal_cutting;
            }
            // data_text = key.replace(/\B(?=(\d{3})+(?!\d))/g, ","); //천단위로 콤마를 찍어줌.
            // return data_text;
        } else if (test === "WonHwaDangaSosu" || test === "ExchangeSosu" || test === "ExchangeRateSosu") {   //원화단가, 외화 소수점 자리수 ###,###.00
            var parts = key.toString().split(".");
            if (parts[1]) {
                var decimal_cutting = parts[1].substring(0, 2);
                console.log("decimal_cutting : ", decimal_cutting);
                return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
            }
        } else if (test === "ExchangeDangaSosu" || test === "BiyulSosu" || test === "ExchangeAmountSosu") { //외화단가, 비율 소수점 자리수 ###,###.000
            var parts = key.toString().split(".");
            if (parts[1]) {
                var decimal_cutting = parts[1].substring(0, 3);
                console.log("decimal_cutting : ", decimal_cutting);
                return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
            }
        } else {
            return key;
        }
    }
    return key;
}

/******************************************************************
 기능 : 테이블 항목별 크기조정 기능
 Date : 2018-08-30
 만든이 : hagdung-i
 ******************************************************************/
function table_column_controller(resize_area, Unalterable_area) {
    resize_area.resizable({
        containment: "#" + Unalterable_area[0].id, autoHide: true,
        resize: function (event, ui) {   //테이블사이즈는 가로만 조정 가능하도록.
            ui.size.height = ui.originalSize.height;
        }
    });
}
/******************************************************************
 기능 : 그라데이션의 시작방향, 방향 등을 판단하여 CSS 속성을 줄 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function gradientCase(startDirection, gradientDirection, gradientColor, backgroundColor, divId) {
    var div = $('#' + divId);
    if (startDirection == 'Forward' && gradientDirection == 'Horizontal') { // 시작 방향 정방향, 방향 수평
        div.css('background', 'linear-gradient(to right, ' + backgroundColor + ', ' + gradientColor + ')');
    } else if (startDirection == 'Forward' && gradientDirection == 'Vertical') { // 시작 방향 정방향, 방향 수직
        div.css('background', 'linear-gradient(to bottom, ' + backgroundColor + ', ' + gradientColor + '');
    } else if (startDirection == 'Forward' && gradientDirection == 'ForwardDiagonal') { // 시작 방향 정방향, 방향 하향
        div.css('background', 'linear-gradient(to bottom right, ' + backgroundColor + ', ' + gradientColor + '');
    } else if (startDirection == 'Forward' && gradientDirection == 'BackwardDiagonal') { // 시작 방향 정방향, 방향 상향
        div.css('background', 'linear-gradient(to bottom left, ' + backgroundColor + ', ' + gradientColor + ')');
    } else if (startDirection == 'RightToLeft' && gradientDirection == 'Horizontal') { // 시작 방향 역방향, 방향 수평
        div.css('background', 'linear-gradient(to left, ' + backgroundColor + ', ' + gradientColor + ')');
    } else if (startDirection == 'RightToLeft' && gradientDirection == 'Vertical') { // 시작 방향 역방향, 방향 수직
        div.css('background', 'linear-gradient(to top, ' + backgroundColor + ', ' + gradientColor + ')');
    } else if (startDirection == 'RightToLeft' && gradientDirection == 'ForwardDiagonal') { // 시작 방향 역방향, 방향 하향
        div.css('background', 'linear-gradient(to bottom right, ' + gradientColor + ', ' + backgroundColor + ')');
    } else if (startDirection == 'RightToLeft' && gradientDirection == 'BackwardDiagonal') { // 시작 방향 역방향, 방향 상향
        div.css('background', 'linear-gradient(to bottom left, ' + gradientColor + ', ' + backgroundColor + ')');
    } else if (startDirection == 'Center' && gradientDirection == 'Horizontal') { // 시작 방향 가운데, 방향 수평
        div.css('background', 'linear-gradient(to right, ' + gradientColor + ' 1%, ' + backgroundColor + ' 50%, ' + gradientColor + ' 100%)');
    } else if (startDirection == 'Center' && gradientDirection == 'Vertical') { // 시작 방향 가운데, 방향 수직
        div.css('background', 'linear-gradient(to bottom, ' + gradientColor + ' 1%, ' + backgroundColor + ' 50%, ' + gradientColor + ' 100%)');
    } else if (startDirection == 'Center' && gradientDirection == 'ForwardDiagonal') { // 시작 방향 가운데, 방향 하향
        div.css('background', 'linear-gradient(to bottom right, ' + gradientColor + ' 1%, ' + backgroundColor + ' 50%, ' + gradientColor + ' 100%)');
    } else if (startDirection == 'Center' && gradientDirection == 'BackwardDiagonal') { // 시작 방향 가운데, 방향 상향
        div.css('background', 'linear-gradient(to top right, ' + gradientColor + ' 1%, ' + backgroundColor + ' 50%, ' + gradientColor + ' 100%)');
    } else if (startDirection == 'Edge' && gradientDirection == 'Horizontal') { // 시작 방향 모서리, 방향 수평
        div.css('background', 'linear-gradient(to right, ' + backgroundColor + ' 1%, ' + gradientColor + ' 50%, ' + backgroundColor + ' 100%)');
    } else if (startDirection == 'Edge' && gradientDirection == 'Vertical') { // 시작 방향 모서리, 방향 수직
        div.css('background', 'linear-gradient(to bottom, ' + backgroundColor + ' 1%, ' + gradientColor + ' 50%, ' + backgroundColor + ' 100%)');
    } else if (startDirection == 'Edge' && gradientDirection == 'ForwardDiagonal') { // 시작 방향 모서리, 방향 하향
        div.css('background', 'linear-gradient(to bottom right, ' + backgroundColor + ' 1%, ' + gradientColor + ' 50%, ' + backgroundColor + ' 100%)');
    } else if (startDirection == 'Edge' && gradientDirection == 'BackwardDiagonal') { // 시작 방향 모서리, 방향 상향
        div.css('background', 'linear-gradient(to top right, ' + backgroundColor + ' 1%, ' + gradientColor + ' 50%, ' + backgroundColor + ' 100%)');
    }
}

/******************************************************************
 기능 : 클립핑을 구현할 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function clipping(text, divId, pTagId) {
    var div = $('#' + divId);
    var tag = $('#' + pTagId);
    var str = text.toString();
    var fontSize = (div.css('font-size')).split('pt');
    var parentWidth = div.css('width').split('px');
    var temp = str.split('<br/>');
    var max = temp[0].length;
    var space = temp[0].match(/\s/gi);
    if (temp.length > 1) {
        for (var i = 1; i < temp.length; i++) {
            temp[i] = temp[i].trim();
            space = temp[i].match(/\s/gi); // 공백 찾기
            if (temp[i].length > max) {
                if(space == null) {
                    max = temp[i].length;
                } else {
                    max = temp[i].length - space.length;
                }
            }
        }
    }
    if(space == null) {
        var spacing = (parentWidth[0] - fontSize[0] * max) / 2;
    } else {
        var spacing = (parentWidth[0] - fontSize[0] * max) / 2 + space.length * (fontSize[0] / 2);
    }
    tag.css({
        'left': spacing + 'px',
        'right': spacing + 'px',
        'position': 'absolute'
    });
}

/******************************************************************
 기능 : 금액을 한글로 바꿔주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function numberToKOR(num) {
    var number = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구", "십"];
    var unit = ["", "십", "백", "천", "", "십", "백", "천", "", "십", "백", "천", "", "십", "백", "천", "", "십", "백", "천", "", "십", "백", "천"];
    var result = "";
    for (var i = 0; i < num.length; i++) {
        var str = "";
        var han = number[num.charAt(num.length - (i + 1))];
        if (han != "") str += han + unit[i];
        if (i == 4 && han != "") str += "만";
        if (i == 8 && han != "") str += "억";
        if (i == 12 && han != "") str += "조";
        if (i == 16 && han != "") str += "경";
        if (i == 20 && han != "") str += "해";
        result = str + result;
    }
    if (num != 0) {
        result = result;
    }
    return result;
}

/******************************************************************
 기능 : 금액을 한자로 바꿔주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function numberToCHN(num) {
    // 한자 갖은자 사용
    var number = ["", "壹", "貳", "參", "肆", "伍", "陸", "柒", "捌", "玖", "拾"];
    var unit = ["", "拾", "百", "仟", "", "拾", "百", "仟", "", "拾", "百", "仟", "", "拾", "百", "仟", "", "拾", "百", "仟", "", "拾", "百", "仟"];
    var result = "";
    for (var i = 0; i < num.length; i++) {
        var str = "";
        var han = number[num.charAt(num.length - (i + 1))];
        if (han != "") str += han + unit[i];
        if (i == 4 && han != "") str += "萬";
        if (i == 8 && han != "") str += "億";
        if (i == 12 && han != "") str += "兆";
        if (i == 16 && han != "") str += "京";
        if (i == 20 && han != "") str += "垓";
        result = str + result;
    }
    if (num != 0) {
        result = result;
    }
    return result;
}

/******************************************************************
 기능 : borderStyle 을 css 문법에 맞게 수정하기 위한 함수이다.
 만든이 : 안예솔
 ******************************************************************/
function borderDottedLine(borderStyle) {
    switch (borderStyle) {
        case 'Solid' :
            return 'solid';
            break;
        case 'Dash' :
            return 'dashed';
            break;
        case 'Dot' :
            return 'dotted';
            break;
        case 'DashDot' :
            return 'dashed'; // css에 DashDot이라는 속성이 없음
            break;
        case 'DashDotDot' : // css에 DashDotDot이라는 속성이 없음
            return 'dotted';
            break;
        case 'Custom' : // 아직 뭔지 모름
            return 'solid';
            break;
    }
}

/******************************************************************
 기능 : font-size의 단위를 pt로 바꿔주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function changeFontUnit(fontSize) {
    // fontSize의 단위를 통일하기위해
    var temp = 0;
    var fontSizePt = 0;
    if (fontSize.indexOf('pt') != -1) {
        fontSizePt = fontSize;
    } else if (fontSize.indexOf('px') != -1) {
        temp = fontSize.split('px');
        fontSizePt = Math.round(temp[0] * 0.75) + 'pt';
    } else if (fontSize.indexOf('in') != -1) {
        temp = fontSize.split('in');
        fontSizePt = Math.round(temp[0] * 72) + 'pt';
    } else if (fontSize.indexOf('mm') != -1) {
        temp = fontSize.split('mm');
        fontSizePt = Math.round(temp[0] * 2.835) + 'pt';
    } else if (fontSize.indexOf('world') != -1) { // px이랑 같음
        temp = fontSize.split('world');
        fontSizePt = Math.round(temp[0] * 0.75) + 'pt';
    } else if (fontSize.indexOf('document') != -1) { // document 단위가 xml에 어떻게 저장되는지 모름
        temp = fontSize.split('document');
        fontSizePt = Math.round(temp[0] * 12 * 2.835) + 'pt';
    }
    return fontSizePt;
}

/******************************************************************
 기능 : 자간 속성을 구현한다.
 만든이 : 안예솔
 ******************************************************************/
function characterSpacing(text, spacing, pTagId) {
    if (text != undefined) {
        var tag = $('#' + pTagId);
        var str = text.toString();
        var strSplit = str.split('<br/>');
        strSplit[0] = strSplit[0].trim();
        var max = strSplit[0].length;
        var parentWidthString = tag.parent().css('width');
        var parentWidth = parentWidthString.split('p');
        var fontSize = (tag.css('font-size')).split('pt');

        if (strSplit.length > 1) {
            for (var i = 1; i < strSplit.length; i++) {
                strSplit[i] = strSplit[i].trim();
                if (max < strSplit[i].length) {
                    max = strSplit[i].length;
                }
            }
        }

        var mid = (parentWidth[0] - (fontSize[0] * max + spacing * (max - 1))) / 2;

        tag.css({
            'margin-left': mid + 'px',
            'margin-right': mid + 'px',
            'letter-spacing': spacing + 'px'
        });
    } else {
    }
}
