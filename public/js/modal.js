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
        try{
            var tds = this.value;
            if(tds>0 && tds<=8){
                changeColor(tds);
            }else{
                alert("결재란 칸 수는 1 이상 8 이하여야 합니다.");
                this.value="";
            }
        }catch(e){
            console.log(e.message);
        }
    });
});
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
        $("#copyratio").focus();
        $("#warning").text("인쇄배율의 범위는 0~100 입니다.");
        return false;
    }else{
        var eCopyRate = $("#copyratio").val();
        eCopyRate = (Number(eCopyRate))/100;

        $(".page").each(function (i, e) {
           console.log("e : ", e.id);
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
 기능 : 고급인쇄설정 - 폰트설정 - 폰트서식, 폰트내용 폰트 변경 기능
 author : 하지연
 ******************************************************************/
function eSetFont(data){
    var checkedFontForm = $("input[type=radio][name=fontform]:checked").val();
    console.log("폰트 서식 선택된 폰트 : " + checkedFontForm);

    var checkedFontContent = $("input[type=radio][name=fontcontent]:checked").val();
    console.log("폰트 내용 선택된 폰트 : " + checkedFontContent);


    /*var systemLabelId = $('#SystemLabel' + systemLabelNum);

    systemLabelId.css({
        'width': data.rectangle.width,
        'height': data.rectangle.height,
        'position': 'absolute',
        'left': data.rectangle.x + 'px',
        'top': data.rectangle.y + 'px',
        'text-align': 'center',
        'border': '1px solid black'
    });*/


    /*if(data.DataType === DataLabel){
        ch
    }*/

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