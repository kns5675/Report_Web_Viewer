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

    //용지 크기 선택(A4,B4 등)
    $("#pagesizeoptions").on("change", function () {
        pagesizeselect($(this).val());
    });
    // paper_setting();
    $(".direction").on("change",function () {
        paper_setting();
    });

    //출력일 인쇄 기능
    $(".copydate").on("change",function () {
        var print = $('input[id="copydate_id"]:checked').val();
        console.log("print : ",print);
        if(print){
            datePrinting();
        }else{
            $(".timePage").remove();
        }
    });
    //매수 인쇄
    $(".copycount").on("change", function () {
        var count = $('input[id="copycount_id"]:checked').val();
        console.log("count : ",count);
        if(count){
            countPrinting();
        }else{
            $(".countPage").remove();
        }
    });
    //머리글
    $("#extra_header_using_check").on("click", function () {
        var checked = $("#extra_header_using_check").is(":checked");
        console.log(checked);
        if(checked){
            $("#extraheadoptions").removeAttr("disabled");
            $("#extrahead").removeAttr("disabled").removeAttr("readonly");
            head_test();
        }else{
            $("#extraheadoptions").attr("disabled", true).attr("readonly",false);
            $("#extrahead").attr("disabled", true).attr("readonly",true);
            $(".PageHeader").remove();
        }
    });
    $("#extrahead").on("keyup",function () {
        // head_test();
    });
    //꼬리글
    $("#extra_tail_using_check").on("click", function () {
        var checked = $("#extra_tail_using_check").is(":checked");
        console.log(checked);
        if(checked){
            $("#extratailoptions").removeAttr("disabled");
            $("#extratail").removeAttr("disabled").removeAttr("readonly");
            var value = 40;
            footer_test(value);
        }else{
            $("#extratailoptions").attr("disabled", true).attr("readonly",false);
            $("#extratail").attr("disabled", true).attr("readonly",true);
            $(".PageFooter").remove();
        }
    });
});

//학준 추가
function hakjoons(){

}

function paper_setting(setting,test3) {
    //용지방향 설정
    var test = $('input:radio[name="direction"]').is(":checked");
    var test2 = $('input:radio[name="direction"]').val();

    console.log("paper_setting : ", test);
    console.log("setting : ", setting);
    console.log("test2 : ", test2);
    console.log("test3 : ",test3);
    if(test){
        if(setting){
            if(test2 === "가로"){
                paperDirection();
                $("input:radio[name='direction']:radio[value='세로']").prop("checked",true);
                $("input:radio[name='direction']:radio[value='가로']").prop("checked",false);
            }
        }else{
            paperDirection();
        }
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
            // $(eCopyRatioContent).css('-webkit-transform','scale(' + (ecopyratio) + ')');
            // $(eCopyRatioContent).css('-webkit-transform-origin','0 0');
            // $(eCopyRatioContent).css('-moz-transform','scale(' + (ecopyratio) + ')');
            // $(eCopyRatioContent).css('-moz-transform-origin','0 0');
            // $(eCopyRatioContent).css('-o-transform','scale(' + (ecopyratio) + ')');
            // $(eCopyRatioContent).css('-o-transform-origin','0 0');
            // $(eCopyRatioContent).css('transform','scale('+(ecopyratio)+')');
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