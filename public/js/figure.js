// 도형 객체
/******************************************************************
 기능 : 도형에 대한 공통 속성을 빼내서 객체를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function Figure(data) {
    this.parentId = data.ParentID === undefined ? undefined : data.ParentID._text;
    this.id = data.Id._text;
    this.rectangle = {
        x : (data.Rectangle.X === undefined ? 0 : data.Rectangle.X._text),
        y : (data.Rectangle.Y === undefined ? 0 : data.Rectangle.Y._text),
        width : data.Rectangle.Width._text,
        height : data.Rectangle.Height._text
    };

    this.name = data.Name._text;
    this.zOrder = data.ZOrder._text;
    this.thickness = data.Thickness._text;
    this.movable = data.Movable._text;
    this.changeable = data.Changeable._text;
    this.visible = data.Visible._text;
    this.printable = data.Printable._text;
}

function ControlRectangle(data) {
    Figure.apply(this, arguments);

    this.backgroundColor = data.BackGroundColor._text;
    this.trangsparent = data.Transparent._text; // 뭐지?
    this.borderColor = data.BorderColor._text;
    this.roundingValue = data.RoundingValue._text;
    this.recDashStyle = data.RecDashStyle._text;
}

function ControlCircle(data) {
    Figure.apply(this, arguments);

    this.backgroundColor = data.BackGroundColor._text;
    this.trangsparent = data.Transparent === undefined ? undefined : data.Transparent._text;
    this.borderColor = data.BorderColor._text;
    this.roundingValue = data.RoundingValue === undefined ? undefined : data.RoundingValue._text;
    this.recDashStyle = data.RecDashStyle === undefined ? undefined : data.RecDashStyle._text;
}

function ControlLine(data) {
    Figure.apply(this, arguments);

    this.lineDash = data.LineDash._text;
    this.lineColor = data.LineColor._text;
    this.lineGap = data.LineGap._text;
    this.lineType = data.LineType._text;
    this.lineDashStyle = data.LineDashStyle._text;
}

function ControlArrow(data) {
    Figure.apply(this, arguments);

    this.lineDash = data.LineDash._text;
    this.lineColor = data.LineColor._text;
    this.lineGap = data.LineGap._text; // ???
    this.lineType = data.LineType._text;
    this.arrowType = data.ArrowType._text;
    this.arrowSize = data.ArrowSize._text;
    this.arrowShape = data.ArrowShape._text;
    this.arrowDashStyle = data.ArraowDashStyle === undefined ? undefined : data.ArraowDashStyle._text;
}