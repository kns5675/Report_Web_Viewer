// 작성자 : 전형준
var bandNum = 1;
var footer_height = 0;
var minGroupBandDataHeight = 0;

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
 * 임시로 만든 함수.
 * 리포트에 밴드들을 그려줌(ChildBands 들을 그려주기 위해 재귀함수로 사용)
 * 인자 bands : 그려줄 밴드들 // layerName : 어느 Layer에 그려줄 지
 *
 * 수정 : 2018-08-22
 * BandData일 경우 페이지 크기에 맞게 BandData Height 변경
 * from 구영준
 * *********************************************************/
function drawBand(bands, layerName, reportHeight, dataBand) {

    bands.forEach(function (band) { // 밴드 갯수만큼 반복문 돌음
        // 페이지 헤더 밴드의 속성 '첫 페이지 출력 생략(PageOutputSkip)' 속성값이 'true'면 출력X

        if (band.attributes["xsi:type"] === "BandPageHeader" && band.pageOutputSkip === "true") {
            return;
        }

        // 타이틀 밴드 - 첫 페이지가 아니면 출력X
        if (band.attributes["xsi:type"] === "BandTitle" && reportPageCnt > 1) {
            return;
        }

        if (band.childHeaderBands !== null) { // 자식헤더밴드에서 재호출
            drawBand(band.childHeaderBands, layerName, reportHeight);
        }

        // if(band.childBands !== null){
        //     drawBand(band.childBands);
        // }
        // childBands라는 애가 필요없는 애일 수 있고
        // 어디서 재귀호출해야 할 지 명확치 않아 우선 주석처리

        // 밴드 div를 그려주고 CSS 입힘
        var div_id = 'band' + (bandNum++);
        $('#' + layerName).append("<div id='" + div_id + "' class='Band " + band.attributes["xsi:type"] + "'>" + band.name + "</div>");

        judgementControlList(band, div_id); // 라벨을 그려줌

        if (band.attributes["xsi:type"] == 'BandData') {
            var dataBandHeight = getBandHeightWithGroupField(band, reportHeight);
            getFooterHeight(bands);
            getMinGroupBandDataHeight(band);
            $('#' + div_id).css({
                'width': band.rectangle.width,
                'height': dataBandHeight,
                'border-bottom': "1px solid red"
            });
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


        if (band.attributes["xsi:type"] === "BandGroupHeader") {
            groupDataRow = 0;
        }

        var avaHegiht = 0;
        var dt = Object.values(dataTable.DataSetName)[0];
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
            curDatarow += (groupFieldArray[groupFieldNum].length - 1);
            groupFieldNum++;

            if(curDatarow < dt.length){
                if (band.forceNewPage) {

                } else {
                    var siblings = $('#' + div_id).siblings();
                    var curr_height = parseInt($('#' + div_id).css('height').substring(0, $('#' + div_id).css('height').length - 2));

                    for (var i = 0; i < siblings.length; i++) {
                        curr_height += parseInt(siblings.eq(i).css('height').substring(0, siblings.eq(i).css('height').length - 2));
                    }
                    avaHegiht = reportHeight - curr_height - footer_height;

                    if (avaHegiht > minGroupBandDataHeight) {
                        dataBand = (function (arg) {
                            var band = new Array();
                            band.push(arg);
                            return band;
                        })(dataBand);
                        drawBand(dataBand, layerName, reportHeight);
                    }
                }
            }
        }

        if (band.childFooterBands !== null) { // 자식 풋터 밴드에서 재호출
            drawBand(band.childFooterBands, layerName, reportHeight, band);
        }

    });
}
