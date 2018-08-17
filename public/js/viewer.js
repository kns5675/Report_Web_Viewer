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
function sizechanged(){
    $("#txtZoom").bind("change", function(){
        test();
    });
}
function test(){
    try {
        var flexiblecontent = document.getElementById("reportTemplate");
        var size = $("#txtZoom").val();

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
function zoomIn(){
    try {
        var size = $("#txtZoom").val();
        size = parseFloat(size);
        size = (size + 0.05).toFixed(2);

        $("#txtZoom").val();
        $("#option1").val(size);
        var optionsize  = $("#option1").val();

        var changedoption1 = ((($("#option1").val())*100).toFixed(0)+"%");
        $("#option1").text(changedoption1);
        $("#txtZoom option:last").attr("selected","selected");
        test();
    }
    catch(e) {
        alert("test ==> " + e.message);
    }
}
function zoomOut(){
    try {
        var size = $("#txtZoom").val();

        var size = parseFloat(size);
        //string 형 size를 parseFloat이용해서 number형으로 변환시켰음.

        size = (size - 0.05).toFixed(2);
        $("#txtZoom").val();
        $("#option1").val(size);

        var changedoption1 = ((($("#option1").val())*100).toFixed(0)+"%");
        $("#option1").text(changedoption1);
        $("#txtZoom option:last").attr("selected","selected");

        test();
    }
    catch(e) {
        alert(e.message);
    }
}
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