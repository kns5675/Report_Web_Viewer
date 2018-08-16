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
                        judgementControlList(BandTitle);
                        break;
                    case "BandData" :
                        BandData = Layers[k].Bands.anyType[m];
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

function judgementChildBand() {

}

function judgementControlList(data) {
    console.log(data.ControlList.anyType);
    if (!(data.ControlList.anyType === undefined)) { // ControlList태그 안에 뭔가가 있을 때
        var controlList = data.ControlList.anyType;
        judgementLabel(data.ControlList.anyType);
    } else {
        console.log('none');
    }
}

function judgementLabel(data) {
    var attr = data._attributes["xsi:type"];
    console.log(data);
    if (attr == "ControlDynamicTable") { // 동적 테이블
        var controlDynamicTable = new Table(data);
        tableList.push(controlDynamicTable);

        var tableLabels = data.Labels.TableLabel;
        tableLabels.forEach(function (tableLabels) {
            var tableLabel = new DynamicTableLabel(tableLabels);
            tableLabelList.push(tableLabel);
        });
    } else if (attr == "ControlFixedTable") { // 고정 테이블
        var controlFixedTable = new Table(data);
        tableList.push(controlFixedTable);

        var tableLabels = data.Labels.TableLabel;
        tableLabels.forEach(function (tableLabels) {
            var tableLabel = new FixedTableLabel(tableLabels);
            tableLabelList.push(tableLabel);
        });
    } else if (attr == "ControlLabel") {
        if (!(data.DataType === undefined)) {
            console.log(data.DataType._text);
            switch (data.DataType._text) {
                case "SystemLabel" : // 시스템 라벨
                    var label = new SystemLabel(data);
                    labelList.push(label);
                    break;
                case "DataLabel" : // 데이터 라벨
                    var label = new DataLabel(data);
                    labelList.push(label);
                    break;
                case "SummaryLabel" : // 요약 라벨
                    var label = new SummaryLabel(data);
                    labelList.push(label);
                    break;
                default : // 아마 그냥 라벨
                    var label = new Label(data);
                    labelList.push(label);
                    break;
            }
        } else {
            console.log('Label None');
        }
    }
}