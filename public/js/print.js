function pagePrint(ratio){
    try{
        alert("ratio : "+ ratio);
        alert("type of ratio : "+typeof ratio);
        var flexiblecontent = document.getElementById("reportTemplate");
        //$("#txtZoom").val();
        //$("#txtZoom").val(ratio);
        //alert("txtZoom 값 : " + $("#txtZoom").val());
        var size = $("#txtZoom").val();
        alert("size : " + size);
        //$("#txtZoom option:eq(2)").attr("selected","selected");
        //alert("알려주세욤 1이라고해! : " + $("#txtZoom option:selected").val());
        //alert("size 값은 ? : "+size);

        window.print();
        alert("지금 배율이 몇인지 : "+$("#txtZoom").val());
        if (jQuery.browser.msie) {
            flexiblecontent.style.zoom = 1.0;
        }
        else {
            $(flexiblecontent).css('-webkit-transform','scale(' + (1.0) + ')');
            $(flexiblecontent).css('-webkit-transform-origin','0 0');
            $(flexiblecontent).css('-moz-transform','scale(' + (1.0) + ')');
            $(flexiblecontent).css('-moz-transform-origin','0 0');
            $(flexiblecontent).css('-o-transform','scale(' + (1.0) + ')');
            $(flexiblecontent).css('-o-transform-origin','0 0');
        }
    }catch(e){
        console.log(e.message);
    }
}