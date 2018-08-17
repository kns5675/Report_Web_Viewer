document.write("<script type='text/javascript' src='/JS/label.js' ><" + "/script>");
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

/******************************************************************
 기능 : 어떤 밴드인지 판단하는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function judgementBand(Layers) {
    for (var k = 0; k < Layers.length; k++) {
        if (Array.isArray(Layers[k].Bands.anyType)) { // 배열이면 true 아니면 false
            for (var m = 0; m < Layers[k].Bands.anyType.length; m++) {
                switch (Layers[k].Bands.anyType[m]._attributes["xsi:type"]) {
                    case "BandBackGround" :
                        BandBackGround = Layers[k].Bands.anyType[m];
                        judgementControlList(BandBackGround);
                        break;
                    case "BandPageHeader" :
                        BandPageHeader = Layers[k].Bands.anyType[m];
                        judgementControlList(BandPageHeader);
                        break;
                    case "BandTitle" :
                        BandTitle = Layers[k].Bands.anyType[m];
                        judgementChildBand(BandTitle);
                        judgementControlList(BandTitle);
                        break;
                    case "BandData" :
                        BandData = Layers[k].Bands.anyType[m];
                        judgementChildBand(BandData);
                        judgementControlList(BandData);
                        break;
                    case "BandPageFooter" :
                        BandPageFooter = Layers[k].Bands.anyType[m];
                        judgementControlList(BandPageFooter);
                        break;
                    case "BandForeGround" :
                        BandForeGround = Layers[k].Bands.anyType[m];
                        judgementControlList(BandForeGround);
                        break;
                }
            }
        } else {
            switch (Layers[k].Bands.anyType._attributes["xsi:type"]) {
                case "BandBackGround" :
                    BandBackGround = Layers[k].Bands.anyType;
                    judgementControlList(BandBackGround);
                    break;
                case "BandPageHeader" :
                    BandPageHeader = Layers[k].Bands.anyType;
                    judgementControlList(BandPageHeader);
                    break;
                case "BandTitle" :
                    BandTitle = Layers[k].Bands.anyType;
                    judgementChildBand(BandTitle);
                    judgementControlList(BandTitle);
                    break;
                case "BandData" :
                    BandData = Layers[k].Bands.anyType;
                    judgementControlList(BandData);
                    break;
                case "BandPageFooter" :
                    BandPageFooter = Layers[k].Bands.anyType;
                    judgementControlList(BandPageFooter);
                    break;
                case "BandForeGround" :
                    BandForeGround = Layers[k].Bands.anyType;
                    judgementControlList(BandForeGround);
                    break;
            }
        }
    }
}

/******************************************************************
 기능 : 하위 밴드의 유무 및 어떤 하위 밴드인지 판단하는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function judgementChildBand(data) {
    var childBandName;

    if (!(data.ChildBands.anyType === undefined)) {
    }
    if (!(data.ChildHeaderBands.anyType === undefined)) {
        if (Array.isArray(data.ChildHeaderBands.anyType)) {
            for (var i = 0; i < data.ChildHeaderBands.anyType.length; i++) {
                childBandName = data.ChildHeaderBands.anyType[i]._attributes["xsi:type"];

                switch (childBandName) {
                    case "BandDataHeader" :
                        BandDataHeader = data.ChildHeaderBands.anyType[i];
                        judgementControlList(BandDataHeader);
                        break;
                    case "BandDummyHeader" :
                        BandDummyHeader = data.ChildHeaderBands.anyType[i];
                        judgementControlList(BandDummyHeader);
                        break;
                    case "BandGroupHeader" :
                        BandGroupHeader = data.ChildHeaderBands.anyType[i];
                        judgementControlList(BandGroupHeader);
                        break;
                }
            }
        } else {
            childBandName = data.ChildHeaderBands.anyType._attributes["xsi:type"];
            switch (childBandName) {
                case "BandDataHeader" :
                    BandDataHeader = data.ChildHeaderBands.anyType;
                    judgementControlList(BandDataHeader);
                    break;
                case "BandDummyHeader" :
                    BandDummyHeader = data.ChildHeaderBands.anyType;
                    judgementControlList(BandDummyHeader);
                    break;
                case "BandGroupHeader" :
                    BandGroupHeader = data.ChildHeaderBands.anyType;
                    judgementControlList(BandGroupHeader);
                    break;
            }
        }
    }
    if (!(data.ChildFooterBands.anyType == undefined)) {
        if (Array.isArray(data.ChildFooterBands.anyType)) {
            for (var i = 0; i < data.ChildFooterBands.anyType.length; i++) {
                childBandName = data.ChildFooterBands.anyType[i]._attributes["xsi:type"];
                switch (childBandName) {
                    case "BandDataFooter" :
                        BandDataFooter = data.ChildFooterBands.anyType[i];
                        judgementControlList(BandDataFooter);
                        break;
                    case "BandDummyFooter" :
                        BandDummyFooter = data.ChildFooterBands.anyType[i];
                        judgementControlList(BandDummyFooter);
                        break;
                    case "BandGroupFooter" :
                        BandGroupFooter = data.ChildFooterBands.anyType[i];
                        judgementControlList(BandGroupFooter);
                        break;
                }
            }
        } else {
            childBandName = data.ChildFooterBands.anyType._attributes["xsi:type"];
            switch (childBandName) {
                case "BandDataFooter" :
                    BandDataFooter = data.ChildFooterBands.anyType;
                    judgementControlList(BandDataFooter);
                    break;
                case "BandDummyFooter" :
                    BandDummyFooter = data.ChildFooterBands.anyType;
                    judgementControlList(BandDummyFooter);
                    break;
                case "BandGroupFooter" :
                    BandGroupFooter = data.ChildFooterBands.anyType;
                    judgementControlList(BandGroupFooter);
                    break;
            }
        }
    }
}

/******************************************************************
 기능 : ControlList의 유무를 판단하는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function judgementControlList(data) {
    if (!(data.ControlList.anyType === undefined)) { // ControlList태그 안에 뭔가가 있을 때
        var controlList = data.ControlList.anyType;
        if (Array.isArray(controlList)) {
            controlList.forEach(function (controlList) {
                judgementLabel(controlList);
            });
        } else {
            judgementLabel(controlList);
        }
    } else {
        console.log('ControlList none');
    }
}

/******************************************************************
 기능 : 어떤 Label인지를 판단하여 객체를 생성해주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function judgementLabel(data) {
    var attr = data._attributes["xsi:type"];
    if (attr == "ControlDynamicTable") { // 동적 테이블
        var controlDynamicTable = new Table(data);
        tableList.push(controlDynamicTable);

        var tableLabels = data.Labels.TableLabel;

        for (var i = 0; i < tableLabels.length; i++) {
            var tableLabel = new DynamicTableLabel(data, i);
            tableLabelList.push(tableLabel);
        }

        drawingDynamicTable(controlDynamicTable, tableLabelList);

    } else if (attr == "ControlFixedTable") { // 고정 테이블
        var controlFixedTable = new Table(data);
        tableList.push(controlFixedTable);

        var tableLabels = data.Labels.TableLabel;
        for (var i = 0; i < tableLabels.length; i++) {
            var tableLabel = new FixedTableLabel(data, i);
            tableLabelList.push(tableLabel);
        }
        drawingFixedTable(controlFixedTable, tableLabelList);

    } else if (attr == "ControlLabel") {
        if (!(data.DataType === undefined)) {
            switch (data.DataType._text) {
                case "SummaryLabel" : // 요약 라벨
                    var label = new SummaryLabel(data);
                    labelList.push(label);
                    drawingSummaryLabel(label);
                    break;
                case "DataLabel" : // 데이터 라벨
                    var label = new DataLabel(data);
                    labelList.push(label);
                    drawingDataLabel(label);
                    break;
                case "Expression" : // 수식 라벨
                    var label = new Expression(data);
                    labelList.push(label);
                    drawingExpression(label);
                    break;
                case "GroupLabel" : // 그룹 라벨
                    var label = new GroupLabel(data);
                    labelList.push(label);
                    drawingGroupLabel(label);
                    break;
                case "ParameterLabel" : // 파라미터 라벨
                    var label = new ParameterLabel(data);
                    labelList.push(label);
                    drawingParameterLabel(label);
                    break;
                case "SystemLabel" : // 시스템 라벨
                    var label = new SystemLabel(data);
                    labelList.push(label);
                    drawingSystemLabel(label);
                    break;
            }
        } else {
            var label = new Label(data);
            labelList.push(label);
            drawingNormalLabel(label);
        }
    }
}

/******************************************************************
 부모의 position이 relative이고 자식의 position이 absolute일 때
 부모를 기준으로 자식의 위치를 잡을 수 있다.
 ******************************************************************/

/* 객체를 만들 때 데이터 바인딩도 해보아야한당 */
/******************************************************************
 기능 : DynamicTable(동적 테이블)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingDynamicTable(table, tableLabel) {
    $('#report').append('<div id="Table"></div>');
    $('#Table').append('<table id="dynamicTable"></table>');
    $('#report').css('position', 'relative');
    $('#Table').css('position', 'absolute');

    $('#Table').css('left', table.rectangle.x + 'px');
    $('#Table').css('top', table.rectangle.y + 'px');

    $('#dynamicTable').css('width', table.rectangle.width + 'px');
    $('#dynamicTable').css('height', table.rectangle.height + 'px');


/*     let html = '<table>'
         +'<thead>'
         +'<th><%= Object.keys(dt[0])[0]%></th>'
         +'<th><%= Object.keys(dt[0])[1]%></th>'
         +'<th><%= Object.keys(dt[0])[2]%></th>'
        +'<th><%= Object.keys(dt[0])[3]%></th>'
        +'<th><%= Object.keys(dt[0])[4]%></th>'
        +'</thead>'
        +'<tbody>'
        <% dt.forEach(function(data){ %>
            +'<tr>'
            +'<td><%= data.이름._text %> </td>'
            +'<td><%= data.품명._text %> </td>'
            +'<td><%= data.수량._text %> </td>'
            +'<td><%= data.단가._text %> </td>'
            +'<td><%= data.금액._text %> </td>'
            +'</tr>'
            <% })%>
        +'</tbody>'
        +'</table>';*/

    $('#dynamicTable').html(html);

    $('#dynamicTable').append('<tr id = "dynamicTitleLabel"></tr>');
    $('#dynamicTable').append('<tr id = "dynamicValueLabel"></tr>');

    if (Array.isArray(tableLabel)) {
        tableLabel.forEach(function (tableLabel, i) {
            switch (tableLabel._attributes) {
                case "DynamicTableTitleLabel" :
                    $('#dynamicTitleLabel').append('<th>a</th>');
                    $('#dynamicTitleLabel').css('width', tableLabel.rectangle.width);
                    $('#dynamicTitleLabel').css('height', tableLabel.rectangle.height);
                    $('th').css('border', '1px solid black');
                    break;
                case "DynamicTableValueLabel" :
                    $('#dynamicValueLabel').append('<td>a</td>');
                    $('#dynamicValueLabel').css('width', tableLabel.rectangle.width);
                    $('#dynamicValueLabel').css('height', tableLabel.rectangle.height);
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
function drawingFixedTable(table, tableLabel) {
    $('#report').append('<table id="fixedTable"></table>');

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
                    break;
                case "FixedTableValueLabel" :
                    $('#fixedValueLabel').append('<td></td>');
                    $('#fixedValueLabel').css('width', tableLabel.rectangle.width);
                    $('#fixedValueLabel').css('height', tableLabel.rectangle.height);
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
function drawingSystemLabel(data) {
    $('#report').append('<div id = "SystemLabel' + systemLabelNum + '">SystemLabel</div>');

    $('#SystemLabel' + systemLabelNum).css('width', data.rectangle.width);
    $('#SystemLabel' + systemLabelNum).css('height', data.rectangle.height);

    $('#SystemLabel' + systemLabelNum).css('position', 'absolute');
    $('#SystemLabel' + systemLabelNum).css('left', data.rectangle.x + 'px');
    $('#SystemLabel' + systemLabelNum).css('top', data.rectangle.y + 'px');

    $('#SystemLabel' + systemLabelNum).css('border', '1px solid black');
    systemLabelNum++;
}

/******************************************************************
 기능 : SummaryLabel(요약 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingSummaryLabel(data) {
    $('#report').append('<div id = "SummaryLabel' + summaryLabelNum + '">SummaryLabel</div>');

    $('#SummaryLabel' + summaryLabelNum).css('width', data.rectangle.width);
    $('#SummaryLabel' + summaryLabelNum).css('height', data.rectangle.height);

    $('#SummaryLabel' + summaryLabelNum).css('position', 'absolute');
    $('#SummaryLabel' + summaryLabelNum).css('left', data.rectangle.x + 'px');
    $('#SummaryLabel' + summaryLabelNum).css('top', data.rectangle.y + 'px');

    $('#SummaryLabel' + summaryLabelNum).css('border', '1px solid black');
    summaryLabelNum++;
}

/******************************************************************
 기능 : DataLabel(데이터 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingDataLabel(data) {
    $('#report').append('<div id = "DataLabel' + dataLabelNum + '">DataLabel</div>');

    $('#DataLabel' + dataLabelNum).css('width', data.rectangle.width);
    $('#DataLabel' + dataLabelNum).css('height', data.rectangle.height);

    $('#DataLabel' + dataLabelNum).css('position', 'absolute');
    $('#DataLabel' + dataLabelNum).css('left', data.rectangle.x + 'px');
    $('#DataLabel' + dataLabelNum).css('top', data.rectangle.y + 'px');

    $('#DataLabel' + dataLabelNum).css('border', '1px solid black');
    dataLabelNum++;
}

/******************************************************************
 기능 : NormalLabel(일반 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingNormalLabel(data) {
    $('#report').append('<div id = "NormalLabel' + normalLabelNum + '">NormalLabel</div>');

    $('#NormalLabel' + normalLabelNum).css('width', data.rectangle.width);
    $('#NormalLabel' + normalLabelNum).css('height', data.rectangle.height);

    $('#NormalLabel' + normalLabelNum).css('position', 'absolute');
    $('#NormalLabel' + normalLabelNum).css('left', data.rectangle.x + 'px');
    $('#NormalLabel' + normalLabelNum).css('top', data.rectangle.y + 'px');

    $('#NormalLabel' + normalLabelNum).css('border', '1px solid black');
    normalLabelNum++;
}

/******************************************************************
 기능 : Expression(수식 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingExpression(data) {
    $('#report').append('<div id = "Expression' + expressionNum + '">Expression</div>');

    $('#Expression' + expressionNum).css('width', data.rectangle.width);
    $('#Expression' + expressionNum).css('height', data.rectangle.height);

    $('#Expression' + expressionNum).css('position', 'absolute');
    $('#Expression' + expressionNum).css('left', data.rectangle.x + 'px');
    $('#Expression' + expressionNum).css('top', data.rectangle.y + 'px');

    $('#Expression' + expressionNum).css('border', '1px solid black');
    expressionNum++;
}

/******************************************************************
 기능 : GroupLabel(그룹 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingGroupLabel(data) {
    $('#report').append('<div id = "GroupLabel' + groupLabelNum + '">GroupLabel</div>');

    $('#GroupLabel' + groupLabelNum).css('width', data.rectangle.width);
    $('#GroupLabel' + groupLabelNum).css('height', data.rectangle.height);

    $('#GroupLabel' + groupLabelNum).css('position', 'absolute');
    $('#GroupLabel' + groupLabelNum).css('left', data.rectangle.x + 'px');
    $('#GroupLabel' + groupLabelNum).css('top', data.rectangle.y + 'px');

    $('#GroupLabel' + groupLabelNum).css('border', '1px solid black');
    groupLabelNum++;
}

/******************************************************************
 기능 : ParameterLabel(파라미터 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingParameterLabel(data) {
    $('#report').append('<div id = "ParameterLabel' + parameterLabelNum + '">ParameterLabel</div>');

    $('#ParameterLabel' + parameterLabelNum).css('width', data.rectangle.width);
    $('#ParameterLabel' + parameterLabelNum).css('height', data.rectangle.height);

    $('#ParameterLabel' + parameterLabelNum).css('position', 'absolute');
    $('#ParameterLabel' + parameterLabelNum).css('left', data.rectangle.x + 'px');
    $('#ParameterLabel' + parameterLabelNum).css('top', data.rectangle.y + 'px');

    $('#ParameterLabel' + parameterLabelNum).css('border', '1px solid black');
    parameterLabelNum++;
}