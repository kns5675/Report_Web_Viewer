var ImageNum = 1;

/******************************************************************
 기능 : 첫 페이지 버튼 기능 함수.
 만든이 : hagdung-i
 ******************************************************************/
function FirstPage(){
    $("#FirstPage").on("click",function () {
        $(window).scrollTop(0);
        $("#NowPage").val(1);
    });
}


/******************************************************************
 기능 : 현재 페이지 input 태그 기능 함수.
 만든이 : hagdung-i
 ******************************************************************/
function NowPage(){
    $("#NowPage").on("keyup",function () {
        $(this).val($(this).val().replace(/[^0-9]/g,""));

        var inputpage = "page"+$(this).val();
        var pagevalue = $('#'+inputpage).offset().top;
        $(window).scrollTop(pagevalue);
    });
}


/******************************************************************
 기능 : 이전 페이지 버튼 기능 함수.
 만든이 : hagdung-i
 ******************************************************************/
function PreviousPage(){
    $("#PreviousPage").on("click",function () {
        var nowpage = $("#NowPage").val() - 1;
        if(nowpage > 0){
            var page = $("#page"+nowpage).offset().top;
            $("#NowPage").val(nowpage);
            $(window).scrollTop(page);
        }else{
            $("#NowPage").val(1);
        }
    });
}


/******************************************************************
 기능 : 다음 페이지 버튼 기능 함수.
 만든이 : hagdung-i
 ******************************************************************/
function NextPage(){
    $("#NextPage").on("click",function () {
        var nowpage = $("#NowPage").val()*1+1;
        var totalpage = $(".page").length;
        if(nowpage <= totalpage){
            var page = $("#page"+nowpage).offset().top;
            $("#NowPage").val(nowpage);
            $(window).scrollTop(page);
        }else{
            $("#NowPage").val(totalpage);
        }
    });
}


/******************************************************************
 기능 : 마지막 페이지 버튼 기능 함수.
 만든이 : hagdung-i
 ******************************************************************/
function LastPage(pagecount){
    $("#LastPage").on("click",function () {
        var Last = $(".page").length;
        var page = $("#page"+Last).offset().top;
        $(window).scrollTop(page);
        $("#NowPage").val(pagecount);
    });
}


/******************************************************************
 기능 : 페이지 상단바(header) 고정 함수.
 만든이 : hagdung-i
 ******************************************************************/
function HeaderFixAndPageScroll(pagecount) {
    var jbOffset = $( '#header' ).offset();

    $( window ).scroll( function() {
        if ( $( document ).scrollTop() > jbOffset.top ) {
            $( '#header' ).addClass( 'jbFixed' );
        }
        else {
            $( '#header' ).removeClass( 'jbFixed' );
        }
        PageValue(pagecount);
    });
}


/******************************************************************
 기능 : SCROLL 시 Page 값 변환 함수.
 만든이 : hagdung-i
 ******************************************************************/
function PageValue() {
    $(".page").each(function (i, e) {
        var page = $("#"+e.id).offset().top-500;
        if($( document ).scrollTop() >= page){
            var pagenum = e.id.toString().substring(4,5);
            $("#NowPage").val(pagenum);
        }
    });
}


/******************************************************************
 기능 : image upload를 위한 함수.
 만든이 : hagdung-i
 ******************************************************************/
function image_upload() {


    var modalLayer = $("#modalLayer");
    var modalCont = $(".modalContent");
    var marginLeft = modalCont.outerWidth()/2;
    var marginTop = modalCont.outerHeight()/2;

    /******************************************************************
     기능 : image_upload_button(이미지 추가 버튼) 클릭시 반응.
     만든이 : hagdung-i
     ******************************************************************/
    $(".image_upload_button").on("click" ,function () { //이미지 추가 버튼 클릭.
        modalLayer.fadeIn("slow");
        modalCont.css({"margin-top" : -marginTop, "margin-left" : -marginLeft});
        $(this).blur();
        return false;
    });

    /******************************************************************
     기능 : upload_button(모달창의 확인 버튼) 클릭시 반응.
     만든이 : hagdung-i
     ******************************************************************/
    $("#upload_button").click(function () { //이미지 추가 모달의 확인 버튼 클릭.
        modalLayer.fadeOut("slow");
    });

    /******************************************************************
     기능 : upload_cancel(모달창의 취소 버튼) 클릭시 반응.
     만든이 : hagdung-i
     ******************************************************************/
    $("#upload_cancel").click(function(){ //이미지 추가 모달의 취소 버튼 클릭.
        modalLayer.fadeOut("slow");
        var nowpagenum = $("#NowPage").val();
        console.log("삭제 이미지 번호 : ",nowpagenum);
        $("#image"+nowpagenum).remove();
    });
}


/******************************************************************
 기능 : 보안상의 이유로 실제 파일 접근 경로를 변환해서 가져오기 때문에 실제 url이 필요하여 해당 로직 추가.
 만든이 : hagdung-i
 ******************************************************************/
function readURL(input) {
    var nowpagenum = $("#NowPage").val();
    console.log("페이지 번호 : ",nowpagenum);
    console.log("추가 이미지 번호 : ",ImageNum);
    $("#report"+nowpagenum).append("<div class='box'>" +
        "<div class='boxheader'>Header</div>" +
        "<div class='boxbody'>\n" +
        "        Resize me\n" +
        "      </div>" +
        "image_upload_button" +
        "</div>");
    // "<img id= 'image"+ImageNum+"' class='ui-widget-content' src= '#' width=\"153\" height=\"204\"/>" +

    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#image'+ImageNum).attr('src', e.target.result);
            ImageNum++;
        };
        reader.readAsDataURL(input.files[0]);
    }

}

/******************************************************************
 기능 : realURL 함수 호출.
 만든이 : hagdung-i
 ******************************************************************/
$(function() {
    $('#image_insert').on("change", function () {
        readURL(this);
    });

});

function resizes() {
    console.log("resizes in");
    // $('.box').resizable({
    //     handleSelector: ".win-size-grip"
    // });
    $('#box').draggable({handle:".win-size-grip"});
    $('#box').resizable();
}