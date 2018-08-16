function drawBand(report){
    report.layers.designLayer.bands.forEach(function (band) {
        // console.log(report.name + "의" + band.name);
        $('.report' + reportNum).append("<div id='B" + band.id + "'></div>");
    });
}