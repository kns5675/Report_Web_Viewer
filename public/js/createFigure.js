var rectangleNum = 0;
var circleNum = 0;
var lineNum = 0;
var arrowNum = 0;
var figureNum = 0;

/******************************************************************
 기능 : 사각형을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingRectangle(data, divId) {
    var div = $('#' + divId);
    div.css('position', 'relative');
    div.append('<div id = "Figure' + figureNum + '"></div>');

    var rectangleId = $('#Figure' + figureNum);

    rectangleId.css('border', '0px');

    var x = parseInt(data.rectangle.x);
    var y = parseInt(data.rectangle.y);
    var width = parseInt(data.rectangle.width);
    var height = parseInt(data.rectangle.height);

    rectangleId.append('<canvas id = "Rectangle' + rectangleNum + '" width = "' + (width + x) + '" height = "' + (height + y) + '"></canvas>');
    var canvas = document.getElementById("Rectangle" + rectangleNum);
    var context = canvas.getContext('2d');

    context.fillStyle = data.backgroundColor;
    context.fillRect(data.rectangle.x, data.rectangle.y, data.rectangle.width, data.rectangle.height);

    // visible 속성
    if (data.visible == 'false') {
        canvas.clearRect(data.rectangle.x, data.rectangle.y, data.rectangle.width, data.rectangle.height);
    }

    if(data.borderColor == 'Transparent') {
        canvas.strokeStyle = 'Transparent';
    }
    rectangleNum++;
    figureNum++;
}
/******************************************************************
 기능 : 원을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingCircle(data, divId) {
    var div = $('#' + divId);
    div.css('position', 'relative');
    div.append('<div id = "Figure' + figureNum + '"></div>');

    var circleId = $('#Figure' + figureNum);

    circleId.css({
        'border' : '0px',
        'position' : 'absolute'
    });

    var kappa = 0.5522848;
    var x = parseInt(data.rectangle.x);
    var y = parseInt(data.rectangle.y);
    var width = parseInt(data.rectangle.width);
    var height = parseInt(data.rectangle.height);

    circleId.append('<canvas id = "Circle' + circleNum + '"width = "' + (width + x) + '" height = "' + (height + y) + '"></canvas>');
    var canvas = document.getElementById("Circle" + circleNum);
    var context = canvas.getContext('2d');



    var xm = x + width / 2; // x-middle
    var ym = y + height / 2; // y-middle
    var ox = width / 2 * kappa;
    var oy = height / 2 * kappa;
    var xe = x + width; // x-end
    var ye = y + height; // y-end

    context.fillStyle = data.backgroundColor;
    context.beginPath();
    context.moveTo(x, ym);
    context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    //context.closePath();
    context.stroke();

    // visible 속성
    if (data.visible == 'false') {
        canvas.clearRect(data.rectangle.x, data.rectangle.y, data.rectangle.width, data.rectangle.height);
    }

    if(data.borderColor == 'Transparent') {
        canvas.strokeStyle = 'Transparent';
    }
    circleNum++;
    figureNum++;
}
/******************************************************************
 기능 : 선을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingLine(data, divId) {

}
/******************************************************************
 기능 : 화살표를 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingArrow(data, divId) {

}