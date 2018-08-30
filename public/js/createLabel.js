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

        /*
        To Do : 하나의 페이지에 고정테이블이 2개 이상 있을 경우 fixTableLabelList에 겹침
         */
        var controlFixedTable = new Table(data);
        tableList.push(controlFixedTable);

        var fixTableLabels = data.Labels.TableLabel;
        var fixTableLabelList = new Array();

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
function drawingDynamicTable(table, tableLabel, divId) {
    var div = $('#' + divId);
    div.append('<div id = "Table' + tableNum + '"></div>');
    var divIdTable = $('#Table' + tableNum);
    divIdTable.append('<div id="dynamicTable_resizing_div_packing'+dynamicTableNum + '"></div>');
    var dynamicTable_resizing_div_packing = $("#dynamicTable_resizing_div_packing"+dynamicTableNum);
    dynamicTable_resizing_div_packing.append('<div id="dynamicTable_resizing_div'+dynamicTableNum + '"></div>');

    var dynamicTable_resizing_div = $("#dynamicTable_resizing_div"+dynamicTableNum);
    dynamicTable_resizing_div.append('<table id="dynamicTable' + dynamicTableNum + '"></table>');
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

    var numOfData = getNumOfDataInOnePage(tableLabel, divId); //한 페이지에 들어갈 데이터 개수
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
/******************************************************************
 기능 : DynamicTableValueLabel(동적 테이블 밸류 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 구영준
 *******************************************************************/
function drawingDynamicTableValueLabel(label, dt, tableId, numOfData){
    if(groupFieldArray == undefined) {
        row = (pageNum-1) * numOfData; //한 페이지 출력 해야할 시작 row
        var rowLength = row + numOfData; //한 페이지에 마지막으로 출력해야할 row

        for (curDatarow = row; curDatarow < rowLength; curDatarow++) {

            var data = dt[curDatarow];
            var valueTrId = $('#dynamicValueLabel' + curDatarow);
            if(valueTrId.length < 1)
                tableId.append('<tr id = "dynamicValueLabel' + curDatarow + '"></tr>');
            for (key in data) {
                if (label.fieldName == key) {
                    var valueTrId = $('#dynamicValueLabel' + curDatarow);
                    var key_data = data[key]._text;
                    var table_reform = table_format_check(data, valueTrId, key_data, table);
                    valueTrId.append(
                        '<td class="Label ' + label._attributes + ' ' + label.dataType + '">' + table_reform + '</td>'
                    );
                    valueTrId.css({
                        'width': label.rectangle.width,
                        'height': label.rectangle.height,
                        'font-size': label.fontSize,
                        'font-family': label.fontFamily,
                        'font-weight': label.fontStyle,
                        'background-color': label.backGroundColor
                    });
                    var td = $('td');
                    td.css('border', '1px solid black');
                }
            }
        }
    }else {
        for (var j = groupDataRow; j < groupFieldArray[groupFieldNum].length; j++) {
            var data = groupFieldArray[groupFieldNum];
            var rowNum = curDatarow+j;
            var valueTrId = $('#dynamicValueLabel' + rowNum);
            if(valueTrId.length < 1)
                tableId.append('<tr id =   "dynamicValueLabel' + rowNum + '"></tr>');
            for (key in data[j]) {
                var valueTrId = $('#dynamicValueLabel' + rowNum);
                if (label.fieldName == key) {
                    valueTrId.append('<td>' + data[j][key]._text + '</td>');
                    valueTrId.css({
                        'width': label.rectangle.width,
                        'height': label.rectangle.height,
                        'font-size': label.fontSize,
                        'font-family': label.fontFamily,
                        'font-weight': label.fontStyle,
                        'background-color' : label.backGroundColor
                    });
                    var td = $('td');
                    td.css('border', '1px solid black');
                }
            }
        }
    }
}

/******************************************************************
 기능 : DynamicTableTitleLabel(동적 테이블 타이틀 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 구영준

 수정 : 테이블 id 값 한글 생성되는 부분 수정.
 Date : 2018-08-28
 From hagdung-i
 *******************************************************************/
function drawingDynamicTableTitleLabel(label, dt){
    var temp = Object.keys(dt[0]);
    var titleTrId = $('#dynamicTitleLabel' + dynamicTitleLabelNum);
    var header_Name_Number = 1;
    temp.forEach(function(titleName){
        if(label.text == titleName){
            titleArray.push(titleName);
            titleTrId.append('<th id = "DynamicTableTitleLabel'+ header_Name_Number +'_View_Page_Number'+ thNum + '"></th>');
            titleTrId.css({
                'width': label.rectangle.width,
                'height': label.rectangle.height,
                'font-size': label.fontSize,
                'font-family': label.fontFamily,
                'font-weight': label.fontStyle,
                'font-color' : label.textColor,
                'background-color' : label.backGroundColor
            });
            var thId = $('#DynamicTableTitleLabel' + header_Name_Number +"_View_Page_Number"+ thNum);
            thId.css('border', '1px solid black');
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
                        'background-color' : label.backGroundColor
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
                        'background-color' : label.backGroundColor
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
    systemLabelId.addClass("NormalLabel_scope");
    systemLabelId.css({
        'width': data.rectangle.width,
        'height': data.rectangle.height,
        'position': 'absolute',
        'left': data.rectangle.x + 'px',
        'top': data.rectangle.y + 'px',
        'text-align': 'center',
        'border': '1px solid black',
        'background-color' : data.backGroundColor
    });
    Lock_check(data, systemLabelId, div);
    var date = new Date();
    switch (data.systemFieldName) {
        case 'Date' :
            var year = date.getFullYear();
            var month = plusZero(date.getMonth() + 1); // month는 0부터 시작
            var day = plusZero(date.getDate());
            var dateStr = year + '-' + month + '-' + day;

            systemLabelId.append('<p id = "PDate' + dateNum + '">' + dateStr + '</p>');

            pId = $('#PDate' + dateNum);

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

            pId = $('#PDateTime' + dateTimeNum);

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

            pId = $('#PTime' + timeNum);

            pId.css({
                'font-size': data.fontSize,
                'font-family': data.fontFamily,
                'font-weight': data.fontStyle
            });

            verticalCenter('PTime' + timeNum);

            timeNum++;
            break;
        case 'PageNumber' : // 현재 페이지 번호
            var PPageNumber = "PPageNumber";
            systemLabelId.append('<p id ="' + PPageNumber + pageNumberNum + '" class="pageNumber"></p>');

            pId = $('#' + PPageNumber + pageNumberNum);

            pId.css({
                'font-size': data.fontSize,
                'font-family': data.fontFamily,
                'font-weight': data.fontStyle
            });

            verticalCenter(PPageNumber + pageNumberNum);

            pageNumberNum++;
            break;
        case 'TotalPage' : // 전체 페이지 번호
            var PTotalPage = "PTotalPage";
            systemLabelId.append('<p id ="' + PTotalPage + totalPageNum + '" class="totalPage"></p>');

            pId = $('#' + PTotalPage + totalPageNum);

                pId.css({
                    'font-size': data.fontSize,
                    'font-family': data.fontFamily,
                    'font-weight': data.fontStyle
                });

            verticalCenter(PTotalPage + totalPageNum);
            totalPageNum++;
            break;
        case 'PageNumber / TotalPage' :  // 현재 페이지 번호 / 전체 페이지 정보
            var PPageNumberNTotalPage = "PPageNumberNTotalPage";
            systemLabelId.append('<p id ="' + PPageNumberNTotalPage +  pageNumTotalPageNum + '" class="pageNumberTotalPage"></p>');

            pId = $('#' + PPageNumberNTotalPage + pageNumTotalPageNum);

            pId.css({
                'font-size': data.fontSize,
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
    summaryLabelId.addClass("NormalLabel_scope");
    summaryLabelId.css({
        'width': data.rectangle.width,
        'height': data.rectangle.height,
        'position': 'absolute',
        'left': data.rectangle.x + 'px',
        'top': data.rectangle.y + 'px',
        'text-align': 'center',
        'border': '1px solid black',
        'background-color' : data.backGroundColor
    });

    summaryLabelId.append('<p id = "PSummaryLabel' + summaryLabelNum + '"></p>');
    Lock_check(data, summaryLabelId, div);
    var pId = $('#PSummaryLabel' + summaryLabelNum);

    pId.css({
        'font-size': data.fontSize,
        'font-family': data.fontFamily,
        'font-weight': data.fontStyle
    });

    //pId.append(data.text);
    pId.addClass('Label');
    pId.addClass(data.dataType);

    verticalCenter('PSummaryLabel' + summaryLabelNum);
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
    dataLabelId.css({
        'width': data.rectangle.width,
        'height': data.rectangle.height,
        'position': 'absolute',
        'left': data.rectangle.x + 'px',
        'top': data.rectangle.y + 'px',
        'text-align': 'center',
        'border': '1px solid black',
        'background-color' : data.backGroundColor
    });
    dataLabelId.append('<p id = "PDataLabel' + dataLabelNum + '"></p>');
    Lock_check(data, dataLabelId, div);

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
    normalLabelId.css({
        'width': data.rectangle.width,
        'height': data.rectangle.height,
        'position': 'absolute',
        'left': data.rectangle.x + 'px',
        'top': data.rectangle.y + 'px',
        'text-align': 'center', // 텍스트 수평 정렬에 따라 center, right, left써주기!
        'border': '1px solid black',
        'white-space': 'nowrap',
        'overflow': 'visible',
        'background-color' : data.backGroundColor,
        'zIndex' : 999
    });
    normalLabelId.append('<p id = "PNormalLabel' + normalLabelNum + '">'+format_check(data)+'</p>');

    Lock_check(data, normalLabelId, div);

    var pId = $('#PNormalLabel' + normalLabelNum);

    pId.css({
        'font-size' : data.fontSize,
        'font-family' : data.fontFamily,
        'font-weight' : data.fontStyle
    });
    // toStringFn(data.text, "PNormalLabel" + normalLabelNum);
    // textEqualDivision(data.text, "PNormalLabel" + normalLabelNum);

    verticalCenter('PNormalLabel' + normalLabelNum); // 텍스트 수직 정렬이 중간인 경우
    // verticalTop('PNormalLabel' + normalLabelNum); // 텍스트 수직 정렬이 위쪽인 경우
    // verticalBottom('PNormalLabel' + normalLabelNum); // 텍스트 수직 정렬이 아래쪽인 경우
    // verticalCenterEqualDivision('PNormalLabel' + normalLabelNum); // 텍스트 수직 정렬이 중간인 경우

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
    expressionId.css({
        'width': data.rectangle.width,
        'height': data.rectangle.height,
        'position': 'absolute',
        'left': data.rectangle.x + 'px',
        'top': data.rectangle.y + 'px',
        'text-align': 'center',
        'border': '1px solid black',
        'background-color' : data.backGroundColor
    });
    expressionId.append('<p id = "PExpression' + expressionNum + '"></p>');
    Lock_check(data, expressionId, div);
    var pId = $('#PExpression' + expressionNum);

    pId.css({
        'font-size': data.fontSize,
        'font-family': data.fontFamily,
        'font-weight': data.fontStyle
    });
    //$('#PExpression' + expressionNum).append(data.text);

    verticalCenter('PExpression' + expressionNum);

    pId.addClass('Label');
    pId.addClass(data.dataType);

    expressionNum++;
}
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
    groupLabelId.css({
        'width': data.rectangle.width,
        'height': data.rectangle.height,
        'position': 'absolute',
        'left': data.rectangle.x + 'px',
        'top': data.rectangle.y + 'px',
        'text-align': 'center',
        'border': '1px solid black',
        'background-color' : data.backGroundColor
    });
    groupLabelId.append('<p id = "PGroupLabel' + groupLabelNum + '"></p>');
    Lock_check(data, groupLabelId, div);
    var pId = $('#PGroupLabel' + groupLabelNum);

    pId.css({
        'font-size': data.fontSize,
        'font-family': data.fontFamily,
        'font-weight': data.fontStyle
    });
    //$('#PGroupLabel' + groupLabelNum).append(data.text);

    verticalCenter('PGroupLabel' + groupLabelNum);

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
    div.append('<div id = "ParameterLabel' + parameterLabelNum + '">ParameterLabel</div>');

    var parameterLabelId = $('#ParameterLabel' + parameterLabelNum);
    parameterLabelId.addClass("NormalLabel_scope");
    parameterLabelId.css({
        'width': data.rectangle.width,
        'height': data.rectangle.height,
        'position': 'absolute',
        'left': data.rectangle.x + 'px',
        'top': data.rectangle.y + 'px',
        'text-align': 'center',
        'border': '1px solid black',
        'background-color' : data.backGroundColor
    });
    parameterLabelId.append('<p id = "PParameterLabel' + parameterLabelNum + '"></p>');
    Lock_check(data, parameterLabelId, div);
    var pId = $('#PParameterLabel' + parameterLabelNum);

    pId.css({
        'font-size': data.fontSize,
        'font-family': data.fontFamily,
        'font-weight': data.fontStyle
    });
    //$('#PParameterLabel' + parameterLabelNum).append(data.text);

    verticalCenter('PParameterLabel' + parameterLabelNum);

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
    for(var i = 1; i < str.length; i++){
        appendStr += str[i];
    }
    tag.append(appendStr);
}
/******************************************************************
 기능 : 텍스트 수평 정렬이 균등분할인 속성을 구현한다.
 만든이 : 안예솔
 ******************************************************************/
function textEqualDivision(text, pTagId) {
    var tag = $('#' + pTagId);
    var str = text.toString();
    var fontsize = (tag.css('font-size')).split('p');
    var parentWidth = tag.css('width').split('p');
    // 16pt 이런 식으로 값이 받아져서 p앞으로 끊어서 숫자만 받아오려고 한 문자열 자르기 작업
    var appendStr = str[0];
    for(var i = 1; i < str.length; i++){
        if(str[i] != ' '){
            appendStr += str[i];
        }
        var num = appendStr.indexOf("<br/>");

        if(num != -1){
            var spacing = (parentWidth[0] - fontsize[0] * num) / (num - 1);
            tag.append('<p style = "letter-spacing : ' + spacing + 'px; margin:0px;">' + appendStr + '</p>');
            appendStr = '';
        }
    }
    var num = appendStr.length;
    var spacing = (parentWidth[0] - fontsize[0] * num) / (num - 1);
    tag.append('<p style = "letter-spacing : ' + spacing + 'px; margin:0px;">' + appendStr + '</p>');
}
/******************************************************************
 기능 : 텍스트 수직 정렬이 가운데인 속성을 구현한다.
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
/******************************************************************
 기능 : 텍스트 수직 정렬이 위쪽인 속성을 구현한다.
 만든이 : 안예솔
 ******************************************************************/
function verticalTop(pTagId) {
    var div = $('#' + pTagId);

    div.css({
        'margin-top' : '0px'
    });
}
/******************************************************************
 기능 : 텍스트 수직 정렬이 아래쪽인 속성을 구현한다.
 만든이 : 안예솔
 ******************************************************************/
function verticalBottom(pTagId) {
    var div = $('#' + pTagId);
    var fontsize = (div.css('font-size')).split('p');
    // 16pt 이런 식으로 값이 받아져서 p앞으로 끊어서 숫자만 받아오려고 한 문자열 자르기 작업

    var divBr = $('#' + pTagId + ' br');
    var brCount = divBr.length;
    // text중에서 <br/>의 개수를 구함

    var parentHeightString = div.parent().css('height');
    var parentHeight = parentHeightString.split('p');

    var spacing = parentHeight[0] - fontsize[0] * (brCount + 1) - brCount - 1.33;

    div.css({
        'margin-top' : spacing + 'px',
        'margin-bottom' : '0px'
    });
}
/******************************************************************
 기능 : 텍스트 수직 정렬이 균등분할인 속성을 구현한다.
 만든이 : 안예솔
 ******************************************************************/
function verticalCenterEqualDivision(pTagId) {
    var div = $('#' + pTagId);
    div.css({
        'margin-top' : '0px',
        'margin-bottom' : '0px',
    });

    var fontsize = (div.css('font-size')).split('p');
    // 16pt 이런 식으로 값이 받아져서 p앞으로 끊어서 숫자만 받아오려고 한 문자열 자르기 작업

    var divBr = $('#' + pTagId + ' br');
    var brCount = divBr.length;
    // text중에서 <br/>의 개수를 구함

    var parentHeightString = div.parent().css('height');
    var parentHeight = parentHeightString.split('p');

    if(brCount == 0){
        var mid = (parentHeight[0] - fontsize[0] * (brCount + 1)) / 2 - brCount;

        div.css({
            'margin-top' : mid + 'px',
            'margin-bottom' : mid + 'px'
        });
    } else {
        var spacing = (parentHeight[0] - fontsize[0] * (brCount + 1)) / brCount - brCount;
        divBr.before('<p style = "height : ' + spacing + 'px; margin-top : 0px; margin-bottom : 0px;"></p>');
        divBr.remove();
    }
}
/******************************************************************
 기능 : 각각의 형태의 Label id와 데이터를 받아서 lock이 걸려있는 라벨을 제외한 라벨들의 위치 이동, 크기 조정 기능 추가.
 Date : 2018-08-24
 만든이 : hagdung-i
 ******************************************************************/
function Lock_check(data, Label_id, div) { //라벨 데이터, 드래그 리사이즈 영역, 벗어나면 안되는 영역
    var Lock_check;
    if(data.Lock === undefined){
        Lock_check = data.Lock;
    }else{
        Lock_check = data.Lock._text;
    }
    if(!Lock_check) {
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
    if(data.Lock === undefined){
        Lock_check = data.Lock;
    }else{
        Lock_check = data.Lock._text;
    }
    if(!Lock_check) {
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
    var num_check = data.text.replace(/[^0-9]/g,""); //데이터에서 숫자만 추출.
    var data_text = data.text;
    // console.log("test: ",test);
    if(test == "AmountSosu"){   //추후, 다른 7가지의 속성을 알게되면 else if로 추가해야함.
        if(num_check != ""){ //해당 데이터가 숫자인 경우내려
            console.log("num_check : ",num_check);
            data_text = num_check.replace(/\B(?=(\d{3})+(?!\d))/g, ","); //천단위로 콤마를 찍어줌.
        }
        return data_text;
    }else{
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
    if(test == "AmountSosu"){
        if(key != NaN){ //해당 데이터가 숫자일 경우
            var data_text = key.replace(/\B(?=(\d{3})+(?!\d))/g, ","); //천단위로 콤마를 찍어줌.
        }
        return data_text;
    }else{
        return key;
    }
}
/******************************************************************
 기능 : 테이블 항목별 크기조정 기능
 Date : 2018-08-30
 만든이 : hagdung-i
 ******************************************************************/
function table_column_controller(resize_area, Unalterable_area){
    resize_area.resizable({
        containment: "#" + Unalterable_area[0].id, autoHide: true,
        resize: function (event, ui) {   //테이블사이즈는 가로만 조정 가능하도록.
            ui.size.height = ui.originalSize.height;
        }
    });
};
