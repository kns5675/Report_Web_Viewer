// 작성자 : 전형준

/***********************************************************
 * 임시로 만든 함수.
 * 리포트에 밴드들을 그려줌
 * *********************************************************/
function drawBand(report){
    report.layers.designLayer.bands.forEach(function (band) {
        // console.log(report.name + "의" + band.name);
        $('.report' + reportNum).append("<div id='B" + band.id + "'>" + band.name + "</div>");
        $('#B' + band.id).css({
           'width' : band.rectangle.width,
           'height' : band.rectangle.height,
           'border-bottom' : "1px solid red",
        });
    });
}
/************************************************************
 ************************************************************/