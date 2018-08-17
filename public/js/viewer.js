/******************************************************************
 기능 : DR Viewer 인쇄 메뉴 선택하기 (select option value받아와서 메뉴 인식 후 모달창 띄우기)
 author : 하지연
 ******************************************************************/
function copyoptions(){
    try{
        if ($("#copyOptions").val() == 'ecopy')
        {
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
 기능 : select option의 선택값을 기본으로 -버튼 클릭 시 5%가 추가 축소되는
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
 기능 : 모달창의 닫기 버튼
 author : 하지연
 ******************************************************************/
function close_pop() {
    $('#myModal').hide();
};
function close_pop2(){
    $('#modalcase').hide();
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