document.write("<script type='text/javascript' src='/js/label.js' ><" + "/script>");
var BandBackGround;
var BandPageHeader;
var BandTitle; // 밴드 추가 >> BandDummyHeader, BandDummyFooter
var BandDummyHeader;
var BandDummy;
var BandDummyFooter;
var BandData; // 밴드 추가 >> BandDataHeader, BandDataFooter, BandDummyHeader, BandDummyFooter, BandGroupHeader, BandGroupFooter
var BandGroupHeader; // 밴드 추가 >> BandDummyHeader, BandDummyFooter
var BandGroupFooter;
var BandDataHeader;
var BandDataFooter;
var BandPageFooter;
var BandForeGround;
var BandTail;
var BandSummary;
var BandSubReport;

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

/******************************************************************
 기능 : ControlList의 유무를 판단하는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function judgementControlList(data, divId) {
    if (!(data.controlList.anyType === undefined)) { // ControlList태그 안에 뭔가가 있을 때
        var controlList = data.controlList.anyType;

        if (Array.isArray(controlList)) {
            controlList.forEach(function (list) {
                console.log(list);
                judgementLabel(list, divId);
            });
        } else {
            console.log(data);
            judgementLabel(controlList, divId);
        }
    } else {
        console.log('ControlList none');
    }
}

/******************************************************************
 기능 : 어떤 Label인지를 판단하여 객체를 생성해주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function judgementLabel(data, divId) {
    console.log(data);
    var attr = data._attributes["xsi:type"];
    if (attr == "ControlDynamicTable") { // 동적 테이블
        var controlDynamicTable = new Table(data);
        tableList.push(controlDynamicTable);

        var tableLabels = data.Labels.TableLabel;

        for (var i = 0; i < tableLabels.length; i++) {
            console.log(tableLabels[i]);
            var tableLabel = new DynamicTableLabel(tableLabels[i], i);
            console.log(tableLabel);
            tableLabelList.push(tableLabel);
        }
        drawingDynamicTable(controlDynamicTable, tableLabelList, divId);

    } else if (attr == "ControlFixedTable") { // 고정 테이블
        var controlFixedTable = new Table(data);
        tableList.push(controlFixedTable);

        var tableLabels = data.Labels.TableLabel;
        for (var i = 0; i < tableLabels.length; i++) {
            var tableLabel = new FixedTableLabel(tableLabels, i);
            tableLabelList.push(tableLabel);
        }
        drawingFixedTable(controlFixedTable, tableLabelList, divId);

    } else if (attr == "ControlLabel") {
        console.log(attr);
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
 ******************************************************************/
function drawingDynamicTable(table, tableLabel, divId) {
    $('#' + divId).append('<div id="Table"></div>');
    $('#Table').append('<table id="dynamicTable"></table>');
    $('#' + divId).css('position', 'relative');
    $('#Table').css('position', 'absolute');

    $('#Table').css('left', table.rectangle.x + 'px');
    $('#Table').css('top', table.rectangle.y + 'px');

    $('#dynamicTable').css('width', table.rectangle.width + 'px');
    $('#dynamicTable').css('height', table.rectangle.height + 'px');

    $('#dynamicTable').append('<tr id = "dynamicTitleLabel"></tr>');
    $('#dynamicTable').append('<tr id = "dynamicValueLabel"></tr>');

    if (Array.isArray(tableLabel)) {
        tableLabel.forEach(function (tableLabel) {
            switch (tableLabel._attributes) {
                case "DynamicTableTitleLabel" :
                    var temp = Object.keys(dataTable.DataSetName.dt[0]);
                    for(var i = 0; i < temp.length; i++){
                        // console.log(tableLabel);
                        if(tableLabel.text == temp[i]){
                            $('#dynamicTitleLabel').append('<th id = "' + temp[i] + '"></th>');
                            $('#dynamicTitleLabel').css('width', tableLabel.rectangle.width);
                            $('#dynamicTitleLabel').css('height', tableLabel.rectangle.height);
                            $('#dynamicTitleLabel').css('font-size', tableLabel.fontSize);
                            $('#dynamicTitleLabel').css('font-family', tableLabel.fontFamily);
                            $('#dynamicTitleLabel').css('font-weight', tableLabel.fontStyle);
                            $('th').css('border', '1px solid black');
                            $('#' + temp[i]).append(temp[i]);
                        }
                    }
                    break;
                case "DynamicTableValueLabel" :
                    $('#dynamicValueLabel').append('<td>a</td>');
                    $('#dynamicValueLabel').css('width', tableLabel.rectangle.width);
                    $('#dynamicValueLabel').css('height', tableLabel.rectangle.height);
                    $('#dynamicValueLabel').css('font-size', tableLabel.fontSize);
                    $('#dynamicValueLabel').css('font-family', tableLabel.fontFamily);
                    $('#dynamicValueLabel').css('font-weight', tableLabel.fontStyle);
                    $('td').css('border', '1px solid black');
                    break;
            }
        })
    }
    $('#dynamicTable').css('border', '1px solid black');
    $('#dynamicTable').css('border-collapse', 'collapse');
    $('#dynamicTable').css('text-align', 'center');
}


/******************************************************************
 기능 : FixedTable(고정 테이블)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingFixedTable(table, tableLabel, divId) {
    $('#' + divId).append('<div id="Table"></div>');
    $('#Table').append('<table id="fixedTable"></table>');
    $('#' + divId).css('position', 'relative');
    $('#Table').css('position', 'absolute');

    $('#fixedTable').css('width', table.rectangle.width);
    $('#fixedTable').css('height', table.rectangle.height);

    $('#fixedTable').css('left', table.rectangle.x);
    $('#fixedTable').css('top', table.rectangle.y);

    $('#fixedTable').append('<tr id = "fixedTitleLabel"></tr>');
    $('#fixedTable').append('<tr id = "fixedValueLabel"></tr>');

    if (Array.isArray(tableLabel)) {
        tableLabel.forEach(function (tableLabel) {
            switch (tableLabel._attributes["xsi:type"]) {
                case "FixedTableTitleLabel" :
                    $('#fixedTitleLabel').append('<th></th>');
                    $('#fixedTitleLabel').css('width', tableLabel.rectangle.width);
                    $('#fixedTitleLabel').css('height', tableLabel.rectangle.height);
                    $('#fixedTitleLabel').css('font-size', tableLabel.fontSize);
                    $('#fixedTitleLabel').css('font-family', tableLabel.fontFamily);
                    $('#fixedTitleLabel').css('font-weigth', tableLabel.fontStyle);
                    break;
                case "FixedTableValueLabel" :
                    $('#fixedValueLabel').append('<td></td>');
                    $('#fixedValueLabel').css('width', tableLabel.rectangle.width);
                    $('#fixedValueLabel').css('height', tableLabel.rectangle.height);
                    $('#fixedValueLabel').css('font-family', tableLabel.fontFamily);
                    $('#fixedValueLabel').css('font-weight', tableLabel.fontStyle);
                    break;
            }
        })
    }
    $('#fixedTable').css('border', '1px solid black');
    $('#fixedTable').css('border-collapse', 'collapse');
    $('#fixedTable').css('text-align', 'center');
}

/* 일반 라벨에 있는 텍스트 값 가져와서 뿌리기 */
/******************************************************************
 기능 : SystemLabel(시스템 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingSystemLabel(data, divId) {
    $('#' + divId).css('position', 'relative');
    $('#' + divId).append('<div id = "SystemLabel' + systemLabelNum + '"></div>');

    $('#SystemLabel' + systemLabelNum).css('width', data.rectangle.width);
    $('#SystemLabel' + systemLabelNum).css('height', data.rectangle.height);

    $('#SystemLabel' + systemLabelNum).css('position', 'absolute');
    $('#SystemLabel' + systemLabelNum).css('left', data.rectangle.x + 'px');
    $('#SystemLabel' + systemLabelNum).css('top', data.rectangle.y + 'px');

    $('#SystemLabel' + systemLabelNum).css('text-align', 'center');

    $('#SystemLabel' + systemLabelNum).css('border', '1px solid black');
    $('#SystemLabel' + systemLabelNum).css('font-size', data.fontSize);
    $('#SystemLabel' + systemLabelNum).css('font-family', data.fontFamily);
    $('#SystemLabel' + systemLabelNum).css('font-weight', data.fontStyle);

    var date = new Date();
    switch (data.systemFieldName) {
        case 'Date' :
            var year = date.getFullYear();
            var month = plusZero(date.getMonth() + 1); // month는 0부터 시작
            var day = plusZero(date.getDate());
            var dateStr = year + '-' + month + '-' + day;

            $('#SystemLabel' + systemLabelNum).append('<p id = "date' +  dateNum + '">' + dateStr + '</p>');

            verticalCenter(('date' + dateNum), data);

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

            $('#SystemLabel' + systemLabelNum).append('<p id = "dateTime' +  dateTimeNum + '">' + dateTimeStr + '</p>');

            verticalCenter(('dateTime' + dateTimeNum), data);

            dateTimeNum++;
            break;
        case 'Time' :
            var hour = plusZero(date.getHours());
            var min = plusZero(date.getMinutes());
            var sec = plusZero(date.getSeconds());
            var timeStr = hour + ':' + min + ':' + sec;

            $('#SystemLabel' + systemLabelNum).append('<p id = "time' +  timeNum + '">' + timeStr + '</p>');

            verticalCenter(('time' + timeNum), data);

            timeNum++;
            break;
        case 'PageNumber' : // 현재 페이지 번호
            pageNumberNum++;
            break;
        case 'TotalPage' : // 전체 페이지 번호
            totalPageNum++;
            break;
        case 'PageNumber / TotalPage' :  // 현재 페이지 번호 / 전체 페이지 정보
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
    $('#' + divId).css('position', 'relative');
    $('#' + divId).append('<div id = "SummaryLabel' + summaryLabelNum + '">SummaryLabel</div>');

    $('#SummaryLabel' + summaryLabelNum).css('width', data.rectangle.width);
    $('#SummaryLabel' + summaryLabelNum).css('height', data.rectangle.height);

    $('#SummaryLabel' + summaryLabelNum).css('position', 'absolute');
    $('#SummaryLabel' + summaryLabelNum).css('left', data.rectangle.x + 'px');
    $('#SummaryLabel' + summaryLabelNum).css('top', data.rectangle.y + 'px');

    $('#SummaryLabel' + summaryLabelNum).css('border', '1px solid black');
    $('#SummaryLabel' + summaryLabelNum).css('font-size', data.fontSize);
    $('#SummaryLabel' + summaryLabelNum).css('font-family', data.fontFamily);
    $('#SummaryLabel' + summaryLabelNum).css('font-weight', data.fontStyle);

    $('#SummaryLabel' + summaryLabelNum).append('<p id = "PSummaryLabel' + summaryLabelNum + '"></p>');
    //$('#PSummaryLabel' + summaryLabelNum).append(data.text);

    verticalCenter(('SummaryLabel' + summaryLabelNum), data);

    summaryLabelNum++;
}

/******************************************************************
 기능 : DataLabel(데이터 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingDataLabel(data, divId) {
    $('#' + divId).css('position', 'relative');
    $('#' + divId).append('<div id = "DataLabel' + dataLabelNum + '">DataLabel</div>');

    $('#DataLabel' + dataLabelNum).css('width', data.rectangle.width);
    $('#DataLabel' + dataLabelNum).css('height', data.rectangle.height);

    $('#DataLabel' + dataLabelNum).css('position', 'absolute');
    $('#DataLabel' + dataLabelNum).css('left', data.rectangle.x + 'px');
    $('#DataLabel' + dataLabelNum).css('top', data.rectangle.y + 'px');

    $('#DataLabel' + dataLabelNum).css('border', '1px solid black');
    $('#DataLabel' + dataLabelNum).css('font-size', data.fontSize);
    $('#DataLabel' + dataLabelNum).css('font-family', data.fontFamily);
    $('#DataLabel' + dataLabelNum).css('font-weight', data.fontStyle);

    $('#DataLabel' + dataLabelNum).append('<p id = "PDataLabel' + dataLabelNum + '"></p>');
    //$('#PDataLabel' + dataLabelNum).append(data.text);

    verticalCenter(('DataLabel' + dataLabelNum), data);

    dataLabelNum++;
}

/******************************************************************
 기능 : NormalLabel(일반 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingNormalLabel(data, divId) {
    $('#' + divId).css('position', 'relative');
    $('#' + divId).append('<div id = "NormalLabel' + normalLabelNum + '"></div>');

    $('#NormalLabel' + normalLabelNum).css('width', data.rectangle.width);
    $('#NormalLabel' + normalLabelNum).css('height', data.rectangle.height);

    $('#NormalLabel' + normalLabelNum).css('position', 'absolute');
    $('#NormalLabel' + normalLabelNum).css('left', data.rectangle.x + 'px');
    $('#NormalLabel' + normalLabelNum).css('top', data.rectangle.y + 'px');

    $('#NormalLabel' + normalLabelNum).css('border', '1px solid black');
    $('#NormalLabel' + normalLabelNum).css('font-size', data.fontSize);
    $('#NormalLabel' + normalLabelNum).css('font-family', data.fontFamily);
    $('#NormalLabel' + normalLabelNum).css('font-weight', data.fontStyle);
    $('#NormalLabel' + normalLabelNum).css('white-space', 'nowrap');
    $('#NormalLabel' + normalLabelNum).css('overflow', 'visible');

    $('#NormalLabel' + normalLabelNum).append('<p id = "PNormalLabel' + normalLabelNum + '"></p>');
    $('#PNormalLabel' + normalLabelNum).append(data.text);
    $('#PNormalLabel' + normalLabelNum).css('display', 'block');

    verticalCenter(('PNormalLabel' + normalLabelNum), data);

    normalLabelNum++;
}

/******************************************************************
 기능 : Expression(수식 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingExpression(data, divId) {
    $('#' + divId).css('position', 'relative');
    $('#' + divId).append('<div id = "Expression' + expressionNum + '">Expression</div>');

    $('#Expression' + expressionNum).css('width', data.rectangle.width);
    $('#Expression' + expressionNum).css('height', data.rectangle.height);

    $('#Expression' + expressionNum).css('position', 'absolute');
    $('#Expression' + expressionNum).css('left', data.rectangle.x + 'px');
    $('#Expression' + expressionNum).css('top', data.rectangle.y + 'px');

    $('#Expression' + expressionNum).css('border', '1px solid black');
    $('#Expression' + expressionNum).css('font-size', data.fontSize);
    $('#Expression' + expressionNum).css('font-family', data.fontFamily);
    $('#Expression' + expressionNum).css('font-weight', data.fontStyle);

    $('#Expression' + expressionNum).append('<p id = "PExpression' + expressionNum + '"></p>');
    //$('#PExpression' + expressionNum).append(data.text);

    verticalCenter(('PExpression' + expressionNum), data);

    expressionNum++;
}

/******************************************************************
 기능 : GroupLabel(그룹 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingGroupLabel(data, divId) {
    $('#' + divId).css('position', 'relative');
    $('#' + divId).append('<div id = "GroupLabel' + groupLabelNum + '">GroupLabel</div>');

    $('#GroupLabel' + groupLabelNum).css('width', data.rectangle.width);
    $('#GroupLabel' + groupLabelNum).css('height', data.rectangle.height);

    $('#GroupLabel' + groupLabelNum).css('position', 'absolute');
    $('#GroupLabel' + groupLabelNum).css('left', data.rectangle.x + 'px');
    $('#GroupLabel' + groupLabelNum).css('top', data.rectangle.y + 'px');

    $('#GroupLabel' + groupLabelNum).css('border', '1px solid black');
    $('#GroupLabel' + groupLabelNum).css('font-size', data.fontSize);
    $('#GroupLabel' + groupLabelNum).css('font-family', data.fontFamily);
    $('#GroupLabel' + groupLabelNum).css('font-weight', data.fontStyle);

    $('#GroupLabel' + groupLabelNum).append('<p id = "PGroupLabel' + groupLabelNum + '"></p>');
    //$('#PGroupLabel' + groupLabelNum).append(data.text);

    verticalCenter(('PGroupLabel' + groupLabelNum), data);

    groupLabelNum++;
}

/******************************************************************
 기능 : ParameterLabel(파라미터 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingParameterLabel(data, divId) {
    $('#' + divId).css('position', 'relative');
    $('#' + divId).append('<div id = "ParameterLabel' + parameterLabelNum + '">ParameterLabel</div>');

    $('#ParameterLabel' + parameterLabelNum).css('width', data.rectangle.width);
    $('#ParameterLabel' + parameterLabelNum).css('height', data.rectangle.height);

    $('#ParameterLabel' + parameterLabelNum).css('position', 'absolute');
    $('#ParameterLabel' + parameterLabelNum).css('left', data.rectangle.x + 'px');
    $('#ParameterLabel' + parameterLabelNum).css('top', data.rectangle.y + 'px');

    $('#ParameterLabel' + parameterLabelNum).css('border', '1px solid black');
    $('#ParameterLabel' + parameterLabelNum).css('font-size', data.fontSize);
    $('#ParameterLabel' + parameterLabelNum).css('font-family', data.fontFamily);
    $('#ParameterLabel' + parameterLabelNum).css('font-weight', data.fontStyle);

    $('#ParameterLabel' + parameterLabelNum).append('<p id = "PParameterLabel' + parameterLabelNum + '"></p>');
    //$('#PParameterLabel' + parameterLabelNum).append(data.text);

    verticalCenter(('PParameterLabel' + parameterLabelNum), data);

    parameterLabelNum++;
}


/******************************************************************
 기능 : 시간 또는 날짜를 출력할 때 한 자리 숫자일 경우 0을 붙여줘서 두 자리 숫자로 출력 해주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function plusZero(data) {
    var str = data.toString();
    if(str.length == 1){
        data = '0' + data;
    }
    return data;
}


/******************************************************************
 기능 : 텍스트를 세로로 가운데 정렬할 수 있는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function verticalCenter(divId, data) {
    var fontsize = ($('#' + divId).css('font-size')).split('p');
    // 16pt 이런 식으로 값이 받아져서 p앞으로 끊어서 숫자만 받아오려고 한 문자열 자르기 작업
    var mid = (data.rectangle.height - fontsize[0] - 3) / 2; // 왜 그런지는 모르겠지만 3을 빼줘야 width를 벗어나지 않음..

    $('#' + divId).css('margin-top', mid);
    $('#' + divId).css('margin-bottom', mid);
}

