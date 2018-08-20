// 작성자 : 전형준
var bandNum = 1;

/***********************************************************
 * 임시로 만든 함수.
 * 리포트에 밴드들을 그려줌
 * *********************************************************/
function drawBand(bands){
    console.log("fff")
    bands.forEach(function (band) {

        if(band.childHeaderBands !== null){
            drawBand(band.childHeaderBands);
        }
        // if(band.childBands !== null){
        //     drawBand(band.childBands);
        // }
        // childBands라는 애가 필요없는 애일 수 있음

        band.divId = "report" + reportNum + "_band" + bandNum;
        $('.report' + reportNum).append("<div id='" + band.divId + "'>" + band.name + "</div>");
        $('#B' + band.divId).css({
           'width' : band.rectangle.width,
           'height' : band.rectangle.height,
           'border-bottom' : "1px solid red",
        });

        if(band.childFooterBands !== null){
            drawBand(band.childFooterBands);
        }
        // judgementControlList(band);
        bandNum++;

    });
}
/************************************************************
 ************************************************************/