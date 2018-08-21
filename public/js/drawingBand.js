// 작성자 : 전형준

/***********************************************************
 * 임시로 만든 함수.
 * 리포트에 밴드들을 그려줌
 * *********************************************************/
function drawBand(bands, layerName){
    bands.forEach(function (band) {

        if(band.childHeaderBands !== null){
            drawBand(band.childHeaderBands, layerName);
        }
        // if(band.childBands !== null){
        //     drawBand(band.childBands);
        // }
        // childBands라는 애가 필요없는 애일 수 있음

        var div_id = 'b' + band.id;
        $('#' + layerName).append("<div id='" + div_id + "' class='" + band.attributes["xsi:type"] + "'>" + band.name + "</div>");
        $('#' + div_id).css({
           'width' : band.rectangle.width,
           'height' : band.rectangle.height,
           'border-bottom' : "1px solid red",
        });

        if(band.childFooterBands !== null){
            drawBand(band.childFooterBands, layerName);
        }
        judgementControlList(band, div_id);
        bandNum++;

    });
}
/************************************************************
 ************************************************************/