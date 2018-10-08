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


function file_download_data_get() {
    console.log("total_data : ",total_data);
    var file_data = $("#file_data")[0].value;
    $("#file_data")[0].value = total_data;
    console.log("file_data : ",$("#file_data")[0].value);

}

/******************************************************************
 기능 : 저장 버튼 기능
 만든이 : hagdung-i
 ******************************************************************/
function file_save() {
    var modalLayer = $("#file_download_modalLayer");
    $("#saving").on("click", function () {
        console.log("total_data.ReportTemplate.ReportList.anyType.Layers : ",total_data.ReportTemplate.ReportList.anyType);
        modalLayer.fadeIn("slow");
        // var Layers;
        // var Reports;
        //
        // if(total_data.ReportTemplate.ReportList.anyType.Layers){
        //     Layers = total_data.ReportTemplate.ReportList.anyType.Layers.anyType;
        //     Layer_forEach(Layers);
        //
        // }else{//report가 여러장일 경우
        //     Reports = total_data.ReportTemplate.ReportList.anyType;
        //     Reports.forEach(function (e, i) {
        //         Layers = e.Layers.anyType;
        //         Layer_forEach(Layers);
        //     });
        // }
    });
    $("#file_download_button").on("click", function () {
        var test = $("#file_name")[0].value;
        console.log("test: ",test);
        modalLayer.fadeOut("slow");
    });
    $("#file_download_cancel").on("click", function () {
        modalLayer.fadeOut("slow");
    });
    $(".download_cancel").on("click", function () {
        modalLayer.fadeOut("slow");
    });
}

function Layer_forEach(Layers) {

    Layers.forEach(function (e, i) {
        var bands = e.Bands.anyType;
        Band_forEach(bands);
    });
}

function Band_forEach(bands) {
    var label_id;
    var temp;
    if(bands[1]){
        bands.forEach(function (e, i) {
            if(e.ControlList.anyType){
                label_id = e.ControlList.anyType;
            }
            console.log("e.ControlList.anyType : ",e.ControlList.anyType);
            console.log("i : ",i);
            // if(){
            //
            // }
            Label_forEach(label_id, temp);
        });
    }else{
        if(bands.ControlList.anyType){
            label_id = bands.ControlList.anyType;
            label_id.forEach(function (e, i) {
                // console.log("e : ",e);
            });
        }
    }

}

function Label_forEach(label_id) {
    // console.log("label_id : ",label_id);
    if(label_id._attributes["xsi:type"] === "ControlDynamicTable"){
        var table = label_id.Labels.TableLabel;
        table.forEach(function (e, i) {
            // console.log("e : ",e);

        });
    }else if(label_id._attributes["xsi:type"] === "ControlFixedTable"){

    }else if(label_id._attributes["xsi:type"] === "ControlLabel"){
        if(label_id.DataType){
            if(label_id.DataType._text === "SystemLabel"){
                // console.log("label_id : ",label_id.Name._text);
                var count = 0;
                if(label_id.Name){
                    $("."+label_id.Name._text).each(function (i, e) {
                        // console.log("label_id.Rectangle.Width : ", label_id.Rectangle.Width);
                        // var next_element = $("."+label_id.Name._text)[i+1];
                        var element_width = e.style.width.replace(/[^0-9]/g, '');
                        // console.log("element_width : ",element_width);
                        if(element_width !== label_id.Rectangle.Width._text){ //이 위쪽에서 수정된 하나의 값만 찾아서 해당 값으로 모두 바꿔주는 로직이 필요.
                            // label_id.Rectangle.Width._text = element_width;  //모두 바꿔줄 필요없이 들어갈 하나의 값만 바꾸면되는데?
                            temp = element_width;
                            var total_count = $("."+label_id.Name._text).length;
                            $("."+label_id.Name._text).each(function (i, e) {
                                console.log("temp : ",temp);
                                if(temp !== e.style.width.replace(/[^0-9]/g, '')){
                                    count++;
                                }
                                console.log("count : ",count);
                                if(count+1 === total_count){
                                    console.log("label_id.Rectangle.Width._text에 temp를 넣는 시점.");
                                    label_id.Rectangle.Width._text = temp;
                                }
                            });
                            // console.log("temp : ",temp);
                        }
                        // if(e.style.height !==label_id.Rectangle.Height){
                        //     label_id.Rectangle.Height = e.style.height;
                        // }
                        // if(e.style.left !==label_id.Rectangle.X){
                        //     label_id.Rectangle.X = e.style.left;
                        // }
                        // if(e.style.top !==label_id.Rectangle.X){
                        //     label_id.Rectangle.X = e.style.top;
                        // }
                        // var label_name = e.id.replace(/[^a-zA-Z]/g, '');
                        // if(label_name === "SystemLabel"){
                        //
                        // }
                    });
                }
            }else{

            }
        }
    }
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
    $("#file_opener").on("click", function () {
        console.log("window : ",window.reportTemplate);
        $("#filemodalLayer").fadeIn("slow");
    });

    $("#file_upload_button").on("click", function () {
        modalLayer.fadeOut("slow");
    });

    $("#file_upload_cancel").on("click", function () {
        modalLayer.fadeOut("slow");
    });

    $(".upload_cancel").click(function(){
        modalLayer.fadeOut("slow");
    });
}

function file_open_submit(file, db, param) {
    var file_ckeck_xml = file[0].value.match(/(.xml)$/);
    var db_ckeck_xml = db[0].value.match(/(.xml)$/);
    var param_ckeck_xml = param[0].value.match(/(.xml)$/);
    if(file_ckeck_xml && db_ckeck_xml && param_ckeck_xml){ //입력 파일이 .xml 파일일 때
        alert("입력한 파일을 기준으로 새로 그립니다.");
        console.log("file_name : ",file[0].value);
        console.log("db : ",db[0].value);
        console.log("param : ",param[0].value);
    }else{
        alert("xml 파일만 입력이 가능합니다.");
        return null;
    }
    // alert(file_name);
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
        // var Last = $(".page").length;
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
    // $( '#header' )[0].style.width = "100%";
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
    // $(".page").each(function (i, e) {
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
        modalCont.css({"margin-top" : -marginTop, "margin-left" : -marginLeft});
        $(this).blur();
        return false;
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
    $(".upload_cancel").click(function(){
        modalLayer.fadeOut("slow");
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
    // tag_Making(scope);
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
    imagediv.style.zIndex = imagezIndex+ImageNum*10-1;

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
    // setdiv.className  = "setting_button";

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
    /******************************************************************
     기능 : 이미지 영역의 드래그 이동 & 크기 조정 기능.
     만든이 : hagdung-i
     ******************************************************************/
    $("#"+imagediv.id).draggable({ containment:"#backGroundLayer"+nowpagenum, zIndex:13}); //영역 나가지 못하게 하는 설정.
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
    var modalLayer = $("#image_dialog");
    modalLayer.fadeOut("slow");
}
/******************************************************************
 기능 : 이미지 앞으로/뒤로 기능(영역 변경이 아닌 이미지간의 순서만 변경).
 만든이 : hagdung-i

 기능 : 이미지 순서 맨 앞, 맨 뒤, 앞으로, 뒤로 버튼 기능.
 날짜 : 2018-09-05
 만든이 : hagdung-i
 ******************************************************************/
function image_level(level, ImageNum, index) {
    $(".ImageDiv").each(function (i, e) {
        if(level === "up"){ //이미지 순서 앞으로/뒤로
            if($("#imagediv"+ImageNum)[0].style.zIndex < e.style.zIndex){ //선택한 이미지보다 zindex가 크거나 같은 애가 있을 경우
                if(index) {  //맨 앞으로인지 그냥 앞으로 인지 구분
                    if (e.style.zIndex >= 999) {
                        //이미 맨 앞으로 보낸 이미지가 있는지(999보다 클때), 현재 이미지가 그보다 작거나 같은지 구분
                        $("#imagediv" + ImageNum)[0].style.zIndex = e.style.zIndex * 1 + 1;
                    } else {
                        $("#imagediv" + ImageNum)[0].style.zIndex = 999;
                    }
                }else {
                    $("#imagediv" + ImageNum)[0].style.zIndex = e.style.zIndex * 1 + 1;   //큰애보다 1만 더 크게
                }
            }else if($("#imagediv"+ImageNum)[0].style.zIndex === e.style.zIndex){//작을 경우도 자기 자신에 1만 증가.
                $("#imagediv"+ImageNum)[0].style.zIndex = e.style.zIndex*1+10;
            }
        }else if (level === "down"){
            if($("#imagediv"+ImageNum)[0].style.zIndex > e.style.zIndex){
                if(index) {  //맨 앞으로인지 그냥 앞으로 인지 구분
                    if (e.style.zIndex <= -1) {   //이미 맨 뒤로 보낸 이미지가 있는지 구분
                        $("#imagediv" + ImageNum)[0].style.zIndex = e.style.zIndex * 1 - 1;
                    } else {
                        $("#imagediv" + ImageNum)[0].style.zIndex = -1;
                    }
                }else {
                    $("#imagediv" + ImageNum)[0].style.zIndex = e.style.zIndex * 1-1;   //큰애보다 1만 더 크게
                }
            }else if($("#imagediv"+ImageNum)[0].style.zIndex === e.style.zIndex){//작을 경우도 자기 자신에 1만 증가.
                $("#imagediv"+ImageNum)[0].style.zIndex = e.style.zIndex*1-10;
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
    var modalLayer = $("#image_dialog");
    var dialog = $("#dialog");
    // var dialog_div = $("#dialog_div");
    // dialog_div.css({"visibility": "hidden"});
    var marginLeft = dialog.outerWidth()/2;
    var marginTop = dialog.outerHeight()/2;
    /******************************************************************
     기능 : 이미지 속성 버튼 클릭시 이벤트
     만든이 : hagdung-i
     ******************************************************************/
    $(".setting_button").on("click", function () {
        modalLayer.fadeIn("slow");
        CImageNum = this.id.replace(/[^0-9]/g,'');
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
    $('#image_insert').on("change", function () {
        if(this.value){
            var test = this.value;
            if(test){
                // console.log("test : ",test);
                readURL(this);
            }
        }
    });

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

                        console.log("reader : ",fileList [0]);
                        if (fileList && fileList[0]) {
                            var reader = new FileReader();
                            reader.onload = function(e) {
                                console.log("e.target.result : ",e.target.result);
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

        // shell.echo('hello world');
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
