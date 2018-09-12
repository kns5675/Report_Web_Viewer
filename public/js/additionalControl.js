// AdditionalControl 객체
/******************************************************************
 기능 : AdditionalControl에 대한 공통 속성을 빼내서 객체를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function AdditionalControl(data) {
    this.parentId = data.ParentID === undefined ? undefined : data.ParentID._text;
    this.id = data.Id._text;
    this.rectangle = {
        x : (data.Rectangle.X === undefined ? 0 : data.Rectangle.X._text),
        y : (data.Rectangle.Y === undefined ? 0 : data.Rectangle.Y._text),
        width : data.Rectangle.Width._text,
        height : data.Rectangle.Height._text
    };

    this.name = data.Name._text;
    this.Lock = data.Lock;
    this.zOrder = data.ZOrder === undefined ? 0 : data.ZOrder._text;
    this.text = data.Text === undefined ? undefined : data.Text._text;
    this.checked = data.Checked._text; // 체크 여부
    this.freeMove = data.FreeMove === undefined ? false : data.FreeMove._text; // 밴드 밖(좌측, 상단)으로 이동 가능
    this.editable = data.Editable === undefined ? true : data.Editable._text; // 편집 가능
}

/******************************************************************
 기능 : AdditionalControl 객체를 상속 받는 ControlRadioButton(라디오 버튼)에 대한 객체를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function ControlRadioButton(data){
    AdditionalControl.apply(this, arguments);
}

/******************************************************************
 기능 : AdditionalControl 객체를 상속 받는 ControlCheckBoxButton(체크 박스)에 대한 객체를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function ControlCheckBoxButton(data){
    AdditionalControl.apply(this, arguments);
}
