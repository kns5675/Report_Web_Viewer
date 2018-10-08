/******************************************************************
 기능 : 인쇄버튼 클릭시 DR Viewer에서 적용된 페이지 비율 값은 무시하고 100%배율로
        출력할수 있게 한 후, 인쇄창을 닫으면 기존에 적용된 페이지 비율로 화면 볼수있게 세팅
 author : 하지연
 ******************************************************************/
function pagePrint(){
    try{
        var temp_padding = $('#temp_reportTemplate').css('padding-top');
        $('#temp_reportTemplate').css('padding-top', '0px');
        $('.pageforcopyratio').css('outline', 'none')
        var flexiblecontent = document.getElementById("temp_reportTemplate");

        if (jQuery.browser.msie) {
            flexiblecontent.style.zoom = 1.0;
            window.print();
            $("#copyOptions").val("--인쇄--").attr("selected","selected");
            //alert($("#txtZoom option:selected").val());
            $('#temp_reportTemplate').css('padding-top', temp_padding);
            $('.pageforcopyratio').css('outline', 'outline', '1px solid black');
        }
        else {
            $(flexiblecontent).css('-webkit-transform','scale(' + (1.0) + ')');
            $(flexiblecontent).css('-webkit-transform-origin','0 0');
            $(flexiblecontent).css('-moz-transform','scale(' + (1.0) + ')');
            $(flexiblecontent).css('-moz-transform-origin','0 0');
            $(flexiblecontent).css('-o-transform','scale(' + (1.0) + ')');
            $(flexiblecontent).css('-o-transform-origin','0 0');
            window.print();//100%비율 값 넣고 윈도우의 프린트 기능 이용하여 프린트
            $("#copyOptions").val("--인쇄--").attr("selected","selected");
            
            nowsize = $("#txtZoom option:selected").val();//기존에 적용된 option에 값을 들고와서
            $("#option1").val(nowsize).attr("selected","selected");
            $("#option1").text((nowsize*100).toFixed(0)+ "%");//select option값에 보여주고
            $(flexiblecontent).css('-webkit-transform','scale(' + (nowsize) + ')');//css적용하여 기존화면 비율적용
            $(flexiblecontent).css('-webkit-transform-origin','0 0');
            $(flexiblecontent).css('-moz-transform','scale(' + (nowsize) + ')');
            $(flexiblecontent).css('-moz-transform-origin','0 0');
            $(flexiblecontent).css('-o-transform','scale(' + (nowsize) + ')');
            $(flexiblecontent).css('-o-transform-origin','0 0');
            $('#temp_reportTemplate').css('padding-top', temp_padding);
            $('.pageforcopyratio').css('outline', '1px solid black');

        }
    }catch(e){
        console.log(e.message);
    }
}