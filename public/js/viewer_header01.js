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
