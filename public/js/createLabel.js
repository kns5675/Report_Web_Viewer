document.write("<script type='text/javascript' src='/js/label.js' ><" + "/script>");
document.write("<script type='text/javascript' src='/js/figure.js' ><" + "/script>");
document.write("<script type='text/javascript' src='/js/additionalControl.js' ><" + "/script>");

var labelList = [];
var tableLabelList = [];
var tableList = [];
var fixTableList = [];
var systemLabelNum = 1;
var summaryLabelNum = 1;
var dataLabelNum = 1;
var normalLabelNum = 1;
var expressionNum = 1;
var groupLabelNum = 1;
var parameterLabelNum = 1;
var tableValueLabelNum = 1;
var groupFieldNum = 0; // 그룹으로 묶었을 경우 BandGroupHeader에서 DataLabel을 사용했을 때 몇 번째 그룹이 출력중인지 알 수 있는 변수
var groupFieldNumInRegion = 0;
var tableNum = 1;
var dynamicTableNum = 1;
var dynamicTableAnnexedPaperOutPut = 0;
var annexPaperOutputNum = 0;
var fixedTableNum = 1; // 지연추가
var dynamicTitleLabelNum = 1;
var thNum = 1;
var dynamicValueLabelNum = 1;
var fixedTableLabelNum = 1; //지연추가
var groupFieldArray = [];
var regionNum = 1;
var fixTableRowCount = 0;
var labelC = 0;
var rC2 = 1;
var verticalPNum = 0;
var groupFieldArrayInRegion = [];

var saving_data;

/******************************************************************
 기능 : ControlList의 유무를 판단하는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function judgementControlList(band, divId, numOfData, dt) {
    if (band.groupFieldArray !== undefined) {
        groupFieldArray = band.groupFieldArray;
    }
    if (!(band.controlList.anyType === undefined)) { // ControlList 태그 안에 뭔가가 있을 때
        var controlList = band.controlList.anyType;
        if (Array.isArray(controlList)) {
            controlList.forEach(function (list) {
                judgementLabel(list, divId, numOfData, band, dt);
            });
        } else {
            judgementLabel(controlList, divId, numOfData, band, dt);
        }
    } else {
    }
}

/******************************************************************
 기능 : 어떤 Label인지를 판단하여 객체를 생성해주는 함수를 만든다.
 만든이 : 안예솔

 수정 : 하지연
 날짜 : 2018-09-18
 수정 내용 : 고정테이블 부분 추가 및 수정
 ******************************************************************/
function judgementLabel(data, divId, numOfData, band, dt) {
    var attr = data._attributes["xsi:type"];
    var band_name = band.attributes["xsi:type"];
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
        drawingDynamicTable(controlDynamicTable, tableLabelList, divId, numOfData, band, dt);
    } else if (attr == "ControlFixedTable") { // 고정 테이블일때
        /*
        ToDo : 하나의 페이지에 고정테이블이 2개 이상 있을 경우 fixTableLabelList에 겹침
         */
        var controlFixedTable = new Table(data);
        // tableList.push(controlFixedTable);
        fixTableList.push(controlFixedTable);
        var fixTableLabels = data.Labels.TableLabel;
        var fixTableLabelList = [];

        if (fixTableLabels) {
            fixTableLabels.forEach(function (label, i) {
                var fixtableLabel = new FixedTableLabel(label, i);

                if (fixTableLabelList.length < fixTableLabels.length) { // 수정 : 하지연
                    fixTableLabelList.push(fixtableLabel);
                }
            });
        }
        if (isRegion) {
            drawingFixedTableInRegion(data, controlFixedTable, fixTableLabelList, divId, numOfData, fixTableList, band);//numOfData추가. // YeSol > band 추가
        } else {
            drawingFixedTable(data, controlFixedTable, fixTableLabelList, divId, numOfData, fixTableList, band);//numOfData추가. // YeSol > band 추가
        }

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
            drawingNormalLabel(label, divId, band_name);
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
    } else if (attr == 'ControlRadioButton') { // 라디오 버튼
        var additionalControl = new ControlRadioButton(data);
        drawingRadioButton(additionalControl, divId);
    } else if (attr == 'ControlCheckBoxButton') { // 체크 박스
        var additionalControl = new ControlCheckBoxButton(data);
        drawingCheckBox(additionalControl, divId);
    } else if (attr == 'ControlRegion') { // 리전
        var regionControl = new ControlRegion(data);
        drawingRegion(regionControl, divId);
    }
}

/******************************************************************
 기능 : 리전을 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingRegion(data, divId) {
    var div = $('#' + divId);

    div.css('position', 'relative');

    div.append('<div id = "region' + regionNum + '"></div>');

    var regionDiv = $('#region' + regionNum);

    regionDiv.css({
        'left': data.rectangle.x + 'px',
        'top': data.rectangle.y + 'px',
        'width': data.rectangle.width + 'px',
        'height': data.rectangle.height + 'px',
        'position': 'absolute',
        'background-color': 'rgba(255, 0, 0, 0)',
        'border': '1px solid black',
        'z-index': 0
    });

    var regionName = 'region' + regionNum;
    var regionHeight = data.rectangle.height;

    var bands = data.layer.bands;

    var dataBands = [];
    bands.forEach(function (band) {
        if (band.attributes['xsi:type'] == 'BandData') {
            dataBands.push(band);
        }
    });

    dataBands.forEach(function (dataBand) {
        isRegion = true;
        var dt;
        var groupFieldNameInRegion;
        groupFieldArrayInRegion = [];
        if (!remainData && !remainDataInRegion) {
            remainDataInRegion = true; // 추가 181010
            groupFieldNumInRegion = 0; // 추가 181010
        }
        var childHeaderBands = dataBand.childHeaderBands;
        var sort;
        var i = 0;
        if (Array.isArray(childHeaderBands)) {
            childHeaderBands.forEach(function (childHeaderBand) {
                if (childHeaderBand.attributes["xsi:type"] == 'BandGroupHeader') {
                    dt = dataTable.DataSetName[dataBand.dataTableName];
                    groupFieldNameInRegion = childHeaderBand.groupFieldName;
                    sort = childHeaderBand.groupingFieldSort;
                }
            });
        } else if (!Array.isArray(childHeaderBands) && childHeaderBands != null) {
            if (childHeaderBands.attributes["xsi:type"] == 'BandGroupHeader') {
                dt = dataTable.DataSetName[dataBand.dataTableName];
                groupFieldNameInRegion = childHeaderBands.groupFiledName;
                sort = childHeaderBands.groupingFieldSort;
            }
        }
        if (dt != undefined && groupFieldNameInRegion != undefined) {
            if (dt.length > 1) {
                dt.forEach(function (data) {
                    var comparison = groupFieldArrayInRegion.some(function (arr) {
                        if (arr[0] == data[groupFieldNameInRegion]._text) {
                            arr.push(data);
                            return true; // 배열 중 같은 이름이 있으면 break;
                        } else {
                            return false; // continue;
                        }
                    });
                    if (!comparison) {
                        if (data[groupFieldNameInRegion]) { //학준 추가 groupFieldName이 없을 경우 제외.
                            groupFieldArrayInRegion[i] = [];
                            groupFieldArrayInRegion[i].push(data[groupFieldNameInRegion]._text);
                            groupFieldArrayInRegion[i].push(data);
                            i++;
                        }
                    }
                });
            } else {
                if (dt[groupFieldNameInRegion]) { //학준 추가 groupFieldName이 없을 경우 제외.
                    groupFieldArrayInRegion[0] = [];
                    groupFieldArrayInRegion[0].push(dt[groupFieldNameInRegion]._text);
                    groupFieldArrayInRegion[0].push(dt);
                }
            }

            if (sort == 'ASC') { // 기준 필드 정렬 순서가 오름차순일 때!
                groupFieldArrayInRegion.sort();
            }
            if (sort == 'DESC') { // 기준 필드 정렬 순서가 내림차순일 때!
                groupFieldArrayInRegion.sort(descSorting);
                function descSorting(a, b) {
                    if (a > b) return -1;
                    if (b > a) return 1;
                    return 0;
                }
            }
        }
        drawBand(bands, regionName, regionHeight, undefined);
        isRegion = false;
    });
    regionNum++
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
function drawingSystemLabel(data, divId, band_name) {
    var labelNbandInfo = {
        data: data,
        divId: divId,
        band_name: band_name !== undefined ? band_name : undefined,
        div: $('#' + divId),
        labelId: $('#' + data.dataType + systemLabelNum++),
        label_scope: "NormalLabel_scope " + data.name,
        labelNum: systemLabelNum,
        label_type: data.dataType
    };
    labelPropertyApply(labelNbandInfo);
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

 수정 : DataTableName 추가
 Date : 2018-09-18
 From Mr.Koo
 ******************************************************************/
function drawingSummaryLabel(data, divId, band_name) {
    var labelNbandInfo = {
        data: data,
        divId: divId,
        band_name: band_name !== undefined ? band_name : undefined,
        div: $('#' + divId),
        labelId: $('#' + data.dataType + summaryLabelNum++),
        label_scope: "NormalLabel_scope",
        labelNum: summaryLabelNum,
        label_type: data.dataType,
        dataTableName: data.dataTableName
    };
    labelPropertyApply(labelNbandInfo);
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

 수정 : DataTableName 추가
 Date : 2018-09-18
 From Mr.Koo
 ******************************************************************/
function drawingDataLabel(data, divId, band_name) {
    var labelNbandInfo = {
        data: data,
        divId: divId,
        band_name: band_name !== undefined ? band_name : undefined,
        div: $('#' + divId),
        labelId: $('#' + data.dataType + dataLabelNum++),
        label_scope: "NormalLabel_scope",
        labelNum: dataLabelNum,
        label_type: data.dataType,
        dataTableName: data.dataTableName
    };
    labelPropertyApply(labelNbandInfo);
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
function drawingNormalLabel(data, divId, band_name) {
    var labelNbandInfo = {
        data: data,
        divId: divId,
        band_name: band_name !== undefined ? band_name : undefined,
        div: $('#' + divId),
        labelId: $('#' + data.dataType + normalLabelNum++),
        label_scope: "NormalLabel_scope",
        labelNum: normalLabelNum,
        label_type: data.dataType
    };
    labelPropertyApply(labelNbandInfo);
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
function drawingExpression(data, divId, band_name) {
    var labelNbandInfo = {
        data: data,
        divId: divId,
        band_name: band_name !== undefined ? band_name : undefined,
        div: $('#' + divId),
        labelId: $('#' + data.dataType + expressionNum++),
        label_scope: "NormalLabel_scope",
        labelNum: expressionNum,
        label_type: data.dataType
    };
    labelPropertyApply(labelNbandInfo);
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
function drawingGroupLabel(data, divId, band_name) {
    var labelNbandInfo = {
        data: data,
        divId: divId,
        band_name: band_name !== undefined ? band_name : undefined,
        div: $('#' + divId),
        labelId: $('#' + data.dataType + groupLabelNum++),
        label_scope: "NormalLabel_scope",
        labelNum: groupLabelNum,
        label_type: data.dataType
    };
    labelPropertyApply(labelNbandInfo);
}

/******************************************************************
 기능 : ParameterLabel(파라미터 라벨)을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔

 수정 : ParameterLabel의 크기 조정, 위치 이동, 내용 수정 추가.
 Date : 2018-08-27
 From hagdung-i
 ******************************************************************/
function drawingParameterLabel(data, divId, band_name) {
    var labelNbandInfo = {
        data: data,
        divId: divId,
        band_name: band_name !== undefined ? band_name : undefined,
        div: $('#' + divId),
        labelId: $('#ParameterLabel' + parameterLabelNum++),
        label_scope: "NormalLabel_scope",
        labelNum: parameterLabelNum,
        label_type: data.dataType
    };
    labelPropertyApply(labelNbandInfo);
}



/******************************************************************
 기능 : 라벨들이 다시 그려질 때 다시 이벤트를 부여하는 함수
 Date : 2018-09-27
 만든이 : hyeongdyun-i
 ******************************************************************/
function resize_event_reSetting() {
    after_Lock_check();
    // after_Lock_Check_Table();
    // after_table_column_controller();
}

/******************************************************************
 기능 : 라벨의 p태그 생성 및 각 가벨의 특성에 맞춰 커스텀하는 로직을 따로 추출.
 사유 : 이미지 같이 p태그가 들어가지 않는 라벨 작업을 위함.
 Date : 2018-09-12
 만든이 : hagdung-i
 ******************************************************************/
function label_text_Setting(labelNbandInfo) {
    labelNbandInfo.labelId.append('<p id = "P' + labelNbandInfo.label_type + labelNbandInfo.labelNum + '"></p>');
    Lock_check(labelNbandInfo.data, labelNbandInfo.labelId, labelNbandInfo.div);

    var pId = $('#P' + labelNbandInfo.label_type + labelNbandInfo.labelNum);
    pId[0].real_id = labelNbandInfo.data.id;

    if (labelNbandInfo.label_type === "SystemLabel") {
        var date = new Date();
        switch (labelNbandInfo.data.systemFieldName) {
            case 'Date' :
                var year = date.getFullYear();
                var month = plusZero(date.getMonth() + 1); // month는 0부터 시작
                var day = plusZero(date.getDate());
                labelNbandInfo.data.text = year + '-' + month + '-' + day;
                pId.addClass("date");
                break;
            case 'Date/time' :
                var year = date.getFullYear();
                var month = plusZero(date.getMonth() + 1); // month는 0부터 시작
                var day = plusZero(date.getDate());
                var hour = plusZero(date.getHours());
                var min = plusZero(date.getMinutes());
                var sec = plusZero(date.getSeconds());
                labelNbandInfo.data.text = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
                pId.addClass("dateTime");
                break;
            case 'Time' :
                var hour = plusZero(date.getHours());
                var min = plusZero(date.getMinutes());
                var sec = plusZero(date.getSeconds());
                labelNbandInfo.data.text = hour + ':' + min + ':' + sec;
                pId.addClass("time");
                break;
            case 'PageNumber' : // 현재 페이지 번호
                pId.addClass("pageNumber");
                labelNbandInfo.data.text = "tempStr";
                break;
            case 'TotalPage' : // 전체 페이지 번호
                pId.addClass("totalPage");
                labelNbandInfo.data.text = "tempStr";
                break;
            case 'PageNumber / TotalPage' :  // 현재 페이지 번호 / 전체 페이지 정보
                pId.addClass("pageNumberTotalPage");
                labelNbandInfo.data.text = "tempStr";
                break;
        }
    }

    // 요약라벨
    if (labelNbandInfo.label_type === "SummaryLabel") {
        var dt = dataTable.DataSetName[labelNbandInfo.dataTableName];
        var key_arr = Object.keys(dt[0]);

        var key = null;
        key_arr.forEach(function (obj) { // key 값 설정
            if (labelNbandInfo.data.fieldName == obj) {
                key = obj;
                return;
            }
        });

        switch (labelNbandInfo.data.summaryType) {
            case 'Sum' :    // 합계
                var summary_label_sum = 0;

                if (groupFieldArray.length !== 0) { // 그룹 기준 필드가 있을 때
                    for (var i = 0; i < groupFieldArray[groupFieldNum].length - 1; i++) {
                        summary_label_sum += Number(groupFieldArray[groupFieldNum][i + 1][key]._text);
                    }
                } else {
                    for (var i = 0; i < dt.length; i++) {
                        summary_label_sum += Number(dt[i][key]._text);
                    }
                }

                labelNbandInfo.data.text = summary_label_sum;
                if (isNaN(Number(labelNbandInfo.data.text))) {
                    labelNbandInfo.data.text = "오류!";
                    pId.attr('title', '값이 숫자가 아닙니다');
                }
                break;
            case 'Avg' :    // 평균
                var summary_label_sum = 0;
                var summary_label_avg = 0;

                if (groupFieldArray.length !== 0) { // 그룹 기준 필드가 있을 때
                    for (var i = 0; i < groupFieldArray[groupFieldNum].length - 1; i++) {
                        summary_label_sum += Number(groupFieldArray[groupFieldNum][i + 1][key]._text);
                    }
                    summary_label_avg = summary_label_sum / (groupFieldArray[groupFieldNum].length - 1);
                } else {
                    for (var i = 0; i < dt.length; i++) {
                        summary_label_sum += Number(dt[i][key]._text);
                    }
                    summary_label_avg = summary_label_sum / dt.length;
                }
                labelNbandInfo.data.text = summary_label_avg;
                if (isNaN(Number(labelNbandInfo.data.text))) {
                    labelNbandInfo.data.text = "오류!";
                    pId.attr('title', '값이 숫자가 아닙니다');
                }
                break;
            case 'Max' :    // 최대값
                var temp_arr = [];
                if (groupFieldArray.length !== 0) { // 그룹 기준 필드가 있을 때
                    for (var i = 0; i < groupFieldArray[groupFieldNum].length - 1; i++) {
                        temp_arr.push(Number(groupFieldArray[groupFieldNum][i + 1][key]._text));
                    }
                    var summary_label_max = temp_arr.reduce(function (previous, current) {
                        return previous > current ? previous : current;
                    });
                } else {
                    for (var i = 0; i < dt.length; i++) {
                        temp_arr.push(Number(dt[i][key]));
                    }
                    var summary_label_max = temp_arr.reduce(function (previous, current) {
                        return previous > current ? previous : current;
                    });
                }
                if (isNaN(Number(labelNbandInfo.data.text))) {
                    labelNbandInfo.data.text = "오류!";
                    pId.attr('title', '값이 숫자가 아닙니다');
                }
                labelNbandInfo.data.text = summary_label_max;
                break;
            case 'Min' :    // 최소값
                var temp_arr = [];
                if (groupFieldArray.length !== 0) { // 그룹 기준 필드가 있을 때
                    for (var i = 0; i < groupFieldArray[groupFieldNum].length - 1; i++) {
                        temp_arr.push(Number(groupFieldArray[groupFieldNum][i + 1][key]._text));
                    }
                    var summary_label_min = temp_arr.reduce(function (previous, current) {
                        return previous > current ? current : previous;
                    });
                } else {
                    for (var i = 0; i < dt.length; i++) {
                        temp_arr.push(Number(dt[i][key]));
                    }
                    var summary_label_min = temp_arr.reduce(function (previous, current) {
                        return previous > current ? current : previous;
                    });
                }
                labelNbandInfo.data.text = summary_label_min;
                if (isNaN(Number(labelNbandInfo.data.text))) {
                    labelNbandInfo.data.text = "오류!";
                    pId.attr('title', '값이 숫자가 아닙니다');
                }
                break;
            case 'Cnt' :    // 개수
                var summary_label_cnt = 0;
                if (groupFieldArray.length !== 0) { // 그룹 기준 필드가 있을 때
                    summary_label_cnt = groupFieldArray[groupFieldNum].length - 1;
                } else {
                    summary_label_cnt = dt.length;
                }

                labelNbandInfo.data.text = summary_label_cnt;
                if (isNaN(Number(labelNbandInfo.data.text))) {
                    labelNbandInfo.data.text = "오류!";
                    pId.attr('title', '값이 숫자가 아닙니다');
                }
                break;
            default :   // None
                labelNbandInfo.data.text = '';
                break;
        }
    }

    // fontSize의 단위를 통일하기위해
    var fontSizePt = changeFontUnit(labelNbandInfo.data.fontSize);
    pId.css({
        'font-size': fontSizePt,
        'font-family': labelNbandInfo.data.fontFamily,
        'font-weight': labelNbandInfo.data.fontWeight,
        'font-style': labelNbandInfo.data.fontStyle,
        'margin-top': '10px',
        'margin-bottom': '10px',
        'margin-right': '10px',
        'margin-left': '10px'
    });

    if (labelNbandInfo.label_type === "ParameterLabel") {
        paramTable.NewDataSet.Table1.forEach(function (paramData) {
            if (labelNbandInfo.data.parameterName == paramData.Key._text) {
                var paramdata_text = table_format_check(null, null, paramData.Value._text, labelNbandInfo.data);
                labelNbandInfo.data.text = paramdata_text;
            }
        });
    }
    if (labelNbandInfo.label_type === "DataLabel") {
        var dt = dataTable.DataSetName[labelNbandInfo.dataTableName];
        if (dt != undefined) {
            if (groupFieldArray !== undefined) {

                //예시가 없음 추후 수정 필요 할 수 있음.
                for(key in groupFieldArray[groupFieldNum][1]) {
                    if (key === labelNbandInfo.data.fieldName) {
                        pId.append(groupFieldArray[groupFieldNum][1][key]._text);
                        var DataLabel_text = table_format_check(null, null, groupFieldArray[groupFieldNum][1][key]._text, labelNbandInfo.data);
                    }
                }
                // labelNbandInfo.data.text = pId.text();
                pId[0].text = DataLabel_text;

                labelNbandInfo.data.text = DataLabel_text;
            }
        }
    }

    // 0값 표시 여부가 NoShow(표시하지 않음) 이고 문자 형식이 숫자 일 때
    if (labelNbandInfo.data.showZeroState == 'NoShow' && labelNbandInfo.data.labelTextType == 'Number') {
        labelNbandInfo.data.text = (labelNbandInfo.data.text).replace(/(^0+)/, '');
    }

    if (labelNbandInfo.data.text !== undefined) {
        pId.text('');
        if (labelNbandInfo.data.textDirection == 'Vertical') {
            textAlignVertical(labelNbandInfo.data.text, "P" + labelNbandInfo.label_type + labelNbandInfo.labelNum);
        } else if (labelNbandInfo.data.textDirection == 'Horizontal') {
            toStringFn(labelNbandInfo.data.text, "P" + labelNbandInfo.label_type + labelNbandInfo.labelNum);
        }
    }

    // 자간 속성
    if (labelNbandInfo.data.characterSpacing !== undefined) {
        characterSpacing(labelNbandInfo.data.text, labelNbandInfo.data.characterSpacing,
            "P" + labelNbandInfo.label_type + labelNbandInfo.labelNum);
    }

    // 줄 간격 속성
    if (labelNbandInfo.data.lineSpacing !== undefined) {
        lineSpacing(labelNbandInfo.data.text,
            labelNbandInfo.data.lineSpacing, "P" + labelNbandInfo.label_type + labelNbandInfo.labelNum);
    }
    var test = $('#' + "P" + labelNbandInfo.label_type + labelNbandInfo.labelNum + ' br');
    // Clipping 속성
    if (labelNbandInfo.data.clipping == 'true') {
        labelNbandInfo.labelId.css({
            'text-overflow': 'clip',
            'overflow': 'hidden'
        });
        clipping(labelNbandInfo.data.text, labelNbandInfo.label_type + labelNbandInfo.labelNum,
            'P' + labelNbandInfo.label_type + labelNbandInfo.labelNum);
    }

    if (labelNbandInfo.data.autosize == true) { // 자동 높이 조절
        autoSizeTrue('P' + labelNbandInfo.label_type + labelNbandInfo.labelNum);
    } else {
        if (labelNbandInfo.data.text !== undefined) {
            switch (labelNbandInfo.data.horizontalTextAlignment) {
                case 'Center' :
                    textAlignCenter(labelNbandInfo.data.text, "P" + labelNbandInfo.label_type + labelNbandInfo.labelNum,
                        labelNbandInfo.data.wordWrap, labelNbandInfo.data.textDirection);
                    break;
                case 'Left' :
                    pId.css('text-align', 'left');
                    break;
                case 'Right' :
                    pId.css('text-align', 'right');
                    break;
                case 'Distributed' :
                    pId.text('');
                    textEqualDivision(labelNbandInfo.data.text, "P" + labelNbandInfo.label_type + labelNbandInfo.labelNum); // 텍스트 수평 정렬이 균등 분할인 경우
                    break;
            }
            switch (labelNbandInfo.data.verticalTextAlignment) {
                case 'Center' :
                    verticalCenter("P" + labelNbandInfo.label_type + labelNbandInfo.labelNum); // 텍스트 수직 정렬이 중간인 경우
                    break;
                case 'Top' :
                    verticalTop("P" + labelNbandInfo.label_type + labelNbandInfo.labelNum); // 텍스트 수직 정렬이 위쪽인 경우
                    break;
                case 'Bottom' :
                    verticalBottom("P" + labelNbandInfo.label_type + labelNbandInfo.labelNum); // 텍스트 수직 정렬이 아래쪽인 경우
                    break;
                case 'Distributed' :
                    verticalCenterEqualDivision(labelNbandInfo.data.text, "P" + labelNbandInfo.label_type
                        + labelNbandInfo.labelNum, labelNbandInfo.data.textDirection); // 텍스트 수직 정렬이 균등 분할인 경우
                    break;
            }
        }
    }
    // 폰트크기 자동 줄어듦
    if (labelNbandInfo.data.autoFontType == 'AutoSmall') {
        fontSizeAutoSmall(labelNbandInfo.data.text, "P" + labelNbandInfo.label_type + labelNbandInfo.labelNum);
    }

    // 기본 여백 미사용
    if (labelNbandInfo.data.isUseBasicInnerMargin == 'false') {
        pId.css({
            'margin-left': labelNbandInfo.data.interMargin.left + 'px',
            'margin-right': labelNbandInfo.data.interMargin.right + 'px',
            'margin-top': labelNbandInfo.data.interMargin.top + 'px',
            'margin-bottom': labelNbandInfo.data.interMargin.bottom + 'px',
        });
    }

    // 중간 줄 그리기
    if (labelNbandInfo.data.isDrawStrikeOutLine == 'true') {
        pId.css('text-decoration', 'line-through');
    }

    // 밑줄 그리기
    if (labelNbandInfo.data.isDrawUnderLine == 'true') {
        pId.css('text-decoration', 'underline');
    }

    // 중간 줄과 밑줄 모두 그릴 때
    if (labelNbandInfo.data.isDrawStrikeOutLine == 'true' && labelNbandInfo.data.isDrawUnderLine == 'true') {
        pId.css('text-decoration', 'line-through underline');
    }

    // 글자 크기 동일하게 하기
    if (labelNbandInfo.data.isSameWidth == 'true') {
        var fontSize = (pId.css('font-size')).split('p');
        pId.css('word-spacing', (fontSize[0] - 1.181) + 'px');
    }
    // drd_javascript(labelNbandInfo.data, labelNbandInfo.labelId, labelNbandInfo.data.startBindScript);
    pId.addClass('Label');
    pId.addClass(labelNbandInfo.label_type);
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
                if (space == null) {
                    max = temp[i].length;
                } else {
                    max = temp[i].length - space.length;
                }
            }
        }
    }
    if (space == null) {
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

/******************************************************************
 기능 : Label의 visible, border, 라벨 형태, 그라데이션, 자동 줄바꿈 속성과
        바코드, QR코드를 구현한다.
 만든이 : 전형준, 안예솔
 ******************************************************************/
function labelPropertyApply(labelNbandInfo) {
    labelNbandInfo.div = $('#' + labelNbandInfo.divId);
    labelNbandInfo.div.css('position', 'relative');
    labelNbandInfo.div.append('<div id = "' + labelNbandInfo.label_type + labelNbandInfo.labelNum + '"></div>');
    labelNbandInfo.labelId = $('#' + labelNbandInfo.label_type + labelNbandInfo.labelNum);
    labelNbandInfo.labelId.addClass(labelNbandInfo.label_scope);
    Lock_check(labelNbandInfo.data, labelNbandInfo.labelId, labelNbandInfo.div);

    // visible 속성
    if (labelNbandInfo.data.visible == 'false') {
        labelNbandInfo.labelId.css('display', 'none');
    }
    // border 속성 관련
    if (labelNbandInfo.data.noBorder == 'true') {
        labelNbandInfo.labelId.css('border', 'none');
    } else {
        if (labelNbandInfo.data.borderThickness !== undefined) {
            var leftBorder = borderDottedLine(labelNbandInfo.data.borderDottedLines.leftDashStyle);
            var rightBorder = borderDottedLine(labelNbandInfo.data.borderDottedLines.rightDashStyle);
            var bottomBorder = borderDottedLine(labelNbandInfo.data.borderDottedLines.bottomDashStyle);
            var topBorder = borderDottedLine(labelNbandInfo.data.borderDottedLines.topDashStyle);
            labelNbandInfo.labelId.css({
                'border-left': labelNbandInfo.data.borderThickness.left + 'px ' + leftBorder + ' ' + labelNbandInfo.data.leftBorderColor,
                'border-right': labelNbandInfo.data.borderThickness.right + 'px ' + rightBorder + ' ' + labelNbandInfo.data.rightBorderColor,
                'border-bottom': labelNbandInfo.data.borderThickness.bottom + 'px ' + bottomBorder + ' ' + labelNbandInfo.data.bottomBorderColor,
                'border-top': labelNbandInfo.data.borderThickness.top + 'px ' + topBorder + ' ' + labelNbandInfo.data.topBorderColor,
                'zIndex' : 0,
                'pointer-events' : 'auto'
            });
        } else {
            labelNbandInfo.labelId.css({
                'border': '1px solid black',
                'zIndex': 0
            });
        }
    }
    var z_index = z_index_setting(labelNbandInfo.band_name);

    labelNbandInfo.labelId.css({
        'width': labelNbandInfo.data.rectangle.width,
        'height': labelNbandInfo.data.rectangle.height,
        'box-sizing' : 'border-box',
        'position': 'absolute',
        'left': labelNbandInfo.data.rectangle.x + 'px',
        'top': labelNbandInfo.data.rectangle.y + 'px',
        'zIndex': z_index,
        'white-space': 'nowrap', // 줄바꿈 안되게하는거
        'background-color': labelNbandInfo.data.backGroundColor, // 배경색
        'color': labelNbandInfo.data.textColor // 글자 색
    });

    // 바코드
    if (labelNbandInfo.data.drawingType !== undefined && labelNbandInfo.data.drawingType === "Barcode") {
        var barcode_text = labelNbandInfo.data.text === undefined ? 'ERROR' : labelNbandInfo.data.text;
        var barcode_type = labelNbandInfo.data.barcodeType === undefined ? 'code39' : labelNbandInfo.data.barcodeType.toLowerCase();
        labelNbandInfo.labelId.barcode(barcode_text, barcode_type);
        labelNbandInfo.labelId.css('overflow', 'visible');

        // 바코드의 높이를 조금 줄여줌
        labelNbandInfo.labelId.children('div:not(:last-child)').css('height',
            Number(labelNbandInfo.labelId.children('div:not(:last-child)').css('height').substring(0,
                labelNbandInfo.labelId.children('div:not(:last-child)').css('height').length - 2)) * 0.8 + 'px'
        );

        var changeRatio = Number(labelNbandInfo.data.rectangle.width)
            / Number(labelNbandInfo.labelId.css('width').substring(0, labelNbandInfo.labelId.css('width').length - 2));

        for (var i = 0; i < labelNbandInfo.labelId.children('div:not(:last-child)').length; i++) {
            if (labelNbandInfo.labelId.children('div:not(:last-child)').eq(i).css('width') !== "0px") {
                labelNbandInfo.labelId.children('div:not(:last-child)').eq(i).css(
                    'width',
                    labelNbandInfo.labelId.children('div:not(:last-child)').eq(i).css('width').substring(
                        0, labelNbandInfo.labelId.children('div:not(:last-child)').eq(i).css('width').length - 2
                    ) * changeRatio + 'px');
            } else {
                labelNbandInfo.labelId.children('div:not(:last-child)').eq(i).css(
                    'border-left-width',
                    labelNbandInfo.labelId.children('div:not(:last-child)').eq(i).css('border-left-width').substring(
                        0, labelNbandInfo.labelId.children('div:not(:last-child)').eq(i).css('border-left-width').length - 2
                    ) * changeRatio + 'px');
            }
        }

        labelNbandInfo.labelId.css('width', labelNbandInfo.data.rectangle.width + 'px');

        // labelNbandInfo.labelId.children('div:not(:last-child)').css(' ')

        // 바코드 폰트 크기를 조금 키워줌
        labelNbandInfo.labelId.children('div:last-child').css({
            'font-size': '15px',
            'font-weight': 'bold',
            'line-height': '15px',
            'pointer-events': 'auto'
        });

        // 바코드를 감싸는 div의 크기를 글씨 div의 높이 +  바코드 div의 높이로 설정
        labelNbandInfo.labelId.css('height',
            Number(labelNbandInfo.labelId.children('div:first-child').css('height')
                .substring(0, labelNbandInfo.labelId.children('div:first-child').css('height').length - 2))
            + Number(labelNbandInfo.labelId.children('div:last-child').css('height')
                .substring(0, labelNbandInfo.labelId.children('div:last-child').css('height').length - 2)) + 'px'
        );
        return;
    }

    // QR코드
    if (labelNbandInfo.data.drawingType !== undefined && labelNbandInfo.data.drawingType === "QrBarcode") {
        var qrcode_text = labelNbandInfo.data.text === undefined ? '??? ??' : labelNbandInfo.data.text;
        labelNbandInfo.labelId.qrcode({
            render: "canvas",
            width: labelNbandInfo.data.rectangle.width,
            height: labelNbandInfo.data.rectangle.height,
            text: qrcode_text
        });
        labelNbandInfo.labelId.find('canvas').css({
            'width': '100%',
            'height': '100%',
            'pointer-events': 'auto'
        });
        return;
    }


    // 라벨 형태 -> 원
    if (labelNbandInfo.data.labelShape == 'Circle') {
        labelNbandInfo.labelId.css({
            'border-radius': '100%', // LabelShape가 원일 때
            'border': labelNbandInfo.data.circleLineThickness + 'px solid '
                + labelNbandInfo.data.circleLineColor // (원 테두리 두께) 속성이 뭔지 모르겠땀
        });
    }

    // 그라데이션을 사용할 때
    if (labelNbandInfo.data.gradientLB !== undefined && labelNbandInfo.data.gradientLB.isUseGradient == 'true') {
        gradientCase(labelNbandInfo.data.gradientLB.startGradientDirection,
            labelNbandInfo.data.gradientLB.gradientDirection,
            labelNbandInfo.data.gradientLB.gradientColor,
            labelNbandInfo.data.backGroundColor, labelNbandInfo.label_type + labelNbandInfo.labelNum);
    }

    // 자동 줄바꾸기
    if (labelNbandInfo.data.wordWrap == 'true') {
        labelNbandInfo.labelId.css('white-space', 'normal');
    }
    if (labelNbandInfo.data.drawingType === "Image") {
        image_label_making(labelNbandInfo);
    } else {
        label_text_Setting(labelNbandInfo);
    }
}
