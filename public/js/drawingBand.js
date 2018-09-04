// 작성자 : 전형준
var bandNum = 1;
var footer_height = 0;
var minGroupBandDataHeight = 0;
var remainData = false;
var numofData = 0;
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
    for (var i = 0; i < bands.length; i++) {
        var bandDataIndex = 0;
        if (bands[i].attributes["xsi:type"] === "BandData") {
            bandDataIndex = i;
        }
        if (i > bandDataIndex)
            footer_height += Number(bands[i].rectangle.height);
    }
}
/***********************************************************
 * 기능 : 데이터 밴드 밑의 풋터 길이를 제외한 여백을 구함
 * 만든이 : 구영준
 * *********************************************************/
function getAvaHeight(div_id, reportHeight) {
    var siblings = $('#' + div_id).siblings();
    var curr_height = parseInt($('#' + div_id).css('height').substring(0, $('#' + div_id).css('height').length - 2));

    for (var i = 0; i < siblings.length; i++) {
        curr_height += parseInt(siblings.eq(i).css('height').substring(0, siblings.eq(i).css('height').length - 2));
    }
    //ToDo -4 지워야함 Maybe 밴드에 픽셀 때문에 화면이 겹쳐서 강제로 해줌
    avaHegiht = reportHeight - curr_height - footer_height - 4;

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
    var bandGroupFooterHeight = 0

    band.childFooterBands.forEach(function (child) {
        bandGroupFooterHeight = child.rectangle.height;
    });

    var numofData = Math.floor((avaHeight - titleHeight - footer_height) / valueHeight);


    if (numofData > dataCount) {
        return dataCount
    } else {
        return numofData
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
            if(!remainData){
                drawBand(band.childHeaderBands, layerName, reportHeight);
            }
        }

        var div_id = 'band' + (bandNum++);
        $('#' + layerName).append("<div id='" + div_id + "' class='Band " + band.attributes["xsi:type"] + "'>" + band.name + "</div>");

        // if(band.childBands !== null){
        //     drawBand(band.childBands);
        // }
        // childBands라는 애가 필요없는 애일 수 있고
        // 어디서 재귀호출해야 할 지 명확치 않아 우선 주석처리

        if (band.attributes["xsi:type"] === "BandData") {
            if(bands.length > 1){
                getFooterHeight(bands);
            }
            if(groupFieldArray.length > 0) {
                getMinGroupBandDataHeight(band);
                avaHeight = getAvaHeight(div_id, reportHeight);
                numofData = getNumOfDataWithGroupField(band, avaHeight);
            }
        }
        judgementControlList(band, div_id, numofData); // 라벨을 그려줌

        if (band.attributes["xsi:type"] == 'BandData') {
            var dataBandHeight = 0;
            if(groupFieldArray.length > 0) {
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
            }else {
                $('#' + div_id).css({
                    'width': band.rectangle.width,
                    'height': band.rectangle.height,
                    'border-bottom': "1px solid red"
                });
            }

        } else if (band.attributes["xsi:type"] === "BandPageFooter") {
            $('#' + div_id).css({
                'width': band.rectangle.width,
                'height': band.rectangle.height,
                'position': 'absolute',
                'bottom': 0 + "px",
                'border-bottom': "1px solid red"

            });
        } else {
            $('#' + div_id).css({
                'width': band.rectangle.width,
                'height': band.rectangle.height,
                'border-bottom': "1px solid red"
            });
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
                if (!band.forceNewPage) {

                } else {
                    var siblings = $('#' + div_id).siblings();
                    var curr_height = parseInt($('#' + div_id).css('height').substring(0, $('#' + div_id).css('height').length - 2));

                    for (var i = 0; i < siblings.length; i++) {
                        curr_height += parseInt(siblings.eq(i).css('height').substring(0, siblings.eq(i).css('height').length - 2));
                    }
                    //ToDo -4 지워야함 Maybe 밴드에 픽셀 때문에 화면이 겹쳐서 강제로 해줌
                    avaHeight = reportHeight - curr_height - footer_height - 4;

                    if (avaHeight > minGroupBandDataHeight) {
                        parentBand = (function (arg) {
                            var band = new Array();
                            band.push(arg);
                            return band;
                        })(parentBand);
                        drawBand(parentBand, layerName, reportHeight);
                    }
                }
            }
        }


        if (band.childFooterBands !== null) { // 자식 풋터 밴드에서 재호출
            if(!remainData){
                drawBand(band.childFooterBands, layerName, reportHeight, band);
            }
        }

    });
}
