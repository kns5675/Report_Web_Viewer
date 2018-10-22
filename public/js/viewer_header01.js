var page_offset = 97;
var ImageNum = 1;
var imgae_src;
var CImageNum;
var imageid;
var count = 0;
var imagedivid;
var set_buttonid;
var imagezIndex = 401;
var total_data;
var total_report;
var total_band;
var total_label;


function file_download_data_get() {
    $("#file_data")[0].value = JSON.stringify(total_data);

    alert("파일 저장 완료");
    alert("Report_Web_Viewer/file_save 파일 하위에 저장됩니다.");
    // return total_data;
}

/******************************************************************
 기능 : 저장 버튼 기능
 만든이 : hagdung-i
 ******************************************************************/
function file_save() {
    var modalLayer = $("#file_download_modalLayer");
    var file_download_Modal = $("#file_download_Modal");
    $("#saving").on("click", function () {
        modalLayer.fadeIn("slow");
        file_download_Modal.css("display","block");
    });
    $("#file_download_button").on("click", function () {
        var test = $("#file_name")[0].value;
        modalLayer.fadeOut("slow");
        file_download_Modal.css("display","none");
    });
    $("#file_download_cancel").on("click", function () {
        modalLayer.fadeOut("slow");
        file_download_Modal.css("display","none");
    });
    $(".download_cancel").on("click", function () {
        modalLayer.fadeOut("slow");
        file_download_Modal.css("display","none");
    });
}
function saving_data_binding(data){
    total_data = data;
}
/******************************************************************
 기능 : 파일 열기 버튼 기능.
 만든이 : hagdung-i
 ******************************************************************/
function file_open() {

    var modalLayer = $("#filemodalLayer");
    var file_Modal = $("#file_Modal");
    $("#file_opener").on("click", function () {
        file_Modal.css("display", "block");
        modalLayer.fadeIn("slow");
    });

    $("#file_upload_button").on("click", function () {
        modalLayer.fadeOut("slow");
        file_Modal.css("display", "none");
    });

    $("#file_upload_cancel").on("click", function () {
        modalLayer.fadeOut("slow");
        file_Modal.css("display", "none");
    });

    $(".upload_cancel").click(function(){
        modalLayer.fadeOut("slow");
        file_Modal.css("display", "none");
    });
}

function file_open_submit(file, db, param) {
    var file_ckeck_xml = file[0].value.match(/(.xml)$/);
    var db_ckeck_xml = db[0].value.match(/(.xml)$/);
    var param_ckeck_xml = param[0].value.match(/(.xml)$/);
    if(file_ckeck_xml && db_ckeck_xml && param_ckeck_xml){ //입력 파일이 .xml 파일일 때
        // alert("입력한 파일을 기준으로 새로 그립니다.");
    }else{
        alert("xml 파일만 입력이 가능합니다.");
        return null;
    }
}

function file_realURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            // $('#image'+ImageNum).attr('src', e.target.result);
            // ImageNum++;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

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
        // var totalpage = $(".page").length;
        var totalpage = $(".visiblePage").length;
        if(nowpage <= totalpage){
            var page;
            if(nowpage == 2){
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
        var Last = $(".visiblePage").length;
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
    $(".visiblePage").each(function (i, e) {
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
    var Image_modal = $("#Image_Modal");
    var image_add_butten = $("#image_add_butten");
    var modalLayer = $("#modalLayer");
    var modalCont = $(".modalContent");
    var marginLeft = modalCont.outerWidth()/2;
    var marginTop = modalCont.outerHeight()/2;
    /******************************************************************
     기능 : 이미지 추가 버튼
     만든이 : hagdung-i
     ******************************************************************/
    $("#image_upload_button").on("click" ,function () {
        modalLayer.fadeIn("slow");
        Image_modal.css('display','block');

        image_add_butten.css({"margin-top" : -marginTop, "margin-left" : -marginLeft});
        $(this).blur();
        return false;
    });
    /******************************************************************
     기능 : 이미지 추가 모달창의 확인 버튼
     만든이 : hagdung-i
     ******************************************************************/
    $("#upload_button").click(function () {
        modalLayer.fadeOut("slow");
        Image_modal.css('display','none');
    });
    /******************************************************************
     기능 : 이미지 추가 모달창의 취소 버튼
     만든이 : hagdung-i
     ******************************************************************/
    $(".upload_cancel").click(function(){
        modalLayer.fadeOut("slow");
        Image_modal.css('display','none');
        $("#"+imagedivid).remove();
    });
}
/******************************************************************
 기능 : 보안상의 이유로 실제 파일 접근 경로를 변환해서 가져오기 때문에 실제 url이 필요하여 해당 로직 추가.
 만든이 : hagdung-i
 ******************************************************************/
function readURL(input) {
    var scope = "designLayer";
    if($("#dialog_div"+ImageNum)[0]){
        $("#dialog_div"+ImageNum).remove();
    }
    tag_Making(scope).then(function (resolve) {
        image_setting();
    });
    /******************************************************************
     기능 : 실제 url 가져오는 기능.
     만든이 : hagdung-i
     ******************************************************************/
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
 기능 : 태그 생성 함수.
 만든이 : hagdung-i
 ******************************************************************/
async function tag_Making(scope, imgae_src, imgnum) {
    var nowpagenum = $("#NowPage").val();
    if(imgnum){
        var test = $("#image1")[0];
        if(test){
            imgnum++;
        }
        ImageNum = imgnum;
    }
    /******************************************************************
     기능 : 이미지 영역 생성 & 이미지 생성
     만든이 : hagdung-i
     ******************************************************************/
    var Packing = document.createElement("div");
    Packing.id = "ImageDivPacking"+ImageNum;
    Packing.style.position = "absolute";
    Packing.style.pointerEvents = "auto";
    Packing.style.height = "1px";

    var imagediv = document.createElement("div");
    imagedivid = "imagediv"+ImageNum;
    imagediv.id = imagedivid;
    imagediv.className = "ImageDiv";
    imagediv.style.height = "400px";
    imagediv.style.backgroundColor = "black";
    // imagediv.style.zIndex = imagezIndex+ImageNum*10-1;
    imagediv.style.zIndex = 1000;

    var images = document.createElement("img");
    imageid = "image"+ImageNum;
    images.id = imageid;
    images.className = "Images";
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

    var set_button = document.createElement("input");
    set_buttonid = "image_button"+ImageNum;
    set_button.id = set_buttonid;
    set_button.className  = "setting_button";
    set_button.type = "button";
    set_button.value = "이미지 속성";
    set_button.style.visibility = "hidden";
    /******************************************************************
     기능 : 이미지 추가 기능 모달창 생성.
     만든이 : hagdung-i
     ******************************************************************/
    if(scope === "designLayer"){
        document.getElementById("designLayer"+nowpagenum).prepend(Packing);
    }else if(scope === "backGroundLayer"){
        document.getElementById("backGroundLayer"+nowpagenum).prepend(Packing);
    }else if(scope === "foreGroundLayer"){
        document.getElementById("foreGroundLayer"+nowpagenum).prepend(Packing);
    }
    document.getElementById(Packing.id).appendChild(imagediv);
    document.getElementById(imagediv.id).appendChild(images);
    document.getElementById(imagediv.id).appendChild(setdiv);
    document.getElementById(setdiv.id).appendChild(set_button);
    /******************************************************************
     기능 : 이미지 영역의 드래그 이동 & 크기 조정 기능.
     만든이 : hagdung-i
     ******************************************************************/
    $("#"+imagediv.id).draggable({ containment:"#backGroundLayer"+nowpagenum}); //영역 나가지 못하게 하는 설정.
    $("#"+imagediv.id).resizable({});

    return new Promise(function (resolve) {
        var data = 100;
        resolve(data);
    });
}
/******************************************************************
 기능 : 이미지 모달창 닫기 기능.
 만든이 : hagdung-i
 ******************************************************************/
function image_moal_fadeout() {
    var Image_modal = $("#Image_Modal2");
    var modalLayer = $("#image_dialog");
    modalLayer.fadeOut("slow");
    Image_modal.css('display','none');
}
/******************************************************************
 기능 : 이미지 앞으로/뒤로 기능(영역 변경이 아닌 이미지간의 순서만 변경).
 만든이 : hagdung-i

 기능 : 이미지 순서 맨 앞, 맨 뒤, 앞으로, 뒤로 버튼 기능.
 날짜 : 2018-09-05
 만든이 : hagdung-i
 ******************************************************************/
function image_level(level, ImageNum, index) {
    var length = $(".ImageDiv").length;
    $(".ImageDiv").each(function (i, e) {
        if(length === 1){ //이미지 1개일 때
            if (level === "up") { //이미지 순서 앞으로/뒤로
                $("#imagediv" + ImageNum)[0].style.zIndex = 1000;
            } else if (level === "down") {
                $("#imagediv" + ImageNum)[0].style.zIndex = -1;
            }
        }else { //이미지 여러개일때
            if (level === "up") { //이미지 순서 앞으로/뒤로
                if ($("#imagediv" + ImageNum)[0].style.zIndex < e.style.zIndex) { //선택한 이미지보다 zindex가 크거나 같은 애가 있을 경우
                    if (index) {  //맨 앞으로인지 그냥 앞으로 인지 구분
                        if (e.style.zIndex >= 999) {
                            //이미 맨 앞으로 보낸 이미지가 있는지(999보다 클때), 현재 이미지가 그보다 작거나 같은지 구분
                            $("#imagediv" + ImageNum)[0].style.zIndex = e.style.zIndex * 1 + 10;
                        } else {
                            $("#imagediv" + ImageNum)[0].style.zIndex = 1000;
                        }
                    } else {
                        $("#imagediv" + ImageNum)[0].style.zIndex = e.style.zIndex * 1 + 1;   //큰애보다 1만 더 크게
                    }
                } else if ($("#imagediv" + ImageNum)[0].style.zIndex === e.style.zIndex) {//작을 경우도 자기 자신에 1만 증가.
                    $("#imagediv" + ImageNum)[0].style.zIndex = e.style.zIndex * 1 + 10;
                }
            } else if (level === "down") {
                if ($("#imagediv" + ImageNum)[0].style.zIndex > e.style.zIndex) {
                    if (index) {  //맨 앞으로인지 그냥 앞으로 인지 구분
                        if (e.style.zIndex <= -1) {   //이미 맨 뒤로 보낸 이미지가 있는지 구분
                            $("#imagediv" + ImageNum)[0].style.zIndex = e.style.zIndex * 1 - 1;
                        } else {
                            $("#imagediv" + ImageNum)[0].style.zIndex = -1;
                        }
                    } else {
                        $("#imagediv" + ImageNum)[0].style.zIndex = e.style.zIndex * 1 - 1;   //큰애보다 1만 더 크게
                    }
                } else if ($("#imagediv" + ImageNum)[0].style.zIndex === e.style.zIndex) {//작을 경우도 자기 자신에 1만 증가.
                    $("#imagediv" + ImageNum)[0].style.zIndex = e.style.zIndex * 1 - 10;
                }
            }
        }
    });
}
/******************************************************************
 기능 : 이미지 삭제, 수정 기능.
 만든이 : hagdung-i
 ******************************************************************/
async function image_setting(){
    /******************************************************************
     기능 : 이미지에 마우스 올릴 시에만 이미지 속성 버튼이 나타남.
     만든이 : hagdung-i
     ******************************************************************/
    $(".ImageDiv").on("mouseover",function () {
        var id = this.id.replace(/[^0-9]/g,'');
        var styles = $("#image_button"+id);
        styles[0].style.visibility = "visible";
    });
    $(".ImageDiv").on("mouseleave",function () {
        var id = this.id.replace(/[^0-9]/g,'');
        var styles = $("#image_button"+id);
        styles[0].style.visibility = "hidden";
    });
    var Image_modal = $("#Image_Modal2");
    var modalLayer = $("#image_dialog");
    var dialog = $("#dialog");
    var marginLeft = dialog.outerWidth()/2;
    var marginTop = dialog.outerHeight()/2;
    /******************************************************************
     기능 : 이미지 속성 버튼 클릭시 이벤트
     만든이 : hagdung-i
     ******************************************************************/
    $(".setting_button").on("click", function () {
        modalLayer.fadeIn("slow");
        CImageNum = this.id.replace(/[^0-9]/g,'');
        Image_modal.css('display','block');
        dialog.css({"margin-top" : -marginTop, "margin-left" : -marginLeft});
        $("#dialog_div"+CImageNum).css({"visibility": "visible"});
        $("#image_update_cancel"+CImageNum).css({"visibility": "visible"});
        $(this).blur();
        return false;
    });
    /******************************************************************
     기능 : 이미지 속성 - 취소 버튼 클릭시 이벤트
     만든이 : hagdung-i
     ******************************************************************/
    $(".image_update_cancel").on("click",function () {
        image_moal_fadeout();
    });
    /******************************************************************
     기능 : 이미지 속성 - 삭제 버튼 클릭시 이벤트
     만든이 : hagdung-i
     ******************************************************************/
    $("#image_dialog_delete").on("click", function () {
        $("#ImageDivPacking"+CImageNum).remove();
        image_moal_fadeout();
    });
    /******************************************************************
     기능 : 이미지 속성 - 이미지 맨 앞으로 보내기 버튼 클릭시 이벤트
     만든이 : hagdung-i
     ******************************************************************/
    $("#limit_fore_dialog").on("click", function () {
        image_level("up",CImageNum, 500);
        image_moal_fadeout(CImageNum);
    });
    /******************************************************************
     기능 : 이미지 속성 - 이미지 맨 뒤로 보내기 버튼 클릭시 이벤트
     만든이 : hagdung-i
     ******************************************************************/
    $("#limit_back_dialog").on("click", function () {
        image_level("down",CImageNum, "limit");
        image_moal_fadeout(CImageNum);
    });
    /******************************************************************
     기능 : 이미지 속성 - 이미지 앞으로 보내기 버튼 클릭시 이벤트
     만든이 : hagdung-i
     ******************************************************************/
    $("#fore_dialog").on("click", function () {
        image_level("up",CImageNum);
        image_moal_fadeout(CImageNum);
    });
    /******************************************************************
     기능 : 이미지 속성 - 이미지 뒤로 보내기 버튼 클릭시 이벤트
     만든이 : hagdung-i
     ******************************************************************/
    $("#back_dialog").on("click", function () {
        image_level("down",CImageNum);
        image_moal_fadeout(CImageNum);
    });
}
/******************************************************************
 기능 : realURL 함수 호출.
 만든이 : hagdung-i
 ******************************************************************/
$(function() {
    /******************************************************************
     기능 : 이미지 추가 기능의 파일 관련 기능.
     만든이 : hagdung-i
     ******************************************************************/
    $('#image_insert').on("change", function () {
        if(this.value){
            var test = this.value;
            if(test){
                readURL(this);
            }
        }
    });
    /******************************************************************
     기능 : 파일 열기 기능의 파일 관련 기능.
     날짜 : 2018-10-10
     만든이 : hagdung-i
     ******************************************************************/
    $("#file_insert").on("change", function () {
        if(this.value){
            var test = this.value;
            if(test){
                var ckeck_xml = test.match(/(.xml)$/);
                if(ckeck_xml){ //입력 파일이 .xml 파일일 때
                    var file = document.querySelector('#file_insert');

                    file.onchange = function () {
                        var fileList = file.files ;

                        // 읽기
                        var reader = new FileReader();
                        var dwadaw = reader.readAsText(fileList [0]);

                        if (fileList && fileList[0]) {
                            var reader = new FileReader();
                            reader.onload = function(e) {
                            };
                            reader.readAsDataURL(fileList[0]);
                        }
                        // //로드 한 후
                        // reader.onload = function  () {
                        //     document.querySelector('#preview').textContent = reader.result ;
                        // };
                    };
                    file_realURL(this);
                }else{
                    alert("xml 파일을 입력해주세요.");
                }
            }
        }
    });
});
function DRD_button() {
    $("#DRD_Start").on("click", function () {
    });
}
/******************************************************************
 기능 : 이미지 순서 변경 시 포,백그라운드에 새로 그려주기 위해 디자인레이어의
        이미지와 모달의 버튼들을 지우고 다시 그리는 것을 동기로 변경. 지운 후에
        새로 그리기 위함.
 날짜 : 2018-09-04
 만든이 : hagdung-i
 ******************************************************************/
async function remove_end(CImageNum) {
    return new Promise(function (resolve) {
        image_moal_fadeout(CImageNum);
        resolve(imgae_src);
    });
}
