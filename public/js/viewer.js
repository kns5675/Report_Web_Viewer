var docheight; //297
var docwidth; //210
var doc;// = new jsPDF('p','mm',[297,210]);
/******************************************************************
 기능 : 이미지 내보내기, PDF내보내기, HTML내보내기 시 필요한 로딩화면 띄우기
 작성자 : 하지연
 ******************************************************************/
function beginLoading(imageName) {
    $("#imageType").text(imageName);
    console.log("불키기 들어왔따.");
    $("#loadingModal").show();
}
/******************************************************************
 기능 : 이미지 내보내기, PDF내보내기, HTML내보내기 시 필요한 로딩화면 없애기
 작성자 : 하지연
 ******************************************************************/
function endingLoading(){
   // console.log("불끄기 들어왔다.");
    $("#loadingModal").css("display","none");
}
/******************************************************************
 기능 : 리포트 리스트의 리포트들을 하나의 pdf 파일로 저장.
 작성자 : 하지연
 ******************************************************************/
async function makePdf() {
    return new Promise(function(resolve){
        var docwidth1 = Number(($("#page1").css("width")).replace(/[^0-9]/g, ''));
        var docheight1 = Number(($("#page1").css("height")).replace(/[^0-9]/g, ''));
        docwidth1 = ((docwidth1 / 96) * 25.4).toFixed(1);
        docheight1 = ((docheight1 / 96) * 0.254).toFixed(1);
        docwidth1 = Math.floor(Number(docwidth1)) - 1;
        docheight1 = Math.floor(Number(docheight1)) - 1;
        var data=100;
        //Dr Viewer의 고급인쇄에서 용지방향을 바꿨을 경우 pdf orientation값 변경 처리
        var pageOrientation;
        var area = [];

        if (docwidth1 < docheight1) {   //    용지 = 세로
            pageOrientation = 'p';    //    p = portrait : 세로
            docwidth1 = Number(210);
            docheight1 = Number(297);

        } else {   //    용지 = 가로
            docwidth1 = Number(297);
            docheight1 = Number(210);
            pageOrientation = 'l';
        }
        area = [pageOrientation, docwidth1, docheight1];
        resolve(area);
    });
}

async function beforeSaving(pageOrientation, docwidth1, docheight1) {

    return new Promise(function(resolve){
        var area;
        if (pageOrientation == 'p') {
        } else{
            pageOrientation == 'l'
        }
        area = [pageOrientation, docwidth1, docheight1];
        resolve(area);
    });
}
function createPdf(pageOrientation,docwidth1,docheight1){
    return new Promise(function(resolve){
        doc = new jsPDF(pageOrientation,'mm',[docheight1,docwidth1]);
        //console.log("docheight1 : "+docheight1 + " docwidth1 : "+docwidth1);
        var area;
        var totalnum = $(".pageforcopyratio").length;
        $(".pageforcopyratio").each(function (i, e) {
            docheight = (e.style.height).replace(/[^0-9]/g,'');
            docheight = (((Number(docheight))/96)*2.54).toFixed(1);
            docheight = Math.floor(Number(docheight))-1;

            docwidth = (e.style.width).replace(/[^0-9]/g,'');
            docwidth = (((Number(docwidth))/96)*25.4).toFixed(1);
            docwidth = Math.floor(Number(docwidth))-1;

            var pageForCopyRatioNum = e.id.replace(/[^0-9]/g,'');
            html2canvas(document.querySelector("#pageForCopyRatio"+pageForCopyRatioNum)).then(canvas => {
                var img = canvas.toDataURL("image/png");
                doc.addPage().addImage(img,'PNG',0,0,docwidth1,docheight1);
                if(i+1 ==totalnum){
                    area = [pageOrientation, docwidth1, docheight1];
                    resolve(area);
                }
            });
        });
    });
}
function saving (){
    doc.deletePage(1);  //더미 페이지 삭제
    doc.save('saveAsPdf.pdf');
}
/******************************************************************
 기능 : 리포트 리스트의 리포트들을 하나의 HTML 파일로 저장.
 작성자 : 하지연
 ******************************************************************/
function makeHTML(){
    var thistext = $("#reportTemplate").html().toString();
    var pom = document.getElementById("saveAsHTML");
    pom.setAttribute('href','data:text/plain;charset=utf-8,'+ encodeURIComponent(thistext));
    pom.setAttribute('download','saveAsHTML.html');
}
/******************************************************************
 기능 : DR Viewer 인쇄 메뉴 선택하기 (select option value받아와서 메뉴 인식 후 모달창 띄우기)
 작성자 : 하지연
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
 작성자 : 하지연
 ******************************************************************/
function sizechanged(){
    $("#txtZoom").bind("change", function(){
        test();
    });
}
/******************************************************************
 기능 : DR Viewer의 zoomIn,zoomOut기능에서 확대 또는 축소 변경 값을 받아온 후,
        다양한 브라우저의 scale값을 조정하여 zoomIn, zoomOut기능 구현
 작성자 : 하지연
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
 작성자 : 하지연
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
 작성자 : 하지연
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
 작성자 : 하지연
 ******************************************************************/
function close_pop() {
    $('#myModal').hide();//고급인쇄 모달창 닫기
    resetData();//데이터값 초기화 밑 기본값 세팅처리
}

/******************************************************************
 기능 : 고급인쇄 모달창의 데이터값 초기화 밑 기본값 세팅처리
 작성자 : 하지연
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
}
/******************************************************************
 기능 : 모달창 닫기 - 데이터값 초기화 밑 기본값 세팅 처리
 작성자 : 하지연
 ******************************************************************/
function close_pop1() {
    //얜 값을 넘겨야함
    $('#myModal').hide();
    $("#copyOptions").val("--인쇄--").attr("selected","selected");
}
function close_pop2(){
    //데이터 초기화
    $("#sign").val('');
    $("input:checkbox[name='rangesetting']").prop("checked",false);
    $("input:checkbox[name='pricetilt']").prop("checked",false);
    $("#range1").val('');
    $("#range2").val('');

    $('#modalcase').hide();
}
function close_pop3(){
    $('#modalcase').hide();
}
/******************************************************************
 기능 : - DR Viewer 이미지 내보내기 메뉴를 이용하여 SELECT의 OPTION
        값을 설정.
        - 이미지 버튼클릭 시 로딩화면 띄우기
 작성자 : 하지연
 ******************************************************************/
function imageOptions(){
    try{
        if ($("#saveAsImage").val() == 'png'){
            var typeofimages = $("#saveAsImage").val();
            beginLoading(typeofimages);
            setImageType(typeofimages);
            endingLoading();
        }else if($("#saveAsImage").val() == 'jpeg'){
            var typeofimages = $("#saveAsImage").val();
            beginLoading(typeofimages);
            setImageType(typeofimages);
            endingLoading();
        }else if($("#saveAsImage").val() == 'bmp'){
            var typeofimages = $("#saveAsImage").val();
            beginLoading(typeofimages);
            setImageType(typeofimages);
            endingLoading();
        }else if($("#saveAsImage").val() == 'tiff'){
            var typeofimages = $("#saveAsImage").val();
            beginLoading(typeofimages);
            setImageType(typeofimages);
            endingLoading();
        }else if($("#saveAsImage").val() == 'gif'){
            var typeofimages = $("#saveAsImage").val();
            beginLoading(typeofimages);
            setImageType(typeofimages);
            endingLoading();
        }else{
            console.log("인식못했음");
        }
    }catch(e){
        console.log(e.message);
    }
}
/******************************************************************
 기능 : 웹뷰어의 화면을 html2canvas모듈을 이용하여 캡쳐한 후
        SELECT의 OPTION값에서 받은 이미지의 확장자로 이미지 변환 후,
        로컬로 파일 저장.
 작성자 : 하지연
 ******************************************************************/
function setImageType(typeofimages){

    var enumber = $(".pageforcopyratio").length;

    for(var i=1; i<=enumber; i++){
        drawingCanvas(i);
    }
    function drawingCanvas(enumber){
        html2canvas(document.querySelector("#pageForCopyRatio" + enumber)).then(canvas => {
            console.log("drawingcanvas안에서 enumber : " + enumber);
            console.log("html2canvas 안에서 image type : " + typeofimages);
            document.body.appendChild(canvas);
            //var img = canvas.toDataURL("image/"+ typeofimages).replace("image/"+typeofimages,"image/octet-stream");
            var img = canvas.toDataURL("image/"+ typeofimages);
            if(enumber==1){
                window.open().document.write('<img src="' + img + '" />');
            }
            var a = document.createElement('a');
            //a.href=canvas.toDataURL('image/'+typeofimages).replace("image/"+typeofimages,"image/octet-stream");
            //a.href=canvas.toDataURL('image/'+typeofimages).replace("image/"+typeofimages);
            a.href=img;
            a.download = 'saveAs' + typeofimages+ '.' + typeofimages;
            a.click();
        });
    }
    $("#saveAsImage").val("--이미지--").attr("selected","selected");
}
/******************************************************************
 기능 : select box에서 이미지 타입을 받아 해당타입의 이미지로 저장하는 기능
 작성자 : 하지연
 ******************************************************************/
function saveImages(typeofimages, currentindex){
    console.log("받아오는 이미지 타입 : " + typeofimages);
    var pageForCopyRatioNum = $(".pageforcopyratio").length;
    console.log("총 페이지 수 : " + pageForCopyRatioNum);

    var values = [1,2,3,4,5,6,7,8,9,10];
    // var currentindex ;
   return {
       next: function(){
           html2canvas(document.querySelector("#pageForCopyRatio"+currentindex)).then(canvas => {
               console.log("html2canvas 까지 들어왔음 : " + currentindex);
               console.log("html2canvas 안에서 typeof images 찍어봄 : " + typeofimages);
               document.body.appendChild(canvas);
               var img = canvas.toDataURL("image/"+ typeofimages).replace("image/"+ typeofimages,"image/octet-stream");
               window.open().document.write('<img src="' + img + '" />');
               setTimeout(function(){
                   saveSaveSave(canvas,typeofimages);
               },2000);
           });
           // var done = (currentindex =$(".pageforcopyratio").length);
           var iteration = {
               value:values[currentindex]
               // done: done
           }
               // currentindex++;
               return iteration;
       }
   }
}

function saveSaveSave(canvas, typeofimages){
    console.log("savesavesave들어옴");
    console.log("typeofimages : " + typeofimages);

    if(typeofimages == 'png'){
        console.log("png임");
        return Canvas2Image.saveAsPNG(canvas);
    }else{
        console.log("jpeg임");
        return Canvas2Image.saveAsJPEG(canvas);
    }
}
function saveSaveSave1(canvas, typeofimages, enumber){
    console.log("savesavesave들어옴 enumber는 : " + enumber );
    console.log("typeofimages : " + typeofimages);

    if(typeofimages == 'png'){
        console.log("png임");
        return Canvas2Image.saveAsPNG(canvas);
    } else {
        console.log("jpeg임");
        return Canvas2Image.saveAsJPEG(canvas);
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

function howmanyPages(thisvalue){
    alert("this value : " + thisvalue);
}

//학준 추가
function band_dbclick_event(data) {
    if (data.ReportTemplate.ReportList.anyType.Editable !== undefined) {
        var Editable = data.ReportTemplate.ReportList.anyType.Editable._text;
        if (Editable == "true") {
            $(".NormalLabel_scope").on({
                "dblclick": function () {
                    var this_text;
                    var this_id = this.children;
                    for(var i=0; i<this_id.length; i++){
                        if(this_id[i].id){
                            this_text = $("#" + this_id[i].id)[0].innerText;
                            var current = this.id;
                            var current_width = this.style.width;
                            var current_height = this.style.height;

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
                        }
                    }
                },
                "keydown": function (key) {
                    if (key.keyCode === 13) { //enter 처리
                        if (!key.shiftKey) {  //shift + enter 처리
                            var insert_text = $("#text_area").val();
                            var text_convert = insert_text.replace(/(?:\r\n|\r|\n)/g, '<br />'); // html 문법으로 변환.
                            var this_id = this.children;
                            for(var i=0; i<this_id.length; i++){
                                if(this_id[i].id){
                                    $("#" + this_id[i].id)[0].innerHTML = text_convert;
                                    $("#text_div").remove();
                                    this.style.borderWidth = "1px";
                                    this.style.borderColor = "black";
                                    this.style.borderStyle = "solid";
                                }
                            }

                        }
                    } else if (key.keyCode === 27) { //esc 처리
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
                        if (!key.shiftKey) {
                            var insert_text = $("#text_area").val();
                            var text_convert = insert_text.replace(/(?:\r\n|\r|\n)/g, '<br />'); // html 문법으로 변환.
                            $("#" + this.id)[0].innerHTML = text_convert;
                            $("#text_div").remove();
                            this.style.borderWidth = "1px";
                            this.style.borderColor = "black";
                            this.style.borderStyle = "solid";
                        }
                    } else if (key.keyCode === 27) {
                        $("#text_div").remove();
                        this.style.borderWidth = "1px";
                        this.style.borderColor = "black";
                        this.style.borderStyle = "solid";
                    }
                }
            });

            $('.NormalLabel').on("click", function () {
                // autoSize(this.id);
            });
        }
    }
}

function print_test() {
    console.log("test");
}

/******************************************************************
 기능 : 라벨 클릭시 자동 사이즈 조절 기능 추가.
 이슈 : 문자 크기 기준으로 글자수를 확인해서 가로/세로 크기를 조정해주는데, 문자가 영어/한국어 사이즈가 다른데 해당 처리가 안되어 있으며,
 p태그 내부에 또 p태그가 있을 경우 해당 태그를 모두 텍스트로 구분해서 너무 긴 라벨이 생성되는 문제가 생김.
 일단은 최대 크기를 조정해두는 방식으로 묶어둠.
 날짜 : 2018-09-07
 만든이 : 김학준
 ******************************************************************/
function autoSize(pTagId) {
    var tag = $('#' + pTagId);
    var fontSize = (tag.css('font-size')).split('p');
    var tag_row = (tag[0].innerHTML).split('<br>');
    var big_row = 1;
    tag_row.forEach(function (e) {
        var cutting_row = e.replace(/(^\s*)|(\s*$)/, '');
        if (big_row < cutting_row.length) {
            big_row = cutting_row.length;
        }
    });
    // 16pt 이런 식으로 값이 받아져서 p앞으로 끊어서 숫자만 받아오려고 한 문자열 자르기 작업
    var brTag = $('#' + pTagId + ' br');
    var brCount = brTag.length;
    var one_line = 0;
    if (brCount == 0) {//텍스트가 한줄일 경우를 위해 마진 값을 추가.
        one_line = 6;
    }
    // text중에서 <br/>의 개수를 구함
    var widths;
    if (fontSize[0] > 20) {
        widths = (fontSize[0]) * big_row;
    } else if (fontSize[0] < 10) {
        widths = (fontSize[0] + 2) * big_row;
    } else {
        widths = (fontSize[0] - 3) * big_row;
    }
    var designLayerSize = $(".designLayer")[0].style.width.split('p');
    if (widths > designLayerSize[0]) {
        widths = designLayerSize;
    }
    var height = fontSize[0] * (brCount + 1) + brCount + one_line;
    tag.parent().css({
        'width': widths + 'px',
        'height': height + 'px'
        // 'top': (height*1 + fontSize[0]*1) + 'px'
    });
    tag.css({
        'margin-left': '3px',
        'margin-right': '3px',
        'margin-top': '3px',
        'margin-bottom': '3px'
    });
}
