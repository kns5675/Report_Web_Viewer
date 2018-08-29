// Label 객체

// console.log(data.ReportTemplate.ReportList.anyType.Layers.anyType[1].Bands.anyType[0].ControlList.anyType);

/******************************************************************
 기능 : Label에 대한 공통 속성을 빼내서 객체를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function Label(data){
    this.parentId = data.ParentID === undefined ? undefined : data.ParentID._text;
    this.id = data.Id._text;
    // x : (data.Rectangle.X === undefined ? 0 : data.Rectangle.X._text)
    this.rectangle = {
        x : (data.Rectangle.X === undefined ? 0 : data.Rectangle.X._text),
        y : (data.Rectangle.Y === undefined ? 0 : data.Rectangle.Y._text),
        width : data.Rectangle.Width._text,
        height : data.Rectangle.Height._text
    };

    this.name = data.Name._text;
    this.Lock = data.Lock;
    this.dataType = (data.DataType === undefined ? 0 : data.DataType._text); // 데이터 형태
    this.imageTransparent = (data.ImageTransparent === undefined ? 0 : data.ImageTransparent._text); // 이미지 투명도
    this.zOrder = (data.ZOrder === undefined ? 0 : data.ZOrder._text);

    this.borderThickness = (data.BorderThickness === undefined ? undefined : { // 테두리 두께 (있을 수도 있고 없을 수도 있는 속성)
        left : (data.BorderThickness.Left === undefined ? 0 : data.BorderThickness.Left._text),
        top : (data.BorderThickness.Top === undefined ? 0 : data.BorderThickness.Top._text),
        right : (data.BorderThickness.Right === undefined ? 0 : data.BorderThickness.Right._text),
        bottom : (data.BorderThickness.Bottom === undefined ? 0 : data.BorderThickness.Bottom._text)
    });

    this.enableBorder = (data.EnableBorder === undefined ? undefined : { // boolean이라는 태그 이름으로 총 4개가 들어가있어서 어떻게 해야할지 모르겠담..
        boolean1 : data.EnableBorder.boolean[0]._text,
        boolean2 : data.EnableBorder.boolean[1]._text,
        boolean3 : data.EnableBorder.boolean[2]._text,
        boolean4 : data.EnableBorder.boolean[3]._text
    });

    if(data.Font === undefined){
        this.fontFamily = '굴림';
        this.fontSize = '10pt';
        this.fontStyle = 'normal';
    } else {
        Font = (data.Font._text).split(','); // 굴림, 10pt(, style=bold)로 되어있어서 잘라야함
        this.fontFamily = Font[0];
        this.fontSize = (Font[1]).trim(); // 공백 제거
        if(Font.length == 3){ // ex) 굴림, 10pt, style=bold일 때
            this.fontStyle = (Font[2]).trim(); // 공백 제거
        } else {
            this.fontStyle = 'normal';
        }
    }
    this.borderDottedLines = data.EnableBorder === undefined ? undefined : data.BorderDottedLines._text; // 테두리 점선 left, right, top, bottom있는 것 같음
    this.indentLB = data.IndentLB === undefined ? undefined : data.IndentLB._text; // 들여쓰기
    this.interMargin = data.InterMargin === undefined ? undefined : data.InterMargin._text; // 내부 여백

    this.lbRec = (data.LbRec === undefined ? undefined : {
        x : (data.GradientLB.LbRec.X === undefined ? 0 : data.GradientLB.LbRec.X._text),
        y : (data.GradientLB.LbRec.Y === undefined ? 0 : data.GradientLB.LbRec.Y._text),
        width : (data.GradientLB.LbRec.Width === undefined ? 0 : data.GradientLB.LbRec.Width._text),
        height : (data.GradientLB.LbRec.Height === undefined ? 0 : data.GradientLB.LbRec.Height._text)
    });

    this.isUseGradient = data.IsUseGradient === undefined ? false : data.IsUseGradient._text; // 그라데이션 사용 여부
    this.gradientColor = data.GradientColor === undefined ? undefined : data.GradientColor._text; // 그라데이션 색
    this.startGradientDirection = data.StartGradientDirection === undefined ? undefined : data.StartGradientDirection._text; // 그라데이션 시작 방향
    this.gradientDerection = data.GradientDerection === undefined ? undefined : data.GradientDerection._text; // 그라데이션 방향

    this.indexUnderLine = (data.IndexUnderLine === undefined ? undefined : { // 이중 밑줄
        isUse : (data.IndexUnderLine.IsUse === undefined ? 0 : data.IndexUnderLine.IsUse._text), // 사용 여부
        verSpace : (data.IndexUnderLine.VerSpace === undefined ? 0 : data.IndexUnderLine.VerSpace._text), // 수직 공백
        edgeSpace : (data.IndexUnderLine.EdgeSpace === undefined ? 0 : data.IndexUnderLine.EdgeSpace._text), // 모서리 너비
        firstLineThickness : (data.IndexUnderLine.FirstLineThickness === undefined ? 0 : data.IndexUnderLine.FirstLineThickness._text), // 첫 번째 라인 두께
        secondLineThickness : (data.IndexUnderLine.SecondLineThickness === undefined ? 0 : data.IndexUnderLine.SecondLineThickness._text), // 두 번째 라인 두께
        betweenLineSpace : (data.BetweenLineSpace === undefined ? undefined : data.BetweenLineSpace._text) // 두 라인 사이 간격
    });

    this.text = data.Text === undefined ? undefined : data.Text._text;
    this.dziName = data.DziName === undefined ? undefined : data.DziName._text; // 데이터 셋 이름
    this.dataTableName = data.DataTableName === undefined ? undefined : data.DataTableName._text; // 데이터 테이블 이름
    this.base64ImageFromViewer = data.Base64ImageFromViewer === undefined ? undefined : data.Base64ImageFromViewer._text; // 이미지 저장값을 예로 하는 경우 해당 이미지를 Base64형태로 변환하여 저장한다

    this.labelTextType = (data.LabelTextType === undefined ? 0 : data.LabelTextType._text); // 문자 형식
    this.format = (data.Format === undefined ? 0 : data.Format._text); // 표시 형식
    this.startBindScript = (data.StartBindScript === undefined ? 0 : data.StartBindScript._text); // 아마도 JavaScript 코드
    this.reVectorValue = (data.ReVectorValue === undefined ? 0 : data.ReVectorValue._text); // 어디서 쓰이는지 모르겠음
    this._formatFieldNone = (data._formatFieldNone === undefined ? 0 : data._formatFieldNone._text);

    this.drawingType = data.DrawingType === undefined ? undefined : data.DrawingType._text; // 그리기 형태
    this.isSaveImage = data.IsSaveImage === undefined ? undefined : data.IsSaveImage._text; // 이미지 저장
    this.labelTypeForSetFont = data.LabelTypeForSetFont === undefined ? undefined : data.LabelTypeForSetFont._text; // 폰트 지정 타입
    this.autosize = data.Autosize === undefined ? undefined : data.Autosize._text; // 자동 높이 조정
    this.isVectorCharacter = data.IsVectorCharacter === undefined ? undefined : data.IsVectorCharacter._text; // 장평 조정 설정
    this.vectorValue = data.VectorValue === undefined ? undefined : data.VectorValue._text; // 수동 장평 조절
    this.autoFontType = data.AutoFontType === undefined ? undefined : data.AutoFontType._text; // 폰트 크기 자동 조절
    this.wordWrap = data.WordWrap === undefined ? undefined : data.WordWrap._text; // 자동 줄바꾸기
    this.formatType = data.FormatType === undefined ? undefined : data.FormatType._text; // 소수점 자릿수
    this.showZeroState = data.ShowZeroState === undefined ? undefined : data.ShowZeroState._text; // 0값 표시 여부
    this.visible = data.Visible === undefined ? undefined : data.Visible._text; // VISIBLE
    this.numberToTextType = data.NumberToTextType === undefined ? undefined : data.NumberToTextType._text; // 금액 표시 방법
    this.isSameWidth = data.IsSameWidth === undefined ? undefined : data.IsSameWidth._text; // 글자 크기 동일 여부
    this.editable = data.Editable === undefined ? undefined : data.Editable._text; // 편집 가능
    this.backGroundColor = data.BackGroundColor === undefined ? 'white' : data.BackGroundColor._text; // 바탕색
    this.clipping = data.Clipping === undefined ? undefined : data.Clipping._text; // 클립핑
    this.borderLineLocation = data.BorderLineLocation === undefined ? undefined : data.BorderLineLocation._text; // 테두리 라인 위치
    this.textColor = data.TextColor === undefined ? 'black' : data.TextColor._text; // 글꼴 색
    this.textDirection = data.TextDirection === undefined ? undefined : data.TextDirection._text; // 텍스트 방향
    this.verticalTextAlignment = data.VerticalTextAlignment === undefined ? undefined : data.VerticalTextAlignment._text;
    this.characterSpacing = data.CharacterSpacing === undefined ? 0 : data.CharacterSpacing._text; // 자간
    this.lineSpacing = data.LineSpacing === undefined ? undefined : data.LineSpacing._text; // 줄 간격
    this.isUseBasicInnerMargin = data.IsUseBasicInnerMargin === undefined ? true : data.IsUseBasicInnerMargin._text; // 기본 여백 사용 기본 값이 true 인 듯
    this.labelShape = data.LabelShape === undefined ? undefined : data.LabelShape._text; // 라벨 형태
    this.circleLineColor = data.CircleLineColor === undefined ? undefined : data.CircleLineColor._text; // 원 테두리 색

    this.detailWhere = data.DetailWhere === undefined ? undefined : data.DetailWhere._text; // 요약 라벨 조건절
    this.parameterName = data.ParameterName === undefined ? undefined : data.ParameterName._text; // 파라미터 이름
    this.summaryType = data.SummaryType === undefined ? undefined : data.SummaryType._text; // 요약 타입
    this.qrCodeEncodingType = data.QRCodeEncodingType === undefined ? undefined : data.QRCodeEncodingType._text; // QR 코드 인코딩 타입
    this.barcodeType = data.BarcodeType === undefined ? undefined : data.BarcodeType._text; // 바코드 타입
    this.priorLabel = data.PriorLabel === undefined ? undefined : data.PriorLabel._text; // 선행 라벨
    this.groupingRule = data.GroupingRule === undefined ? undefined : data.GroupingRule._text; // 그룹핑규칙
    this.imageSizeType = data.ImageSizeType === undefined ? undefined : data.ImageSizeType._text; //이미지 크기
}


/******************************************************************
 기능 : Table에 대한 객체를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function Table(data){ // ControlList 밑에 anyType이 ControlFixedTable, ControlDynamicTable인 애들
    this.parentId = data.ParentID._text;
    this.id = data.Id._text;
    this.rectangle = {
        x : (data.Rectangle.X === undefined ? 0 : data.Rectangle.X._text),
        y : (data.Rectangle.Y === undefined ? 0 : data.Rectangle.Y._text),
        width : data.Rectangle.Width._text,
        height : data.Rectangle.Height._text
    };
    this.name = data.Name._text;
    this.Lock = data.Lock;

    this.isShowAtColumnSelect = data.IsShowAtColumnSelect._text; // 뷰어 항목 선택 표시 여부
    // 인쇄 미리보기에서 항목선택을 하는 경우 원하는 컬럼을 추가 및 제거할 수 있다.
    this.isRepeatToPageBottom = data.IsRepeatToPageBottom._text; // 페이지 하단까지 채우기
    this.columnCount = data.ColumnCount._text; // 열수
    this.rowCount = data.RowCount._text; // 행수
    this.isApprovalBox = data.IsApprovalBox === undefined ? undefined : data.IsApprovalBox._text;
    this.relateTableList = data.RelateTableList === undefined ? 0 : data.RelateTableList._text; // 연결된 테이블
    this.forceAnnex = data.ForceAnnex === undefined ? 0 : data.ForceAnnex._text;
    this.minimumRowCount = data.MinimumRowCount === undefined ? 1 : data.MinimumRowCount._text; // 최소 행 개수 (DRD에서 Default값이 1임)
    this.fixRowCount = data.FixRowCount === undefined ? 0 : data.FixRowCount._text; // 최대 행 개수 (DRD에서 Default값이 0임)
    this.isForceOverRow = data.IsForceOverRow === undefined ? true : data.IsForceOverRow._text; // 최대 행 이후의 데이터 true 일 때는 페이지 넘기기 false일 때는 제거(별지 출력)
    this.isAnnexMark = data.isAnnexMark === undefined ? 0 : data.isAnnexMark._text; // 별지 마크 표시 여부
    this.annexReportName = data.AnnextReportName === undefined ? undefined : data.AnnextReportName._text; // 별지 리포트 명
    this.isFirstPagePrint = data.IsFirstPagePrint === undefined ? undefined : data.IsFirstPagePrint._text; // 첫 페이지만 출력, 결재란 여부가 예 일때 결재란을 첫페이지에만 출력할것인지, 전체 페이지에 출력할것인지 판단하는 값
    this.IsdynamicBinding = data.IsdynamicBinding === undefined ? undefined : data.IsdynamicBinding._text; // 결재란의 컬럼을 동적으로 (수정 못하니까 신경 안써도 됨)

    this.formatType = data.FormatType === undefined ? undefined : data.FormatType._text; // 소수점 자릿수
}



/******************************************************************
 기능 : Table 객체를 상속 받는 FixedTable(고정 테이블)의 Label에 대한 객체를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function FixedTableLabel(data, i){
    Label.apply(this, arguments);

    this._attributes = data._attributes["xsi:type"];
    this.horizontalTextAlignment = data.HorizontalTextAlignment === undefined ? undefined : data.HorizontalTextAlignment._text; // 텍스트 수평 정렬
    this.selected = data.Selected._text; // 테이블 라벨에만 있는 것 같음
    this.leftBorderColor = data.LeftBorderColor === undefined ? undefined : data.LeftBorderColor._text; // 고정 테이블에만 있는 것 같음? 왼쪽 테두리 색
    this.rightBorderColor = data.RightBorderColor === undefined ? undefined : data.RightBorderColor._text; // 고정 테이블에만 있는 것 같음? 오른쪽 테두리 색
    this.topBorderColor = data.TopBorderColor === undefined ? undefined : data.TopBorderColor._text; // 고정 테이블에만 있는 것 같음? 위쪽 테두리 색
    this.bottomBorderColor = data.BottomBorderColor === undefined ? undefined : data.BottomBorderColor._text; // 고정 테이블에만 있는 것 같음? 아래쪽 테두리 색
}


/******************************************************************
 기능 : Table 객체를 상속 받는 DynamicTable(동적 테이블)의 Label에 대한 객체를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function DynamicTableLabel(data, i){
    Label.apply(this, arguments);
    // Table.apply(this, arguments);

    // var tableLabelData = data.Labels.TableLabel;
    this._attributes = data._attributes["xsi:type"];
    this.selected = data.Selected._text; // 테이블 라벨에만 있는 것 같음
    this.fieldName = data.FieldName === undefined ? 0 : data.FieldName._text; // 동적 테이블 밸류 라벨에만 있는 것 같음
}

/******************************************************************
 기능 : Label 객체를 상속 받는 SystemLabel(시스템 라벨)의 객체를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function SystemLabel(data){
    Label.apply(this, arguments);
    this.systemFieldName = data.SystemFieldName === undefined ? 'Date' : data.SystemFieldName._text; // 시스템 필드 이름
}

/******************************************************************
 기능 : Label 객체를 상속 받는 SummaryLabel(요약 라벨)의 객체를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function SummaryLabel(data){
    Label.apply(this, arguments);
}

/******************************************************************
 기능 : Label 객체를 상속 받는 DataLabel(데이터 라벨)의 객체를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function DataLabel(data){
    Label.apply(this, arguments);

    this.fieldName = data.FieldName._text;
}

/******************************************************************
 기능 : Label 객체를 상속 받는 NormalLabel(일반 라벨)의 객체를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function NormalLabel(data){
    Label.apply(this, arguments);
}

/******************************************************************
 기능 : Label 객체를 상속 받는 Expression(수식 라벨)의 객체를 만든다. (구현 보류)
 만든이 : 안예솔
 ******************************************************************/
function Expression(data){
    Label.apply(this, arguments);
}

/******************************************************************
 기능 : Label 객체를 상속 받는 GroupLabel(그룹 라벨)의 객체를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function GroupLabel(data){
    Label.apply(this, arguments);
}

/******************************************************************
 기능 : Label 객체를 상속 받는 ParameterLabel(파라미터 라벨)의 객체를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function ParameterLabel(data){
    Label.apply(this, arguments);
}