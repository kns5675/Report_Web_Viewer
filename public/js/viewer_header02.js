$(document).ready(function(){
    $("#mymodal2").click(function(){
        $("#modalcase").css("display","block");
    });
    $("#closebtn").click(function(){
        $('#modalTableChoice').hide();//고급인쇄 모달창 닫기
    });
    $("#closebtn3").click(function(){
        close_pop2();
    });
    $("#closebtn4").click(function(){
        close_pop3();
    });
    $("#sign").on('keyup',function(){
        dataValidity2();    //고급인쇄 - 결재란 칸수 지정 데이터 유효성 검증
    });
    $("#copyratio").on({
        keydown: function(){
            onlyNumber(event);  //고급인쇄 - 인쇄배율 input박스 내에 숫자만 받도록 제어
        },
        keyup: function () {
            removeChar();   //고급인쇄 - 인쇄배율 input박스 내에 글자입력시 삭제하도록 제어
        },
        change: function(){
            copyRatioCheck();   //고급인쇄 - 인쇄배율 -> input 박스 내에 범위 지정 & 예외처리 & 입력된 배율값 적용
        }
    });
    $(".fontform,.fontcontent").on("change",function(){ //고급인쇄 - 폰트설정 - 폰트내용, 폰트서식 변경
        eSetFont();
    });
});

/******************************************************************
 기능 : image upload를 위한 함수.
 만든이 : hagdung-i
 ******************************************************************/
function tableChoice() {

    var modalLayer = $("#modalTableChoice");

    /******************************************************************
     기능 : 이미지 추가 버튼
     만든이 : hagdung-i
     ******************************************************************/
    $("#tableChoice").on("click" ,function () {
        modalLayer.show();

        var main = $('#leftpart_modalTableChoice_main');

        main.append('<table id = "labelListTable"</table>');

        var labelList = $('#labelListTable');

        tableLabelList.forEach(function(label, i){
            if(label._attributes == "DynamicTableTitleLabel") {
                labelList.append('<tr>');
                labelList.append('<td><input type="checkbox" name="check" value ="' + label.text + '">' + label.text + '<td>');
                labelList.append('</tr>');
            }
        });
    });

    $("#closebtn_modalTableChoice").click(function(){
        modalLayer.hide();//고급인쇄 모달창 닫기
    });

    /******************************************************************
     기능 : 이미지 추가 모달창의 확인 버튼
     만든이 : hagdung-i
     ******************************************************************/
    $("#upload_button").click(function () {
        modalLayer.fadeOut("slow");

    });

    /******************************************************************
     기능 : 이미지 추가 모달창의 취소 버튼
     만든이 : hagdung-i
     ******************************************************************/
    $("#upload_cancel").click(function(){
        modalLayer.fadeOut("slow");
        $("#"+imagedivid).remove();
    });
}