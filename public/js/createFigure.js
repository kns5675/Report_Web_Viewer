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
    div.append('<div id = "Rectangle' + rectangleNum + '"></div>');

    var rectangleId = $('#Rectangle' + rectangleNum);

    var thickness = data.thickness;
    var recDashStyle = data.recDashStyle;
    var borderColor = data.borderColor;
    var roundingValue = Number(data.roundingValue);
    if(roundingValue < 2) {
        roundingValue = roundingValue * 20;
    } else if(roundingValue >= 2) {
        roundingValue = 50;
    }

    Lock_check(data, rectangleId, div);

    rectangleId.css({
        'border' : thickness + 'px ' + recDashStyle + ' ' + borderColor,
        'width' : data.rectangle.width,
        'height' : data.rectangle.height,
        'position' : 'absolute',
        'left' : data.rectangle.x + 'px',
        'top' : data.rectangle.y + 'px',
        'background-color' : data.backgroundColor,
        'border-radius' : roundingValue + 'px'
    });

    // visible 속성
    if (data.visible == 'false') {
        rectangleId.css('display', 'none');
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
    div.append('<div id = "Figure' + figureNum + '"></div>');

    var figureId = $('#Figure' + figureNum);

    figureId.css({
        'border' : '0px',
        'width' : data.rectangle.width,
        'height' : data.rectangle.height,
        'position' : 'absolute',
        'left' : data.rectangle.x + 'px',
        'top' : data.rectangle.y + 'px'
    });

    Lock_check(data, figureId, div);

    var kappa = 0.5522848;
    var x = 0;
    var y = 0;
    var width = parseInt(data.rectangle.width);
    var height = parseInt(data.rectangle.height);

    figureId.append('<canvas id = "Circle' + circleNum + '"width = "' + width + 'px" height = "' + height + 'px"></canvas>');

    var canvas = document.getElementById("Circle" + circleNum);
    var context = canvas.getContext('2d');

    var xm = x + width / 2; // x-middle
    var ym = y + height / 2; // y-middle
    var ox = width / 2 * kappa;
    var oy = height / 2 * kappa;
    var xe = x + width; // x-end
    var ye = y + height; // y-end

    context.beginPath();
    context.moveTo(x, ym);
    context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);

    context.fillStyle = data.backgroundColor;
    context.lineWidth = data.thickness;
    context.strokeStyle = data.borderColor;
    context.stroke();
    context.fill();

    // visible 속성
    if (data.visible == 'false') {
        canvas.clearRect(data.rectangle.x, data.rectangle.y, data.rectangle.width, data.rectangle.height);
    }
    circleNum++;
    figureNum++;
}
/******************************************************************
 기능 : 선을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingLine(data, divId) {
    var div = $('#' + divId);
    div.append('<div id = "Figure' + figureNum + '"></div>');

    var figureId = $('#Figure' + figureNum);

    var x = Number(data.rectangle.x);
    var y = Number(data.rectangle.y);
    var width = Number(data.rectangle.width);
    var height = Number(data.rectangle.height);

    figureId.css({
        'border' : '0px',
        'width' : width + 'px',
        'height' : height + 'px',
        'position' : 'absolute',
        'left' : x + 'px',
        'top' : y + 'px'
    });

    Lock_check(data, figureId, div);

    figureId.append('<canvas id = "Line' + lineNum + '" width = "' + width + '" height = "' + height + '"></canvas>');

    var canvas = document.getElementById("Line" + lineNum);
    var context = canvas.getContext('2d');

    context.beginPath();
    switch (data.lineType) {
        case "Horizontal" :
            context.moveTo(0, 0);
            context.lineTo(width, 0);
            break;
        case "Vertical" :
            context.moveTo(0, 0);
            context.lineTo(0, height);
            break;
        case "BackSlash" :
            context.moveTo(0, 0);
            context.lineTo(width, height);
            break;
        case "Slash" :
            context.moveTo(width, 0);
            context.lineTo(0, height);
            break;
    }
    switch (data.lineDashStyle) {
        case "Dot" :
            context.setLineDash([3, 9]);
            break;
        case "Dash" :
            context.setLineDash([8]);
            break;
        case "DashDot" : // 구현할 수 없음
            context.setLineDash([8]);
            break;
        case "DashDotDot" : // 구현할 수 없음
            context.setLineDash([3, 9]);
            break;
    }
    canvas.style.position = "absolute";
    context.lineWidth = data.thickness;
    context.strokeStyle = data.lineColor;
    context.closePath();
    context.stroke();

    lineNum++;
    figureNum++;
}
/******************************************************************
 기능 : 화살표를 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingArrow(data, divId) {
    var div = $('#' + divId);
    div.append('<div id = "Figure' + figureNum + '"></div>');

    var figureId = $('#Figure' + figureNum);

    figureId.css({
        'border' : '0px',
        'width' : data.rectangle.width,
        'height' : data.rectangle.height,
        'position' : 'absolute',
        'left' : data.rectangle.x + 'px',
        'top' : data.rectangle.y + 'px'
    });

    Lock_check(data, figureId, div);

    var x = parseInt(data.rectangle.x);
    var y = parseInt(data.rectangle.y);
    var width = parseInt(data.rectangle.width);
    var height = parseInt(data.rectangle.height);

    figureId.append('<canvas id = "Arrow' + arrowNum + '" width = "' + width + '" height = "' + height + '"></canvas>');

    var canvas = document.getElementById("Arrow" + arrowNum);
    var context = canvas.getContext('2d');

    context.beginPath();
    switch (data.lineType) {
        case "Horizontal" :
            context.moveTo(5, 5);
            context.lineTo(width, 5);
            context.closePath();

            context.moveTo(width, 5);
            context.lineTo(width-7, 0);
            context.lineTo(width-7, 10);
            context.closePath();
            context.fillStyle = data.lineColor;
            context.lineWidth = data.thickness;
            context.stroke();
            context.fill();
            break;
        case "Vertical" :
            context.moveTo(5, 5);
            context.lineTo(5, height);
            context.closePath();

            context.moveTo(5, height);
            context.lineTo(0, height-7);
            context.lineTo(10, height-7);
            context.closePath();
            context.fillStyle = data.lineColor;
            context.lineWidth = data.thickness;
            context.stroke();
            context.fill();
            break;
        case "BackSlash" : // 제대로 안됨..ㅠ
            context.moveTo(0, 0);
            context.lineTo(width, height-3);
            context.closePath();

            context.moveTo(width, height);
            context.lineTo(width-2, height-10);
            context.lineTo(width-10, height-1);
            context.closePath();
            context.fillStyle = data.lineColor;
            context.lineWidth = data.thickness;
            context.stroke();
            context.fill();
            break;
        case "Slash" : // 제대로 안됨
            context.moveTo(0, height);
            context.lineTo(width, 3);
            context.closePath();

            context.moveTo(width, 0);
            context.lineTo(width-2, height-10);
            context.lineTo(width-10, height-1);
            context.closePath();
            context.fillStyle = data.lineColor;
            context.lineWidth = data.thickness;
            context.stroke();
            context.fill();
            break;
    }
    switch (data.lineDashStyle) {
        case "Dot" :
            context.setLineDash([3, 9]);
            break;
        case "Dash" :
            context.setLineDash([8]);
            break;
        case "DashDot" : // 구현할 수 없음
            context.setLineDash([8]);
            break;
        case "DashDotDot" : // 구현할 수 없음
            context.setLineDash([3, 9]);
            break;
    }
    context.lineWidth = data.thickness;
    context.strokeStyle = data.lineColor;
    context.closePath();
    context.stroke();

    arrowNum++;
    figureNum++;
}