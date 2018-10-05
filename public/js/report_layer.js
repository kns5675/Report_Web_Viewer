// 작성자 : 전형준
// ReportTemplate 객체와 Report, Layer 객체를 생성하는 File.
// Layer 객체는 createBand.js File의 CreateBandArray 메소드를 실행


/**************************** ReportTemplate 객체 ***************************
 * 작성자 : 전형준
 ****************************************************************************/
function ReportTemplate(data){

    // reportTemplate.attributes["xmlns:xsd"];
    // reportTemplate.attributes["xmlns:xsi"]; // 이런식으로 접근할 것
    this.attributes = data.ReportTemplate._attributes;

    this.id = data.ReportTemplate.Id._text; // ID
    this.rectangle = data.ReportTemplate.Rectangle._text; // ReportTemplate에게 의미 없는 속성
    this.name = data.ReportTemplate.Name._text; // 이름
    this.printOder = data.ReportTemplate.PrintOder._text; // 인쇄 순서
    this.savedLocation = data.ReportTemplate.SavedLocation._text; // 파일 저장 경로
    this.mesureUnit = data.ReportTemplate.MesureUnit._text; // 사용 단위계
    this.isUsePrinterHardMargin = data.ReportTemplate.IsUsePrinterHardMargin._text; //프린터 기본여백 사용
    this.gridGap = { // 그리드 간격
        width : data.ReportTemplate.GridGap.Width._text,
        height : data.ReportTemplate.GridGap.Height._text
    };

    this.drawGrid = data.ReportTemplate.DrawGrid._text; // 그리드 라인 표시
    this.snapToGrid = data.ReportTemplate.SnapToGrid._text; // 그리드 눈금에 따른 이동

    // 웹버전은 가상화 버전과 관련이 없으므로 해당 속성에 대해서는 무시하여도 무관 //
    this.isVirtureToLocalPrint = data.ReportTemplate.IsVirtureToLocalPrint._text;
    this.imageListVirtual = data.ReportTemplate.ImageListVirtual._text;
    // 웹버전은 가상화 버전과 관련이 없으므로 해당 속성에 대해서는 무시하여도 무관 //

    this.reportList = (function(data){ // ReportList 배열 생성(Report가 한개든 이상이든)
        var list = [];
        var report = null;
        // anyType이 배열인지 체크 (List에 Report가 1개만 존재)
        if(!Array.isArray(data.anyType)){
            report = new Report(data.anyType);
            list.push(report);
        } else{ // List에 Report가 2개 이상 존재
            data.anyType.forEach(function(report){
                report = new Report(report);
                list.push(report);
            });
        }
        return list;
    })(data.ReportTemplate.ReportList);

    this.isLinkedReport = data.ReportTemplate.IsLinkedReport._text; // 리포트 연결 인쇄
    this.pasteMode = data.ReportTemplate.PasteMode._text; // 확대축소 붙이기 모드
    this.isUseExportPerGroup = data.ReportTemplate.IsUseExportPerGroup._text; // 그룹별 엑셀 내보내기 사용
}
/****************************************************************************
 ****************************************************************************/


/****************************** Report 객체*********************************
 * 작성자 : 전형준
 ***************************************************************************/
function Report(data){
    // 왜인지 모르겠지만 Sample01.DRF의 3번째 Report에서 ParentID가 존재하지 않음, 객체에 넣지 않았음
    // this.parentId = data.ParentID._text;
    this.id = data.Id._text; // id
    this.rectangle = { // 크기
        x : data.Rectangle.X === undefined ? 0 : data.Rectangle.X._text,
        y : data.Rectangle.Y === undefined ? 0 : data.Rectangle.Y._text,
        width : data.Rectangle.Width._text,
        height : data.Rectangle.Height._text
    };
    this.name = data.Name._text; // 이름
    this.lock = data.Lock === undefined ? undefined : data.Lock._text; // 잠김

    // 인쇄 무시하기란 다중의 리포트가 있는 경우 특정 리포트에 IsIgnore값을
    // true로 하게 되면 데이터 유무와 관계없이 해당 리포트는 인쇄 미리보기에서 제외함
    this.isIgnore = data.IsIgnore._text; // 인쇄 무시하기
    this.forceNewPage = data.ForceNewPage._text; // 페이지 넘기기
    this.forceNextReport = data.ForceNextReport._text === 'true' ? true : false // 리포트 넘기기
    this.multyFormCount = data.MultyFormCount._text; // 다단 전표 수
    this.annexPaper = data.AnnexPaper._text; // 별지(서브리포트)
    this.noPrintIfNoData = data.NoPrintIfNoData._text; // 데이터 테이블에 따른 인쇄 유무

    // Layers
    if(data._attributes["xsi:type"] === "Report") {
        this.layers = {
            backGroundLayer: new Layer(data.Layers.anyType[0]),
            designLayer: new Layer(data.Layers.anyType[1]),
            foreGroundLayer: new Layer(data.Layers.anyType[2])
        };
    }

    this.margin = { // 여백
        x : data.Margin.X === undefined ? 0 : data.Margin.X._text,
        y : data.Margin.Y === undefined ? 0 : data.Margin.Y._text,
        width : data.Margin.Width === undefined ? 0 : data.Margin.Width._text,
        height : data.Margin.Height === undefined ? 0 : data.Margin.Height._text
    };
    this.paperDirection = data.PaperDirection._text; // 용지 방향
    this.gutter = data.Gutter._text; // 제본용 여백
    this.gutterPosition = data.GutterPosition._text; // 제본용 여백 위치
    this.morrirMargins = data.MorrirMargins._text; // 페이지 마주보기
    this.paperType = data.PaperType._text; // 용지 타입

    if(data._attributes["xsi:type"] === "Report") {
        this.paperSize = { // 페이지 크기
            width : data.PaperSize.Width._text,
            height : data.PaperSize.Height._text
        };
    }

    this.showPageBorder = data.ShowPageBorder;
    this.hideVirtualArea = data.HideVirtualArea; // 가상 영역 숨김
    this.standardMarginPixel = data.StandardMarginPixel; // 라벨 기본 여백값
}
/***************************************************************************
 ***************************************************************************/



/************** Layer 객체(ForeGround, Design, BackGround) *****************
 * 작성자 : 전형준
 ***************************************************************************/
function Layer(data){
    this.attributes = data._attributes;
    this.name = data.Name._text;
    this.isActive = data.IsActive._text;
    this.isVisible = data.IsVisible === undefined ? undefined : data.IsVisible._text;
    this.bands = CreateBandArray(data.Bands); // 각 Layer가 갖고 있는 Bands
    this.bands = setMasterBandNSubBand(this.bands);
}
/***************************************************************************
 ***************************************************************************/
