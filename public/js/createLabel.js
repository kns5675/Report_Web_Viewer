document.write("<script type='text/javascript' src='/js/label.js' ><" + "/script>");

var labelList = new Array();
var tableLabelList = new Array();
var tableList = new Array();
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
var groupFieldArray = new Array();
var titleArray = new Array(); // 그룹으로 묶었을 경우 titleName으로만 접근이 가능해져서 그 titleName을 담을 배열
var dynamicTableValueNum = 0;
var row = 0;

/******************************************************************
 기능 : ControlList의 유무를 판단하는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function judgementControlList(band, divId) {
    if (band.groupFieldArray !== undefined) {
        groupFieldArray = band.groupFieldArray;
    }
    if (!(band.controlList.anyType === undefined)) { // ControlList 태그 안에 뭔가가 있을 때
        var controlList = band.controlList.anyType;

        if (Array.isArray(controlList)) {
            controlList.forEach(function (list) {
                judgementLabel(list, divId);
            });
        } else {
            judgementLabel(controlList, divId);
        }
    } else {
    }
}

/******************************************************************
 기능 : 어떤 Label인지를 판단하여 객체를 생성해주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function judgementLabel(data, divId) {
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
        drawingDynamicTable(controlDynamicTable, tableLabelList, divId);

    } else if (attr == "ControlFixedTable") { // 고정 테이블
        var controlFixedTable = new Table(data);
        tableList.push(controlFixedTable);

        var tableLabels = data.Labels.TableLabel;

        tableLabels.forEach(function (label, i) {
            var tableLabel = new FixedTableLabel(label, i);
            tableLabelList.push(tableLabel);
        });
        drawingFixedTable(controlFixedTable, tableLabelList, divId);

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
    }
}

/******************************************************************
 부모의 position이 relative이고 자식의 position이 absolute일 때
 부모를 기준으로 자식의 위치를 잡을 수 있다.
 ******************************************************************/

/* 밴드도 파라미터로 받아와야함 */
/******************************************************************
 기능 : DynamicTable(동적 테이블)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔

 수정 : DynamicTableValueLabel에 데이터 바인딩
 Date : 2018-08-20
 From 구영준
 ******************************************************************/
function drawingDynamicTable(table, tableLabel, divId) {
    var div = $('#' + divId);
    div.append('<div id = "Table' + tableNum + '"></div>');

    var divIdTable = $('#Table' + tableNum);
    divIdTable.append('<table id="dynamicTable' + dynamicTableNum + '"></table>');

    div.css('position', 'relative');

    divIdTable.css({
        'position': 'absolute',
        'left': table.rectangle.x + 'px',
        'top': table.rectangle.y + 'px'
    });

    var tableId = $('#dynamicTable' + dynamicTableNum);

    tableId.css({
        'width': table.rectangle.width + 'px',
        'height': table.rectangle.height + 'px'
    });

    tableId.append('<tr id = "dynamicTitleLabel' + dynamicTitleLabelNum + '"></tr>');
    // tableId.append('<tr id = "dynamicValueLabel' + dynamicValueLabelNum + '"></tr>');

    var titleTrId = $('#dynamicTitleLabel' + dynamicTitleLabelNum);

    var numOfData = getNumOfDataInOnePage(tableLabel, divId); //한 페이지에 들어갈 데이터 개수
    row = (pageNum-1) * numOfData; //한 페이지 출력 해야할 시작 row
    var rowLength = row + numOfData; //한 페이지에 마지막으로 출력해야할 row

    if (Array.isArray(tableLabel)) {
        tableLabel.forEach(function (label) {
            switch (label._attributes) {
                case "DynamicTableTitleLabel" :
                    var temp = Object.keys(dataTable.DataSetName.dt[0]);
                    temp.forEach(function(titleName){
                        if(label.text == titleName){
                            titleArray.push(titleName);
                            titleTrId.append('<th id = "' + titleName + thNum + '"></th>');
                            titleTrId.css({
                                'width': label.rectangle.width,
                                'height': label.rectangle.height,
                                'font-size': label.fontSize,
                                'font-family': label.fontFamily,
                                'font-weight': label.fontStyle
                            });
                            var thId = $('#' + titleName + thNum);
                            thId.css('border', '1px solid black');
                            thId.append(titleName);
                        }
                    });
                    break;
                    //수정사항
                    // 수정 180822 YeSol
                case "DynamicTableValueLabel" :
                    for (var j = row; j < rowLength; j++) {
                        var data = dataTable.DataSetName.dt[j];
                        tableId.append('<tr id = "dynamicValueLabel' + j + '"></tr>');
                        var valueTrId = $('#dynamicValueLabel' + j);

                        for (key in data) {
                            if (label.fieldName == key) {
                                var valueTrId = $('#dynamicValueLabel' + j);
                                valueTrId.append('<td>' + data[key]._text + '</td>');
                                valueTrId.css({
                                    'width': label.rectangle.width,
                                    'height': label.rectangle.height,
                                    'font-size': label.fontSize,
                                    'font-family': label.fontFamily,
                                    'font-weight': label.fontStyle
                                });
                                var td = $('td');
                                td.css('border', '1px solid black');
                            }
                        }
                    }
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
                        'font-weight': label.fontStyle
                    });
                    break;
                case "FixedTableValueLabel" :
                    valueTrId.append('<td></td>');
                    valueTrId.css({
                        'width': label.rectangle.width,
                        'height': label.rectangle.height,
                        'font-size': label.fontSize,
                        'font-family': label.fontFamily,
                        'font-weight': label.fontStyle
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
 ******************************************************************/
function drawingSystemLabel(data, divId) {
    var div = $('#' + divId);
    div.css('position', 'relative');
    div.append('<div id = "SystemLabel' + systemLabelNum + '"></div>');

    var systemLabelId = $('#SystemLabel' + systemLabelNum);

    systemLabelId.css({
        'width': data.rectangle.width,
        'height': data.rectangle.height,
        'position': 'absolute',
        'left': data.rectangle.x + 'px',
        'top': data.rectangle.y + 'px',
        'text-align': 'center',
        'border': '1px solid black'
    });

    var date = new Date();
    switch (data.systemFieldName) {
        case 'Date' :
            var year = date.getFullYear();
            var month = plusZero(date.getMonth() + 1); // month는 0부터 시작
            var day = plusZero(date.getDate());
            var dateStr = year + '-' + month + '-' + day;

            systemLabelId.append('<p id = "PDate' + dateNum + '">' + dateStr + '</p>');

            var pId = $('#PDate' + dateNum);

            pId.css({
                'font-size': data.fontSize,
                'font-family': data.fontFamily,
                'font-weight': data.fontStyle
            });

            verticalCenter('PDate' + dateNum);

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

            systemLabelId.append('<p id = "PDateTime' + dateTimeNum + '">' + dateTimeStr + '</p>');

            var pId = $('#PDateTime' + dateTimeNum);

            pId.css({
                'font-size': data.fontSize,
                'font-family': data.fontFamily,
                'font-weight': data.fontStyle
            });

            verticalCenter('PDateTime' + dateTimeNum);

            dateTimeNum++;
            break;
        case 'Time' :
            var hour = plusZero(date.getHours());
            var min = plusZero(date.getMinutes());
            var sec = plusZero(date.getSeconds());
            var timeStr = hour + ':' + min + ':' + sec;

            systemLabelId.append('<p id = "PTime' + timeNum + '">' + timeStr + '</p>');

            var pId = $('#PTime' + timeNum);

            pId.css({
                'font-size': data.fontSize,
                'font-family': data.fontFamily,
                'font-weight': data.fontStyle
            });

            verticalCenter('PTime' + timeNum);

            timeNum++;
            break;
        case 'PageNumber' : // 현재 페이지 번호
            pageNumberNum++;
            break;
        case 'TotalPage' : // 전체 페이지 번호
            var totalPage = "totalPage";
            systemLabelId.append('<p id ="' + totalPage +  totalPageNum + '" class="' + totalPage + '"></p>');

            var pId = $('#' + totalPage + totalPageNum);

            pId.css({
                'font-size': data.fontSize,
                'font-family': data.fontFamily,
                'font-weight': data.fontStyle
            });

            verticalCenter(totalPage + totalPageNum);
            totalPageNum++;
            break;
        case 'PageNumber / TotalPage' :  // 현재 페이지 번호 / 전체 페이지 정보
            var pageNumberTotalPage = "pageNumberTotalPage";

            systemLabelId.append('<p id ="' + pageNumberTotalPage +  pageNumTotalPageNum + '" class="' + pageNumberTotalPage + '"></p>');

            var pId = $('#' + pageNumberTotalPage + pageNumTotalPageNum);

            pId.css({
                'font-size': data.fontSize,
                'font-family': data.fontFamily,
                'font-weight': data.fontStyle
            });

            verticalCenter(pageNumberTotalPage + pageNumTotalPageNum);
            pageNumTotalPageNum++;
            break;
    }
    systemLabelNum++;
}


/******************************************************************
 기능 : SummaryLabel(요약 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingSummaryLabel(data, divId) {
    var div = $('#' + divId);
    div.css('position', 'relative');
    div.append('<div id = "SummaryLabel' + summaryLabelNum + '">SummaryLabel</div>');

    var summaryLabelId = $('#SummaryLabel' + summaryLabelNum);

    summaryLabelId.css({
        'width': data.rectangle.width,
        'height': data.rectangle.height,
        'position': 'absolute',
        'left': data.rectangle.x + 'px',
        'top': data.rectangle.y + 'px',
        'text-align': 'center',
        'border': '1px solid black'
    });

    summaryLabelId.append('<p id = "PSummaryLabel' + summaryLabelNum + '"></p>');

    var pId = $('#PSummaryLabel' + summaryLabelNum);

    pId.css({
        'font-size': data.fontSize,
        'font-family': data.fontFamily,
        'font-weight': data.fontStyle
    });

    //pId.append(data.text);

    verticalCenter('PSummaryLabel' + summaryLabelNum);

    summaryLabelNum++;
}

/******************************************************************
 기능 : DataLabel(데이터 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingDataLabel(data, divId) {
    var div = $('#' + divId);
    div.css('position', 'relative');
    div.append('<div id = "DataLabel' + dataLabelNum + '"></div>');

    var dataLabelId = $('#DataLabel' + dataLabelNum);

    dataLabelId.css({
        'width': data.rectangle.width,
        'height': data.rectangle.height,
        'position': 'absolute',
        'left': data.rectangle.x + 'px',
        'top': data.rectangle.y + 'px',
        'text-align': 'center',
        'border': '1px solid black'
    });

    dataLabelId.append('<p id = "PDataLabel' + dataLabelNum + '"></p>');

    var pId = $('#PDataLabel' + dataLabelNum);

    pId.css({
        'font-size': data.fontSize,
        'font-family': data.fontFamily,
        'font-weight': data.fontStyle
    });

    /********************************************
     한 그룹의 데이터 출력이 끝나면 groupFieldNum++를 어디선가 해줘야함..어떻게해야하지..모르겠담
     *******************************************/
    if (groupFieldArray !== undefined) {
        pId.append(groupFieldArray[groupFieldNum][0]);
    }

    verticalCenter('PDataLabel' + dataLabelNum);

    dataLabelNum++;
}

/******************************************************************
 기능 : NormalLabel(일반 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingNormalLabel(data, divId) {
    var div = $('#' + divId);
    div.css('position', 'relative');
    div.append('<div id = "NormalLabel' + normalLabelNum + '"></div>');

    var normalLabelId = $('#NormalLabel' + normalLabelNum);

    normalLabelId.css({
        'width': data.rectangle.width,
        'height': data.rectangle.height,
        'position': 'absolute',
        'left': data.rectangle.x + 'px',
        'top': data.rectangle.y + 'px',
        'text-align': 'center',
        'border': '1px solid black',
        'white-space': 'nowrap',
        'overflow': 'visible'
    });

    normalLabelId.append('<p id = "PNormalLabel' + normalLabelNum + '"></p>');

    var pId = $('#PNormalLabel' + normalLabelNum);

    pId.css({
        'font-size' : data.fontSize,
        'font-family' : data.fontFamily,
        'font-weight' : data.fontStyle
    });
    // var str = data.text.toString();
    // console.log(str.length);
    // for(var i = 0; i < str.length; i++){
    //     console.log(str[i]);
    // }
    // pId.append(data.text);
    toStringFn(data.text, pId);

    verticalCenter('PNormalLabel' + normalLabelNum);

    normalLabelNum++;
}

function toStringFn(text, pId) {
    var str = text.toString();
    // console.log(str);
    var appendStr = str[0];
    for(var i = 1; i < str.length; i++){
        appendStr += str[i];
        // console.log(str[i].small())
        // console.log(pId.width());
    }
    pId.append(appendStr);
    // pId.css('object-fit', 'cover');
    // pId.css('justify-content', 'space-between');
}

/******************************************************************
 기능 : Expression(수식 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingExpression(data, divId) {
    var div = $('#' + divId);
    div.css('position', 'relative');
    div.append('<div id = "Expression' + expressionNum + '">Expression</div>');

    var expressionId = $('#Expression' + expressionNum);

    expressionId.css({
        'width': data.rectangle.width,
        'height': data.rectangle.height,
        'position': 'absolute',
        'left': data.rectangle.x + 'px',
        'top': data.rectangle.y + 'px',
        'text-align': 'center',
        'border': '1px solid black'
    });

    expressionId.append('<p id = "PExpression' + expressionNum + '"></p>');

    var pId = $('#PExpression' + expressionNum);

    pId.css({
        'font-size': data.fontSize,
        'font-family': data.fontFamily,
        'font-weight': data.fontStyle
    });
    //$('#PExpression' + expressionNum).append(data.text);

    verticalCenter('PExpression' + expressionNum);

    expressionNum++;
}

/******************************************************************
 기능 : GroupLabel(그룹 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingGroupLabel(data, divId) {
    var div = $('#' + divId);
    div.css('position', 'relative');
    div.append('<div id = "GroupLabel' + groupLabelNum + '">GroupLabel</div>');

    var groupLabelId = $('#GroupLabel' + groupLabelNum);

    groupLabelId.css({
        'width': data.rectangle.width,
        'height': data.rectangle.height,
        'position': 'absolute',
        'left': data.rectangle.x + 'px',
        'top': data.rectangle.y + 'px',
        'text-align': 'center',
        'border': '1px solid black'
    });

    groupLabelId.append('<p id = "PGroupLabel' + groupLabelNum + '"></p>');

    var pId = $('#PGroupLabel' + groupLabelNum);

    pId.css({
        'font-size': data.fontSize,
        'font-family': data.fontFamily,
        'font-weight': data.fontStyle
    });
    //$('#PGroupLabel' + groupLabelNum).append(data.text);

    verticalCenter('PGroupLabel' + groupLabelNum);

    groupLabelNum++;
}

/******************************************************************
 기능 : ParameterLabel(파라미터 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingParameterLabel(data, divId) {
    var div = $('#' + divId);
    div.css('position', 'relative');
    div.append('<div id = "ParameterLabel' + parameterLabelNum + '">ParameterLabel</div>');

    var parameterLabelId = $('#ParameterLabel' + parameterLabelNum);

    parameterLabelId.css({
        'width': data.rectangle.width,
        'height': data.rectangle.height,
        'position': 'absolute',
        'left': data.rectangle.x + 'px',
        'top': data.rectangle.y + 'px',
        'text-align': 'center',
        'border': '1px solid black'
    });

    parameterLabelId.append('<p id = "PParameterLabel' + parameterLabelNum + '"></p>');

    var pId = $('#PParameterLabel' + parameterLabelNum);

    pId.css({
        'font-size': data.fontSize,
        'font-family': data.fontFamily,
        'font-weight': data.fontStyle
    });
    //$('#PParameterLabel' + parameterLabelNum).append(data.text);

    verticalCenter('PParameterLabel' + parameterLabelNum);

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
 기능 : 텍스트를 세로로 가운데 정렬할 수 있는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function verticalCenter(pTagId) {
    var div = $('#' + pTagId);
    var fontsize = (div.css('font-size')).split('p');
    // 16pt 이런 식으로 값이 받아져서 p앞으로 끊어서 숫자만 받아오려고 한 문자열 자르기 작업

    var divBr = $('#' + pTagId + ' br');
    var brCount = divBr.length;
    // text중에서 <br/>의 개수를 구함

    var parentHeightString = div.parent().css('height');
    var parentHeight = parentHeightString.split('p');

    var mid = (parentHeight[0] - fontsize[0] * (brCount + 1)) / 2 - brCount;

    div.css({
        'margin-top' : mid + 'px',
        'margin-bottom' : mid + 'px'
    });
}