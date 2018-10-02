// Label 객체
/******************************************************************
 기능 : Label에 대한 공통 속성을 빼내서 객체를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function Label(data){
    this.parentId = data.ParentID === undefined ? undefined : data.ParentID._text;
    this.id = data.Id._text;
    this.rectangle = {
        x : (data.Rectangle.X === undefined ? 0 : data.Rectangle.X._text),
        y : (data.Rectangle.Y === undefined ? 0 : data.Rectangle.Y._text),
        width : data.Rectangle.Width._text,
        height : data.Rectangle.Height._text
    };

    this.name = data.Name._text;
    this.Lock = data.Lock === undefined ? undefined : data.Lock._text;
    this.dataType = data.DataType === undefined ? "NormalLabel" : data.DataType._text; // 데이터 형태
    this.imageTransparent = data.ImageTransparent === undefined ? 0 : data.ImageTransparent; // 이미지 투명도
    this.zOrder = data.ZOrder === undefined ? 0 : data.ZOrder._text;

    this.borderThickness = (data.BorderThickness === undefined ? undefined : { // 테두리 두께 (있을 수도 있고 없을 수도 있는 속성)
        left : (data.BorderThickness.Left === undefined ? 0 : data.BorderThickness.Left._text),
        top : (data.BorderThickness.Top === undefined ? 0 : data.BorderThickness.Top._text),
        right : (data.BorderThickness.Right === undefined ? 0 : data.BorderThickness.Right._text),
        bottom : (data.BorderThickness.Bottom === undefined ? 0 : data.BorderThickness.Bottom._text)
    });

    this.leftBorderColor = data.LeftBorderColor === undefined ? 'black' : data.LeftBorderColor._text; // 왼쪽 테두리 색
    this.rightBorderColor = data.RightBorderColor === undefined ? 'black' : data.RightBorderColor._text; // 오른쪽 테두리 색
    this.topBorderColor = data.TopBorderColor === undefined ? 'black' : data.TopBorderColor._text; // 위쪽 테두리 색
    this.bottomBorderColor = data.BottomBorderColor === undefined ? 'black' : data.BottomBorderColor._text; // 아래쪽 테두리 색

    this.borderDottedLines = { // 아마도 모든 라벨에 항상 있는 것 같음
        leftDashStyle : (data.BorderDottedLines.LeftDashStyle === undefined ? 'Solid' : data.BorderDottedLines.LeftDashStyle._text),
        rightDashStyle : (data.BorderDottedLines.RightDashStyle === undefined ? 'Solid' : data.BorderDottedLines.RightDashStyle._text),
        topDashStyle : (data.BorderDottedLines.TopDashStyle === undefined ? 'Solid' : data.BorderDottedLines.TopDashStyle._text),
        bottomDashStyle : (data.BorderDottedLines.BottomDashStyle === undefined ? 'Solid' : data.BorderDottedLines.BottomDashStyle._text),
    }; // 테두리 점선

    this.noBorder = data.NoBorder === undefined ? false : data.NoBorder._text; // 테두리 없음

    this.enableBorder = (data.EnableBorder === undefined ? undefined : { // 고정 값이라서 구현할 필요 없을 듯!
        boolean1 : data.EnableBorder.boolean[0]._text,
        boolean2 : data.EnableBorder.boolean[1]._text,
        boolean3 : data.EnableBorder.boolean[2]._text,
        boolean4 : data.EnableBorder.boolean[3]._text
    });

    if(data.Font === undefined){
        this.fontFamily = '굴림';
        this.fontSize = '10pt';
        this.fontWeight = 'normal';
        this.fontStyle = 'normal';
    } else {
        Font = (data.Font._text).split(','); // 굴림, 10pt(, style=bold)로 되어있어서 잘라야함
        this.fontFamily = Font[0];
        this.fontSize = (Font[1]).trim(); // 공백 제거
        if(Font.length == 3){ // ex) 굴림, 10pt, style=bold일 때
            Font[2] = Font[2].split('='); // fontWeight
            this.fontWeight = (Font[2][1]).trim(); // 글자 굵기 (bold)
        } else if(Font.length == 4) {
            this.fontStyle = Font[3].trim(); // 글자 기울임 (italic)
        } else {
            this.fontWeight = 'normal';
            this.fontStyle = 'normal';
        }
    }
    this.isDrawUnderLine = data.IsDrawUnderLine === undefined ? false : data.IsDrawUnderLine._text; // 밑줄
    this.isDrawStrikeOutLine = data.IsDrawStrikeOutLine === undefined ? false : data.IsDrawStrikeOutLine._text; // 중간줄

    // 내부 여백
    this.interMargin = (data.InterMargin === undefined ? undefined : {
        left : (data.InterMargin.Left === undefined ? 0 : data.InterMargin.Left._text),
        right : (data.InterMargin.Right === undefined ? 0 : data.InterMargin.Right._text),
        top : (data.InterMargin.Top === undefined ? 0 : data.InterMargin.Top._text),
        bottom : (data.InterMargin.Bottom === undefined ? 0 : data.InterMargin.Bottom._text)
    });
    this.indentLB = data.IndentLB === undefined ? undefined : data.IndentLB._text; // 들여쓰기 (작동 안함)

    this.gradientLB = (data.GradientLB === undefined ? undefined : {
        isUseGradient : (data.GradientLB.IsUseGradient === undefined ? false : data.GradientLB.IsUseGradient._text), // 그라데이션 사용 여부
        startGradientDirection : (data.GradientLB.StartGradientDirection === undefined ? 'Forward' : data.GradientLB.StartGradientDirection._text), // 그라데이션 시작 방향
        gradientDirection : (data.GradientLB.GradientDerection === undefined ? 'Horizontal' : data.GradientLB.GradientDerection._text), // 그라데이션 방향
        gradientColor : (data.GradientLB.GradientColor === undefined ? 'blue' : data.GradientLB.GradientColor._text), // 그라데이션 색
        lbRec: (data.GradientLB.LbRec === undefined ? undefined : {
            x: (data.GradientLB.LbRec.X === undefined ? 0 : data.GradientLB.LbRec.X._text),
            y: (data.GradientLB.LbRec.Y === undefined ? 0 : data.GradientLB.LbRec.Y._text),
            width: (data.GradientLB.LbRec.Width === undefined ? 0 : data.GradientLB.LbRec.Width._text),
            height: (data.GradientLB.LbRec.Height === undefined ? 0 : data.GradientLB.LbRec.Height._text)
        })
    });

    this.indexUnderLine = (data.IndexUnderLine === undefined ? undefined : { // 이중 밑줄 (구현 불가)
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

    this.labelTextType = data.LabelTextType === undefined ? undefined : data.LabelTextType._text; // 문자 형식
    this.format = (data.Format === undefined ? 0 : data.Format._text); // 표시 형식
    this.startBindScript = data.StartBindScript === undefined ? undefined : data.StartBindScript._text; // 아마도 JavaScript 코드
    this.reVectorValue = data.ReVectorValue === undefined ? 0 : data.ReVectorValue._text; // 아마도 장평 관련
    this._formatFieldNone = data._formatFieldNone === undefined ? 0 : data._formatFieldNone._text;

    this.drawingType = data.DrawingType === undefined ? undefined : data.DrawingType._text; // 그리기 형태
    this.isSaveImage = data.IsSaveImage === undefined ? undefined : data.IsSaveImage._text; // 이미지 저장
    this.labelTypeForSetFont = data.LabelTypeForSetFont === undefined ? undefined : data.LabelTypeForSetFont._text; // 폰트 지정 타입 >> 서식, 내용으로 나뉨
    this.autosize = data.Autosize === undefined ? false : data.Autosize._text; // 자동 높이 조정 (default값 : false)
    this.isVectorCharacter = data.IsVectorCharacter === undefined ? undefined : data.IsVectorCharacter._text; // 장평 조정 설정 (구현 불가)
    this.vectorValue = data.VectorValue === undefined ? undefined : data.VectorValue._text; // 수동 장평 조절 (구현 불가)
    this.autoFontType = data.AutoFontType === undefined ? undefined : data.AutoFontType._text; // 폰트 크기 자동 조절
    this.wordWrap = data.WordWrap === undefined ? false : data.WordWrap._text; // 자동 줄바꾸기
    this.formatType = data.FormatType === undefined ? undefined : data.FormatType._text; // 소수점 자릿수
    this.showZeroState = data.ShowZeroState === undefined ? undefined : data.ShowZeroState._text; // 0값 표시 여부
    this.visible = data.Visible === undefined ? true : data.Visible._text; // VISIBLE Default : true
    this.numberToTextType = data.NumberToTextType === undefined ? false : data.NumberToTextType._text; // 금액 표시 방법
    this.isSameWidth = data.IsSameWidth === undefined ? false : data.IsSameWidth._text; // 글자 크기 동일 여부
    this.editable = data.Editable === undefined ? 'true' : data.Editable._text; // 편집 가능

    this.backGroundColor = data.BackgGoundColor === undefined ? 'white' : data.BackgGoundColor._text; // 바탕색
    this.clipping = data.Clipping === undefined ? false : data.Clipping._text; // 클립핑 default : false
    // true일 때 -> 텍스트의 길이가 라벨의 너비보다 긴 경우 라벨의 너비에 맞춰 넘어가는 글자들은 제거하고 출력하는 옵션
    this.borderLineLocation = data.BorderLineLocation === undefined ? undefined : data.BorderLineLocation._text; // 테두리 라인 위치 (구현 X)
    this.textColor = data.TextColor === undefined ? 'black' : data.TextColor._text; // 글꼴 색

    this.characterSpacing = data.CharacterSpacing === undefined ? undefined : data.CharacterSpacing._text; // 자간
    this.lineSpacing = data.LineSpacing === undefined ? undefined : data.LineSpacing._text; // 줄 간격

    this.isUseBasicInnerMargin = data.IsUseBasicInnerMargin === undefined ? true : data.IsUseBasicInnerMargin._text; // 기본 여백 사용 기본 값이 true 인 듯
    this.labelShape = data.LabelShape === undefined ? 'rectangle' : data.LabelShape._text; // 라벨 형태
    this.circleLineColor = data.CircleLineColor === undefined ? 'black' : data.CircleLineColor._text; // 원 테두리 색
    this.circleLineThickness = data.CirCleLineThickness === undefined ? 1 : data.CirCleLineThickness._text; //원 테두리 두께

    this.qrCodeEncodingType = data.QRCodeEncodingType === undefined ? undefined : data.QRCodeEncodingType._text; // QR 코드 인코딩 타입
    this.barcodeType = data.BarcodeType === undefined ? undefined : data.BarcodeType._text; // 바코드 타입
    this.priorLabel = data.PriorLabel === undefined ? undefined : data.PriorLabel._text; // 선행 라벨

    this.imageSizeType = data.ImageSizeType === undefined ? undefined : data.ImageSizeType._text; //이미지 크기
    this.lock = data.Lock === undefined ? false : data.Lock._text; // 잠김 속성 default : false
    // true일 때 위치 이동, 크기 수정 불가

    this._formatFieldAmountSosu = data._formatFieldAmountSosu === undefined ? undefined : data._formatFieldAmountSosu._text; // 소수점자리수 : 수량소숫점자리수 표시형식(Format)

    this.horizontalTextAlignment = data.HorizontalTextAlignment === undefined ? 'Center' : data.HorizontalTextAlignment._text; // 텍스트 수평 정렬
    this.verticalTextAlignment = data.VerticalTextAlignment === undefined ? 'Center' : data.VerticalTextAlignment._text; // 텍스트 수직 정렬
    this.textDirection = data.TextDirection === undefined ? 'Horizontal' : data.TextDirection._text; // 텍스트 방향 아마도 default horizontal

    // this.grouppingRule = data.GroupingRule === undefined ? 'Merge' : data.GroupingRule._text; // 그룹핑규칙
    this.grouppingRule = 'Merge'; // 그룹핑 규칙 (일단은 Merge만 될 거라고 해서 Merge로 해놓음)

    this.parameterName = data.ParameterName === undefined ? undefined : data.ParameterName._text; // 파라미터 이름 (테이블 내에 파라미터가 있을 때 ParameterName이 필요함)
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
        width : (data.Rectangle.Width === undefined ? undefined : data.Rectangle.Width._text),//학준추가
        height : (data.Rectangle.Height === undefined ? undefined : data.Rectangle.Height._text)//학준추가
    };
    this.name = data.Name._text;

    this.isShowAtColumnSelect = data.IsShowAtColumnSelect._text; // 뷰어 항목 선택 표시 여부
    // 인쇄 미리보기에서 항목선택을 하는 경우 원하는 컬럼을 추가 및 제거할 수 있다.
    this.isRepeatToPageBottom = data.IsRepeatToPageBottom._text; // 페이지 하단까지 채우기
    this.columnCount = data.ColumnCount._text; // 열수
    this.rowCount = data.RowCount._text; // 행수
    this.isApprovalBox = data.IsApprovalBox === undefined ? undefined : data.IsApprovalBox._text;
    this.relateTableList = data.RelateTableList === undefined ? 0 : data.RelateTableList._text; // 연결된 테이블
    this.forceAnnex = data.ForceAnnex === undefined ? 0 : data.ForceAnnex._text;
    this.minimumRowCount = data.MinimumRowCount === undefined ? undefined : data.MinimumRowCount._text; // 최소 행 개수 (DRD에서 Default값이 1임)
    this.fixRowCount = data.FixRowCount === undefined ? 0 : data.FixRowCount._text; // 최대 행 개수 (DRD에서 Default값이 0임)
    this.isForceOverRow = data.IsForceOverRow === undefined ? false : data.IsForceOverRow._text; // 최대 행 이후의 데이터 true 일 때는 페이지 넘기기 false일 때는 제거(별지 출력)
    this.isAnnexMark = data.isAnnexMark === undefined ? 0 : data.isAnnexMark._text; // 별지 마크 표시 여부
    this.annexReportName = data.AnnextReportName === undefined ? undefined : data.AnnextReportName._text; // 별지 리포트 명
    this.isFirstPagePrint = data.IsFirstPagePrint === undefined ? undefined : data.IsFirstPagePrint._text; // 첫 페이지만 출력, 결재란 여부가 예 일때 결재란을 첫페이지에만 출력할것인지, 전체 페이지에 출력할것인지 판단하는 값
    this.IsdynamicBinding = data.IsdynamicBinding === undefined ? undefined : data.IsdynamicBinding._text; // 결재란의 컬럼을 동적으로 (수정 못하니까 신경 안써도 됨)

    this.isPrintColumn = data.IsPrintColumn === undefined ? true : data.IsPrintColumn._text; // 테이블의 컬럼 출력 여부
}



/******************************************************************
 기능 : Table 객체를 상속 받는 FixedTable(고정 테이블)의 Label에 대한 객체를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function FixedTableLabel(data, i){
    Label.apply(this, arguments);

    this._attributes = data._attributes["xsi:type"];

    this.selected = data.Selected._text; // 테이블 라벨에만 있는 것 같음
    this.fieldName = data.FieldName === undefined ? 0 : data.FieldName._text;

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

    /***************************************
     * SummaryType수정하기
     ***************************************/
    this.summaryType = data.SummaryType === undefined ? 'Sum' : data.SummaryType._text; // 요약 타입
    this.detailWhere = data.DetailWhere === undefined ? undefined : data.DetailWhere._text; // 요약 라벨 조건절
    this.fieldName = data.FieldName === undefined ? undefined : data.FieldName._text; // 필드 이름
}

/******************************************************************
 기능 : Label 객체를 상속 받는 DataLabel(데이터 라벨)의 객체를 만든다.
 만든이 : 안예솔
 ******************************************************************/
function DataLabel(data){
    Label.apply(this, arguments);

    this.fieldName = data.FieldName === undefined ? undefined : data.FieldName._text;
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

    this.parameterName = data.ParameterName === undefined ? undefined : data.ParameterName._text; // 파라미터 이름
}

/******************************************************************
 기능 : Report 객체를 상속 받는 Region(리전)의 객체를 만든다.
 만든이 : 전형준

 수정 : 안예솔
 ******************************************************************/
function ControlRegion(data){
    Report.apply(this, arguments);
    this.layer = new Layer(data.Layers.anyType);
    this.regionRepeatFile = data.RegionRepeatFill._text;
    this.zOrder = data.ZOrder === undefined ? undefined : data.ZOrder._text;
    this.printDirection = data.PrintDirection._text;
    this.offsetBetweentResion = {
        width : data.OffsetBetweenResion.Width._text,
        height : data.OffsetBetweenResion.Height._text
    };
    this.forcePage = data.Forcepage._text;
}