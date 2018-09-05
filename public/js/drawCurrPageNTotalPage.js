/**********************************************
 * 작성자 : 전형준
 * 기능 : System Label 중 PageNumber, TotalPage, PageNumber / TotalPage
 *        이 세 Label을 그려주는 함수.
 *        PageNumberLabel을 제외한 두 Label은 TotalPage를 구해야 하므로,
 *        Page가 모두 그려진 후 마지막에 함수를 실행하는 것이 바람직.
 ***********************************************************************/

// 아래 함수들을 모두 실행
function drawPageNumberInSystemLabel(){
    drawPageNumberNTotalPageLabel();
    drawTotalPageLabel();
    drawPageNumberLabel();
}

function drawPageNumberNTotalPageLabel(){
    var allPageNumTotalPageTag = $('.pageNumberTotalPage');
    for(var i = 0; i< allPageNumTotalPageTag.length; i++){
        allPageNumTotalPageTag.eq(i).text(
            allPageNumTotalPageTag.eq(i).parents('.page').attr('id').substring(4) + " / " + (pageNum-1)
        );
    }
}

function drawTotalPageLabel(){
    var totalPageTag = $('.totalPage');
    for(var i=0; i<totalPageTag.length-1; i++){
        totalPageTag.eq(i).text(pageNum-1);
    }
}

function drawPageNumberLabel(){
    var pageNumberTag = $('.pageNumber');
    for(var i = 0; i< pageNumberTag.length; i++){
        pageNumberTag.eq(i).text(
            pageNumberTag.eq(i).parents('.page').attr('id').substring(4)
        );
    }
}