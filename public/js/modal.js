var pagecount_check = true;
var pageprint_check = true;
$(document).ready(function(){
    header_event_setting();
    jiyeons();
});

/******************************************************************
 기능 : 각 기능별 이벤트 시작점.
 만든이 : hagdung-i
 날짜 : 2018 - 08 - 27
 ******************************************************************/
function header_event_setting(){
    /******************************************************************
     기능 : 용지 크기 선택(A4,B4 등) 이벤트, 셀렉트 박스 선택 값에 따라 페이지 리사이징 함수에 전달.
     만든이 : hagdung-i
     날짜 : 2018 - 08 - 27
     ******************************************************************/
    $("#pagesizeoptions").on("change", function () {
        pagesizeselect($(this).val());
    });
    /******************************************************************
     기능 : 용지 방향 선택(가로/세로) 이벤트, 페이지 셋팅함수 호출.
     만든이 : hagdung-i
     날짜 : 2018 - 08 - 27
     ******************************************************************/
    $(".direction").on("change",function () {
        paper_setting();
    });
    /******************************************************************
     기능 : 출력일 인쇄 이벤트
     만든이 : hagdung-i
     날짜 : 2018 - 08 - 27
     ******************************************************************/
    $(".copydate").on("change",function () {
        var print = $('input[id="copydate_id"]:checked').val();
        if(print){
            if(pageprint_check){
                datePrinting();
            }
            pageprint_check = false;
        }else{
            if(pageprint_check !== true) {
                $(".timePage").remove();
            }
            pageprint_check = true;
        }
    });
    /******************************************************************
     기능 : 매수 인쇄 이벤트
     만든이 : hagdung-i
     날짜 : 2018 - 08 - 27
     ******************************************************************/
    $(".copycount").on("change", function () {
        var count = $('input[id="copycount_id"]:checked').val();
       // console.log("count : ",count);
        if(count){
            if(pagecount_check) {
                countPrinting();
            }
            pagecount_check = false;
        }else{
            if(pagecount_check !== true) {
                $(".countPage").remove();
            }
            pagecount_check = true;
        }
    });
    /******************************************************************
     기능 : 머리글 체크 값별 이벤트
     만든이 : hagdung-i
     날짜 : 2018 - 08 - 27
     ******************************************************************/
    $("#extra_header_using_check").on("click", function () {
        extra_header_using_check();
    });
    /******************************************************************
     기능 : 꼬리글 체크 값별 이벤트
     만든이 : hagdung-i
     날짜 : 2018 - 08 - 27
     ******************************************************************/
    $("#extra_tail_using_check").on("click", function () {
        extra_tail_using_check();
    });

    //머리글, 꼬리글 입력 값으로 뿌려주기.
    /******************************************************************
     기능 : 용지 크기 선택(A4,B4 등)
     만든이 : hagdung-i
     날짜 : 2018 - 08 - 27
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
     날짜 : 2018 - 08 - 27
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
 기능 : 각 기능별 이벤트 시작점.
 만든이 : 하지연
 날짜 : 2018 - 09 - 03
 ******************************************************************/
function jiyeons() {
    /******************************************************************
     기능 : 고급인쇄설정 - 결재란 설정 - 결재란 등록 모달창 닫기
     만든이 : 하지연
     ******************************************************************/
    $("#mymodal2").click(function () {
        $("#modalcase").css("display", "block");
    });
    $("#closebtn").click(function () {
        close_pop();
    });
    $("#closebtn3").click(function () {
        close_pop2();
    });
    $("#closebtn4").click(function () {
        close_pop3();
    });
    /******************************************************************
     기능 : 고급인쇄설정 - 결재란 설정 - 결재란 칸수 지정 데이터 유효성 검증
     만든이 : 하지연
     ******************************************************************/
    $("#sign").on('keyup', function () {
        dataValidity2();
    });
    /******************************************************************
     기능 : 1. 고급인쇄설정 - 인쇄배율 input 박스 내에 숫자만 받도록 제어
     2. 고급인쇄설정 - 인쇄배율 input박스 내에 글자입력시 삭제하도록 제어
     3. 고급인쇄설정 - 인쇄배율 input 박스 내에 범위 지정 & 예외처리 & 입력된 배율값 적용
     만든이 : 하지연
     ******************************************************************/
    $("#copyratio").on({
        keydown: function () {
            onlyNumber(event);
        },
        keyup: function () {
            removeChar();
        },
        change: function () {
            copyRatioCheck();
        }
    });
    /******************************************************************
     기능 : 고급인쇄설정 - 폰트설정 - 폰트내용, 폰트 서식 변경 함수
     만든이 : 하지연
     ******************************************************************/
    $(".fontform,.fontcontent").on("change", function () { //고급인쇄 - 폰트설정 - 폰트내용, 폰트서식 변경
        eSetFont();
    });
    /******************************************************************
     기능 : 고급인쇄설정 - 폰트설정 - 금액 기울임꼴 표시 변경 함수
     만든이 : 하지연
     ******************************************************************/
    $("input:checkbox[name='pricetilt']").on("change",function () {
        tiltPrice();
    });
}

/******************************************************************
 기능 : 용지방향 설정 함수.
 만든이 : hagdung-i
 날짜 : 2018 - 08 - 27
 ******************************************************************/
function paper_setting(setting) {
    //용지방향 설정 가로와 세로를 서로 뒤바꿔주는 식의 형태인데, 가로에 해당하는 라디오 박스가 선택 되어 있을 때만 초기화시 세로로 되돌림.
    var checked_check = $('input:radio[name="direction"]').prop("checked");
   // console.log("checked_check : ",checked_check);
    if(setting){    //x 버튼 누르면 초기화
        if(!checked_check){ //x버튼을 눌럿을 때, 체크가 있는 값이 가로이면
        //    console.log("reset");
            paperDirection();
            $("input:radio[name='direction']:radio[value='세로']").prop("checked",true);
            $("input:radio[name='direction']:radio[value='가로']").prop("checked",false);
        }else{ //가로가 아니면
            // paperDirection();
        }
    }else{
       // console.log("not reset");
        paperDirection();
    }
}
/******************************************************************
 기능 : 용지 크기 설정 함수.
 만든이 : hagdung-i
 날짜 : 2018 - 08 - 27
 내용 : 페이지 사이즈별로 px 단위로 설정
 ******************************************************************/
function pagesizeselect(paper) {
    var checked_check = $('input:radio[name="direction"]').prop("checked");
    var pageForCopyRatio = $('.pageforcopyratio');
    if(checked_check){
        if(paper === "Letter"){
            pageForCopyRatio.css('width', 816.3779527559 + 'px');
            pageForCopyRatio.css('height', 1054.488188976 + 'px');
        }else if(paper === "Tabloid"){
            pageForCopyRatio.css('width', 1054.488188976 + 'px');
            pageForCopyRatio.css('height', 1632.755905512 + 'px');
        }else if(paper === "Legal"){
            pageForCopyRatio.css('width', 816.3779527559 + 'px');
            pageForCopyRatio.css('height', 1345.511811024 + 'px');
        }else if(paper === "Statement"){
            pageForCopyRatio.css('width', 529.1338582677 + 'px');
            pageForCopyRatio.css('height', 816.3779527559 + 'px');
        }else if(paper === "Executive"){
            pageForCopyRatio.css('width', 695.4330708661 + 'px');
            pageForCopyRatio.css('height', 1009.133858268 + 'px');
        }else if(paper === "A3"){
            pageForCopyRatio.css('width', 1122.519685039 + 'px');
            pageForCopyRatio.css('height', 1587.401574803 + 'px');
        }else if(paper === "A4"){
            pageForCopyRatio.css('width', 793.7007874016 + 'px');
            pageForCopyRatio.css('height', 1122.519685039 + 'px');
        }else if(paper === "A5"){
            pageForCopyRatio.css('width', 793.7007874016 + 'px');
            pageForCopyRatio.css('height', 559.3700787402 + 'px');
        }else if(paper === "B4 (JIS)"){
            pageForCopyRatio.css('width', 971.3385826772 + 'px');
            pageForCopyRatio.css('height', 1375.748031496 + 'px');
        }else if(paper === "B5 (JIS)"){
            pageForCopyRatio.css('width', 687.874015748 + 'px');
            pageForCopyRatio.css('height', 971.3385826772 + 'px');
        }
    }else{
        if(paper === "Letter"){
            pageForCopyRatio.css('width',  1054.488188976 + 'px');
            pageForCopyRatio.css('height', 816.3779527559 + 'px');
        }else if(paper === "Tabloid"){
            pageForCopyRatio.css('width', 1632.755905512 + 'px');
            pageForCopyRatio.css('height', 1054.488188976 + 'px');
        }else if(paper === "Legal"){
            pageForCopyRatio.css('width', 1345.511811024 + 'px');
            pageForCopyRatio.css('height', 816.3779527559 + 'px');
        }else if(paper === "Statement"){
            pageForCopyRatio.css('width', 816.3779527559 + 'px');
            pageForCopyRatio.css('height', 529.1338582677 + 'px');
        }else if(paper === "Executive"){
            pageForCopyRatio.css('width', 1009.133858268 + 'px');
            pageForCopyRatio.css('height', 695.4330708661 + 'px');
        }else if(paper === "A3"){
            pageForCopyRatio.css('width', 1587.401574803 + 'px');
            pageForCopyRatio.css('height', 1122.519685039 + 'px');
        }else if(paper === "A4"){
            pageForCopyRatio.css('width', 1122.519685039 + 'px');
            pageForCopyRatio.css('height', 793.7007874016 + 'px');
        }else if(paper === "A5"){
            pageForCopyRatio.css('width', 559.3700787402 + 'px');
            pageForCopyRatio.css('height', 793.7007874016 + 'px');
        }else if(paper === "B4 (JIS)"){
            pageForCopyRatio.css('width', 1375.748031496 + 'px');
            pageForCopyRatio.css('height', 971.3385826772 + 'px');
        }else if(paper === "B5 (JIS)"){
            pageForCopyRatio.css('width', 971.3385826772 + 'px');
            pageForCopyRatio.css('height', 687.874015748 + 'px');
        }
    }
}
/******************************************************************
 기능 : 머리글 입력창, 셀렉트박스 함수.
 만든이 : hagdung-i
 날짜 : 2018 - 08 - 27
 내용 : 머리글 체크 확인 및 disabled, readonly 설정을 적용하고 체크시 머리글의 영역 생성하고 그려주는 함수 호출
 ******************************************************************/
function extra_header_using_check() {
    var checked = $("#extra_header_using_check").is(":checked");
    if(checked){
        $("#extraheadoptions").removeAttr("disabled");
        $("#extrahead").removeAttr("disabled").removeAttr("readonly");
        var value = 0.1;
        header_test(value);
    }else{
        $("#extraheadoptions").attr("disabled", true).attr("readonly",false);
        $("#extrahead").attr("disabled", true).attr("readonly",true);
        $(".PageHeader").remove();
    }
}
/******************************************************************
 기능 : 꼬리글 입력창, 셀렉트박스 함수.
 만든이 : hagdung-i
 날짜 : 2018 - 08 - 27
 내용 : 꼬리글 체크 확인 및 disabled, readonly 설정을 적용하고 체크시 꼬리글의 영역 생성하고 그려주는 함수 호출
 ******************************************************************/
function extra_tail_using_check() {
    var checked = $("#extra_tail_using_check").is(":checked");
    if(checked){
        $("#extratailoptions").removeAttr("disabled");
        $("#extratail").removeAttr("disabled").removeAttr("readonly");
        var value = 0.1;
        footer_test(value);
    }else{
        $("#extratailoptions").attr("disabled", true).attr("readonly",false);
        $("#extratail").attr("disabled", true).attr("readonly",true);
        $(".PageFooter").remove();
    }
}
/******************************************************************
 기능 : 용지방향 함수.
 만든이 : hagdung-i
 날짜 : 2018 - 08 - 27
 내용 : 페이지 세로/가로 값을 반전 시키는 함수.
 ******************************************************************/
function paperDirection() {

    $(".pageforcopyratio").each(function (i, e) {
        var temp = e.style.width;
        e.style.width = e.style.height;
        e.style.height = temp;
    });
    $(".forcopyratio").each(function (i, e) {
        var temp = e.style.width;
        //console.log("temp : ",temp);
        e.style.width = e.style.height;
        e.style.height = temp;
    });
    $(".backGroundLayer").each(function (i, e) {
        var temp = e.style.width;
        e.style.width = e.style.height;
        e.style.height = temp;
    });
    $(".designLayer").each(function (i, e) {
      //  console.log("designLayer 돌아감");
        var temp = e.style.width;
        e.style.width = e.style.height;
        e.style.height = temp;
    });
    $(".foreGroundLayer").each(function (i, e) {
       // console.log("designLayer 돌아감");
        var temp = e.style.width;
        e.style.width = e.style.height;
        e.style.height = temp;
    });

    $(".Band").each(function (i, e) {
        e.style.width = "100%";
    });

    // var width = $("#pageForCopyRatio1")[0].style.width;
    // var height = $("#pageForCopyRatio1")[0].style.height;
    // var temp = width;
    // height = width;
    // width = temp;
    // console.log("width : ",width);
    // console.log("height : ",height);
    // console.log("data : ",data);
    // width = height;
    //     e.style.width = e.style.height;
    //     e.style.height = temp;
    // removePage(data, width, height);
}
/******************************************************************
 기능 : 날짜 그리는 함수.
 만든이 : hagdung-i
 날짜 : 2018 - 08 - 27
 내용 : 날짜 데이터를 셋팅하고, 페이지별로 영역을 잡아서 해당 영역에 데이터를 나타내주는 함수.
 ******************************************************************/
function datePrinting() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDay();
    const hour = date.getHours();
    const seconds = date.getSeconds();
    const totaldate = year+"-"+month+"-"+day+" "+hour +":"+seconds;

    $(".visiblePage").each(function (i,e) {
       // console.log(e.id.replace(/[^0-9]/g,""));
        const row_interval = e.style.width.replace(/[^-\.0-9]/g,"")*0.83;
        const col_interval = e.style.height.replace(/[^-\.0-9]/g,"")*0.97;
      //  console.log("row_interval : ",row_interval);
      //   console.log("col_interval : ",col_interval);
      //   console.log("$(\"#page\"+e.id.replace(/[^0-9]/g,\"\")).offset().left :",$("#page"+e.id.replace(/[^0-9]/g,"")).offset().left);
      //   console.log("offset : ",$("#page"+e.id.replace(/[^0-9]/g,"")).offset().top);
        const time_area = document.createElement("div");
        time_area.id = "time_area"+e.id.replace(/[^0-9]/g,"");
        time_area.style.position = "absolute";
        time_area.className = "timePage";
        time_area.style.left = row_interval+"%";
        time_area.style.top = col_interval+"%";
        time_area.style.width = "100px";
        time_area.style.height = "50px";
        time_area.style.zIndex = "999";

        const time = document.createElement("div");
        time.id = "SystemDate"+e.id.replace(/[^0-9]/g,"");
        time.className = "SystemDate";

        const time_tag = document.createElement("input");
        time_tag.id = totaldate;
        time_tag.value = totaldate;
        time_tag.type = "text";
        time_tag.style.backgroundColor = "rgba(255, 255, 255, 0)";
        time_tag.style.border = "none";
        time_tag.readOnly = true;
        time_tag.style.fontSize = "12px";

        document.getElementById("page"+e.id.replace(/[^0-9]/g,"")).appendChild(time_area);
        document.getElementById(time_area.id).appendChild(time);
        document.getElementById(time.id).appendChild(time_tag);
    });
}
/******************************************************************
 기능 : 페이징 그려주는 함수.
 만든이 : hagdung-i
 날짜 : 2018 - 08 - 27
 내용 : 페이지 수 데이터를 셋팅하고, 페이지별로 영역을 잡아서 해당 영역에 데이터를 나타내주는 함수.
 ******************************************************************/
function countPrinting() {

    $(".visiblePage").each(function (i,e) {
     //   console.log(e.id.replace(/[^0-9]/g, ""));
        const col_interval = e.style.width.replace(/[^-\.0-9]/g,"")*0.91;
        const row_interval = e.style.height.replace(/[^-\.0-9]/g,"")*0.97;
        const count_area = document.createElement("div");
        const totalpage = $(".visiblePage").length;
        count_area.id = "countPage" + e.id.replace(/[^0-9]/g, "");
        count_area.className = "countPage";
        count_area.style.position = "absolute";
        count_area.style.left = col_interval+"%";
        count_area.style.top = row_interval+"%";
        count_area.style.width = "100px";
        count_area.style.height = "50px";
        count_area.style.zIndex = "999";

        const count_Packing = document.createElement("div");
        count_Packing.id = "countData" + e.id.replace(/[^0-9]/g, "");
        count_Packing.className = "countData";

        const count_tag = document.createElement("input");
        count_tag.id = "count_tag" + e.id.replace(/[^0-9]/g, "");
        count_tag.value = e.id.replace(/[^0-9]/g, "") + "/" + totalpage;
        count_tag.type = "text";
        count_tag.style.backgroundColor = "rgba(255, 255, 255, 0)";
        count_tag.style.border = "none";
        count_tag.readOnly = true;
        count_tag.style.fontSize = "12px";

        document.getElementById("page" + e.id.replace(/[^0-9]/g, "")).appendChild(count_area);
        document.getElementById(count_area.id).appendChild(count_Packing);
        document.getElementById(count_Packing.id).appendChild(count_tag);
    });
}
/******************************************************************
 기능 : 머리글 그리는 함수.
 만든이 : hagdung-i
 날짜 : 2018 - 08 - 27
 내용 : 페이지 좌표를 계산해서 머리글 영역을 잡고, 그려주는 함수.
 ******************************************************************/
function header_test(value, input_value) {
    var all_page = $(".page");
    var header_pos = $('#extraheadoptions').val();

    all_page.each(function (i,e) {
        var not_input;
        var display_none_chk = (all_page.eq(i).parents('.pageforcopyratio').css('display') === 'none');
        if (input_value != undefined) { //input 창에 입력이 없을 경우엔 빈칸으로 설정.
            not_input = input_value;
        } else {
            not_input = " ";
        }
        // 페이지 좌표 계산.
        // const row_interval = e.style.width.replace(/[^-\.0-9]/g,"")*value;
        const col_interval = e.style.height.replace(/[^-\.0-9]/g,"")*0.01;
        //영역 잡고, 그려줌.
        const PageHeader = document.createElement("div");
        PageHeader.id = "PageHeader" + (i + 1);
        PageHeader.className = "PageHeader";
        PageHeader.style.zIndex = "999";

        const header_Packing = document.createElement("div");
        header_Packing.id = "headerData" + (i + 1);
        header_Packing.className = "headerData";

        const header_tag = document.createElement("span");
        header_tag.id = "header_tag" + (i + 1);
        header_tag.innerText = not_input;
        header_tag.style.backgroundColor = "rgba(255, 255, 255, 0)";
        header_tag.style.border = "none";
        header_tag.style.fontSize = "12px";

        all_page.eq(i).append(PageHeader);
        document.getElementById(PageHeader.id).appendChild(header_Packing);
        document.getElementById(header_Packing.id).appendChild(header_tag);
        PageHeader.style.position = "absolute";

        $('#temp_header').html($('#PageHeader' + (i + 1)).clone());

        if (header_pos == '상단좌측') {
            PageHeader.style.left =
                (stringToNumberByPx(all_page.eq(i).children('.designLayer').css('margin-left')) !== 0) ?
                    all_page.eq(i).children('.designLayer').css('margin-left') : '40px';
        } else if (header_pos == '상단우측') {
            PageHeader.style.right =
                (stringToNumberByPx(all_page.eq(i).children('.designLayer').css('margin-right')) !== 0) ?
                    all_page.eq(i).children('.designLayer').css('margin-right') : '40px';
        } else if (header_pos == '상단중앙') {
            if (display_none_chk) {
                all_page.eq(i).parents('.pageforcopyratio').css('display', 'block');
            }
            PageHeader.style.left =
                (stringToNumberByPx(all_page.eq(i).css('width')) / 2)
                - (stringToNumberByPx($('#temp_header').children('.PageHeader').css('width')) / 2) + 'px';
            if (display_none_chk) {
                all_page.eq(i).parents('.pageforcopyratio').css('display', 'none');
            }
        }

        // top 좌표

        if(stringToNumberByPx(all_page.eq(i).children('.designLayer').css('margin-top')) >= 21) {
            PageHeader.style.top =
                stringToNumberByPx(all_page.eq(i).children('.designLayer').css('margin-top')) - 21 + 'px';
        } else{
            PageHeader.style.top = col_interval+"%";
        }

        $('#temp_header').empty();
    });
}
/******************************************************************
 기능 : 머리글 영역 변경 함수
 만든이 : hagdung-i
 날짜 : 2018 - 08 - 27
 내용 : 머리글 셀렉트 박스를 통해 입력 받는 값에 따라 머리글 영역의 좌표를 변경해주는 함수.
 ******************************************************************/
function header_location(input_value){
    if($("#extraheadoptions").val() ==="상단좌측"){
        var value = 0.1;
        if($(".PageHeader").length != 0){
            $(".PageHeader").remove();
            header_test(value, input_value);
        }else{
            header_test(value, input_value);
        }
    }else if($("#extraheadoptions").val() ==="상단중앙"){
        var value = 0.5;
        if($(".PageHeader").length != 0){
            $(".PageHeader").remove();
            header_test(value, input_value);
        }else{
            header_test(value, input_value);
        }
    }else if($("#extraheadoptions").val() ==="상단우측"){
        var value = 0.9;
        if($(".PageHeader").length != 0){
            $(".PageHeader").remove();
            header_test(value, input_value);
        }else{
            header_test(value, input_value);
        }
    }
}
/******************************************************************
 기능 : 꼬리글 그리는 함수.
 만든이 : hagdung-i
 날짜 : 2018 - 08 - 27
 내용 : 페이지 좌표를 계산해서 꼬리글 영역을 잡고, 그려주는 함수.
 ******************************************************************/
function footer_test(value, input_value) {
    var not_input;
    var all_page = $(".page");
    var footer_pos = $('#extratailoptions').val();

    if(input_value != undefined){
        not_input = input_value;
    }else{
        not_input = " ";
    }

    all_page.each(function (i,e) {
        var display_none_chk = (all_page.eq(i).parents('.pageforcopyratio').css('display') === 'none');
        // 페이지 좌표 계산.
        // const row_interval = e.style.width.replace(/[^-\.0-9]/g,"")*value;
        const col_interval = e.style.height.replace(/[^-\.0-9]/g,"")*0.97;
        ;
        //영역 잡고, 그려줌.
        const PageFooter = document.createElement("div");
        PageFooter.id = "PageFooter" + (i+1);
        PageFooter.className = "PageFooter";
        PageFooter.style.position = "absolute";
        PageFooter.style.zIndex = "999";

        const footer_Packing = document.createElement("div");
        footer_Packing.id = "FooterData" + (i+1);
        footer_Packing.className = "FooterData";

        const footer_tag = document.createElement("span");
        footer_tag.id = "footer_tag" + (i+1);
        footer_tag.innerText = not_input;
        footer_tag.style.backgroundColor = "rgba(255, 255, 255, 0)";
        footer_tag.style.border = "none";
        footer_tag.style.fontSize = "12px";

        all_page.eq(i).append(PageFooter);
        document.getElementById(PageFooter.id).appendChild(footer_Packing);
        document.getElementById(footer_Packing.id).appendChild(footer_tag);

        $('#temp_footer').html($('#PageFooter' + (i + 1)).clone());
        PageFooter.style.position = 'absolute';

        if(footer_pos === '하단좌측'){
            PageFooter.style.left =
                (stringToNumberByPx(all_page.eq(i).children('.designLayer').css('margin-left')) !== 0) ?
                    all_page.eq(i).children('.designLayer').css('margin-left') : '40px';
        } else if(footer_pos === '하단우측'){
            PageFooter.style.right =
                (stringToNumberByPx(all_page.eq(i).children('.designLayer').css('margin-right')) !== 0) ?
                    all_page.eq(i).children('.designLayer').css('margin-right') : '40px';
        } else if(footer_pos === '하단중앙'){
            if (display_none_chk) {
                all_page.eq(i).parents('.pageforcopyratio').css('display', 'block');
            }
            PageFooter.style.left =
                (stringToNumberByPx(all_page.eq(i).css('width')) / 2)
                - (stringToNumberByPx($('#temp_footer').children('.PageFooter').css('width')) / 2) + 'px';
            if (display_none_chk) {
                all_page.eq(i).parents('.pageforcopyratio').css('display', 'none');
            }
        }

        // top 위치 세팅
        if(stringToNumberByPx(all_page.eq(i).children('.designLayer').css('margin-bottom')) >= 21) {
            PageFooter.style.top =
                (
                    stringToNumberByPx(all_page.eq(i).children('.designLayer').css('margin-top')) +
                    stringToNumberByPx(all_page.eq(i).children('.designLayer').css('height'))
                ) + 'px';
                all_page.eq(i).children('.designLayer').css('height');
                    // stringToNumberByPx(all_page.eq(i).children('.designLayer').css('margin-top')) - 21 + 'px';
        } else{
            PageFooter.style.top = col_interval+"%";
        }
       $('#temp_footer').empty();
    });
}
/******************************************************************
 기능 : 꼬리글 영역 변경 함수
 만든이 : hagdung-i
 날짜 : 2018 - 08 - 27
 내용 : 꼬리글 셀렉트 박스를 통해 입력 받는 값에 따라 꼬리글 영역의 좌표를 변경해주는 함수.
 ******************************************************************/
function footer_location(input_value){
    if($("#extratailoptions").val() ==="하단좌측"){
        var value = 0.1;
        if($(".PageFooter").length != 0){
            $(".PageFooter").remove();
            footer_test(value, input_value);
        }else{
            footer_test(value, input_value);
        }
    }else if($("#extratailoptions").val() ==="하단중앙"){
        var value = 0.5;
        if($(".PageFooter").length != 0){
            $(".PageFooter").remove();
            footer_test(value, input_value);
        }else{
            footer_test(value, input_value);
        }
    }else if($("#extratailoptions").val() ==="하단우측"){
        var value = 0.9;
        if($(".PageFooter").length != 0){
            $(".PageFooter").remove();
            footer_test(value, input_value);
        }else{
            footer_test(value, input_value);
        }
    }
}
/******************************************************************
 기능 : 고급인쇄 -  결재란 칸수 지정 데이터 유효성 검증
 만든이 : 하지연
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
       // console.log(e.message);
    }
}
/******************************************************************
 기능 : 고급인쇄설정 - 결재란 설정 - 결재란 등록 모달창 - 결재란 칸수 지정시
        결재라인 css 자동 변경 함수
 author : 하지연
 ******************************************************************/
function changeColor(tds){
    tds = parseInt(tds);
    tds = tds-1;
    $(".modaltd").each(function (i, e) {
       // console.log(e.id);
        var tdid = e.id.replace(/[^0-9]/g, "");
       // console.log(tdid);
        if (tds >= tdid) {
            $("table#modaltable tr:eq(0) td:eq(" + tdid + ")").css("background-color", "white");
            $("table#modaltable tr:eq(1) td:eq(" + tdid + ")").css("background-color", "#E6E6FA");
        } else {
            $("table#modaltable tr:eq(0) td:eq(" + tdid + ")").css("background-color", "#E3E3E3");
            $("table#modaltable tr:eq(1) td:eq(" + tdid + ")").css("background-color", "#E3E3E3");
        }
    });
}
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
            var idnum = e.id.replace(/[^0-9]/g,'');

            eCopyRatio(eCopyRate, idnum);//인쇄배율 변경 펑션
        });
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
      //  console.log(e.message);
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
 기능 : 고급인쇄설정 - 인쇄설정 - 인쇄배율 기능에서 input 태그 내에
        숫자만 허용하게 했으며, 숫자 외 다른 키가 눌렸을 경우 공백으로
        대체하는 함수
 만든이 : 하지연
 ******************************************************************/
function removeChar(event) {
    event = event || window.event;
    var keyID = (event.which) ? event.which : event.keyCode;
    if ( keyID == 8 || keyID == 46 || keyID == 37 || keyID == 39 ){
        $("#warning").text("");
        return true;
    } else{
        event.target.value = event.target.value.replace(/[^0-9]/g, "");
    }
}
/******************************************************************
 기능 : 고급인쇄 - 금액 기울임꼴표시 변경 함수
 만든이 : 하지연
 ******************************************************************/
function tiltPrice(){
    if ($("input:checkbox[name='pricetilt']").prop("checked")) {
        $('.MoneySosu').css('font-style', 'italic');
    } else {
        $('.MoneySosu').css('font-style', 'normal');
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
