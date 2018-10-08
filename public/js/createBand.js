// 작성자 : 전형준
// report_layer.js의 Layer 객체에 band.js에 정의한 객체들을
// Bands와 각 Band의 ChildBands, ChildHeaderBands, ChildFooterBands에 생성



/********************** 밴드 배열 생성 메소드 ************************
* 작성자 : 전형준
***********************************************************************/
function CreateBandArray(data, parentBand){
    var band_list = [];
    var band = null;
    if(Array.isArray(data.anyType)){ // Layer의 Band 또는 ChildBands 배열일 때
        data.anyType.forEach(function(band){
            band = CreateBand(band, parentBand);
            band_list.push(band);
        });
    } else{ // Layer의 Band 또는 ChildBands 배열이 아닐 때
        band = CreateBand(data.anyType, parentBand);
        band_list.push(band);
    }
    return band_list;
}

/***********************************************************************
 ***********************************************************************/



/************  밴드 타입에 맞는 밴드 객체 생성을 위한 함수 *************
 * 작성자 : 전형준
************************************************************************/
function CreateBand(band, parentBand){
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
            return_band = new BandDataHeader(band, parentBand);
            break;
        case "BandDataFooter" : // 데이터 풋터 밴드
            return_band = new BandDataFooter(band, parentBand);
            break;
        case "BandGroupHeader" : // 그룹 헤더 밴드
            return_band = new BandGroupHeader(band, parentBand);
            break;
        case "BandGroupFooter" : // 그룹 풋터 밴드
            return_band = new BandGroupFooter(band, parentBand);
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
            return_band = new BandDummyHeader(band, parentBand);
            break;
        case "BandDummyFooter" : // 더미 풋터 밴드
            return_band = new BandDummyFooter(band, parentBand);
            break;
    }

    return return_band;
}
/*********************************************************************
*********************************************************************/

/************  밴드 객체 생성되면서 마스터밴드에 서브밴드의 객체 변수를 세팅 *************
 * 작성자 : 전형준
 *****************************************************************************************/
function setMasterBandNSubBand(input_bands){
    input_bands.forEach(function(sub_band, sub_index) {
        // 데이터 밴드가 아니라면 조기리턴
        if (sub_band.attributes["xsi:type"] !== "BandData"){
            return;
        }

        // masterBand를 갖는 데이터밴드의 masterBand에 subBand를 만들어줌
        // hasSubBand 변수를 true로 세팅, subBandArr 변수에 서브밴드 객체들을 넣어줌
        if(sub_band.masterBandName !== undefined){
            input_bands.forEach(function(master_band, master_index){
                if(sub_band.masterBandName === master_band.name){
                    input_bands[master_index].hasSubBand = true;
                    input_bands[master_index].subBandArr =
                        (input_bands[master_index].subBandArr === undefined ? [] : input_bands[master_index].subBandArr);
                    input_bands[master_index].subBandArr.push(sub_band); // 마스터 밴드에게는 서브밴드 객체를
                    input_bands[sub_index].masterBandObj = input_bands[master_index]; //  서브 밴드에게는 마스터밴드 객체를
                }
            });
        }
    });
    return input_bands;
}