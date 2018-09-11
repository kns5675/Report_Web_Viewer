var radioButtonNum = 0;
var checkBoxNum = 0;
/******************************************************************
 기능 : 라디오 버튼을 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingRadioButton(data, divId) {
    var div = $('#' + divId);
    div.append('<div id = "RadioButton' + radioButtonNum + '"></div>');

    var radioButtonId = $('#RadioButton' + radioButtonNum);

    if(data.checked == 'true') {
        radioButtonId.append('<input type = "radio" checked = "checked">' + data.text);
    } else {
        radioButtonId.append('<input type = "radio">' + data.text);
    }
    Lock_check(data, radioButtonId, div);
    var width = Number(data.rectangle.width);
    var height = Number(data.rectangle.height);

    radioButtonId.css({
       'border' : 'none',
       'width' : width + 20 + 'px',
       'height' : height + 'px',
       'position' : 'absolute',
       'left' : data.rectangle.x + 'px',
       'top' : data.rectangle.y + 'px',
       'background-color' : 'transparent'
    });

    radioButtonNum++;
}

/******************************************************************
 기능 : 체크 박스를 화면에 그려주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function drawingCheckBox(data, divId) {
    var div = $('#' + divId);
    div.append('<div id = "CheckBox' + checkBoxNum + '"></div>');

    var checkBoxId = $('#CheckBox' + checkBoxNum);
    if(data.checked == 'true') {
        checkBoxId.append('<input type = "checkbox" checked = "checked">' + data.text);
    } else {
        checkBoxId.append('<input type = "checkbox">' + data.text);
    }
    Lock_check(data, checkBoxId, div);

    var width = Number(data.rectangle.width);
    var height = Number(data.rectangle.height);

    checkBoxId.css({
        'border' : 'none',
        'width' : width + 20 + 'px',
        'height' : height + 'px',
        'position' : 'absolute',
        'left' : data.rectangle.x + 'px',
        'top' : data.rectangle.y + 'px',
        'background-color' : 'transparent'
    });
    checkBoxNum++;
}