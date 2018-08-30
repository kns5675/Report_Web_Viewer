var docheight; //297
var docwidth; //210
var doc;// = new jsPDF('p','mm',[297,210]);
/******************************************************************
 기능 : 화면을 pdf로 만드는 기능
 author : 하지연
 /* console.log("왔음");
 html2canvas(document.getElementById("forcopyratio1"),{
        onrendered:function (canvas) {
            var imgData = canvas.toDataURL('image/png');
            console.log("imgData : " + imgData );
            var dataUrl = canvas.toDataURL();
            var doc = new jsPDF('p','mm',[297,210]);
            console.log('doc : ' + doc);
            doc.addImage(imgData,'PNG',10,10,190,95);
            doc.save('sample-file.pdf');
        }
    });
 ******************************************************************/
function makePdf() {
    //도큐먼트 내의 #pageForCopyRatio1의 width, height값 가져옴.(px -> mm & String -> Number)
    var docwidth1 = Number(($("#page1").css("width")).replace(/[^0-9]/g,''));
    var docheight1 = Number(($("#page1").css("height")).replace(/[^0-9]/g,''));

    docwidth1=((docwidth1/96)*25.4).toFixed(1);
    docheight1=((docheight1/96)*0.254).toFixed(1);

    docwidth1 = Math.floor(Number(docwidth1))-1;
    docheight1 = Math.floor(Number(docheight1))-1;

    var pHeight = Number(297);
    var pWidth = Number(210);


    console.log("this width : " + docwidth1 + " type : " + typeof docwidth1); //페이지 세로일 때 210 //페이지 가로일떄 297
    console.log("this height : " + docheight1 + " type : " + typeof docheight1); //페이지 세로일때 297 //페이지 세로일때 210

    //Dr Viewer의 고급인쇄에서 용지방향을 바꿨을 경우 pdf orientation값 변경 처리
    var pageOrientation;

    if(docwidth1==210){
        pageOrientation='p';
        docwidth1 = Number(210);
        docheight1 = Number(297);
        beforeSaving(pageOrientation,docwidth1,docheight1);
        console.log("세로일때 page orientation : "+pageOrientation);

    }else {
        docwidth1 = Number(297);
        docheight1 = Number(210);
        pageOrientation='l';
        beforeSaving(pageOrientation,docwidth1,docheight1);
        console.log("가로일때 page orientation : "+pageOrientation);
    }

    function beforeSaving(pageOrientation,docwidth1,docheight1){
        if(pageOrientation =='p'){
            console.log("세로 before saving 들어왔음");
            createPdf(pageOrientation,docwidth1,docheight1);
        }else if(pageOrientation == 'l'){
            console.log("가로 before saving 들어왔음");
            createPdf(pageOrientation,docwidth1,docheight1);
        }

        function createPdf(pageOrientation){
            doc = new jsPDF(pageOrientation,'mm',[docheight1,docwidth1]);
            console.log("docheight1 : "+docheight1 + " docwidth1 : "+docwidth1);

            $(".pageforcopyratio").each(function (i, e, pageOrientation) {
                //console.log("PAGE ORIENTATION : " + pageOrientation);
                docheight = (e.style.height).replace(/[^0-9]/g,'');
                docheight = (((Number(docheight))/96)*2.54).toFixed(1);
                docheight = Math.floor(Number(docheight))-1;

                docwidth = (e.style.width).replace(/[^0-9]/g,'');
                docwidth = (((Number(docwidth))/96)*25.4).toFixed(1);
                docwidth = Math.floor(Number(docwidth))-1;

                var pageForCopyRatioNum = e.id.replace(/[^0-9]/g,'');
                console.log("pageForCopyRatioNum : " + pageForCopyRatioNum);
                html2canvas(document.querySelector("#pageForCopyRatio"+pageForCopyRatioNum)).then(canvas => {
                    console.log("들어왔는강" + " docwidth1 : "+docwidth1 + " " + typeof docwidth1 + " docheight1 : "+ docheight1 + " " + typeof docheight1);
                    var img = canvas.toDataURL("image/png");
                    doc.addPage().addImage(img,'PNG',0,0,docwidth1,docheight1);
                });
            });

        }
            console.log("doc : ", doc);
    }
}
function saving (){
    console.log("들어왔어욤1");
    doc.deletePage(1);  //더미 페이지 삭제
    doc.save('saveAsPdf.pdf');
}
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
        if ($("#saveAsImage").val() == 'png'){

            var typeofimages = $("#saveAsImage").val();
            console.log("type of images : "+ typeofimages);
            saveImages(typeofimages);
        }else if($("#saveAsImage").val() == 'jpeg'){
            var typeofimages = $("#saveAsImage").val();
            console.log("type of images : "+ typeofimages);
            saveImages(typeofimages);
        }else if($("#saveAsImage").val() == 'bmp'){
            var typeofimages = $("#saveAsImage").val();
            console.log("type of images : "+ typeofimages);
            saveImages(typeofimages);
        }else if($("#saveAsImage").val() == 'tiff'){
            var typeofimages = $("#saveAsImage").val();
            console.log("type of images : "+ typeofimages);
            saveImages(typeofimages);
        }else if($("#saveAsImage").val() == 'gif'){
            var typeofimages = $("#saveAsImage").val();
            console.log("type of images : "+ typeofimages);
            saveImages(typeofimages);
        }else{
            console.log("인식못했음");
        }
    }catch(e){
        console.log(e.message);
    }
}
/******************************************************************
 기능 : select box에서 이미지 타입을 받아 해당타입의 이미지로 저장하는 기능
 author : 하지연
 ******************************************************************/
function saveImages(typeofimages){
    alert(typeofimages);


    /*var eCopyRate = $("#copyratio").val();
    $(".page").each(function (i, e) {
        // console.log("e : ", e.id);
        var idnum = e.id.replace(/[^0-9]/g,'');

        eSetFont();
        eCopyRatio(eCopyRate, idnum);//인쇄배율 변경 펑션
    });*/



    html2canvas(document.querySelector("#pageForCopyRatio1")).then(canvas => {
        document.body.appendChild(canvas);
        console.log("typeofimages : "+ typeofimages);
        var thisdata = ("image/"+ typeofimages);
        console.log(typeof typeofimages); //string
        console.log("this data : " + thisdata); //this data : image/jpg,png이런식으로 나옴.
        var img = canvas.toDataURL("image/"+ typeofimages);
        window.open().document.write('<img src="' + img + '" />');
    });


    $("#saveAsImage").val("--이미지--").attr("selected","selected");
}


/*
promise 예제
function pre(){
    return new Promise(function (resolve, reject) {
        var data11 = 100;
        resolve(data11);

        console.log("100이전에!!")
    });
};


pre().then(function(resolvedData){
    console.log("############## : "+resolvedData);//100찍힘.
});*/

function example(){
      var doc = new jsPDF();
       var specialElementHandlers = {
           '#editor':function(element,renderer){
               return true;
           }
       }
       //html2canvas안에 첫번쨰 인자는 캡쳐하고싶은 element적는거임.
       //onrendered는 html2canvas가 캡쳐한 후 canvas개체가 사용될준비가 되면 실행되는 것이다.
       html2canvas($("#testpdf"),{
           useCORS:false,
           allowTaint:false,
           onrendered:function(canvas){
               var imgData = canvas.toDataURL('image/jpeg');
               //var imgData = canvas.getContext("2d");
               //var img = new Image();
               //img.src = ctx.toDataURL('image/png');
               //ctx.drawImage(img,297,210);

               var doc = new jsPDF("p","mm",[297,210]);
               console.log(imgData);
               doc.addImage(imgData,'JPEG',0,15,210,297);
               doc.save('test.pdf');
           }
       });
}

function getScreenshot(){
    html2canvas(document.getElementById('text'),{
        onrendered: function(canvas){
            console.log("1");
            $('#box1').html("");
            console.log("2");
            $('#box1').append(canvas);
            console.log("3");
        }
    });
}
function genScreenshot() {

    html2canvas(document.body, {
        onrendered: function(canvas) {
            console.log($('#text').html());
            $('#box1').html("");
            $('#box1').append(canvas);

            if (navigator.userAgent.indexOf("MSIE ") > 0 ||
                navigator.userAgent.match(/Trident.*rv\:11\./))
            {
                console.log("if들오옴");
                var blob = canvas.msToBlob();
                window.navigator.msSaveBlob(blob,'Test_file.png');
            }
            else {
                console.log("else들오엄");
                $('#ttest').attr('href', canvas.toDataURL("image/png"));
                $('#ttest').attr('download','Test_file.png');
                $('#ttest')[0].click();
            }


        }
    });
}
/*function genPDF(){
   // var htmlToImage = require('html-to-image');

    var node = document.getElementById('testDiv');
    htmlToImage.toPng(node)
        .then(function (dataUrl) {
            var img = new Image();
            document.body.appendChild(img);
        })
        .catch(function(error){
           console.log('opps... something went wrong....',error);
        });
}*/
/******************************************************************
 기능 : 화면을 pdf로 만드는 기능
 author : 하지연
 ******************************************************************/
function testtest(){
    $("#cmd").on("click",function () {
        alert("눌렀음");
        var doc = new jsPDF();
        alert("doc : " + doc);
        var pdfHandlers = {
            '#editor': function (element, renderer) {
                return true;
            }
        };
        html2canvas(document.getElementById("testpdf"),{
            onrendered:function(canvas){
                var imgData = canvas.toDataURL('image/png');
                var doc = new jsPDF("p","mm",[297,210]);
                doc.addImage(imgData,'PNG',10,10,190,95);
                doc.save('test.pdf');
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


//학준 추가
function band_dbclick_event() {
    $(".NormalLabel_scope").on({
        "dblclick": function () {
            var this_id = this.children[0].id;
            var current = this.id;
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
            if (key.keyCode === 13) { //enter 처리
                if(!key.shiftKey){  //shift + enter 처리
                    var insert_text = $("#text_area").val();
                    var text_convert = insert_text.replace(/(?:\r\n|\r|\n)/g, '<br />'); // html 문법으로 변환.
                    var this_id = this.children[0].id;
                    $("#"+this_id)[0].innerHTML = text_convert;
                    $("#text_div").remove();
                    this.style.borderWidth = "1px";
                    this.style.borderColor = "black";
                    this.style.borderStyle = "solid";
                }
            }else if (key.keyCode === 27){ //esc 처리
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
