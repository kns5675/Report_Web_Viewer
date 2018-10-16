/******************************************************************
 기능 : 각각의 형태의 Label id와 데이터를 받아서 lock이 걸려있는 라벨을 제외한 라벨들의 위치 이동, 크기 조정 기능 추가.
 Date : 2018-08-24
 만든이 : hagdung-i
 ******************************************************************/
function Lock_check(data, Label_id, div) { //라벨 데이터, 드래그 리사이즈 영역(p의 div), 벗어나면 안되는 영역(밴드)
    var editable = data.editable;
    if (editable !== 'false') { // 편집이 가능할 때 editable !== 'false'
        Label_id.addClass("Editable");
        if (!data.lock) {
            if (div[0]) { //예외처리 수정.
                Label_id.draggable({
                    containment: "#" + div[0].id,
                    zIndex: 999,
                    drag: function( event, ui ) {
                        data.rectangle.x = ui.position.top;
                        data.rectangle.y = ui.position.left;
                        label_data_update(data);
                    }
                });
                Label_id.resizable({
                    containment: "#" + div[0].id,
                    autoHide: true,
                    resize: function (event, ui) {
                        var width = ui.size.width;
                        data.rectangle.width = ui.size.width;
                        data.rectangle.height = ui.size.height;
                        label_data_update(data);
                    }
                });
            }
        } else {
            Label_id.addClass('Lock');
        }
    } else {
        Label_id.addClass('nEdit');
    }
}
/******************************************************************
 기능 : 파일 내보내기 기능 구현을 위해 수정된 라벨의 데이터를 데이터 바인딩이 되지 않은 total_data로 묶어주는 함수.
        리전을 제외한 부분 완료.
 Date : 2018-10-11
 만든이 : hagdung-i
 ******************************************************************/
function label_data_update(data, editable) {

    if(total_data.ReportTemplate.ReportList){ //리포트가 있나
        var unbinding_total_report = total_data.ReportTemplate.ReportList.anyType;
        if(unbinding_total_report[1]){ //리포트가 여러갠가
            unbinding_total_report.forEach(function (Report, Index) {
                if(Report.Layers.anyType[1]){ //디자인레이어가 있는가
                    if(Report.Layers.anyType[1].Bands){ //밴드가 있는가
                        total_band = Report.Layers.anyType[1].Bands.anyType;
                        unbinding(total_band, data, editable);
                    }
                }else{ //디자인 레이어 없을 경우

                }
            });
        }else{ //리포트가 1개일 경우 (거래명세서)
            total_band = total_data.ReportTemplate.ReportList.anyType.Layers.anyType[1].Bands.anyType;
            unbinding(total_band, data, editable);
        }
    }

}

/******************************************************************
 기능 : 파일 내보내기 기능의 밴드 하위 역바인딩 로직
        ChildFooterBands ,리전을 제외한 부분 완료.
 Date : 2018-10-15
 만든이 : hagdung-i
 ******************************************************************/
function unbinding(total_band, data, editable) {
    if(total_band[1]){ //밴드가 복수 개의 경우
        total_band.forEach(function (TB,Ti) { //밴드의 child들의 속성이 변경될때 역바인딩하는 로직
            ChildHeaderBands_check(data, editable, TB, Ti);
            var controlList = TB.ControlList.anyType;
            ControlList_check(controlList, TB, editable, Ti);
        });
    }else{ //밴드가 1개일 때
        ChildHeaderBands_check(data, editable, total_band, 0);
        var controlList = total_band.ControlList.anyType;
        ControlList_check(controlList, total_band, editable, 0);
    }
}

/******************************************************************
 기능 : 파일 내보내기 기능의 ControlList(Label) 하위 역바인딩 로직
        ChildFooterBands ,리전을 제외한 부분 완료.
 Date : 2018-10-15
 만든이 : hagdung-i
 ******************************************************************/
function ControlList_check(controlList, TB, editable, Ti) {
    if(controlList){//controlList가 있고 (라벨리스트)
        if(controlList[1]){//controlList가 여러개일때
            controlList.forEach(function (CL, Ci) {
                if(CL.Labels){
                    var labels = CL.Labels.TableLabel;
                    if(labels){
                        labels.forEach(function (label, Li) {
                            if(label.Id._text === editable[1]){
                                label.Text._text = editable[0];
                                controlList[Ci].Labels.TableLabel[Li].Text._text = label.Text._text;
                                total_data.ReportTemplate.ReportList.anyType.Layers.anyType[1].Bands.anyType[Ti][Ci] = controlList;
                            }
                        });
                    }
                }
            });
        }else{ //controlList가 하나일때
            if(TB.ControlList.anyType.Labels){

            }

            if(controlList.Layers){
                var Layers = controlList.Layers;
                if(Layers){
                    if(Layers.anyType[1]){
                        Layers.forEach(function (e, i) {
                            Layers[i];
                        });
                    }else{
                        var Bands = Layers.Bands;
                        if(Bands){
                            if(Bands.anyType[1]){

                            }
                        }
                    }
                }
            }
        }
    }
}

/******************************************************************
 기능 : 파일 내보내기 기능의 ChildHeaderBands 부분 하위 역바인딩 로직
 ChildFooterBands ,리전을 제외한 부분 완료.
 Date : 2018-10-15
 만든이 : hagdung-i
 ******************************************************************/
function ChildHeaderBands_check(data, editable, TB, Ti) {
    if(TB.ChildHeaderBands){
        if(TB.ChildHeaderBands.anyType){ //차일드헤더밴드가 있을때
            var Header_band = TB.ChildHeaderBands.anyType;
            if(TB.ChildHeaderBands.anyType[1]){
                Header_band.forEach(function (HB, Bi) {
                    if(HB.ControlList){
                        var header_label =  HB.ControlList.anyType;
                        header_label.forEach(function (HL, Li) {
                            if(HL.Id){
                                if(HL.Id._text === data.id){
                                    HL.Rectangle.Height._text = String(data.rectangle.height);
                                    HL.Rectangle.Width._text = String(data.rectangle.width);
                                    HL.Rectangle.X._text = String(data.rectangle.x);
                                    HL.Rectangle.Y._text = String(data.rectangle.y);

                                    HB.ControlList.anyType[Li] = HL;
                                    TB.ChildHeaderBands.anyType[Bi] = HB;
                                    total_data.ReportTemplate.ReportList.anyType.Layers.anyType[1].Bands.anyType[Ti] = TB;
                                }
                            }
                        });
                    }
                });
            }else{
                var header_label =  Header_band.ControlList.anyType;
                if(header_label){
                    if(header_label[1]){ //라벨이 복수개일때
                        header_label.forEach(function (HL, Li) { //반복문
                            if(data){
                                if(HL.Id._text === data.id){
                                    if(HL.Rectangle.Height){
                                        HL.Rectangle.Height._text = String(data.rectangle.height);
                                    }
                                    if(HL.Rectangle.Width){
                                        HL.Rectangle.Width._text = String(data.rectangle.width);
                                    }
                                    if(HL.Rectangle.X){
                                        HL.Rectangle.X._text = String(data.rectangle.x);
                                    }
                                    if(HL.Rectangle.Y){
                                        HL.Rectangle.Y._text = String(data.rectangle.y);
                                    }
                                    Header_band.ControlList.anyType[Li].Rectangle = HL.Rectangle;
                                    TB.ChildHeaderBands.anyType = Header_band;
                                    total_data.ReportTemplate.ReportList.anyType.Layers.anyType[1].Bands.anyType[Ti] = TB;
                                }
                            }else{
                                if(HL.Id._text === editable[1]){
                                    HL.Text._text = editable[0];
                                    //total_data 생성(파일 저장시)
                                    Header_band.ControlList.anyType[Li].Text._text = HL.Text._text;
                                    TB.ChildHeaderBands.anyType = Header_band;
                                    total_data.ReportTemplate.ReportList.anyType.Layers.anyType[1].Bands.anyType[Ti] = TB;
                                }
                            }
                        });
                    }else{//라벨이 단수개일때(fixedtable)
                    }
                }
            }
        }
    }
}

/******************************************************************
 기능 : 위의 Lock_check 이벤트를 새로 그려준 element에게도 먹여주기 위한 함수
 Date : 2018-09-27
 만든이 : hyeongdyun-i
 ******************************************************************/
function after_Lock_check() {
    var label_all = $('p.Label:not(.nEdit, .Lock)').parent();

    for (var i = 0; i < label_all.length; i++) {
        (function (index) {
            label_all.eq(index).draggable({
                containment: "#" + label_all.eq(index).parents('.Band').attr('id'),
                zIndex: 999
            });
            label_all.eq(index).resizable({
                containment: "#" + label_all.eq(index).parents('.Band').attr('id'),
                autoHide: true
            });
        })(i);
    }
}

/******************************************************************
 기능 : 각각의 형태의 테이블의 id와 데이터를 받아서 lock이 걸려있는 라벨을 제외한 라벨들의 위치 이동, 크기 조정 기능 추가.
 Date : 2018-08-24
 만든이 : hagdung-i

 수정 : 사이즈 조정시 전체 페이지의 해당 테이블은 모두 수정되도록 수정.
 Date : 2018-09-12
 만든이 : hagdung-i

 수정 : 테이블의 리사이즈, 드래그 기능이 원하는 기능과 다른 점이 있어, 추후 재개발시 참고등으로 필요할 것으로 판단하여 남김.
 Date : 2018-09-15
 만든이 : hagdung-i
 ******************************************************************/
function Lock_Check_Table(data, drag, resize, div) { //테이블 데이터, 드래거블 지정할 영역, 리사이즈 영역, 위치 이동시 벗어나면 안되는 영역
//     var editable = data.editable;
//     if (editable !== 'false') { // 편집이 가능할 때
//         var Lock_check;
//         if (data.Lock === undefined) {
//             Lock_check = data.Lock;
//         } else {
//             Lock_check = data.Lock._text;
//         }
//         if (!Lock_check) {
//             drag.draggable({
//                 containment: "#" + div[0].id,
//                 zIndex: 999,
//                 drag: function (event, ui) { // 예솔 추가
//                     data.rectangle.x = ui.position.top;
//                     data.rectangle.y = ui.position.left;
//                     label_data_update(data);
//                 }
//             });
//             var width;
//             $(function () {
//                 resize.resizable({
//                     containment: "#" + div[0].id,
//                     autoHide: true,
//                     resize: function (event, ui) {   //테이블사이즈는 가로만 조정 가능하도록.
//                         data.rectangle.height = ui.originalSize.height;
//                         data.rectangle.width = ui.size.width;
//                         var select_label = $("#" + this.id)[0].className.split(" ")[1];
//                         $(".table").each(function (i, e) {
//                             var total_col = $("#" + e.id)[0].className.split(" ")[1];
//                             if (total_col === select_label) {
//                                 e.style.width = data.rectangle.width + "px";
//                                 label_data_update(data);
//                             }
//                         });
//                     }
//                 });
//             });
//         } else {
//             resize.addClass('Lock');
//         }
//     }
}

/******************************************************************
 기능 : 테이블 항목별 크기조정 기능
 Date : 2018-08-30
 만든이 : hagdung-i

 수정 : 테이블의 리사이즈, 드래그 기능이 원하는 기능과 다른 점이 있어, 추후 재개발시 참고등으로 필요할 것으로 판단하여 남김.
 Date : 2018-09-15
 만든이 : hagdung-i
 ******************************************************************/
function table_column_controller(resize_area, Unalterable_area, label) {
    // var width;
    // if(label.editable !== "true"){
    //     if(!label.Lock){
    //         if (Unalterable_area[0]) {
    //             resize_area.resizable({
    //                 // containment: "#" + Unalterable_area[0].id,
    //                 autoHide: true,
    //                 resize: function (event, ui) {   //테이블사이즈는 가로만 조정 가능하도록.
    //                     ui.size.height = ui.originalSize.height;
    //                     label.rectangle.width = ui.size.width;
    //                     var resizing_label = this;
    //                     var select_label = $("#" + resizing_label.id).text();
    //                     $(".DynamicTableHeader").each(function (i, e) {
    //                         var total_col = $("#" + e.id).text();
    //                         if (total_col === select_label) {
    //                             e.style.width = label.rectangle.width + "px";
    //                             label_data_update(label);
    //                         }
    //                     });
    //                 }
    //             });
    //         }
    //     }
    // }
}

/******************************************************************
 기능 : 위의 Lock_Check_Table 이벤트를 새로 그려준 element에게도 먹여주기 위한 함수

 위와 동일한 이유로 남김.

 Date : 2018-09-27
 만든이 : hyeongdyun-i
 ******************************************************************/
function after_Lock_Check_Table() { //테이블 데이터, 드래거블 지정할 영역, 리사이즈 영역, 위치 이동시 벗어나면 안되는 영역
    var table_all = $('table.table:not(.Lock)'); // resize

    for (var i = 0; i < table_all.length; i++) {
        (function (index) {
            table_all.eq(index).parent().draggable({
                containment: "#" + table_all.eq(index).parents('.Band').attr('id'),
                zIndex: 999
            });
            var width;
            table_all.eq(index).resizable({
                containment: "#" + table_all.eq(index).parents('.Band').attr('id'), autoHide: true,
                resize: function (event, ui) {   //테이블사이즈는 가로만 조정 가능하도록.
                    ui.size.height = ui.originalSize.height;
                    width = ui.size.width;
                    var select_label = $("#" + this.id)[0].className.split(" ")[1];
                    $(".table").each(function (index, e) {
                        var total_col = $("#" + e.id)[0].className.split(" ")[1];
                        if (total_col === select_label) {
                            e.style.width = width + "px";
                        }
                    });
                }
            });
        })(i);

    }
}

/******************************************************************
 기능 : 라벨 데이터 포맷을 확인해서 소수점 자릿수 설정 값에 따라 해당 형태로 변경 로직 추가.
 Date : 2018-08-24
 만든이 : hagdung-i
 ******************************************************************/
function format_check(data) {
    var test = data.formatType;
    var num_check = data.text.replace(/[^0-9]/g, ""); //데이터에서 숫자만 추출.
    var data_text = data.text;
    if (test == "AmountSosu") {   //추후, 다른 7가지의 속성을 알게되면 else if로 추가해야함.
        if (num_check != "") { //해당 데이터가 숫자인 경우내려
            data_text = num_check.replace(/\B(?=(\d{3})+(?!\d))/g, ","); //천단위로 콤마를 찍어줌.
        }
        return data_text;
    } else {
        return data_text;
    }
}

/******************************************************************
 기능 : 테이블 안의 데이터 포맷을 확인해서 소수점 자릿수 설정 값에 따라 해당 형태로 변경 로직 추가.
 Date : 2018-08-24
 만든이 : hagdung-i

 수정 : 사이즈 조정시 전체 페이지의 해당 테이블은 모두 수정되도록 수정.
 Date : 2018-09-12
 만든이 : hagdung-i

 수정 : 한글/숫자 날짜, 주민등록번호, 도트, 콤마 등의 폰트 포맷 정규식 추가.
 Date : 2018-10-12
 만든이 : hagdung-i
 ******************************************************************/
function table_format_check(data, Label_id, key, table) { //현재 key와 table만 필수 key는 라벨에 그려지는 실제 데이터 table은 테이블의 정보를 담고있는 오브젝트.
    var test = table.formatType;
    var format = table.format;
    var FieldName = table.fieldName;
    // var data_text;
    if (key != NaN) { //해당 데이터가 숫자일 경우
        if (test === "AmountSosu" || test === "MoneySosu" || test === "MoneySosu") {   //수량, 금액 소숫점 자리수 ###,###
            var parts = key.toString().split(".");
            if (parts[1]) { //소수점이 있을 때.
                var decimal_cutting = parts[1].substring(0, 2);
                return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + decimal_cutting;
            } else {
                return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            // data_text = key.replace(/\B(?=(\d{3})+(?!\d))/g, ","); //천단위로 콤마를 찍어줌.
            // return data_text;
        } else if (test === "WonHwaDangaSosu" || test === "ExchangeSosu" || test === "ExchangeRateSosu") {   //원화단가, 외화 소수점 자리수 ###,###.00
            var parts = key.toString().split(".");
            if (parts[1]) {
                var decimal_cutting = parts[1].substring(0, 2);
                return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
            } else {
                return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        } else if (test === "ExchangeDangaSosu" || test === "BiyulSosu" || test === "ExchangeAmountSosu") { //외화단가, 비율 소수점 자리수 ###,###.000
            var parts = key.toString().split(".");
            if (parts[1]) {
                var decimal_cutting = parts[1].substring(0, 3);
                return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
            } else {
                return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        } else if(!test && format){
            var parts;
            //도트
            var dot = format.toString().split(".");
            //콤마
            var comma = format.toString().split(",");
            //한글 날짜
            var year = format.toString().split("년");
            var month = format.toString().split("월");
            var day = format.toString().split("일");

            //날짜
            var Endate = format.toString().split("/");

            //주민번호
            var Social_Security_Number = format.toString().split("-");

            if(key){
                if(dot[1]){ //도트 있을 때
                    parts = key.toString().split(".");
                    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                }
                if(comma[1]){   //콤마 있을 때
                    parts = key.toString().split(",");
                    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }

                if(year[1]){    //년도 있을 때
                    if(month[1]){
                        if(day[0]){
                            parts = key.toString().split("-");
                            if(parts[1]){
                                return parts[0]+"년"+parts[1]+"월"+parts[2]+"일";
                            }else{
                                parts = key.replace(/\B(?=(\d{4})+(?!\d))/g, "/");
                                var parts2 = parts.split("/");
                                if(parts2[1]){
                                    var parts3 = parts2[1].replace(/\B(?=(\d{2})+(?!\d))/g, "월");
                                    var total_date = parts2[0]+"년"+parts3+"일";
                                    return total_date;
                                }
                            }
                        }else if(day[1]){

                        }
                    }
                }

                if(Endate[1]){
                    if(Endate[2]){ // yyyy/mm/dd 형태일 경우
                        parts = key.replace(/\B(?=(\d{4})+(?!\d))/g, "/");
                        var parts2 = parts.split("/");
                        if(parts2[1]){
                            var parts3 = parts2[1].replace(/\B(?=(\d{2})+(?!\d))/g, "/");
                            var total_date = parts2[0]+"/"+parts3;
                            return total_date;
                        }
                    }else{ //   yyyy/mm형태가 올 수 있음.
                        parts = key.replace(/\B(?=(\d{4})+(?!\d))/g, "/");
                    }
                }

                if(Social_Security_Number[1] && !Social_Security_Number[2]){
                    parts = key.substring(0,6);
                    var parts2 = key.substring(6,14);
                    var return_val = parts+"-"+parts2;
                    return return_val;
                    // return parts[0].replace(/\B(?=(\d{6})+(?!\d))/g, "-");
                }
                return key;
            }
        } else {
            return key;
        }
    }else if(format){
        return key;
    }else{
        return key;
    }
}



function shift_table_column_controller(resize_area, Unalterable_area, table_resize_area, table_Unalterable_area) {
    var width;
    if (Unalterable_area[0]) {
        resize_area.resizable({
            containment: "#" + Unalterable_area[0].id,
            autoHide: true,
            resize: function (event, ui) {   //테이블사이즈는 가로만 조정 가능하도록.
                ui.size.height = ui.originalSize.height;
                width = ui.size.width;
                var resizing_label = this;
                var select_label = $("#" + resizing_label.id).text();
                $(".DynamicTableHeader").each(function (i, e) {
                    var total_col = $("#" + e.id).text();
                    if (total_col === select_label) {
                        e.style.width = width + "px";
                    }
                });
                // data.rectangle.width = ui.size.width; // 예솔 추가
                // data.rectangle.height = ui.size.height; // 예솔 추가
            }
        });
        if(table_resize_area){
            table_resize_area.addClass("resizable");
            // table_resize_area.resizable({
            //     containment: "#" + table_Unalterable_area[0].id,
            //     autoHide: true,
            //     resize: function (event, ui) {   //테이블사이즈는 가로만 조정 가능하도록.
            //         ui.size.height = ui.originalSize.height;
            //         width = ui.size.width;
            //         var select_label = $("#" + this.id)[0].className.split(" ")[1];
            //         $(".table").each(function (i, e) {
            //             var total_col = $("#" + e.id)[0].className.split(" ")[1];
            //             if (total_col === select_label) {
            //                 e.style.width = width + "px";
            //             }
            //         });
            //     }
            // });
        }

    }
}

/******************************************************************
 기능 : 위의 Lock_Check_Table 이벤트를 새로 그려준 element에게도 먹여주기 위한 함수
 Date : 2018-09-27
 만든이 : hyeongdyun-i
 ******************************************************************/
function after_table_column_controller() {
    var table_all = $('table.dynamicTable');
    var width;
    for (var i = 0; i < table_all.length; i++) {
        (function (index_i) {
            var first_tr = table_all.eq(index_i).find('tr').eq(0);
            for (var j = 0; j < first_tr.children().length; j++) {
                (function (index_j) {
                    var resize_area = first_tr.children().eq(index_j);
                    resize_area.resizable({
                        containment: "#" + first_tr.attr('id'),
                        autoHide: true,
                        resize: function (event, ui) {   //테이블사이즈는 가로만 조정 가능하도록.
                            ui.size.height = ui.originalSize.height;
                            width = ui.size.width;
                            var resizing_label = this;
                            var select_label = $("#" + resizing_label.id).text();
                            $(".DynamicTableHeader").each(function (i, e) {
                                var total_col = $("#" + e.id).text();
                                if (total_col === select_label) {
                                    e.style.width = width + "px";
                                }
                            });
                            data.rectangle.width = ui.size.width; // 예솔 추가
                            data.rectangle.height = ui.size.height; // 예솔 추가
                        }
                    });
                })(j);
            }
        })(i);
    }
}

/******************************************************************
 기능 : 이미지 라벨 추가.(이미지 크기는 라벨과 이미지 비율 두가지가 있는데,
 layout속성은 xml에서 따로 가져오지 않는 것으로 보아 통합하는 방법으로 구성하되
 그리는 사이즈는 xml에서 받아오는 이미지 사이즈로 통합하고 크기 조정은 가능하도록 구성)
 Date : 2018-09-12
 만든이 : hagdung-i
 ******************************************************************/
function image_label_making(labelNbandInfo) {
    var image_str = labelNbandInfo.data.base64ImageFromViewer;
    var file_name = labelNbandInfo.data.text;
    var div_id = labelNbandInfo.labelId[0].id;
    // 이미지 svg 변환을 위한 후에 손봐야하니 주석 지우지 말아주세요..
    // var test2 = "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath d='M224%20387.814V512L32 320l192-192v126.912C447.375 260.152 437.794 103.016 380.93 0 521.287 151.707 491.48 394.785 224 387.814z'/%3E%3C/svg%3E";
    // var test3 = "data:image/svg;base64,"+test2;
    var baseMaking = "data:image/svg;base64," + image_str.trim(); //base64 -> html 포맷으로 변경.
    var image_send = document.createElement("img");
    image_send.id = "DRD_image" + div_id.replace(/[^0-9]/g, '');
    image_send.className = "image";
    image_send.style.width = "100%";
    image_send.style.height = "100%";
    image_send.style.color = "rgba(255, 151, 166, 0.5)";
    image_send.src = baseMaking;
    var image_div = document.getElementById(div_id); //추후 변경해야됨 해당 div의 id로
    image_div.appendChild(image_send);

    Transparent_Cloak(labelNbandInfo.data.imageTransparent, image_send);
}

/******************************************************************
 기능 : 이미지 투명도, 이미지 크기에 따른 이미지 조정 기능
 Date : 2018-09-11
 만든이 : hagdung-i
 ******************************************************************/
function Transparent_Cloak(imageTransparent, image) {
    if (imageTransparent.IsUseTransParent) { //투명도 관련 속성이 존재할 경우
        var TransparentOX = imageTransparent.IsUseTransParent._text;
        if (TransparentOX) {  //투명도 여부를 확인
            var TransparentColor = imageTransparent.TransParentColor._text;
            return TransparentColor;
        }
    }
}

function z_index_setting(band_name) {
    if (band_name == "BandBackGround") {
        var z_index = -11;
    } else if (band_name == "BandForeGround") {
        var z_index = 100;
    } else {
        var z_index = 2;
    }
    return z_index;
}

/******************************************************************
 기능 : DRD 자바스크립트 구현
 Date : 2018-09-24
 만든이 : big_dolphin

 추가 : DRD 자바스크립트 세부적 추가 기능 구현
 Date : 2018-09-27
 만든이 : hagdung-i

 *추후 자바스크립트 편집 기능 참조 사항.
 ******************************************************************/
function drd_javascript(label, labelId, script, key, data) {
    if (labelId !== undefined && script !== undefined) {
        var making_script;
        making_script = str_replace(script, '<br/>', '\n');
        making_script = str_replace(making_script, 'TextColor', 'color');
        making_script = str_replace(making_script, 'Color.', '');
        making_script = str_replace(making_script, '"]', '"]._text');
        making_script = str_replace(making_script, 'This.Text', '$("#' + labelId + '")[0].innerText');
        making_script = str_replace(making_script, 'DataSource.GetDataRow()', "GetDataRow");

        var var_Y = making_script.indexOf("var");
        if (var_Y !== -1) {
            var variable = making_script.split("var")[1];
            eval(variable);
            DataSource(data);
            eval(making_script);
        }
    }
}

/**
 DRD 자바스크립트 텍스트 치환 함수
 */
function str_replace(str, searchStr, replaceStr) {
    return str.split(searchStr).join(replaceStr);
}

/******************************************************************
 기능 : 자바스크립트 관련 기능.
 Date : 2018-09-24
 만든이 : hagdung-i
 ******************************************************************/
function DataSource(data, variable_name, variable_value) {
    this.GetDataRow = data;
    // this.variable_name = variable_value;
};

// var labelNbandInfo = {
//     data : data,
//     divId : divId,
//     band_name : band_name,
//     div : $('#' + divId),
//     labelId : $('#NormalLabel' + normalLabelNum),
//     label_scope : "NormalLabel_scope",
//     divNum : normalLabelNum
// }


/******************************************************************
 기능 : 시간 또는 날짜를 출력할 때 한 자리 숫자일 경우 0을 붙여줘서 두 자리 숫자로 출력 해주는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function plusZero(data) {
    var str = data.toString();
    if (str.length == 1) {
        data = '0' + data;
    }
    return data;
}

/******************************************************************
 기능 : 한 글자씩 출력하는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function toStringFn(text, pTagId) {
    var tag = $('#' + pTagId);
    var str = text.toString();
    var appendStr = str[0];
    for (var i = 1; i < str.length; i++) {
        appendStr += str[i];
    }
    tag.append(appendStr);
}

/******************************************************************
 기능 : 가운데 정렬 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function textAlignCenter(text, pTagId, wordWrap, textDirection) {
    var tag = $('#' + pTagId);
    var fontSize = (tag.css('font-size')).split('px');
    if (wordWrap == false && textDirection == 'Horizontal') {
        var parentWidth = (tag.parent().css('width')).split('px');
        var str = text.toString();
        var temp = str.split('<br/>');

        var space = temp[0].match(/\s/gi); // 공백 찾기
        var eng = temp[0].match(/[a-z]/gi); // 영문 찾기

        var max = temp[0].length; // 한 줄에 있는 텍스트 길이 중 제일 긴 길이를 넣을 변수
        var maxExceptSpace; // 길이가 제일 긴 텍스트에서 공백을 제외한 길이를 넣을 변수
        if (space != null) {
            maxExceptSpace = max - space.length;
        }
        if (eng != null) {
            maxExceptSpace = maxExceptSpace - eng.length * 0.5;
        }
        if (temp.length > 1) {
            for (var i = 1; i < temp.length; i++) {
                temp[i] = temp[i].trim();
                space = temp[i].match(/\s/gi); // 공백 찾기
                eng = temp[i].match(/[a-z]/gi); // 영문 찾기
                if (temp[i].length > max) {
                    if (space != null) {
                        max = temp[i].length;
                        maxExceptSpace = max - space.length;
                    } else {
                        max = temp[i].length;
                        maxExceptSpace = max;
                    }
                    if (eng != null) {
                        maxExceptSpace = maxExceptSpace - eng.length * (0.5);
                    }
                }
            }
        }

        maxExceptSpace = parseInt(maxExceptSpace);

        fontSize[0] = parseInt(fontSize[0]);
        parentWidth[0] = parseInt(parentWidth[0]);

        if (maxExceptSpace * fontSize[0] > parentWidth[0]) {
            var spacing = (parentWidth[0] - fontSize[0] * maxExceptSpace) / 2;

            tag.css({
                'left': spacing + 'px',
                'right': spacing + 'px',
                'position': 'absolute',
                'overflow': 'visible',
                'white-space': 'nowrap',
                'text-align': 'center'
            });
        } else {
            tag.css('text-align', 'center');
        }
    } else if (textDirection == 'Vertical') {
        var children = tag.children().text().length;
        var parentHeight = (tag.css('height')).split('p');
        var margin = (parentHeight[0] - children * fontSize[0]) / 2;
        tag.children().css({
            'margin-top': margin + 'px',
            'margin-bottom': margin + 'px'
        });
    } else {
        tag.css('text-align', 'center');
    }
}

//////////////// 왠지 야매로 만든 느낌
/******************************************************************
 기능 : 폰트 크기가 자동으로 줄어드는 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function fontSizeAutoSmall(text, pTagId) {
    var tag = $('#' + pTagId);
    var parentWidth = (tag.parent().css('width')).split('p');
    var fontSize = (tag.css('font-size')).split('p');
    var str = text.toString();
    var temp = str.split('<br/>');

    var space = temp[0].match(/\s/gi);

    var max = temp[0].length;

    if (temp.length > 1) {
        for (var i = 1; i < temp.length; i++) {
            temp[i] = temp[i].trim();
            space = temp[i].match(/\s/gi); // 공백 찾기
            if (temp[i].length > max) {
                max = temp[i].length;
            }
        }
    }
    if ((max * fontSize[0]) > parentWidth[0]) {
        var smallFontSize = 0;
        if (space != null) {
            max = max - space.length;
            smallFontSize = Math.floor(parentWidth[0] / (max + space.length * 0.5) * 1.333);
        } else {
            smallFontSize = Math.floor(parentWidth[0] / max * 1.333); // 왜 1.333을 곱해주는거지..?
        }
        tag.css('font-size', smallFontSize + 'pt');
    }
}

/******************************************************************
 기능 : 텍스트 방향이 수직인 함수를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function textAlignVertical(text, pTagId) {
    var pTag = $('#' + pTagId);
    var parentHeight = pTag.parent().css('height').split('p');
    var parentWidth = pTag.parent().css('width').split('p');
    pTag.css({
        'width': parentWidth[0] + 'px',
        'height': parentHeight[0] + 'px'
    });

    var str = text.toString();
    var strSplitByBr = str.split('<br/>');
    var fontSize = (pTag.css('font-size')).split('p');
    strSplitByBr.forEach(function (data, j) {
        data = data.trim();
        var appendStr = data[0];
        for (var i = 1; i < data.length; i++) {
            if (data[i] == ' ') {
                appendStr += '<br/>';
            } else {
                appendStr += data[i];
            }
        }

        var sonHeight = fontSize[0] * data.length;

        var sonTop = (parentHeight[0] - sonHeight) / 2;
        var style = 'white-space : normal; float : left; height : ' + parentHeight[0] + 'px; width : ' + fontSize[0] + 'px;/* margin-top : ' + sonTop + 'px; margin-bottom : ' + sonTop + 'px;*/ line-height : ' + fontSize[0] + 'px;';

        pTag.append('<p style = "' + style + '">' + appendStr + '</p>');
    });
    var marginLeft = (parentWidth[0] - strSplitByBr.length * fontSize[0]) / 2;
    pTag.css({
        'width': (strSplitByBr.length * fontSize[0]) + 'px',
        'height': parentHeight[0] + 'px',
        'margin-left': marginLeft + 'px'
    });
}

/******************************************************************
 기능 : 텍스트 수평 정렬이 균등분할인 속성을 구현한다.
 만든이 : 안예솔
 ******************************************************************/
function textEqualDivision(text, pTagId) {
    var tag = $('#' + pTagId);
    var str = text.toString();
    var fontSize = (tag.css('font-size')).split('p');
    var parentWidth = tag.css('width').split('p');
    var temp = str.split('<br/>');

    for (var i = 0; i < temp.length; i++) {
        temp[i] = temp[i].trim();
        var space = temp[i].match(/\s/gi);
        var num = 0;
        if (space != null) {
            num = temp[i].length - space.length;
        } else {
            num = temp[i].length
        }
        temp[i] = temp[i].replace(/\s/gi, '');
        var spacing = (parentWidth[0] - fontSize[0] * num) / (num - 1);
        tag.append('<p style = "letter-spacing : ' + spacing + 'px; margin:0px;">' + temp[i] + '</p>');
    }
}

/******************************************************************
 기능 : 텍스트 수직 정렬이 가운데인 속성을 구현한다.
 만든이 : 안예솔
 ******************************************************************/
function verticalCenter(pTagId) {
    var tag = $('#' + pTagId);
    var height = (tag.css('height')).split('p');

    var parentHeightString = tag.parent().css('height');
    var parentHeight = parentHeightString.split('p');

    if (parseInt(height[0]) >= parseInt(parentHeight[0])) {
        tag.css({
            'margin-top': '0px',
            'margin-bottom': '0px'
        });
    } else {
        var mid = (parentHeight[0] - height[0]) / 2;

        tag.css({
            'margin-top': mid + 'px',
            'margin-bottom': mid + 'px'
        });
    }
}

/******************************************************************
 기능 : 텍스트 수직 정렬이 위쪽인 속성을 구현한다.
 만든이 : 안예솔
 ******************************************************************/
function verticalTop(pTagId) {
    var tag = $('#' + pTagId);

    tag.css({
        'margin-top': '0px'
    });
}

/******************************************************************
 기능 : 텍스트 수직 정렬이 아래쪽인 속성을 구현한다.
 만든이 : 안예솔
 ******************************************************************/
function verticalBottom(pTagId) {
    var tag = $('#' + pTagId);
    var height = (tag.css('height')).split('p');

    var parentHeightString = tag.parent().css('height');
    var parentHeight = parentHeightString.split('p');

    var spacing = parentHeight[0] - height[0];

    tag.css({
        'margin-top': spacing + 'px',
        'margin-bottom': '0px'
    });
}

/******************************************************************
 기능 : 텍스트 수직 정렬이 균등분할인 속성을 구현한다.
 만든이 : 안예솔
 ******************************************************************/
function verticalCenterEqualDivision(text, pTagId, textDirection) {
    var tag = $('#' + pTagId);
    tag.css({
        'margin-top': '0px',
        'margin-bottom': '0px',
    });
    if (textDirection == 'Horizontal') { // 글자가 가로 방향일 때
        var fontSize = (tag.css('font-size')).split('p');
        // 16pt 이런 식으로 값이 받아져서 p앞으로 끊어서 숫자만 받아오려고 한 문자열 자르기 작업
        var brTag = $('#' + pTagId + ' br');
        var brCount = brTag.length;
        // text중에서 <br/>의 개수를 구함

        var parentHeightString = tag.parent().css('height');
        var parentHeight = parentHeightString.split('p');

        if (brCount == 0) {
            var mid = (parentHeight[0] - fontSize[0] * (brCount + 1)) / 2 - brCount;
            tag.css({
                'margin-top': mid + 'px',
                'margin-bottom': mid + 'px'
            });
        } else {
            var spacing = (parentHeight[0] - fontSize[0] * (brCount + 1)) / brCount - brCount;
            brTag.before('<p style = "height : ' + spacing + 'px; margin-top : 0px; margin-bottom : 0px;"></p>'); // <br/>이 나오기 전에 p태그를 삽입한 후 remove()로 삭제 (줄 바꿈을 위함)
            brTag.remove();
        }
    } else { // 글자가 세로 방향일 때
        tag.text('');
        var str = text.toString();
        var fontSize = (tag.css('font-size')).split('p');
        // // 16pt 이런 식으로 값이 받아져서 p앞으로 끊어서 숫자만 받아오려고 한 문자열 자르기 작업
        var parentHeight = (tag.css('height')).split('p');
        var temp = str.split('<br/>'); // <br/>태그를 중심으로 자름
        for (var i = 0; i < temp.length; i++) {
            temp[i] = temp[i].trim(); // 공백 제거
            var spacing = Math.ceil((parentHeight[0] - temp[i].length * fontSize[0]) / (temp[i].length - 1)) + 1; //
            var appendStr = temp[i][0];
            appendStr += '<p style = "height : ' + spacing + 'px; width: ' + fontSize[0] + 'px; margin-top : 0px; margin-bottom : 0px;"></p>';
            for (var j = 1; j < temp[i].length; j++) {
                if (j == (temp[i].length - 1)) {
                    appendStr += temp[i][j];
                    // appendStr += '<p style = "height : 22.669px; margin-top : 0px; margin-bottom : 0px"></p>';
                } else {
                    appendStr += temp[i][j];
                    appendStr += '<p style = "height : ' + Math.ceil(spacing) + 'px; width : ' + fontSize[0] + 'px; margin-top : 0px; margin-bottom : 0px;"></p>';
                }
            }
            tag.css({
                'margin-top': '0px',
                'margin-bottom': '0px'
            });
            tag.append('<p id = "vertical' + verticalPNum + '" style = width:' + fontSize[0] + 'px; height : ' + parentHeight[0] + 'px; margin-top:0px; margin-bottom:0px"></p>');
            var verticalPId = $('#vertical' + verticalPNum);
            verticalPId.css({
                'float': 'left',
                'margin-top': '0px',
                'margin-bottom': '0px'
            });
            verticalPId.append(appendStr);
            verticalPNum++;
        }
    }
}

/******************************************************************
 기능 : 자동 높이 조정 속성이 '예'일 경우를 구현한다.
 만든이 : 안예솔
 ******************************************************************/
function autoSizeTrue(pTagId) {
    var tag = $('#' + pTagId);
    var fontSize = (tag.css('font-size')).split('p');
    // 16pt 이런 식으로 값이 받아져서 p앞으로 끊어서 숫자만 받아오려고 한 문자열 자르기 작업

    var brTag = $('#' + pTagId + ' br');
    var brCount = brTag.length;
    // text중에서 <br/>의 개수를 구함

    var height = fontSize[0] * (brCount + 1) + brCount;
    tag.parent().css({
        'height': height,
        'top': height + fontSize[0] + 'px'
    });
    tag.css({
        'margin-top': '0px',
        'margin-bottom': '0px'
    });
}

/******************************************************************
 기능 : 줄 간격 속성을 구현한다.
 만든이 : 안예솔
 ******************************************************************/
function lineSpacing(text, spacing, pTagId) {
    var tag = $('#' + pTagId);
    tag.css({
        'margin-top': '0px',
        'margin-bottom': '0px',
    });

    var brTag = $('#' + pTagId + ' br');
    var brCount = brTag.length;
    // text중에서 <br/>의 개수를 구함

    var parentHeightString = tag.parent().css('height');
    var parentHeight = parentHeightString.split('p');
    var fontSize = (tag.css('font-size')).split('p');

    var mid = (parentHeight[0] - (fontSize[0] * (brCount + 1) + spacing * brCount)) / 2 - brCount;

    if (brCount == 0) {
        verticalCenter(pTagId);
    } else {
        tag.css({
            'margin-top': mid + 'px',
            'margin-bottom': mid + 'px'
        });
        brTag.before('<p style = "height : ' + spacing + 'px; margin-top : 0px; margin-bottom : 0px;"></p>'); // <br/>이 나오기 전에 p태그를 삽입한 후 remove()로 삭제 (줄 바꿈을 위함)
        brTag.remove();
    }
}