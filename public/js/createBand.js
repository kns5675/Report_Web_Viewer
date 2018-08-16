// 작성자 : 전형준
// report_layer.js의 Layer 객체에 band.js에 정의한 객체들을
// Bands와 각 Band의 ChildBands, ChildHeaderBands, ChildFooterBands에 생성



// ==================== 밴드 배열 생성 메소드 ==================== //
// 작성자 : 전형준
// =============================================================== //
function CreateBandArray(data){
    var band_list = new Array();
    var band = null;
    if(Array.isArray(data.anyType)){ // Layer의 Band 또는 ChildBands 배열일 때
        data.anyType.forEach(function(band){
            band = CreateBand(band);
            band_list.push(band);
        });
    } else{ // Layer의 Band 또는 ChildBands 배열이 아닐 때
        this.band = CreateBand(data.anyType);
        band_list.push(band);
    }
    return band_list;
}
// ============================================================= //



// ========== 밴드 타입에 맞는 밴드 객체 생성을 위한 함수 ========== //
// 작성자 : 전형준
// ================================================================= //
function CreateBand(band){
    var return_band = null;
    switch(band._attributes["xsi:type"]){
        case "BandBackGround" : // 백그라운드레이어 - 백그라운드밴드
            return_band = new BandBackGround(band);
            break;
        case "BandForeGround" : // 포그라운드레이어 - 포그라운드밴드
            return_band = new BandForeGround(band);
            break;
        case "BandPageHeader" : // 페이지 헤더 밴드
            return_band = new BandPageHeader(band);
            break;
        case "BandTitle" : // 타이틀 밴드
            return_band = new BandTitle(band);
            break;
        case "BandData" : // 데이터 밴드
            return_band = new BandData(band);
            break;
        case "BandDataHeader" : // 데이터 헤더 밴드
            return_band = new BandDataHeader(band);
            break;
        case "BandDataFooter" : // 데이터 풋터 밴드
            return_band = new BandDataFooter(band);
            break;
        case "BandGroupHeader" : // 그룹 헤더 밴드
            return_band = new BandGroupHeader(band);
            break;
        case "BandGroupFooter" : // 그룹 풋터 밴드
            return_band = new BandGroupFooter(band);
            break;
        case "BandTail" : // 테일 밴드
            return_band = new BandTail(band);
            break;
        case "BandPageFooter" : // 페이지 풋터 밴드
            return_band = new BandPageFooter(band);
            break;
        case "BandSummary" : // 써머리 밴드
            return_band = new BandSummary(band);
            break;
        case "BandDummy" : // 더미 밴드
            return_band = new BandDummy(band);
            break;
        case "BandSubReport" : // 서브 리포트 밴드
            return_band = new BandSubReport(band);
            break;
        case "BandDummyHeader" : // 더미 헤더 밴드
            return_band = new BandDummyHeader(band);
            break;
        case "BandDummyFooter" : // 더미 풋터 밴드
            return_band = new BandDummyFooter(band);
            break;
    }

    return return_band;
}
// ============================================================== //