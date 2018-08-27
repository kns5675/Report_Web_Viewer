$(document).ready(function(){
    $("#mymodal2").click(function(){
        $("#modalcase").css("display","block");
    });
    $("#closebtn").click(function(){
        close_pop();
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
    hakjoons();
});

/******************************************************************
 기능 : 각 기능별 이벤트 시작점.
 만든이 : hagdung-i
 ******************************************************************/
function hakjoons(){
    /******************************************************************
     기능 : 용지 크기 선택(A4,B4 등)
     만든이 : hagdung-i
     ******************************************************************/
    $("#pagesizeoptions").on("change", function () {
        pagesizeselect($(this).val());
    });
    $(".direction").on("change",function () {
        paper_setting();
    });

    /******************************************************************
     기능 : 출력일 인쇄 기능
     만든이 : hagdung-i
     ******************************************************************/
    $(".copydate").on("change",function () {
        var print = $('input[id="copydate_id"]:checked').val();
        console.log("print : ",print);
        if(print){
            datePrinting();
        }else{
            $(".timePage").remove();
        }
    });
    /******************************************************************
     기능 : 매수 인쇄
     만든이 : hagdung-i
     ******************************************************************/
    $(".copycount").on("change", function () {
        var count = $('input[id="copycount_id"]:checked').val();
        console.log("count : ",count);
        if(count){
            countPrinting();
        }else{
            $(".countPage").remove();
        }
    });
    /******************************************************************
     기능 : 머리글 체크 값별 이벤트
     만든이 : hagdung-i
     ******************************************************************/
    $("#extra_header_using_check").on("click", function () {
        extra_header_using_check();
    });

    /******************************************************************
     기능 : 꼬리글 체크 값별 이벤트
     만든이 : hagdung-i
     ******************************************************************/
    $("#extra_tail_using_check").on("click", function () {
        extra_tail_using_check();
    });

    //머리글, 꼬리글 입력 값으로 뿌려주기.
    /******************************************************************
     기능 : 용지 크기 선택(A4,B4 등)
     만든이 : hagdung-i
     ******************************************************************/
    $("#extrahead").on("keyup",function () {
        var input_value = $("#extrahead").val();
        header_location(input_value);
    });
    $("#extratail").on("keyup",function () {
        var input_value = $("#extratail").val();
        footer_location(input_value);
    });

    /******************************************************************
     기능 : 머리글, 꼬리글 셀렉트 박스 선택시
     만든이 : hagdung-i
     ******************************************************************/
    $("#extraheadoptions").on("change", function () {
        var input_value = $("#extrahead").val();
        header_location(input_value);
    });
    $("#extratailoptions").on("change", function () {
        var input_value = $("#extratail").val();
        footer_location(input_value);
    });

}

/******************************************************************
 기능 : 용지방향 설정 함수.
 만든이 : hagdung-i
 ******************************************************************/
function paper_setting(setting) {
    //용지방향 설정 가로와 세로를 서로 뒤바꿔주는 식의 형태인데, 가로에 해당하는 라디오 박스가 선택 되어 있을 때만 초기화시 세로로 되돌림.
    var test = $('input:radio[name="direction"]').prop("checked");
    console.log("test : ", test);
    console.log("setting : ", setting);
    if(setting){
        if(!test){
            paperDirection();
            $("input:radio[name='direction']:radio[value='세로']").prop("checked",true);
            $("input:radio[name='direction']:radio[value='가로']").prop("checked",false);
        }
    }else{
        console.log("test : ",test);
        paperDirection();
    }
}

/******************************************************************
 기능 : 고급인쇄 -  결재란 칸수 지정 데이터 유효성 검증
 author : 하지연
 ******************************************************************/
function dataValidity2(){
    try{
        var tds = $("#sign").val();
        tds = parseInt(tds);
        if(tds>0 && tds<=8){
            changeColor(tds);
            $("#alertsign").text("");
        }else{
            $("#alertsign").text("결재란 칸 수는 1 이상 8 이하여야 합니다.");

            this.value="";
        }
    }catch(e){
        console.log(e.message);
    }
}
/******************************************************************
 기능 : 고급인쇄설정 - 결재란 설정 - 결재란 등록 모달창 - 결재란 칸수 지정시
        결재라인 css 변경 함수
 author : 하지연
 ******************************************************************/
function changeColor(tds){
    tds = parseInt(tds);
    tds = tds-1;
    $(".modaltd").each(function (i, e) {
        console.log(e.id);
        var tdid = e.id.replace(/[^0-9]/g, "");
        console.log(tdid);
        if (tds >= tdid) {
            $("table#modaltable tr:eq(0) td:eq(" + tdid + ")").css("background-color", "white");
            $("table#modaltable tr:eq(1) td:eq(" + tdid + ")").css("background-color", "#E6E6FA");
        } else {
            $("table#modaltable tr:eq(0) td:eq(" + tdid + ")").css("background-color", "#E3E3E3");
            $("table#modaltable tr:eq(1) td:eq(" + tdid + ")").css("background-color", "#E3E3E3");
        }
    });
};
/******************************************************************
 기능 : 모달 '확인'버튼 누르기 전 데이터 유효성 검증
 author : 하지연
 ******************************************************************/
function beforeSubmit(){
    var copyRatio = $("#copyratio");
    if(copyRatio.val()>100 || copyRatio.val() == ''){
        $("#warning").text("인쇄배율의 범위는 0~100 입니다.");
        return false;
    }else{
        var eCopyRate = $("#copyratio").val();
        eCopyRate = (Number(eCopyRate))/100;

        $(".page").each(function (i, e) {
           // console.log("e : ", e.id);
           var idnum = e.id.replace(/[^0-9]/g,'');

           eSetFont();
           eCopyRatio(eCopyRate, idnum);//인쇄배율 변경 펑션
        });
        close_pop1();
        //alert("인쇄 배율 : "+copyRatio.val() + " %");
        return true;
    }
}
/******************************************************************
 기능 : 고급인쇄 -  인쇄배율 -> input 박스 내에 범위 지정 & 예외처리 & 입력된 배율값 적용
 author : 하지연
 ******************************************************************/
function copyRatioCheck(){
    var copyRatio = $("#copyratio");
    if(copyRatio.val()>100 || copyRatio.val() == ''){
        $("#warning").text("인쇄배율의 범위는 0~100 입니다.");
        $("#copyratio").val("");
        $("#copyratio").focus();
    }else{
        var eCopyRate = copyRatio.val();
        eCopyRate = (Number(eCopyRate))/100;

        $(".page").each(function (i, e) {
            // console.log("e : ", e.id);
            var idnum = e.id.replace(/[^0-9]/g,'');

            eCopyRatio(eCopyRate, idnum);//인쇄배율 변경 펑션
        });
        //close_pop1();
    }
}
/******************************************************************
 기능 : 고급인쇄설정 - 폰트설정 - 폰트서식, 폰트내용 폰트 변경 기능
 author : 하지연
 ******************************************************************/
function eSetFont(){
    var checkedFontForm = $("input[type=radio][name=fontform]:checked").val();
    $('.Label:not(".DataLabel")').css('font-family', checkedFontForm);

    var checkedFontContent = $("input[type=radio][name=fontcontent]:checked").val();
    $('.Label.DataLabel').css('font-family', checkedFontContent);

}
/******************************************************************
 기능 : 고급인쇄설정 - 폰트설정 - 폰트서식, 폰트내용의 폼에 설정값을
        default값으로 변경 후, viewer에 적용한다.
 author : 하지연
 ******************************************************************/
function eReSetFont(){

    $("input:radio[name='fontform']:radio[value='굴림']").prop("checked",true);
    $("input:radio[name='fontcontent']:radio[value='굴림']").prop("checked",true);

    var checkedFontForm = ('굴림');
    $('.Label:not(".DataLabel")').css('font-family', checkedFontForm);
    var checkedFontContent = ('굴림');
    $('.Label.DataLabel').css('font-family', checkedFontContent);

}
/******************************************************************
 기능 : 고급인쇄설정 - 인쇄설정 - 인쇄배율기능
 author : 하지연
 ******************************************************************/
function eCopyRatio(eCopyRate, idnum){
    try {
        var eCopyRatioContent = document.getElementById('page' + idnum);
        //'page' + idnum
        var ecopyratio = eCopyRate;
        ecopyratio = Number(ecopyratio);
        // console.log("eCopyRatioContent : ",eCopyRatioContent);
      /*  alert(ecopyratio);*/
        if (jQuery.browser.msie) {
            eCopyRatioContent.style.zoom = ecopyratio;
        }
        else {
            $(eCopyRatioContent).css('-webkit-transform','scale(' + (ecopyratio) + ')');
            $(eCopyRatioContent).css('-webkit-transform-origin','0 0');
            $(eCopyRatioContent).css('-moz-transform','scale(' + (ecopyratio) + ')');
            $(eCopyRatioContent).css('-moz-transform-origin','0 0');
            $(eCopyRatioContent).css('-o-transform','scale(' + (ecopyratio) + ')');
            $(eCopyRatioContent).css('-o-transform-origin','0 0');
            $(eCopyRatioContent).css('transform','scale('+(ecopyratio)+')');
        }
    }
    catch(e) {
        console.log(e.message);
    }
}
/******************************************************************
 기능 : 고급인쇄설정 - 인쇄설정 - 인쇄배율 기능에서 input 태그 내에 숫자만 허용하게 했으며,
        숫자이외의 키가 눌렸을 경우 경고글을 보여준다.
 author : 하지연
 ******************************************************************/
function onlyNumber(event){
    event = event || window.event;
    var keyID = (event.which) ? event.which : event.keyCode;
    if ( (keyID >= 48 && keyID <= 57) || (keyID >= 96 && keyID <= 105) || keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39 ){
        $("#warning").text("");
        return true;
    }
    else{
        $("#warning").text("숫자만 입력할 수 있습니다.");
        return false;
    }
}
/******************************************************************
 기능 : 고급인쇄설정 - 인쇄설정 - 인쇄배율 기능에서 input 태그 내에 숫자만 허용하게 했으며,
 숫자 외 다른 키가 눌렸을 경우 공백으로 대체하는 함수
 author : 하지연
 ******************************************************************/
function removeChar(event) {
    event = event || window.event;
    var keyID = (event.which) ? event.which : event.keyCode;
    if ( keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39 ){
        $("#warning").text("");
        return true;
    }
    else{
        event.target.value = event.target.value.replace(/[^0-9]/g, "");
    }
}

jQuery.browser = {}; //jQuery.browser.msie 사용 위함.
(function () {
    jQuery.browser.msie = false;
    jQuery.browser.version = 0;
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        jQuery.browser.msie = true;
        jQuery.browser.version = RegExp.$1;
    }
})();