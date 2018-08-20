var ImageNum = 1;
var imageid;
var imagezIndex = 12;
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
        $("#"+imageid).remove();
    });
}


/******************************************************************
 기능 : 보안상의 이유로 실제 파일 접근 경로를 변환해서 가져오기 때문에 실제 url이 필요하여 해당 로직 추가.
 만든이 : hagdung-i
 ******************************************************************/
function readURL(input) {
    var nowpagenum = $("#NowPage").val();

    //이미지 영역 생성 & 이미지 생성
    var Packing = document.createElement("div");
    var imagediv = document.createElement("div");
    var images = document.createElement("img");
    Packing.id = "ImageDivPacking"+ImageNum;
    Packing.style.position = "absolute";
    Packing.style.height = "1px";
    imageid = "imagediv"+ImageNum;
    imagediv.id = imageid;
    imagediv.class = "ImageDiv";
    console.log("imagediv.id : ",imagediv.id);
    imagediv.style.height = "400px";
    imagediv.style.backgroundColor = "black";
    images.id = "image"+ImageNum;
    images.class = "Images";
    images.src = "#";
    images.style.width = "100%";
    images.style.height = "100%";
    document.getElementById("report"+nowpagenum).appendChild(Packing);
    document.getElementById(Packing.id).appendChild(imagediv);
    document.getElementById(imagediv.id).appendChild(images);
    //이미지 영역의 드래그 이동 & 크기 조정 기능.
    $("#"+imagediv.id).draggable({ containment:"#backGroundLayer"+nowpagenum, zIndex:13});
    $("#"+imagediv.id).resizable({ containment:"#backGroundLayer"+nowpagenum});
    image_setting(imagediv.id, "delete"); //이미지 영역의 id값 받아가기 위함.
    //
    image_setting(imagediv.id, "set");
    //이미지 추가
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
 기능 : 이미지 삭제, 수정 기능.
 만든이 : hagdung-i
 ******************************************************************/
function image_setting(id, setting){
    if(setting == "delete"){
        if($("#"+imageid)[0]){
            $("#"+imageid).dblclick(function () {
                console.log("id : ",id);
                console.log("더블 클릭!");
                $("#"+id).remove();
                // $("#" + id).dialog({
                //     modal: true,
                //     appendTo: "#report"+nowpagenum,
                //     show: "puff",
                //     hide: "explode",
                //     resizable: true,
                //     closeOnEscape: false,
                //     minWidth: 200,
                //     minHeight: 150,
                //     position: { my: "left top", of: "left top"}
                // });
            });
        }
    }else if(setting == "set"){
        $("#"+imageid).on("click",function () {
            console.log("한번 클릭");
            console.log($("#"+id)[0].style.zIndex);
            $("#"+id)[0].style.zIndex =imagezIndex;
            imagezIndex ++;
        });
        $("#"+imageid).on("mouseover",function () {
            var set_button = document.createElement("button");
            set_button.id = "image_button"+ImageNum;

            document.getElementById(id).appendChild(set_button);
            console.log("마우스 오버");

        });
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




