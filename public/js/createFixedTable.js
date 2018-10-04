/******************************************************************
 기능 : FixedTable(고정 테이블)을 화면에 그려주는 함수를 만든다.
 만든이 : 하지연
 ******************************************************************/
function drawingFixedTable(data, controlFixedTable, fixTableLabelList, divId, numOfData, fixTableList) {
    if (data.IsApprovalBox._text == "true") {
        console.log("결재란");//결재란일 경우 처리 여기에. 코드 정리 필요..
    }
    var div = $('#' + divId);//divId = 밴드
    div.css('position', 'relative');
    div.css('border', '1px solid blue');

    div.append('<div id = "Table' + tableNum + '"></div>');//무의미한 테이블 div
    var divIdTable = $('#Table' + tableNum);
    divIdTable.css({
        //'position': 'absolute',
        'top': 0
    });
    var temp_table_class = controlFixedTable.id.substring(0, 4); // 임시로 table을 인식하기 위한 번호 - 전형준

    divIdTable.append('<table id="fixedTable' + fixedTableNum + '" class="table table-' + temp_table_class + '"></table>');
    var fixTableId = $('#fixedTable' + fixedTableNum);//고정테이블
    rC2 = 1;
    fixTableId.css({
        'width': controlFixedTable.rectangle.width,
        'height': controlFixedTable.rectangle.height,
        'border-spacing': 0,
        'padding': 0
    });
    var dt = Object.values(dataTable.DataSetName)[0];

    var fixTableWidth = controlFixedTable.rectangle.width;//고정테이블 width 값
    var fixTableHeight = controlFixedTable.rectangle.height;
    var fixTableLabelListLength = Number(fixTableLabelList.length);//고정테이블 라벨리스트 라벨 갯수
    function countingRows() {
        var xZeroCount = 0;
        for (var q = 0; q < fixTableLabelListLength; q++) {
            if (fixTableLabelList[q].rectangle.x == '0') {
                xZeroCount++;
            }
        }
        setRowCount(xZeroCount);
    }
    countingRows();
    function setRowCount(xZeroCount) {
        var totalLabelWidth = 0;//라벨너비
        var labelCount = 0;//라벨개수
        var rowCount = xZeroCount;//row개수

        if (data.Labels) {//라벨 리스트 라벨 width, height값 가져오기
            for (var i = 0; i < fixTableLabelListLength; i++) {
                var thisLabelWidth = Number(fixTableLabelList[i].rectangle.width);
                var thisLabelHeight = Number(fixTableLabelList[i].rectangle.height);
                var thisLabelX = fixTableLabelList[i].rectangle.x;

                labelCount++;
                totalLabelWidth += thisLabelWidth;

                if (labelCount == fixTableLabelListLength) {
                    // rowCount = xZeroCount;

                    for (var i = 1; i <= rowCount; i++) {
                        fixTableId.append('<tr id = "fixedTableRow' + fixTableRowCount + '"></tr>');
                        var ThisfixedTableRow = $("#fixedTableRow" + fixTableRowCount);

                        ThisfixedTableRow.css({
                            'position':'absolute',
                            'border-spacing': 0,
                            'margin': 0,
                            'padding': 0,
                            'top': 0,
                            'width': fixTableWidth,
                            'overflow': 'visible'
                        });

                        var drawingTds = labelCount / rowCount;

                        tdDataBinding(ThisfixedTableRow, drawingTds);
                        fixTableRowCount++;
                    }

                    function tdDataBinding(ThisfixedTableRow, drawingTds) {
                        var tdId = 'FixedTableLabel_';
                        if (rC2 > drawingTds) {
                            drawingTds = labelCount;
                        }
                        for (rC2; rC2 <= drawingTds; rC2++) {
                            var fromData = fixTableLabelList[rC2 - 1];
                            var tdLeft = fromData.rectangle.x;
                            var tdTop = fromData.rectangle.y;
                            var tdIDMaking = tdId + rC2 + '_' + labelC;
                            var tdIDwithS = $("#" + tdIDMaking);

                            switch (fromData.dataType) {
                                case  "DataLabel" :
                                    if (groupFieldArray !== undefined) {
                                        if (fromData.fieldName !== undefined) {
                                            var fieldName = fromData.fieldName;

                                            if (fieldName == groupFieldName) {
                                                if (groupFieldArray[groupFieldNum]) {
                                                    var showDataLabel = groupFieldArray[groupFieldNum][0];
                                                    if (showDataLabel !== undefined) {
                                                        showDataLabel = showDataLabel
                                                    }
                                                    if (showDataLabel === 'undefined') {
                                                        showDataLabel = ' ';
                                                    }
                                                    if (typeof showDataLabel == undefined) {
                                                        showDataLabel = ' ';
                                                    }
                                                }
                                            } else {
                                                if (groupFieldArray[groupFieldNum]) {
                                                    if (groupFieldArray[groupFieldNum][1][fieldName]) {
                                                        var showDataLabel = groupFieldArray[groupFieldNum][1][fieldName]._text;
                                                        if (showDataLabel !== undefined) {
                                                            showDataLabel = showDataLabel
                                                        }
                                                        if (typeof showDataLabel === 'undefined') {
                                                            showDataLabel = ' ';
                                                        }
                                                    }
                                                } else {
                                                    console.log("그룹풋터밴드에 해당하는 총계나 그런애들에 대한 자바스크립트..? 처리가 필요함");
                                                }
                                            }
                                        }
                                        if (typeof showDataLabel === 'undefined') {
                                            showDataLabel = ' ';
                                        }
                                        var table_reform = table_format_check(data.Labels, tdIDwithS, showDataLabel, fromData);
                                        ThisfixedTableRow.append
                                        ('<td class="DataLabel" id = "' + tdId + rC2 + '_' + labelC + '">' +
                                            '<p id="' + tdId + rC2 + '_p_' + labelC + '">' + table_reform + '</p>' +
                                            '</td>');
                                        // settingAttribute(fromData, tdId, rC2, fixTableId, fixTableWidth, fixTableHeight);
                                        // setTable();
                                        var tdId_javascript = $("#" + tdIDMaking);
                                    }
                                    break;
                                case  "NormalLabel" :
                                    ThisfixedTableRow.append('<td class="NormalLabel" id = "' + tdId + rC2 + '_' + labelC + '">' +
                                        '<p id="' + tdId + rC2 + '_p_' + labelC + '">' + table_format_check(data.Labels, tdIDwithS, fromData.text, fromData) + '</p></td>');
                                    // settingAttribute(fromData, tdId, rC2, fixTableId, fixTableWidth, fixTableHeight);
                                    // setTable();
                                    var tdId_javascript = $("#" + tdIDMaking);
                                    break;
                                // case "SummaryLabel" :
                                // console.log(data);
                                // var label = new SummaryLabel(data);
                                // drawingSummaryLabel(label, divId);
                                // ThisfixedTableRow.append('<td class="SummaryLabel" id = "' + tdId + rC2 + '_' + fixedTableNum + '">' +
                                //     '<p id="' + tdId + rC2 + '_p_' + fixedTableNum + '">' + table_format_check(data.Labels, tdIDwithS, fromData.text, fromData) + '</p></td>');
                                // break;
                            }
                            settingAttribute(fromData, tdId, rC2, fixTableId, fixTableWidth, fixTableHeight, tdLeft, tdTop);
                            setTable();
                            // // drd_javascript(label, tdId_javascript, label.startBindScript, rC2, data[temp]);
                        }
                    }
                }
            }
        }
    }

    function setTable() {
        if (Array.isArray(fixTableLabelList)) {
            var MathfixTableWidth = Math.round(fixTableWidth);
            fixTableId.css({
                'position': 'absolute',
                'z-index': 999,
                //'width': Math.round(fixTableWidth),//어쩔수없었음 round안하면 테이블 width 소수점 자동으로 없애버림..,
                'width': MathfixTableWidth,//하지연
                'over-flow': 'visible',
                'height': fixTableHeight,
                'left': controlFixedTable.rectangle.x + 'px',
                'top': controlFixedTable.rectangle.y + 'px',
                //'border-collapse': 'collapse',
                //'border':'0.5px solid black',//임시로 이렇게 줘봤음 일단
                'border': '0px',
                'border-spacing': '0px'

            });
            labelC++;
            thNum++;
            fixedTableLabelNum++;
        }
    }

    tableNum++;
    fixedTableNum++;
}

/******************************************************************
 기능 : 고정테이블 안의 FixedTableLabel의 속성을 구현하고, 적용시킨다.
 만든이 : 하지연
 ******************************************************************/
function settingAttribute(fromData, tdId, rC2, fixTableId, fixTableWidth, fixTableHeight, tdLeft, tdTop) {
    var ThisFixedTableData = $("#" + tdId + rC2 + '_' + labelC);
    var ThisFixedTableDataP = $("#" + tdId + rC2 + '_p_' + labelC);

    var thisText = fromData.text;
    var thisTextLength = String(fromData.text).length;
    var textWithoutSpace =  String(thisText).replace( /(\s*)/g, "");
    var textSize = fromData.fontSize.split('pt')[0];
    var textWithoutSpaceLength = textWithoutSpace.length;

    //thisText = thisText.toString();
    //console.log("갯수 : ",thisText.length+'<br/>');
    // var space = thisText.split
    //console.log("length : ",fromData.text.length);
    ThisFixedTableDataP.css({
        'top': 0,
        'left': 0
    });
    ThisFixedTableData.css({
        'position':'absolute',
        'left': tdLeft+'px',
        'top': tdTop+'px'
    })

    if (fromData.noBorder == 'true') {//border 없을때
        ThisFixedTableData.css('border', 'none');

        ThisFixedTableData.css({
            'width': fromData.rectangle.width,
            'height': fromData.rectangle.height,
            'float': 'left',
            'background-color': fromData.backGroundColor,
            'font-size': fromData.fontSize,
            'font-family': fromData.fontFamily,
            'font-weight': fromData.fontStyle,
            'padding': 0,
            'border-spacing': '0px',
            'border-collapse': 'collapse',
            'color': fromData.textColor
        });
    } else {//border 있을때
        if (fromData.borderThickness !== undefined) {
            var leftBorderStyle = borderDottedLine(fromData.borderDottedLines.leftDashStyle);
            var rightBorderStyle = borderDottedLine(fromData.borderDottedLines.rightDashStyle);
            var bottomBorderStyle = borderDottedLine(fromData.borderDottedLines.bottomDashStyle);
            var topBorderStyle = borderDottedLine(fromData.borderDottedLines.topDashStyle);
            var leftThickness = Number(fromData.borderThickness.left);
            var rightThickness = Number(fromData.borderThickness.right);
            var bottomThickness = Number(fromData.borderThickness.bottom);
            var topThickness = Number(fromData.borderThickness.top);
            var height = Number(fromData.rectangle.height);
            var width = Number(fromData.rectangle.width);

            if (leftBorderStyle == rightBorderStyle && rightBorderStyle == bottomBorderStyle && bottomBorderStyle == topBorderStyle) {
                if (leftThickness == rightThickness && rightThickness == bottomThickness && bottomThickness == topThickness) {
                    ThisFixedTableData.css({
                        'width': (width - (leftThickness * 2)) + 'px',
                        'height': (height - (topThickness * 2)) + 'px',
                        'float': 'left',
                        'background-color': fromData.backGroundColor,
                        'font-size': fromData.fontSize,
                        'font-family': fromData.fontFamily,
                        'font-weight': fromData.fontStyle,
                        'padding': 0,
                        'margin': 0,
                        'border': topThickness + 'px ' + leftBorderStyle + ' ' + fromData.leftBorderColor,
                        'border-collapse': 'collapse',
                        'border-spacing': '0px',
                        'white-space': 'nowrap',
                        'color': fromData.textColor,
                        'overflow': 'visible',
                    });

                    /*fixTableId.css({
                        'border': (topThickness/2) + 'px ' + leftBorder +' ' + fromData.leftBorderColor,
                        'border-collapse':'collapse',
                        'width': fixTableWidth,
                        'height': fixTableHeight,
                    });*/
                }
            } else {
                ThisFixedTableData.css({
                    'border-left': leftThickness + 'px ' + leftBorderStyle + ' ' + fromData.leftBorderColor,
                    'border-right': rightThickness + 'px ' + rightBorderStyle + ' ' + fromData.rightBorderColor,
                    'border-bottom': bottomThickness + 'px ' + bottomBorderStyle + ' ' + fromData.bottomBorderColor,
                    'border-top': topThickness + 'px ' + topBorderStyle + ' ' + fromData.topBorderColor
                });
                var borderLWidth = ThisFixedTableData.css('border-left-width').split('px')[0];
                var borderRWidth = ThisFixedTableData.css('border-right-width').split('px')[0];
                var borderTWidth = ThisFixedTableData.css('border-top-width').split('px')[0];
                var borderBWidth = ThisFixedTableData.css('border-bottom-width').split('px')[0];

                ThisFixedTableData.css({
                    'width': (width - leftThickness - rightThickness) + 'px',
                    'height': (height - topThickness - bottomThickness) + 'px',
                    'float': 'left',
                    'background-color': fromData.backGroundColor,
                    'font-size': fromData.fontSize,
                    'font-family': fromData.fontFamily,
                    'font-weight': fromData.fontStyle,
                    'padding': 0,
                    'border-collapse': 'collapse',
                    'white-space': 'nowrap',
                    'color': fromData.textColor,
                    'overflow': 'visible'
                });
                /*ThisFixedTableDataP.css({
                    'width': (width - (leftThickness*2) - rightThickness) + 'px',
                    'height': (height - topThickness - bottomThickness) + 'px'
                });*/
            }
        }
    }

    if (fromData.wordWrap == 'true') {
        ThisFixedTableData.css('white-space', 'normal');
    }
    if (fromData.visible == 'false') {//visible 속성
        ThisFixedTableData.css('display', 'none');
    }
    var VTextAlignment = fromData.verticalTextAlignment;
    var TextDirection = fromData.textDirection;

    if(topThickness !== undefined){
        if(TextDirection == 'Vertical'){
            ThisFixedTableDataP.text(textWithoutSpace);
            var ptToPx = textSize/0.75;  //pt를 px로 변환
            textWithoutSpaceLength

            ThisFixedTableDataP.css({
                'width': ptToPx + 'px',
                'height': (textWithoutSpaceLength * ptToPx) + 'px',
                'display':'inline-block'
            });
            ThisFixedTableData.css({
                'white-space':'normal'
            })
        }else if(Text == 'Horizontal'){

            /*ThisFixedTableDataP.css({
                'width': (width - leftThickness * 2) + 'px',
                'height': (height - topThickness * 2) + 'px'
            });*/

        }
    }

    function settingVerticalTextAlignment(VTextAlignment) {
        if (VTextAlignment !== undefined) {
            if (ThisFixedTableDataP.css('height') !== undefined) {
                var tagPHeight = (ThisFixedTableDataP.css('height').split('px')[0]);
                var dataHeight = (ThisFixedTableData.css('height').split('px')[0]);

                if (tagPHeight !== undefined) {
                    if (fromData.rectangle.height - tagPHeight >= 0) {
                        var tagPmarginTop = (fromData.rectangle.height - tagPHeight) / 2;

                        switch (VTextAlignment) {
                            case "Center": {
                                ThisFixedTableDataP.css({
                                    '-webkit-margin-before': tagPmarginTop,
                                    'top': tagPmarginTop,
                                    'display':'inline-block'
                                });
                            }
                                break;
                            case "Top": {
                                ThisFixedTableDataP.css({
                                    '-webkit-margin-before': tagPmarginTop / 2,
                                    'top': tagPmarginTop / 2,
                                    'display':'inline-block'
                                });
                            }
                                break;
                            case "Bottom": {
                                ThisFixedTableDataP.css({
                                    '-webkit-margin-before': tagPmarginTop * 2,
                                    'top': tagPmarginTop * 2,
                                    'display':'inline-block'
                                });
                            }
                                break;
                        }
                    }
                }
            }
        }
    }

    settingVerticalTextAlignment(VTextAlignment);
    var HTextAlignment = fromData.horizontalTextAlignment;

    function settingHorizontalTextAlignment(HTextAlignment) {
        if (HTextAlignment !== undefined) {
            ThisFixedTableData.css("text-align", HTextAlignment);
        }
    }

    settingHorizontalTextAlignment(HTextAlignment);


}
/******************************************************************
 기능 : FixedTable(고정 테이블)이 리전 안에 있을 경우에 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔

 수정 : 하지연
 내용 : tr이 1개일 경우 td가 테이블 내에 제위치를 찾을 수 있도록 수정,

 ******************************************************************/
function drawingFixedTableInRegion(data, controlFixedTable, fixTableLabelList, divId, numOfData, fixTableList) {
    // TODO 몇 번째 데이터를 찍고 있는지 알아야 함!
    if (data.IsApprovalBox._text == "true") {
        //결재란일 경우 결재란에 대한 처리를 여기에 해줘야함. 코드 정리는 필요..
    }
    var div = $('#' + divId);//divId = 밴드
    div.css('position', 'relative');
    div.css('border', '1px solid blue');
    div.css('background-color', 'lightyellow');

    div.append('<div id = "Table' + tableNum + '"></div>');//무의미한 테이블 div
    var divIdTable = $('#Table' + tableNum);
    divIdTable.css({
        //'position': 'absolute', 지연수정
        'top': 0
    });

    var temp_table_class = controlFixedTable.id.substring(0, 4); // 임시로 table을 인식하기 위한 번호 - 전형준

    divIdTable.append('<table id="fixedTable' + fixedTableNum + '" class="table table-' + temp_table_class + '"></table>');
    var fixTableId = $('#fixedTable' + fixedTableNum);//고정테이블
    fixTableId.css({
        'width': controlFixedTable.rectangle.width,
        'height': controlFixedTable.rectangle.height,
        'border-spacing': 0,
        'padding': 0,
    });
    var dt = Object.values(dataTable.DataSetName)[0];

    var fixTableWidth = controlFixedTable.rectangle.width;//고정테이블 width 값
    var fixTableHeight = controlFixedTable.rectangle.height;
    var fixTableLabelListLength = Number(fixTableLabelList.length);//고정테이블 라벨리스트 라벨 갯수

    function countingRows() {
        var xZeroCount = 0;
        for (var q = 0; q < fixTableLabelListLength; q++) {
            if (fixTableLabelList[q].rectangle.x == '0') {
                xZeroCount++;
            }
        }
        setRowCount(xZeroCount);
    }
    countingRows();
    function setRowCount(xZeroCount) {
        var totalLabelWidth = 0;//라벨너비
        var labelCount = 0;//라벨개수
        var rowCount = xZeroCount;//row개수

        if (data.Labels) {//라벨 리스트 라벨 width, height값 가져오기
            for (var i = 0; i < fixTableLabelListLength; i++) {
                var thisLabelWidth = Number(fixTableLabelList[i].rectangle.width);//
                var thisLabelHeight = Number(fixTableLabelList[i].rectangle.height);
                var thisLabelX = fixTableLabelList[i].rectangle.x;

                labelCount++;
                totalLabelWidth += thisLabelWidth;

                if (labelCount == fixTableLabelListLength) {
                    // rowCount = xZeroCount;
                    for (var i = 1; i <= rowCount; i++) {
                        fixTableId.append('<tr id = "fixedTableRow' + fixTableRowCount + '"></tr>');
                        var ThisfixedTableRow = $("#fixedTableRow" + fixTableRowCount);
                        ThisfixedTableRow.css({
                            'position':'absolute',
                            'border-spacing': 0,
                            'margin': 0,
                            'padding': 0,
                            'top': 0,
                            'width': fixTableWidth,
                            'overflow': 'visible'
                        });

                        var drawingTds = labelCount / rowCount;

                        tdDataBinding(ThisfixedTableRow, drawingTds);
                        fixTableRowCount++;
                    }

                    function tdDataBinding(ThisfixedTableRow, drawingTds) {
                        var tdId = 'FixedTableLabel_';
                        if (rowCount =='1') {
                            drawingTds = labelCount;
                        }
                        for (rC2; rC2 <= drawingTds; rC2++) {
                            var fromData = fixTableLabelList[rC2 - 1];

                            var tdLeft = fromData.rectangle.x;
                            var tdTop = fromData.rectangle.y;
                            var tdIDMaking = tdId + rC2 + '_' + labelC;
                            var tdIDwithS = $("#" + tdIDMaking);

                            switch (fromData.dataType) {
                                case  "DataLabel" :
                                    if (groupFieldArrayInRegion !== undefined) {
                                        if (fromData.fieldName !== undefined) {
                                            var fieldName = fromData.fieldName;
                                            if (fieldName == groupFieldName) {
                                                if (groupFieldArrayInRegion[groupFieldNumInRegion]) {
                                                    var showDataLabel = groupFieldArrayInRegion[groupFieldNumInRegion][0];
                                                    if (showDataLabel !== undefined) {
                                                        showDataLabel = showDataLabel
                                                    }
                                                    if (showDataLabel === 'undefined') {
                                                        showDataLabel = ' ';
                                                    }
                                                    if (typeof showDataLabel == undefined) {
                                                        showDataLabel = ' ';
                                                    }
                                                }
                                            } else {
                                                if (groupFieldArrayInRegion[groupFieldNumInRegion]) {
                                                    if (groupFieldArrayInRegion[groupFieldNumInRegion][1][fieldName]) {
                                                        var showDataLabel = groupFieldArrayInRegion[groupFieldNumInRegion][1][fieldName]._text;
                                                        if (showDataLabel !== undefined) {
                                                            showDataLabel = showDataLabel
                                                        }
                                                        if (typeof showDataLabel === 'undefined') {
                                                            showDataLabel = ' ';
                                                        }
                                                    }
                                                } else {
                                                    console.log("그룹풋터밴드에 해당하는 총계나 그런애들에 대한 자바스크립트..? 처리가 필요함");
                                                }
                                            }
                                        }
                                        if (typeof showDataLabel === 'undefined') {
                                            showDataLabel = ' ';
                                        }
                                        var table_reform = table_format_check(data.Labels, tdIDwithS, showDataLabel, fromData);
                                        ThisfixedTableRow.append
                                        ('<td class="DataLabel" id = "' + tdId + rC2 + '_' + labelC + '">' +
                                            '<p id="' + tdId + rC2 + '_p_' + labelC + '">' + table_reform + '</p>' +
                                            '</td>');
                                        // settingAttribute(fromData, tdId, rC2, fixTableId, fixTableWidth, fixTableHeight);
                                        // setTable();
                                        var tdId_javascript = $("#" + tdIDMaking);
                                    }
                                    break;
                                case  "NormalLabel" :
                                    if (fromData.text === undefined) {
                                        fromData.text = ' ';
                                    }
                                    ThisfixedTableRow.append('<td class="NormalLabel" id = "' + tdId + rC2 + '_' + labelC + '">' +
                                        '<p id="' + tdId + rC2 + '_p_' + labelC + '">' + table_format_check(data.Labels, tdIDwithS, fromData.text, fromData) + '</p></td>');
                                    // settingAttribute(fromData, tdId, rC2, fixTableId, fixTableWidth, fixTableHeight);
                                    // setTable();
                                    var tdId_javascript = $("#" + tdIDMaking);
                                    break;
                                // case "SummaryLabel" :
                                //     var label = new DataLabel(data);
                                //     drawingSummaryLabel(label);
                                //     ThisfixedTableRow.append('<td class="SummaryLabel" id = "' + tdId + rC2 + '_' + fixedTableNum + '">' +
                                //         '<p id="' + tdId + rC2 + '_p_' + fixedTableNum + '">' + table_format_check(data.Labels, tdIDwithS, fromData.text, fromData) + '</p></td>');
                                //     break;
                            }
                            settingAttribute(fromData, tdId, rC2, fixTableId, fixTableWidth, fixTableHeight, tdLeft, tdTop);
                            setTable();
                        }
                    }
                }
            }
        }
    }
    setRowCount();

    function setTable() {
        if (Array.isArray(fixTableLabelList)) {
            var MathfixTableWidth = Math.round(fixTableWidth);
            fixTableId.css({
                'position': 'absolute',
                'z-index': 999,
                //'width': Math.round(fixTableWidth),//어쩔수없었음 round안하면 테이블 width 소수점 자동으로 없애버림..,
                'width': MathfixTableWidth,//하지연
                'over-flow': 'visible',
                'height': fixTableHeight,
                'left': controlFixedTable.rectangle.x + 'px',
                'top': controlFixedTable.rectangle.y + 'px',
                //'border-collapse': 'collapse',
                //'border':'0.5px solid black',//임시로 이렇게 줘봤음 일단
                'border': '0px',
                'border-spacing': '0px'
            });
            labelC++;
            thNum++;
            fixedTableLabelNum++;
        }
    }

    tableNum++;
    fixedTableNum++;
}
/******************************************************************
 기능 : FixedTable(고정 테이블)이 데이터 밴드 안에 있을 경우에 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingFixedTableInDataBand(data, controlFixedTable, fixTableLabelList, fixedTableDivId, curDataRowInDataBand, fixTableList) {
    // TODO 몇 번째 데이터를 찍고 있는지 알아야 함!
    if (data.IsApprovalBox._text == "true") {
        //결재란일 경우 결재란에 대한 처리를 여기에 해줘야함. 코드 정리는 필요..
    }
    var fixedTableDiv = $('#' + fixedTableDivId);// 밴드
    fixedTableDiv.css('position', 'relative');
    fixedTableDiv.css('border', '1px solid blue');
    fixedTableDiv.css('background-color', 'lightgreen');

    fixedTableDiv.append('<div id = "Table' + tableNum + '"></div>');//무의미한 테이블 div
    var divIdTable = $('#Table' + tableNum);
    divIdTable.css({
        'position': 'absolute',
        'top': 0
    });
    var temp_table_class = controlFixedTable.id.substring(0, 4); // 임시로 table을 인식하기 위한 번호 - 전형준

    divIdTable.append('<table id="fixedTable' + fixedTableNum + '" class="table table-' + temp_table_class + '"></table>');
    var fixTableId = $('#fixedTable' + fixedTableNum);//고정테이블
    rC2 = 1;
    fixTableId.css({
        'width': controlFixedTable.rectangle.width,
        'height': controlFixedTable.rectangle.height,
        'border-spacing': 0,
        'padding': 0
    });
    var dt = Object.values(dataTable.DataSetName)[0];

    var fixTableWidth = controlFixedTable.rectangle.width;//고정테이블 width 값
    var fixTableHeight = controlFixedTable.rectangle.height;
    var fixTableLabelListLength = Number(fixTableLabelList.length);//고정테이블 라벨리스트 라벨 갯수

    function countingRows() {
        var xZeroCount = 0;
        for (var zz = 0; zz < fixTableLabelListLength; zz++) {
            if (fixTableLabelList[zz].rectangle.x == '0') {
                xZeroCount++;
            }
        }
        setRowCount(xZeroCount);
    }

    countingRows();

    function setRowCount(xZeroCount) {
        var totalLabelWidth = 0;//라벨너비
        var labelCount = 0;//라벨개수
        var rowCount = 0;//row개수

        if (data.Labels) {//라벨 리스트 라벨 width, height값 가져오기
            for (var i = 0; i < fixTableLabelListLength; i++) {
                var thisLabelWidth = Number(fixTableLabelList[i].rectangle.width);
                var thisLabelHeight = Number(fixTableLabelList[i].rectangle.height);
                var thisLabelX = fixTableLabelList[i].rectangle.x;

                labelCount++;
                totalLabelWidth += thisLabelWidth;

                if (labelCount == fixTableLabelListLength) {
                    rowCount = xZeroCount;
                    for (var rC = 1; rC <= rowCount; rC++) {
                        fixTableId.append('<tr id = "fixedTableRow' + fixTableRowCount + '"></tr>');
                        var ThisfixedTableRow = $("#fixedTableRow" + fixTableRowCount);

                        ThisfixedTableRow.css({
                            'position':'absolute',
                            'border-spacing': 0,
                            'margin': 0,
                            'padding': 0,
                            'top': 0,
                            //'width': thisLabelWidth,
                            //'height': thisLabelHeight,
                            'overflow': 'visible'
                        });

                        var drawingTds = labelCount / rowCount;

                        tdDataBinding(ThisfixedTableRow, drawingTds);
                        fixTableRowCount++;
                    }

                    function tdDataBinding(ThisfixedTableRow, drawingTds) {
                        var tdId = 'FixedTableLabel_';
                        if (rC2 > drawingTds) {
                            drawingTds = labelCount;
                        }
                        for (rC2; rC2 <= drawingTds; rC2++) {
                            var fromData = fixTableLabelList[rC2 - 1];

                            var tdIDMaking = tdId + rC2 + '_' + labelC;
                            var tdIDwithS = $("#" + tdIDMaking);

                            switch (fromData.dataType) {
                                case  "DataLabel" :
                                    if (groupFieldArray !== undefined) {
                                        if (fromData.fieldName !== undefined) {
                                            var fieldName = fromData.fieldName;

                                            if (fieldName == groupFieldName) {
                                                if (groupFieldArray[groupFieldNum]) {
                                                    var showDataLabel = groupFieldArray[groupFieldNum][0];
                                                    if (showDataLabel !== undefined) {
                                                        showDataLabel = showDataLabel
                                                    }
                                                    if (showDataLabel === 'undefined') {
                                                        showDataLabel = ' ';
                                                    }
                                                    if (typeof showDataLabel == undefined) {
                                                        showDataLabel = ' ';
                                                    }
                                                }
                                            } else {
                                                if (groupFieldArray[groupFieldNum]) {
                                                    if (groupFieldArray[groupFieldNum][1][fieldName]) {
                                                        var showDataLabel = groupFieldArray[groupFieldNum][1][fieldName]._text;
                                                        if (showDataLabel !== undefined) {
                                                            showDataLabel = showDataLabel
                                                        }
                                                        if (typeof showDataLabel === 'undefined') {
                                                            showDataLabel = ' ';
                                                        }
                                                    }
                                                } else {
                                                    console.log("그룹풋터밴드에 해당하는 총계나 그런애들에 대한 자바스크립트..? 처리가 필요함");
                                                }
                                            }
                                        } else { /////////// 추가한 부분
                                            ThisfixedTableRow.append
                                            ('<td class="DataLabel" id = "' + tdId + rC2 + '_' + fixedTableNum + '">' +
                                                '<p id="' + tdId + rC2 + '_p_' + fixedTableNum + '">' + dt[curDataRowInDataBand] + '</p>' +
                                                '</td>');
                                            settingAttribute(fromData, tdId, rC2, fixTableId, fixTableWidth, fixTableHeight);
                                            setTable();
                                            var tdId_javascript = $("#" + tdIDMaking);
                                            if (curDataRowInDataBand < dt.length) {
                                                curDataRowInDataBand++;
                                            }
                                        }
                                        if (typeof showDataLabel === 'undefined') {
                                            showDataLabel = ' ';
                                        }
                                        var table_reform = table_format_check(data.Labels, tdIDwithS, showDataLabel, fromData);
                                        ThisfixedTableRow.append
                                        ('<td class="DataLabel" id = "' + tdId + rC2 + '_' + labelC + '">' +
                                            '<p id="' + tdId + rC2 + '_p_' + labelC + '">' + table_reform + '</p>' +
                                            '</td>');
                                        settingAttribute(fromData, tdId, rC2, fixTableId, fixTableWidth, fixTableHeight);
                                        setTable();
                                        var tdId_javascript = $("#" + tdIDMaking);
                                    }
                                    break;
                                case  "NormalLabel" :
                                    ThisfixedTableRow.append('<td class="NormalLabel" id = "' + tdId + rC2 + '_' + labelC + '">' +
                                        '<p id="' + tdId + rC2 + '_p_' + labelC + '">' + table_format_check(data.Labels, tdIDwithS, fromData.text, fromData) + '</p></td>');
                                    settingAttribute(fromData, tdId, rC2, fixTableId, fixTableWidth, fixTableHeight);
                                    setTable();
                                    var tdId_javascript = $("#" + tdIDMaking);
                                    break;
                                // case "SummaryLabel" :
                                //     var label = new DataLabel(data);
                                //     drawingSummaryLabel(label);
                                //     ThisfixedTableRow.append('<td class="SummaryLabel" id = "' + tdId + rC2 + '_' + fixedTableNum + '">' +
                                //         '<p id="' + tdId + rC2 + '_p_' + fixedTableNum + '">' + table_format_check(data.Labels, tdIDwithS, fromData.text, fromData) + '</p></td>');
                                //     break;
                            }
                        }
                    }
                }
            }
        }
    }

    setRowCount();

    function setTable() {
        if (Array.isArray(fixTableLabelList)) {
            var MathfixTableWidth = Math.round(fixTableWidth);
            fixTableId.css({
                'position': 'absolute',
                'z-index': 999,
                //'width': Math.round(fixTableWidth),//어쩔수없었음 round안하면 테이블 width 소수점 자동으로 없애버림..,
                'width': MathfixTableWidth,//하지연
                'over-flow': 'visible',
                'height': fixTableHeight,
                'left': controlFixedTable.rectangle.x + 'px',
                'top': controlFixedTable.rectangle.y + 'px',
                //'border-collapse': 'collapse',
                //'border':'0.5px solid black',//임시로 이렇게 줘봤음 일단
                'border': '0px',
                'border-spacing': '0px'
            });
            labelC++;
            thNum++;
            fixedTableLabelNum++;
        }
    }

    tableNum++;
    fixedTableNum++;
}
