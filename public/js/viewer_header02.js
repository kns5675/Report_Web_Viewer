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
 최종 작성일 : 2018.08.31
 ******************************************************************/
function tableChoice() {

    var modalLayer = $("#modalTableChoice");

    // '항목선택' 버튼 클릭시
    $("#tableChoice").on("click" ,function () {
        modalLayer.show();

        var all_table = $('.table');
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

        unique_table_class_arr = temp_table_arr.reduce(function(a,b){if(a.indexOf(b)<0)a.push(b);return a;},[]);

        // 항목선택의 표 리스트 세팅
        unique_table_class_arr.forEach(function(c, index){
            li_list_str += "<li id='table_choice_li" + (index+1) + "' class='tableChoice_li'>표-" + (index+1) + "</li>";
        });
        $('#leftpart_modalTableChoice_header').html(li_list_str);
        // 1. 표 리스트 세팅 완료

        // 2. table 중 display/none 상태인 것들을 변수로 세팅
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
            $(this).addClass('selected_table');

            selected_table_index = $('#leftpart_modalTableChoice_header > li').index(this);
            var labelList = $('#labelListUl');
            labelList.html("");

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
            $('.table_choice_th_checkBox').on('change, click', function(){
                var selected_chkbox = $('.table_choice_th_checkBox').index(this);
                table_choice_bool_list[selected_table_index][selected_chkbox]
                    = $(this).prop('checked');
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

        // 모달창 뜨면 표1 클릭 이벤트 강제 발생
        $('#leftpart_modalTableChoice_header > li').eq(0).trigger('click');
    });

    /*************************************************************
     * 기능 : 닫기(X) 클릭시  모달창 사라짐
     * 만든이 : 전형준
     *************************************************************/
    $("#closebtn_modalTableChoice").click(function(){
        modalLayer.hide();
    });

    /*************************************************************
     * 기능 : '위로' 버튼 클릭시 현재 선택한 column의 자리를 바꾸고,
     *        변수 위치도 변환
     * 만든이 : 전형준
     *************************************************************/
    $("#tableChoice_up").click(function () {
        var selected_th = $('.selected_th');
        var prev_th = selected_th.prev();
        var temp_str;
        var temp_index;
        if(selected_th.length > 0 && $('#labelListUl > li').index(selected_th) > 0) {
            temp_str = prev_th.find('label').text();
            temp_index = index_arr[selected_table_index][$('#labelListUl > li').index(prev_th)];
            prev_th.find('label').text(selected_th.find('label').text());
            index_arr[selected_table_index][$('#labelListUl > li').index(prev_th)]
                = index_arr[selected_table_index][$('#labelListUl > li').index(selected_th)];
            selected_th.find('label').text(temp_str);
            index_arr[selected_table_index][$('#labelListUl > li').index(selected_th)] = temp_index;
            selected_th.removeClass('selected_th');
            prev_th.addClass('selected_th');
        }
    });

    /*************************************************************
     * 기능 : '아래로' 버튼 클릭시 현재 선택한 column의 자리를 바꿈,
     *        변수 위치도 변환
     * 만든이 : 전형준
     *************************************************************/
    $("#tableChoice_down").click(function(){
        var selected_th = $('.selected_th');
        var next_th = selected_th.next();
        var temp_str;
        var temp_index;
        if(selected_th.length > 0 && $('#labelListUl > li').index(selected_th) < $('#labelListUl > li').length-1) {
            temp_str = next_th.find('label').text();
            temp_index = index_arr[selected_table_index][$('#labelListUl > li').index(next_th)];
            next_th.find('label').text(selected_th.find('label').text());
            index_arr[selected_table_index][$('#labelListUl > li').index(next_th)]
                = index_arr[selected_table_index][$('#labelListUl > li').index(selected_th)];
            selected_th.find('label').text(temp_str);
            index_arr[selected_table_index][$('#labelListUl > li').index(selected_th)] = temp_index;
            selected_th.removeClass('selected_th');
            next_th.addClass('selected_th');
        }
    });

    /***********************************************
     * 기능 : '확인' 버튼 클릭시 지금 설정을 적용함
     * 만든이 : 전형준
     ***********************************************/
    $("#tableChoice_done").click(function(){

        // 항목선택에서 지정한대로 순서를 바꿈(현재 무조건 실행됨)
        unique_table_class_arr.forEach(function(table_class_name, table_class_index){ // 클래스만큼 반복
            var table_arr = $('.' + table_class_name);

            Array.prototype.forEach.call(table_arr, function(one_table, one_table_index){ // 테이블 개수 만큼 반복
                var tr_arr = $(one_table).find('tr');

                Array.prototype.forEach.call(tr_arr, function(tr, tr_index){
                    var td_arr = $(tr).children();
                    $(one_table).append($(tr).clone());
                    var temp_table_tr = $(one_table).children().last();

                    Array.prototype.forEach.call(td_arr, function(td, td_index){
                        $(td).html(
                            $(temp_table_tr).children().eq(index_arr[table_class_index][td_index]).html()
                        );
                    });

                    $(temp_table_tr).remove();
                });
                // for(var j=0; j<one_table.length; j++){ // tr 개수 만큼 반복
                //     var td_arr = one_table.eq(j).children();
                //     var temp_table_tr = tr_arr.eq(tr_arr.length-1).next();
                //     console.log(temp_table_tr);
                //     // console.log(td_arr.length);
                //     for(var k=0; k<td_arr.length; k++){ // td 개수 만큼 반복
                //         // console.log(index_arr[table_class_index][k]);
                //         console.log(temp_table_tr.children().eq(index_arr[table_class_index][k]));
                //         // td_arr.eq(k).replaceAll(temp_table_tr.children().eq(index_arr[table_class_index][k]));
                //     }
                // }
                // temp_table_tr.remove();
            });
            // for(var i=0; i<table_arr.length; i++){ // 테이블 개수 만큼 반복
            //     var one_table = table_arr.eq(i).find('tr');
                // table_arr.eq(i).append(tr_arr.clone());
                // temp_table_tr.css('display', 'none');


            // }
        });

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

        $('#labelListUl > li').removeClass('selected_th');
        modalLayer.fadeOut("slow");
    });
}