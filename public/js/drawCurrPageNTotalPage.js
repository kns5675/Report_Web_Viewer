function drawCurrPageNTotalPageLabel(){
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