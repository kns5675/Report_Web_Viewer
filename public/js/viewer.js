function copyoptions(){
    $("#copyOptions").live("change",function(){
        //copytest();
        try{
            alert("copytest들어왔음");

            if ($("#copyOptions").val() == 'enhancedcopy')
            {   alert("고급인쇄들어왔음");
                //$('#myModal').css('display','block');
                $('#myModal').show();
            }else if($("#copyOptions").val() == 'copy'){
                alert("그냥인쇄왔음");
                $('#myModal').css('display','none');
            }else{
                alert("인식못했음");
            }
        }catch(e){
            console.log(e.message);
        }
    });
}
/*function copytest(){
    try{
        alert("copytest들어왔음");

            if ($("#copyOptions").val() == 'enhancedcopy')
            {   alert("고급인쇄들어왔음");
                $('#enhancedcopymodal').css('display','block');
            }else if($("#copyOptions").val() == 'copy'){
                alert("그냥인쇄왔음");
                $('#enhancedcopymodal').css('display','none');
            }else{
                alert("인식못했음");
            }
    }catch(e){
        console.log(e.message);
    }
}*/
function sizechanged(){
    $("#txtZoom").live("change", function(){//live로 한 이유 : on은 jquery버전상 안맞아서 live써야함 지연피셜
        //alert($(this).val());
        test();
    });
}
function test(){
    try {
        var flexiblecontent = document.getElementById("content");
        var size = $("#txtZoom").val();

        if (jQuery.browser.msie) {
            flexiblecontent.style.zoom = size;
        }
        else {
            //alert("test else들옴");
            $('#content').css('-webkit-transform','scale(' + (size) + ')');
            $('#content').css('-webkit-transform-origin','0 0');
            $('#content').css('-moz-transform','scale(' + (size) + ')');
            $('#content').css('-moz-transform-origin','0 0');
            $('#content').css('-o-transform','scale(' + (size) + ')');
            $('#content').css('-o-transform-origin','0 0');
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
        // alert("calculated asize : " + size);
        $("#txtZoom").val();
        $("#option1").val(size);
        //alert("option1의 밸류값은 : " + $("#option1").val());
        var changedoption1 = ((($("#option1").val())*100).toFixed(0)+"%");
        $("#option1").text(changedoption1);
        $("#txtZoom option:last").attr("selected","selected");
        //alert("txtZoom 의 밸류 값은 : " + $("#txtZoom").html());

        test();
    }
    catch(e) {
        alert("test ==> " + e.message);
    }
}
//팝업 Close 기능
function close_pop(flag) {
    $('#myModal').hide();
};