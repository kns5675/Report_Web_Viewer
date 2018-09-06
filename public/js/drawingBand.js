// 작성자 : 전형준
var bandNum = 1;
var footer_height = 0;
var minGroupBandDataHeight = 0;
var remainData = false;
var numofData = 0;
var groupDataRow = 0;

/***********************************************************
 * 기능 : 최소 그룹 데이터 길이
 *  그룹 헤더길이 + 테이블 타이틀 길이 + 테이블 Value 길이
 * 만든이 : 구영준
 * *********************************************************/
function getMinGroupBandDataHeight(band) {
    var bandGroupHeaderHeight = Number(band.childHeaderBands[0].rectangle.height);
    var tableLabel = band.controlList.anyType.Labels.TableLabel;
    var tableTitleHeight = Number(tableLabel[0].Rectangle.Height._text);
    var tableValueHeight = Number(tableLabel[tableLabel.length - 1].Rectangle.Height._text);

    minGroupBandDataHeight = bandGroupHeaderHeight + tableTitleHeight + tableValueHeight;
}

/***********************************************************
 * 기능 : 데이터 밴드 하위의 모든 밴드 길이 합
 * 만든이 : 구영준
 * *********************************************************/
function getFooterHeight(bands) {
    footer_height = 0;
    var bandDataIndex;
    for (var i = 0; i < bands.length; i++) {
        if (bands[i].attributes["xsi:type"] === "BandData") {
            bandDataIndex = i;
        }
        if (i > bandDataIndex){
            console.log(bands[i]);
            footer_height += Number(bands[i].rectangle.height);
        }
    }
}

/***********************************************************
 * 기능 : 데이터 밴드 밑의 풋터 길이를 제외한 여백을 구함
 * 만든이 : 구영준
 * *********************************************************/
function getAvaHeight(div_id, reportHeight) {
    var $divId = '#' + div_id;
    var siblings = $($divId).siblings();
    var curr_height = parseInt($($divId).css('height').substring(0, $($divId).css('height').length - 2));

    for (var i = 0; i < siblings.length; i++) {
        curr_height += parseInt(siblings.eq(i).css('height').substring(0, siblings.eq(i).css('height').length - 2));
    }

    //ToDo -4 지워야함 Maybe 밴드에 픽셀 때문에 화면이 겹쳐서 강제로 해줌
    var avaHegiht = reportHeight - curr_height - footer_height - 4;

    return avaHegiht;
}

/***********************************************************
 기능 : 그룹 헤더/풋터 일 경우 데이터 밴드 길이 계산
 1. 그룹 헤더/풋터 일 경우 그룹 데이터의 길이 만큼의 데이터 길이
 2. th 길이 + td길이 * 데이터 개수
 만든이 : 구영준
 * *********************************************************/
function getNumOfDataWithGroupField(band, avaHeight) {

    var dataCount = groupFieldArray[groupFieldNum].length;
    var labels = band.controlList.anyType.Labels.TableLabel;

    var titleHeight = Number(labels[0].Rectangle.Height._text);
    var valueHeight = Number(labels[labels.length - 1].Rectangle.Height._text);
    var bandGroupFooterHeight = 0;

    band.childFooterBands.forEach(function (child) {
        bandGroupFooterHeight = child.rectangle.height;
    });

    var numofData = Math.floor((avaHeight - titleHeight - footer_height) / valueHeight);
    var groupRemainData = (dataCount - groupDataRow);

    if(numofData > groupRemainData){ // 마지막 페이지
        return dataCount;
    }else{ //마지막 페이지가 아닌 경우
        return numofData;
    }

}

/***********************************************************
 * 임시로 만든 함수.
 * 리포트에 밴드들을 그려줌(ChildBands 들을 그려주기 위해 재귀함수로 사용)
 * 인자 bands : 그려줄 밴드들 // layerName : 어느 Layer에 그려줄 지
 *
 * 수정 : 2018-08-22
 * BandData일 경우 페이지 크기에 맞게 BandData Height 변경
 * from 구영준
 *
 * 수정 : 2018-08-31
 * 그룹 헤더 밴드 구현
 * from 구영준
 * *********************************************************/
function drawBand(bands, layerName, reportHeight, parentBand) {

    var avaHeight = 0;
    var dt = Object.values(dataTable.DataSetName)[0];

    bands.forEach(function (band) { // 밴드 갯수만큼 반복문 돌음
        // 밴드 div를 그려주고 CSS 입힘

        // 페이지 헤더 밴드의 속성 '첫 페이지 출력 생략(PageOutputSkip)' 속성값이 'true'면 출력X
        if (band.attributes["xsi:type"] === "BandPageHeader" && band.pageOutputSkip === "true") {
            return;
        }

        // 타이틀 밴드 - 첫 페이지가 아니면 출력X
        if (band.attributes["xsi:type"] === "BandTitle" && reportPageCnt > 1) {
            return;
        }

        if (band.attributes["xsi:type"] === "BandGroupHeader") {
            if (remainData) {

            } else {
                groupDataRow = 0;
            }
        }

        if (band.childHeaderBands !== null) { // 자식헤더밴드에서 재호출
            drawChildHeaderBand(band.childHeaderBands, layerName, reportHeight, band); // 자식 밴드를 그려주는 함수 호출
        }

        var div_id = 'band' + (bandNum++);
        $('#' + layerName).append("<div id='" + div_id + "' class='Band " + band.attributes["xsi:type"] + "'>" + band.name + "</div>");

        // 수정 18.09.04 YeSol
        if (band.attributes["xsi:type"] === "BandData") {
            if (bands.length > 1) {
                getFooterHeight(bands);
            }
            if (groupFieldArray.length > 0 && band.childHeaderBands !== null) { // band.childHeaderBands !== null 추가
                getMinGroupBandDataHeight(band);
                avaHeight = getAvaHeight(div_id, reportHeight);
                numofData = getNumOfDataWithGroupField(band, avaHeight);
            }else{
                dataBandHeight = getAvaHeight(div_id, reportHeight);
                $('#' + div_id).css({
                    'width': band.rectangle.width,
                    'height': dataBandHeight,
                    'border-bottom': "1px solid red"
                });
            }
        }
        judgementControlList(band, div_id, numofData); // 라벨을 그려줌

        // noinspection FallThroughInSwitchStatementJS
        switch(band.attributes["xsi:type"]) {
            case 'BandData' :
                if (band.childFooterBands) {
                    // console.log("childFooterBands 2 : ",band.childFooterBands[0]);
                    // console.log("childHeaderBands 2 : ",band.childHeaderBands[0]);
                }
                var dataBandHeight = 0;
                if(groupFieldArray.length > 0 && band.childHeaderBands !== null) { // band.childHeaderBands !== null 추가
                    // childHeaderBands중에 BandGroupHeader가 있는 지 판단하기!
                    if (remainData) {
                        dataBandHeight = getBandHeightWithGroupField(band, numofData - groupDataRow);
                    } else {
                        dataBandHeight = getBandHeightWithGroupField(band, numofData);
                    }
                    $('#' + div_id).css({
                        'width': band.rectangle.width,
                        'height': dataBandHeight,
                        'border-bottom': "1px solid red"
                    });
                    if (groupFieldArray[groupFieldNum].length > numofData) {
                        curDatarow += numofData;
                        remainData = true;
                        groupDataRow += numofData;
                    } else {
                        curDatarow += (groupFieldArray[groupFieldNum].length - 1);
                        groupFieldNum++;
                        remainData = false;
                    }
                }
                break;
            case 'BandSubReport' :
                $('#' + div_id).css({
                    'width': band.rectangle.width,
                    'height': band.rectangle.height,
                });
                break;
            case 'BandPageFooter' :
                $('#' + div_id).css({
                    'width': band.rectangle.width,
                    'height': band.rectangle.height,
                    'position': 'absolute',
                    'bottom': 0 + "px",
                    'border-bottom': "1px solid red"
                });
                break;
            case 'BandGroupHeader', 'BandGroupFooter' :
                if(band.invisible === 'true'){
                    $('#' + div_id).css({
                        'width': band.rectangle.width,
                        'height': band.rectangle.height,
                        'border-bottom': "1px solid red",
                        'display' : 'none'
                    });
                }else{
                    $('#' + div_id).css({
                        'width': band.rectangle.width,
                        'height': band.rectangle.height,
                        'border-bottom': "1px solid red"
                    });
                }
                break;
            default :
                $('#' + div_id).css({
                    'width': band.rectangle.width,
                    'height': band.rectangle.height,
                    'border-bottom': "1px solid red"
                });
                break;
        }
        /**************************************************************************************
         * 그룹 풋터 일 경우
         *
         * 페이지 넘기기가 true 면 그룹 풋터 밴드가 그려지고 페이지가 끝
         *                 false면 데이터 밴드가 다시 그려짐
         *
         * 데이터 밴드가 다시 그려질 때,
         * 현재 페이지에서 여유 공간 = 리포트 길이 = 그룹 풋터 밴드 상위의 밴드 길이 - 풋터 밴들 길이
         *
         * 최소 그룹데이터 길이 = 그룹헤더길이 + 동적테이블 title Height  + 동적테이블 value Height 길이
         *
         * 여유 공간이 최소 그룹데이터 길이보다 클 경우
         * 다시 데이터 밴드 그림
         *
         * 만든 사람 : 구영준...
         *
         **************************************************************************************/
        if (band.attributes["xsi:type"] === "BandGroupFooter") {

            if (curDatarow < dt.length) {
                if (band.forceNewPage ==='true') { //페이지 넘기기

                } else {
                    avaHeight = getAvaHeight(div_id, reportHeight);

                    if (avaHeight > minGroupBandDataHeight) {
                        parentBand = (function (arg) {
                            var band = [];
                            band.push(arg);
                            return band;
                        })(parentBand);
                        drawBand(parentBand, layerName, reportHeight);
                    }
                }
            }
        }

        if (band.childFooterBands !== null) { // 자식 풋터 밴드에서 재호출
            drawChildFooterBand(band.childFooterBands, layerName, reportHeight, band); // 자식 밴드를 그려주는 함수 호출
        }
    });
}

/***********************************************************
 기능 : 밴드들의 childHeaderBand를 그린다.
 만든이 : 안예솔
 * *********************************************************/
function drawChildHeaderBand(childBands, layerName, reportHeight, band) {
    var childHeaderBandArray = new Array();
    childBands.forEach(function (childBand) {
        switch (childBand.attributes["xsi:type"]) {
            case 'BandGroupHeader' :
                if (!remainData) {
                    childHeaderBandArray.push(childBand);
                }else{
                    if(band.fixPriorGroupHeader === 'true'){ //그룹 헤더 고정
                        childHeaderBandArray.push(childBand);
                    }
                }
                break;
            case 'BandDataHeader' : // 데이터 헤더 밴드
                if (band.fixTitle == 'true') { // 데이터 헤더 밴드 고정 값이 '예'일 때
                    childHeaderBandArray.push(childBand); // 매 페이지마다 나와야 함
                } else { // 데이터 헤더 밴드 고정 값이 '아니오'일 때
                    if(reportPageCnt == 1) { // 첫 페이지만 나옴
                        childHeaderBandArray.push(childBand);
                    }
                }
                break;
            case 'BandDummyHeader' :
                var isGroupHeader = false;
                childBands.forEach(function(childBand){
                    if(childBand.attributes["xsi:type"] == 'BandGroupHeader') {
                        isGroupHeader = true;
                    }
                });
                if(isGroupHeader){ // 그룹 헤더가 있을 때는 그룹의 맨 처음에 출력
                    if(!remainData) {
                        childHeaderBandArray.push(childBand);
                    }
                } else { // 그룹 헤더가 없을 때는 인쇄물의 첫 페이지에만 출력
                    if(reportPageCnt == 1) {
                        childHeaderBandArray.push(childBand);
                    }
                }
                break;
        }
    });
    drawBand(childHeaderBandArray, layerName, reportHeight, band);
}

///////////////////////// 헤더 해결한 다음에 할래요...
/***********************************************************
 기능 : 밴드들의 childFooterBand를 그린다.
 만든이 : 안예솔
 * *********************************************************/
function drawChildFooterBand(childBands, layerName, reportHeight, band) {
    var childFooterBandArray = new Array();
    var dt = Object.values(dataTable.DataSetName)[0];
    childBands.forEach(function (childBand) {
        switch (childBand.attributes["xsi:type"]) {
            case 'BandGroupFooter' :
                if (!remainData) {
                    childFooterBandArray.push(childBand);
                }else{
                    if(band.fixPriorGroupFooter == 'true'){ //그룻 풋터 고정
                        childFooterBandArray.push(childBand);
                    }
                }
                break;
            case 'BandDataFooter' : // 모든 데이터 출력이 끝난 후에 출력
                if (band.fixTitle == 'true') { // 데이터 헤더 밴드 고정 값이 '예'일 때
                    childFooterBandArray.push(childBand); // 매 페이지마다 나와야 함
                } else { // 데이터 헤더 밴드 고정 값이 '아니오'일 때
                    if(curDatarow > dt.length) { // 데이터 출력이 끝났을 때 나옴
                        childFooterBandArray.push(childBand);
                    }
                }
                break;
            case 'BandDummyFooter' :
                var isGroupHeader = false;
                childBands.forEach(function(childBand){
                    if(childBand.attributes["xsi:type"] == 'BandGroupHeader') {
                        isGroupHeader = true;
                    }
                });
                if(isGroupHeader){ // 그룹 헤더가 있을 때는 그룹의 맨 마지막에 출력
                    if(!remainData) { // 출력할 그룹의 데이터가 남아있지 않을 때
                        childFooterBandArray.push(childBand);
                    }
                } else { // 그룹 헤더가 없을 때는 인쇄물의 마지막 페이지에만 출력

                }
                break;
        }
    });

    drawBand(childFooterBandArray, layerName, reportHeight, band);
}