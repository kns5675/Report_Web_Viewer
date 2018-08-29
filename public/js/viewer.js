/******************************************************************
 기능 : DR Viewer 인쇄 메뉴 선택하기 (select option value받아와서 메뉴 인식 후 모달창 띄우기)
 author : 하지연
 ******************************************************************/

function copyoptions(){
    try{
        if ($("#copyOptions").val() == 'ecopy'){
            $('#myModal').show();
        }else if($("#copyOptions").val() == 'copy'){
            $('#myModal').css('display','none');
            pagePrint();
        }else{
            console.log("인식못했음");
        }
    }catch(e){
        console.log(e.message);
    }
}
/******************************************************************
 기능 : DR Viewer의 zoomIn,zoomOut기능에서 확대 또는 축소의 값변경 판단
 author : 하지연
 ******************************************************************/
function sizechanged(){
    $("#txtZoom").bind("change", function(){
        test();
    });
}
/******************************************************************
 기능 : DR Viewer의 zoomIn,zoomOut기능에서 확대 또는 축소 변경 값을 받아온 후,
        다양한 브라우저의 scale값을 조정하여 zoomIn, zoomOut기능 구현
 author : 하지연
 ******************************************************************/
function test(){
    try {
        var flexiblecontent = document.getElementById("reportTemplate");
        var size = $("#txtZoom").val();
        $("#txtZoom").val(size);

        if (jQuery.browser.msie) {
            flexiblecontent.style.zoom = size;
        }
        else {
            $(flexiblecontent).css('-webkit-transform','scale(' + (size) + ')');
            $(flexiblecontent).css('-webkit-transform-origin','0 0');
            $(flexiblecontent).css('-moz-transform','scale(' + (size) + ')');
            $(flexiblecontent).css('-moz-transform-origin','0 0');
            $(flexiblecontent).css('-o-transform','scale(' + (size) + ')');
            $(flexiblecontent).css('-o-transform-origin','0 0');
        }
    }
    catch(e) {
        console.log(e.message);
    }
}
/******************************************************************
 기능 : select option의 선택값을 기본으로 +버튼 클릭 시 5%가 추가 확대되는
        값을 받아와 zoomIn기능 구현
 author : 하지연
 ******************************************************************/
function zoomIn(){
    try {
        var size = $("#txtZoom").val();
        size = parseFloat(size);
        size = (size + 0.05).toFixed(2);
        $("#option1").val(size);//option1에 사이즈 집어넣고.
        var optionsize  = $("#option1").val();
        var changedoption1 = ((($("#option1").val())*100).toFixed(0)+"%");

        $("#option1").text(changedoption1);
        $("#txtZoom option:last").attr("selected","selected");

        try {
            var flexiblecontent = document.getElementById("reportTemplate");
            $("#txtZoom").val(size);
            if (jQuery.browser.msie) {
                flexiblecontent.style.zoom = size;
            }
            else {
                $(flexiblecontent).css('-webkit-transform','scale(' + (size) + ')');
                $(flexiblecontent).css('-webkit-transform-origin','0 0');
                $(flexiblecontent).css('-moz-transform','scale(' + (size) + ')');
                $(flexiblecontent).css('-moz-transform-origin','0 0');
                $(flexiblecontent).css('-o-transform','scale(' + (size) + ')');
                $(flexiblecontent).css('-o-transform-origin','0 0');
            }
        }
        catch(e) {
            console.log(e.message);
        }
    }
    catch(e) {
        alert("test ==> " + e.message);
    }
}
/******************************************************************
 기능 : select option의 선택값을 기본으로 - 버튼 클릭 시 5%가 추가 축소되는
        값을 받아와 zoomOut기능 구현
 author : 하지연
 ******************************************************************/
function zoomOut(){
    try {
        var size = $("#txtZoom").val();

        var size = parseFloat(size);

        size = (size - 0.05).toFixed(2);
        $("#txtZoom").val();
        $("#option1").val(size);

        var changedoption1 = ((($("#option1").val())*100).toFixed(0)+"%");
        $("#option1").text(changedoption1);
        $("#txtZoom option:last").attr("selected","selected");

        /*test();*/
        try {
            var flexiblecontent = document.getElementById("reportTemplate");
            $("#txtZoom").val(size);
            if (jQuery.browser.msie) {
                flexiblecontent.style.zoom = size;
            }
            else {
                $(flexiblecontent).css('-webkit-transform','scale(' + (size) + ')');
                $(flexiblecontent).css('-webkit-transform-origin','0 0');
                $(flexiblecontent).css('-moz-transform','scale(' + (size) + ')');
                $(flexiblecontent).css('-moz-transform-origin','0 0');
                $(flexiblecontent).css('-o-transform','scale(' + (size) + ')');
                $(flexiblecontent).css('-o-transform-origin','0 0');

            }
        }
        catch(e) {
            console.log(e.message);
        }
    }
    catch(e) {
        alert(e.message);
    }
}
/******************************************************************
 기능 : 모달창 닫기 - 데이터값 초기화 밑 기본값 세팅 처리
 author : 하지연
 ******************************************************************/
function close_pop() {
    $('#myModal').hide();//고급인쇄 모달창 닫기

    resetData();//데이터값 초기화 밑 기본값 세팅처리


};
/******************************************************************
 기능 : 고급인쇄 모달창의 데이터값 초기화 밑 기본값 세팅처리
 author : 하지연
 ******************************************************************/
function resetData(){
    //데이터값 초기화
    $("#copyratio").val("100");
    $("input:radio[name='copyornot']:radio[value='인쇄함']").prop("checked",false);
    $("input:radio[name='copyornot']:radio[value='인쇄안함']").prop("checked",true);

    $("input:radio[name='titleposition']:radio[value='타이틀상단']").prop("checked",true);
    $("input:radio[name='titleposition']:radio[value='타이틀하단']").prop("checked",false);

    $("input:radio[name='fontform']:radio[value='굴림체']").prop("checked",true);
    $("input:radio[name='fontform']:radio[value='바탕체']").prop("checked",false);
    $("input:radio[name='fontform']:radio[value='돋움체']").prop("checked",false);

    $("input:radio[name='fontcontent']:radio[value='굴림체']").prop("checked",true);
    $("input:radio[name='fontcontent']:radio[value='바탕체']").prop("checked",false);
    $("input:radio[name='fontcontent']:radio[value='돋움체']").prop("checked",false);

    $("input:checkbox[name='fontandtilt']").prop("checked",false);

    $("#pagesizeoptions").val("A4").attr("selected","selected");

    $("input:radio[name='copydate']:radio[value='인쇄함']").prop("checked",false);
    $("input:radio[name='copydate']:radio[value='인쇄안함']").prop("checked",true);

    $("input:radio[name='copycount']:radio[value='인쇄함']").prop("checked",false);
    $("input:radio[name='copycount']:radio[value='인쇄안함']").prop("checked",true);

    $("input:checkbox[name='extra']").prop("checked",false);

    $("#extraheadoptions").val("상단좌측").attr("selected","selected"); 
    $("#extrahead").val('');

    $("#extratailoptions").val("하단좌측").attr("selected","selected");
    $("#extratail").val('');

    $("#copyOptions").val("--인쇄--").attr("selected","selected");
    onlyNumber(event);
    copyRatioCheck();
    eReSetFont();

    //용지방향 설정 초기화
    paper_setting("reset");
    //매수인쇄 초기화
    $(".countPage").remove();
    //출력일 인쇄 초기화
    $(".timePage").remove();
    //머리글 초기화
    $(".PageHeader").remove();
    //꼬리글 초기화
    $(".PageFooter").remove();
    //머리글 입력창, 셀렉트박스 초기화
    extra_header_using_check();
    //꼬리글 입력창, 셀렉트박스 초기화
    extra_tail_using_check();
    //페이지 사이즈 조정 초기화
    pagesizeselect("A4");
};
/******************************************************************
 기능 : 모달창 닫기 - 데이터값 초기화 밑 기본값 세팅 처리
 author : 하지연
 ******************************************************************/
function close_pop1() {
    //얜 값을 넘겨야함
    $('#myModal').hide();
    $("#copyOptions").val("--인쇄--").attr("selected","selected");
};
function close_pop2(){
    //데이터 초기화
    $("#sign").val('');
    $("input:checkbox[name='rangesetting']").prop("checked",false);
    $("#range1").val('');
    $("#range2").val('');

    $('#modalcase').hide();
}
function close_pop3(){
    $('#modalcase').hide();
}
/******************************************************************
 기능 : DR Viewer 이미지 내보내기 메뉴 선택하기 (select option value 받아와서
        이미지 타입 정의 모달창 띄우기)
 author : 하지연
 ******************************************************************/
function imageOptions(){
    try{
        if ($("#saveAsImage").val() == 'PNG'){
            alert("png누름");
        }else if($("#saveAsImage").val() == 'JPG'){
            alert("jpg누름");
        }else if($("#saveAsImage").val() == 'BMP'){
            alert("bmp 누름");
        }else if($("#saveAsImage").val() == 'TIFF'){
            alert("tiff누름");
        }else if($("#saveAsImage").val() == 'GIF'){
            alert("gif누름");
        }else{
            console.log("인식못했음");
        }
    }catch(e){
        console.log(e.message);
    }
}
/******************************************************************
 기능 : 화면을 pdf로 만드는 기능
 author : 하지연
 ******************************************************************/
function makePdf() {
    console.log("왔음");
    // html2canvas(document.getElementById("pageForCopyRatio1").then((canvas) => {
    //     document.body.appendChild(canvas);
    // });
    // html2canvas(document.getElementById('reportTemplate')).then((canvas) => {
    //     console.log("reportTemplate : ",document.getElementById('reportTemplate'));
    //     console.log("canvas : ",canvas);
    //     var img = canvas.toDataURL("image/png");
    //     console.log('img : ',img);
    //     window.open().document.write('<img src="' + img + '" />');
    // });

    html2canvas(document.querySelector("#pageForCopyRatio1")).then(canvas => {
        document.body.appendChild(canvas);
        var img = canvas.toDataURL("image/png");
        window.open().document.write('<img src="' + img + '" />');
    });
    // ,{
    //     onrendered:function (canvas) {
    //         console.log("sefsef");
    //         var imgData = canvas.toDataURL('umage/png');
    //         console.log('Reort Image URL : ' + imgData);
    //         var doc = new jsPDF('p','mm',[297,210]);
    //         doc.addImage(imgData,'PNG',10,10,190,95);
    //         doc.save('sample-file.pdf');
    //     }
    // });
}
/******************************************************************
 기능 : 화면을 pdf로 만드는 기능
 author : 하지연
 ******************************************************************/
function testtest(){
    $("#cmd").on("click",function () {
        alert("눌렀음");
       var doc = new jsPDF();
       var specialElementHandlers = {
           '#editor':function (element, renderer) {
               return true;
           }
       }
       html2canvas($("#testpdf"),{
         useCORS:ture,
           allowTaint:true,
           onrendered:function(canvas){
             var imgData = canvas.toDataURL('image/jpeg');
             var doc = new jsPDF("p","mm");
             console.log(imgData);
             doc.addImage(imgData,'JPEG',0,0);
             doc.save("test.pdf");
           }
       });
    });
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

function howmanyPages(thisvalue){
    alert("this value : " + thisvalue);
}

function band_dbclick_event() {
    $(".NormalLabel_scope").on({
        "dblclick": function () {
            var this_id = this.children[0].id;
            var current = this.id;
            console.log("this : ",this);
            console.log("this_id : ",this_id);
            console.log("current : ",current);
            var current_width = this.style.width;
            var current_height = this.style.height;
            var this_text = $("#" + this_id)[0].innerText;

            if ($("#text_area")[0] === undefined) {
                var text_div = document.createElement("div");
                text_div.id = "text_div";

                var text_area = document.createElement('textarea');
                text_area.id = "text_area";
                text_area.value = this_text;
                text_area.style.width = current_width;
                text_area.style.height = current_height;
                text_area.zIndex = 999;

                this.style.borderWidth = "3px";
                this.style.borderColor = "blue";
                this.style.borderStyle = "dotted solid";

                document.getElementById(current).appendChild(text_div);
                document.getElementById(text_div.id).appendChild(text_area);

                document.getElementById(text_area.id).focus();
            }
        },
        "keydown": function (key) {
            if (key.keyCode === 13) {
                if(!key.shiftKey){
                    var insert_text = $("#text_area").val();
                    var text_convert = insert_text.replace(/(?:\r\n|\r|\n)/g, '<br />'); // html 문법으로 변환.
                    var this_id = this.children[0].id;
                    $("#"+this_id)[0].innerHTML = text_convert;
                    $("#text_div").remove();
                    this.style.borderWidth = "1px";
                    this.style.borderColor = "black";
                    this.style.borderStyle = "solid";
                }
            }else if (key.keyCode === 27){
                $("#text_div").remove();
                this.style.borderWidth = "1px";
                this.style.borderColor = "black";
                this.style.borderStyle = "solid";
            }
        }
    });
    $(".DynamicTableHeader").on({
        "dblclick": function () {
        var current = this.id;
        console.log("this : ",this);
        console.log("current : ",current);
        var current_width = this.style.width;
        var current_height = this.style.height;
        var this_text = $("#" + current)[0].innerText;

        if ($("#text_area")[0] === undefined) {
            var text_div = document.createElement("div");
            text_div.id = "text_div";

            var text_area = document.createElement('textarea');
            text_area.id = "text_area";
            text_area.value = this_text;
            text_area.style.width = current_width;
            text_area.style.height = current_height;
            text_area.zIndex = 999;

            this.style.borderWidth = "3px";
            this.style.borderColor = "blue";
            this.style.borderStyle = "dotted solid";

            document.getElementById(current).appendChild(text_div);
            document.getElementById(text_div.id).appendChild(text_area);

            document.getElementById(text_area.id).focus();
        }
    },
        "keydown": function (key) {
            if (key.keyCode === 13) {
                if(!key.shiftKey){
                    var insert_text = $("#text_area").val();
                    var text_convert = insert_text.replace(/(?:\r\n|\r|\n)/g, '<br />'); // html 문법으로 변환.
                    $("#"+this.id)[0].innerHTML = text_convert;
                    $("#text_div").remove();
                    this.style.borderWidth = "1px";
                    this.style.borderColor = "black";
                    this.style.borderStyle = "solid";
                }
            }else if (key.keyCode === 27){
                $("#text_div").remove();
                this.style.borderWidth = "1px";
                this.style.borderColor = "black";
                this.style.borderStyle = "solid";
            }
        }
    });
}