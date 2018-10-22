var unique_table_class_arr;
var table_choice_bool_list;
var table_choice_th_list;
var index_arr;
var selected_table_index = 0;

$(document).ready(function(){
    $("#mymodal2").click(function(){
        $("#modalcase").css("display","block");
    });
    $("#closebtn").click(function(){
        $('#modalTableChoice').hide();//고급인쇄 모달창 닫기
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
});

/******************************************************************
 기능 : 항목선택 기능 구현
 만든이 : 구영준 & 전형준
 최종 작성일 : 2018.09.05
 ******************************************************************/
function tableChoice() {

    var modalLayer = $("#modalTableChoice");

    // '항목선택' 버튼 클릭시
    $("#tableChoice").on("click" ,function () {
        modalLayer.show();

        var all_table = $('.dynamicTable');
        var temp_table_arr = new Array();
        var li_list_str = "";

        // 유니크한 테이블 class를 받아옴
        for(var i=0; i<all_table.length; i++){
            var element_classes = all_table.eq(i).attr('class').split(' ');
            for(var j=0; j<element_classes.length; j++){
                if(element_classes[j].substring(0, 5) === "table" && element_classes[j].length === 10)
                    temp_table_arr.push(element_classes[j]);
            }
         }
        
         // 중복 제거
        unique_table_class_arr = temp_table_arr.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);

        // 항목선택의 표 리스트 세팅
        unique_table_class_arr.forEach(function(c, index){
            li_list_str += "<li id='table_choice_li" + (index+1) + "' class='tableChoice_li'>표-" + (index+1) + "</li>";
            // li_list_str += "<li id='table_choice_li" + (index+1) + "' class='tableChoice_li'>표-" + (index+1) + "</li>";
            // li_list_str += "<li id='table_choice_li" + (index+1) + "' class='tableChoice_li'>표-" + (index+1) + "</li>";
            // li_list_str += "<li id='table_choice_li" + (index+1) + "' class='tableChoice_li'>표-" + (index+1) + "</li>";
            // li_list_str += "<li id='table_choice_li" + (index+1) + "' class='tableChoice_li'>표-" + (index+1) + "</li>";
        });
        $('#leftpart_modalTableChoice_header').html(li_list_str);
        if(stringToNumberByPx($('#leftpart_modalTableChoice_header').css('height')) > 21){
            $('#leftpart_modalTableChoice_header').css({
                'height' : '44px',
            });
            $('#rightpart_modalTableChoice').css('margin', '78px 18px 0px 0px');
        }

        // 1. 표 리스트 세팅 완료

        // 2.
        // - table 중 display/none 상태인 것들을 변수로 세팅(table_choice_bool_list)
        // - table 중 컬럼의 위치를 세팅(table_choice_th_list)
        // - talbe 중 인덱스 위치를 세팅(index_arr)
        table_choice_bool_list = new Array();
        table_choice_th_list = new Array();
        index_arr = new Array();

        for(var i=0; i<unique_table_class_arr.length; i++){
            var temp_arr = new Array();
            var temp_arr2 = new Array();
            var temp_arr3 = new Array();
            var table_first_tr_child = $('.' + unique_table_class_arr[i]).eq(0).find('tr').eq(0).children();
            for(var j=0; j<table_first_tr_child.length; j++){
                temp_arr.push(table_first_tr_child.eq(j).css('display') !== 'none' ? true : false);
                temp_arr2.push(table_first_tr_child.eq(j).text());
                temp_arr3.push(j);
            }
            table_choice_bool_list.push(temp_arr);
            table_choice_th_list.push(temp_arr2);
            index_arr.push(temp_arr3);
        }


        // 3. 위의 변수를 기반으로 체크박스 표시
        $('#leftpart_modalTableChoice_header > li').on('click', function(){
            $('#leftpart_modalTableChoice_header > li').removeClass('selected_table');

            selected_table_index = $('#leftpart_modalTableChoice_header > li').index(this);
            var labelList = $('#labelListUl');
            labelList.empty();

            for(var i=0; i< table_choice_th_list[selected_table_index].length; i++){
               labelList.append(
                   "<li>" +
                        "<input type='checkbox' id='tableChoice_checkBox" + i + "'/>" +
                            "<label for='tableChoice_checkBox" + i + "'>" +
                                table_choice_th_list[selected_table_index][i] +
                            "</label>" +
                   "</li>"
               );
               $('#tableChoice_checkBox' + i).addClass('table_choice_th_checkBox');
                // 이미 보여지고 있지 않은 column은 체크 해제 상태
                $('#tableChoice_checkBox' + i).prop(
                    'checked', table_choice_bool_list[selected_table_index][i]
                );
            }
            
            // 체크박스 클릭시 table_choice_bool_list 값을 바꿔 다른 탭에 갔다와도 변경값을 유지
            $('.table_choice_th_checkBox').on('change, click', function(event){
                var selected_chkbox = $('.table_choice_th_checkBox').index(this);
                table_choice_bool_list[selected_table_index][selected_chkbox]
                    = $(this).prop('checked');
                event.stopPropagation(); // 라벨&체크박스 클릭시 부모li 클릭되는 것 방지
            });

            // 컬럼 li 클릭시 클래스 추가/삭제
            $('#labelListUl > li').on('click', function(){
                if($(this).hasClass('selected_th')){
                    $('#labelListUl > li').removeClass('selected_th');
                } else{
                    $('#labelListUl > li:not(ind)').removeClass('selected_th');
                    $(this).addClass('selected_th');
                }
            });

            // 라벨&체크박스 클릭시 부모li 클릭되는 것 방지
            $('#labelListUl > li > label').on('click', function(event){
                event.stopPropagation();
            });
        });

        // 모달창 뜨면 첫번째 표 클릭 이벤트 강제 발생
        $('#leftpart_modalTableChoice_header > li').eq(0).trigger('click');
    });

    /*************************************************************
     * 기능 : 닫기(X) 클릭시  모달창 사라짐
     *************************************************************/
    $("#closebtn_modalTableChoice").click(function(){
        modalLayer.hide();
    });


    /******************************************************************
     * 기능 : '위로' 버튼 클릭시 현재 선택한 column의 자리를 바꾸고,
     *        변수 위치도 변환
     * 만든이 : 전형준
     ******************************************************************/
    $("#tableChoice_up").click(function () {
        var selected_th = $('.selected_th');
        var prev_th = selected_th.prev();
        var temp_val;
        if(selected_th.length > 0 && $('#labelListUl > li').index(selected_th) > 0) {

            // index 설정
            temp_val = index_arr[selected_table_index][$('#labelListUl > li').index(prev_th)];
            index_arr[selected_table_index][$('#labelListUl > li').index(prev_th)]
                = index_arr[selected_table_index][$('#labelListUl > li').index(selected_th)];
            index_arr[selected_table_index][$('#labelListUl > li').index(selected_th)] = temp_val;

            // 컬럼 이름 위치를 현재 보이는 위치와 같게 설정
            temp_val =
                table_choice_th_list[selected_table_index][$('#labelListUl > li').index(selected_th)];
            table_choice_th_list[selected_table_index][$('#labelListUl > li').index(selected_th)] =
                table_choice_th_list[selected_table_index][$('#labelListUl > li').index(selected_th)-1];
            table_choice_th_list[selected_table_index][$('#labelListUl > li').index(selected_th)-1] =
                temp_val;

            // 컬럼의 display값(true, false)를 현재 보이는 값과 같게 설정
            temp_val =
                table_choice_bool_list[selected_table_index][$('#labelListUl > li').index(selected_th)];
            table_choice_bool_list[selected_table_index][$('#labelListUl > li').index(selected_th)]
                = table_choice_bool_list[selected_table_index][$('#labelListUl > li').index(selected_th)-1];
            table_choice_bool_list[selected_table_index][$('#labelListUl > li').index(selected_th)-1]
                = temp_val;

            // 설정한 값과 같이 뿌려줌
            for(var i=0; i<$('#labelListUl > li').length; i++){
                $('#labelListUl > li > input[type="checkbox"]').eq(i).prop('checked', table_choice_bool_list[selected_table_index][i]);
                $('#labelListUl > li > label').eq(i).text(table_choice_th_list[selected_table_index][i]);
            }

            selected_th.removeClass('selected_th'); // '위로'를 클릭했으니 현재 컬럼의 클래스 제거
            prev_th.addClass('selected_th'); // 이전 컬럼에 클래스 추가

        }
    });

    /******************************************************************
     * 기능 : '아래로' 버튼 클릭시 현재 선택한 column의 자리를 바꿈
     * 만든이 : 전형준
     ******************************************************************/
    $("#tableChoice_down").click(function(){
        var selected_th = $('.selected_th');
        var next_th = selected_th.next();
        var temp_val;

        if(selected_th.length > 0 && $('#labelListUl > li').index(selected_th) < $('#labelListUl > li').length-1) {
            // index 설정
            temp_val = index_arr[selected_table_index][$('#labelListUl > li').index(next_th)];
            index_arr[selected_table_index][$('#labelListUl > li').index(next_th)]
                = index_arr[selected_table_index][$('#labelListUl > li').index(selected_th)];
            index_arr[selected_table_index][$('#labelListUl > li').index(selected_th)] = temp_val;

            // 컬럼 이름 위치를 현재 보이는 위치와 같게 설정
            temp_val =
                table_choice_th_list[selected_table_index][$('#labelListUl > li').index(selected_th)];
            table_choice_th_list[selected_table_index][$('#labelListUl > li').index(selected_th)] =
                table_choice_th_list[selected_table_index][$('#labelListUl > li').index(selected_th)+1];
            table_choice_th_list[selected_table_index][$('#labelListUl > li').index(selected_th)+1] =
                temp_val;

            // 컬럼의 display값(true, false)를 현재 보이는 값과 같게 설정
            temp_val =
                table_choice_bool_list[selected_table_index][$('#labelListUl > li').index(selected_th)];
            table_choice_bool_list[selected_table_index][$('#labelListUl > li').index(selected_th)]
                = table_choice_bool_list[selected_table_index][$('#labelListUl > li').index(selected_th)+1];
            table_choice_bool_list[selected_table_index][$('#labelListUl > li').index(selected_th)+1]
                = temp_val;

            // 설정한 값과 같이 뿌려줌
            for(var i=0; i<$('#labelListUl > li').length; i++){
                $('#labelListUl > li > input[type="checkbox"]').eq(i).prop('checked', table_choice_bool_list[selected_table_index][i]);
                $('#labelListUl > li > label').eq(i).text(table_choice_th_list[selected_table_index][i]);
            }

            selected_th.removeClass('selected_th'); // '아래로'를 클릭했으니 현재 컬럼의 클래스 제거
            next_th.addClass('selected_th'); // 다음 컬럼에 클래스 추가

        }
    });

    /***********************************************
     * 기능 : '확인' 버튼 클릭시 지금 설정을 적용함
     * 만든이 : 전형준
     ***********************************************/
    $("#tableChoice_done").click(function(){

        /****************************** 컬럼 자리 변경 ******************************/
        unique_table_class_arr.forEach(function(table_class_name, table_class_index){ // 클래스만큼 반복
            var table_arr = $('.' + table_class_name);

            // 유사 배열은 배열 메소드를 사용할 수 없으므로 call을 이용하여 사용
            Array.prototype.forEach.call(table_arr, function(one_table, one_table_index){ // 테이블 개수 만큼 반복
                var tr_arr = $(one_table).find('tr');

                Array.prototype.forEach.call(tr_arr, function(tr, tr_index){ // tr 개수 만큼 반복
                    var td_arr = $(tr).children();
                    $(one_table).append($(tr).clone());
                    // 임시 tr을 테이블 끝에 만듦
                    var temp_table_tr = $(one_table).children().last();

                    Array.prototype.forEach.call(td_arr, function(td, td_index){ // td 개수 만큼 반복
                        // 임시 tr의 td를 바꾼 순서에 맞게 원래 tr에 하나씩 넣음
                        $(td).html(
                            $(temp_table_tr).children().eq(index_arr[table_class_index][td_index]).html()
                        );
                    });
                    $(temp_table_tr).remove(); // 임시 tr 삭제
                });
            });
        });
        /****************************** 컬럼 자리 변경 완료 ******************************/


        /****************************** 컬럼 display 여부 ******************************/
        // table_choice_bool_list 변수 값에 따라 display / none 시켜줌
        unique_table_class_arr.forEach(function(table_class_name, index){
            var tr_arr = $('.' + table_class_name).find('tr');

            for(var i=0; i < tr_arr.length; i++){
                var td_arr = tr_arr.eq(i).children();
                for(var j=0; j<td_arr.length; j++) {
                    td_arr.eq(j).css('display',
                        table_choice_bool_list[index][j] === true ? 'table-cell' : 'none');
                }
            }
        });
        /****************************** 컬럼 display 여부 완료 ******************************/

        $('#labelListUl > li').removeClass('selected_th'); // 사용한 클래스 제거
        resize_event_reSetting();
        modalLayer.fadeOut("slow"); // 창 닫기
    });
}

/************************************
 * 기능 : '리포트 선택' 기능 구현
 * 만든이 : 전형준
 ************************************/
function report_choice(){
    var modalLayer = $('#modalReportChoice');
    var reportListUl = $('#reportListUl');
    $('#reportChoice').on('click', function(){
        modalLayer.show(); // 모달창 띄우기

        // 서브리포트? 인지 등 처리해줄 것
        if(reportNum === reportTemplate.reportList.length){
            reportListUl.empty();
            drawChkBox_N_ReportList(reportListUl);
            getDisplayReportList();
        }
    });

    /************************************
     * 기능 : 'X'버튼 클릭시 화면 닫기
     * 만든이 : 전형준
     ************************************/
    $('#closebtn_modalReportChoice').on('click', function(){
       modalLayer.hide();
    });

    /****************************************************
     * 기능 : '확인'버튼 클릭시 체크한 리포트만 보여줌
     * 만든이 : 전형준
     ****************************************************/
    $('#reportChoice_done').on('click', function(){
        var chkbox_arr = $('.report_display_chk');
        var report_specific;

        for(var i=0; i<chkbox_arr.length; i++){
            report_specific = $('.report' + (i+1));
            report_specific.find('.page').removeClass('visiblePage');
            if(chkbox_arr.eq(i).prop('checked') === true) {
                report_specific.css('display', 'block');
                report_specific.find('.page').addClass('visiblePage');
            }
            else{
                report_specific.css('display', 'none');
            }
        }
        reNumbering();
        modalLayer.hide();
    });
}

/****************************************************
 * 기능 : '리포트 선택' 기능에서,
 *         모달창에 리포트 리스트와 그에 대한 체크박스를 그림
 * 만든이 : 전형준
 ****************************************************/
function drawChkBox_N_ReportList(reportListUl){
    for(var i=0; i<reportTemplate.reportList.length; i++){
        reportListUl.append(
            "<li>" +
                "<input type='checkbox' id='report_display_chk" + i + "' class='report_display_chk'/>" +
                "<label for='report_display_chk" + i + "'>" +
                    "Report" + (i+1) + "[" + reportTemplate.reportList[i].name + "]" +
                "</label>" +
            "</li>"
        );
    }
}

/****************************************************
 * 기능 : '리포트 선택' 기능에서 현재 보여지고 있는
 *        리포트를 체크표시로 둠
 * 만든이 : 전형준
 ****************************************************/
function getDisplayReportList(){
    var chkbox_arr = $('.report_display_chk');
    for(var i=0; i<reportTemplate.reportList.length; i++){
        if($('.report' + (i+1)).eq(0).css('display') !== 'none'){
            chkbox_arr.eq(i).prop('checked', 'checked');
        }
    }
}
