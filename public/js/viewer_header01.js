var page_offset = 97;
var ImageNum = 1;
var imageid;
var imagedivid;
var set_buttonid;
var imagezIndex = 401;
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
        //console.log("page : ",$(this).val());
        var inputpage = "page"+$(this).val();
        var pagevalue = $('#'+inputpage).offset().top-page_offset;
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
            var page = $("#page"+nowpage).offset().top-page_offset;
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
            var page;
            if(nowpage == 2){
                //console.log("test");
                page = $("#page"+nowpage).offset().top-235;
            }else{
                page = $("#page"+nowpage).offset().top-page_offset;
            }
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
        var page = $("#page"+Last).offset().top-185;
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
            var pagenum = e.id.replace(/[^0-9]/g,'');
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
        //console.log("삭제 이미지 번호 : ",nowpagenum);
        $("#"+imagedivid).remove();
    });
}


/******************************************************************
 기능 : 보안상의 이유로 실제 파일 접근 경로를 변환해서 가져오기 때문에 실제 url이 필요하여 해당 로직 추가.
 만든이 : hagdung-i
 ******************************************************************/
function readURL(input) {
    var scope = "designLayer";
    tag_Making(scope);
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

function tag_Making(scope, imgae_src) {
    var nowpagenum = $("#NowPage").val();

    //이미지 영역 생성 & 이미지 생성
    var Packing = document.createElement("div");
    Packing.id = "ImageDivPacking"+ImageNum;
    Packing.style.position = "absolute";
    Packing.style.height = "1px";

    var imagediv = document.createElement("div");
    imagedivid = "imagediv"+ImageNum;
    imagediv.id = imagedivid;
    imagediv.className = "ImageDiv";
    imagediv.style.height = "400px";
    imagediv.style.backgroundColor = "black";
    imagediv.style.zIndex = imagezIndex+ImageNum*10-1;

    var images = document.createElement("img");
    imageid = "image"+ImageNum;
    images.id = imageid;
    images.class = "Images";
    if(imgae_src){
        images.src = imgae_src;
    }else{
        images.src = "#";
    }
    images.style.width = "100%";
    images.style.height = "100%";

    var setdiv = document.createElement("div");
    setdiv.id = "setdiv"+ImageNum;
    setdiv.style.position = "absolute";
    setdiv.className  = "setting_button";

    var set_button = document.createElement("input");
    set_buttonid = "image_button"+ImageNum;
    set_button.id = set_buttonid;
    set_button.className  = "setting_button";
    set_button.type = "button";
    set_button.value = "이미지 속성";
    set_button.style.visibility = "hidden";

    var dialog_main_div = document.createElement("div");
    dialog_main_div.id = "dialog_main_div"+ImageNum;
    dialog_main_div.style.position = "absolute";
    dialog_main_div.style.width = "0px";
    dialog_main_div.style.height = "0px";

    var dialog_div = document.createElement("div");
    dialog_div.id = "dialog_div"+ImageNum;

    var main_dialog = $("#dialog")[0].id;

    var dialog = document.createElement("input");
    dialog.id = "dialog"+ImageNum;
    dialog.class = "image_dialog_delete";
    dialog.value = "이미지 삭제";
    dialog.type = "button";

    var limit_fore_dialog = document.createElement("input");
    limit_fore_dialog.id = "limit_fore_dialog"+ImageNum;
    limit_fore_dialog.value = "이미지 맨 앞으로 보내기";
    limit_fore_dialog.type = "button";

    var fore_dialog = document.createElement("input");
    fore_dialog.id = "fore_dialog"+ImageNum;
    fore_dialog.value = "이미지 앞으로 보내기";
    fore_dialog.type = "button";

    var limit_back_dialog = document.createElement("input");
    limit_back_dialog.id = "limit_back_dialog"+ImageNum;
    limit_back_dialog.value = "이미지 맨 뒤로 보내기";
    limit_back_dialog.type = "button";

    var back_dialog = document.createElement("input");
    back_dialog.id = "back_dialog"+ImageNum;
    back_dialog.value = "이미지 뒤로 보내기";
    back_dialog.type = "button";

    var cancel_dialog = document.createElement("input");
    cancel_dialog.id = "image_update_cancel"+ImageNum;
    cancel_dialog.value = "취소";
    cancel_dialog.type = "button";

    //이미지 추가 기능 모달창.
    //console.log("nowpagenum : ",nowpagenum);
    if(scope === "designLayer"){
        document.getElementById("designLayer"+nowpagenum).appendChild(Packing);
    }else if(scope === "backGroundLayer"){
        document.getElementById("backGroundLayer"+nowpagenum).appendChild(Packing);
    }else if(scope === "foreGroundLayer"){
        document.getElementById("foreGroundLayer"+nowpagenum).appendChild(Packing);
    }
    document.getElementById(Packing.id).appendChild(imagediv);
    document.getElementById(imagediv.id).appendChild(images);
    document.getElementById(imagediv.id).appendChild(setdiv);
    document.getElementById(setdiv.id).appendChild(set_button);

    //이미지 수정 기능 모달창.
    document.getElementById(main_dialog).appendChild(dialog_main_div);
    document.getElementById(dialog_main_div.id).appendChild(dialog_div);
    document.getElementById(dialog_div.id).appendChild(dialog);
    document.getElementById(dialog_div.id).appendChild(limit_fore_dialog);
    document.getElementById(dialog_div.id).appendChild(limit_back_dialog);
    document.getElementById(dialog_div.id).appendChild(fore_dialog);
    document.getElementById(dialog_div.id).appendChild(back_dialog);
    document.getElementById(dialog_div.id).appendChild(cancel_dialog);

    //이미지 영역의 드래그 이동 & 크기 조정 기능.
    $("#"+imagediv.id).draggable({ containment:"#backGroundLayer"+nowpagenum, zIndex:13}); //영역 나가지 못하게 하는 설정.
    $("#"+imagediv.id).resizable({});
    image_setting(imagediv.id, set_buttonid, ImageNum, "delete"); //이미지 영역의 id값 받아가기 위함.
    //
    image_setting(imagediv.id, set_buttonid, ImageNum, "set");
}

function image_moal_fadeout(ImageNum) {
    var modalLayer = $("#image_dialog");
    var dialog_div = $("#dialog_div"+ImageNum);
    modalLayer.fadeOut("slow");
    dialog_div.css({"visibility": "hidden"});
}

function image_level(level, ImageNum) {
    $(".ImageDiv").each(function (i, e) {
        if(level === "up"){ //이미지 순서 앞으로/뒤로
            if($("#imagediv"+ImageNum)[0].style.zIndex < e.style.zIndex){
                $("#imagediv"+ImageNum)[0].style.zIndex = e.style.zIndex*1+1;
            }else if($("#imagediv"+ImageNum)[0].style.zIndex === e.style.zIndex){
                $("#imagediv"+ImageNum)[0].style.zIndex = e.style.zIndex*1+10;
            }
        }else if (level === "down"){
            if($("#imagediv"+ImageNum)[0].style.zIndex > e.style.zIndex){
                $("#imagediv"+ImageNum)[0].style.zIndex = e.style.zIndex-1;
            }else if($("#imagediv"+ImageNum)[0].style.zIndex === e.style.zIndex){
                $("#imagediv"+ImageNum)[0].style.zIndex = e.style.zIndex-10;
            }
        }
    });
}

/******************************************************************
 기능 : 이미지 삭제, 수정 기능.
 만든이 : hagdung-i
 ******************************************************************/
function image_setting(id, btn, ImageNum, setting){

    if(setting == "delete"){
        if($("#"+imagedivid)[0].id){
            // $("#"+imageid).dblclick(function () {

            $("#dialog"+id).on("click",function () {
                //console.log("this : ",this);
                //console.log("id : ",id);
                $("#"+id).remove();
            });
        }
    }else if(setting == "set"){
        $("#"+id).on("mouseover",function () {
            var styles = $("#"+btn);
            styles[0].style.visibility = "visible";
        });
        $("#"+id).on("mouseleave",function () {
            var styles = $("#"+btn);
            styles[0].style.visibility = "hidden";
        });

        var modalLayer = $("#image_dialog");
        var dialog = $("#dialog");
        var dialog_div = $("#dialog_div"+ImageNum);
        //console.log("dialog_div : ",dialog_div[0]);
        dialog_div.css({"visibility": "hidden"});
        var marginLeft = dialog.outerWidth()/2;
        var marginTop = dialog.outerHeight()/2;

        //이미지 속성 버튼 클릭시.
        $(".setting_button").on("click", function () {
            modalLayer.fadeIn("slow");
            ImageNum = this.id.replace(/[^0-9]/g,'');
            dialog.css({"margin-top" : -marginTop, "margin-left" : -marginLeft});
            $("#dialog_div"+ImageNum).css({"visibility": "visible"});
            $(this).blur();
            return false;
        });
        $("#image_update_cancel"+ImageNum).on("click",function () {
            image_moal_fadeout(ImageNum);
            // $("#dialog").remove();
        });
        // 이미지 삭제 버튼
        $("#dialog"+ImageNum).on("click", function () {
            $("#ImageDivPacking"+ImageNum).remove();
            $("#dialog_div"+ImageNum).remove();
            image_moal_fadeout(ImageNum);
        });

        //이미지 맨 앞으로 보내기 버튼
        $("#limit_fore_dialog"+ImageNum).on("click", function () {
            //console.log("맨 앞으로 보내기 버튼");
            //console.log("ImageNum : ",ImageNum);
            var imgae_src = $("#image"+ImageNum)[0].src;
            //console.log("imgae_src : ",imgae_src);
            $("#ImageDivPacking"+ImageNum).remove(); // 다른 레이어에 새로 그리려면 지워야지~

            var scope = "foreGroundLayer";
            tag_Making(scope,imgae_src);
            // if(imagezIndex <= 550){
            //     //console.log("imagezIndex : ",imagezIndex);
            //     imagezIndex = 550;
            //     $("#imagediv"+ImageNum)[0].style.zIndex =imagezIndex;
            // }
            image_moal_fadeout(ImageNum);
        });

        //이미지 맨 뒤로 보내기 버튼
        $("#limit_back_dialog"+ImageNum).on("click", function () {
            //console.log("맨 뒤로 보내기 버튼");
            //console.log("ImageNum : ",ImageNum);
            var imgae_src = $("#image"+ImageNum)[0].src;
            //console.log("imgae_src : ",imgae_src);
            $("#ImageDivPacking"+ImageNum).remove(); // 다른 레이어에 새로 그리려면 지워야지~
            var scope = "backGroundLayer";
            tag_Making(scope, imgae_src);
            // if(imagezIndex >=401){
            //     //console.log("imagezIndex : ",imagezIndex);
            //     imagezIndex= 401;
            //     $("#imagediv"+ImageNum)[0].style.zIndex = imagezIndex;
            // }
            image_moal_fadeout(ImageNum);
        });

        //이미지 앞으로 보내기 버튼
        $("#fore_dialog"+ImageNum).on("click", function () {
            //console.log("앞으로 보내기 버튼");
            image_level("up",ImageNum);
            image_moal_fadeout(ImageNum);
        });
        //이미지 뒤로 보내기 버튼
        $("#back_dialog"+ImageNum).on("click", function () {
            //console.log("뒤로 보내기 버튼");
            image_level("down",ImageNum);
            image_moal_fadeout(ImageNum);
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
