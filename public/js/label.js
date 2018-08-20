// Label 객체

// DrawingType, isSaveImage, LabelTypeFormSetFont, Autosize, IsVectorCharacter, VectorValue, AutoFontType, WordWrap, FormatType, ShowZeroState
// Visible, NumberToTextType, IsSameWidth, Editable, BackGroundColor, Clipping, BorderLineLocation, TextColor, TextDirection, VerticalTextAlignment
// CharacterSpacing, LineSpacing, IsUseBasicInnerMargin, LabelShape, CircleLineColor, IsUseGradient, GradientColor, StartGradientDirection, GradientDerection
// DetailWhere, ParameterName, SummaryType, QRCodeEncodingType, BarcodeType, PriorLabel, GroupingRule, ImageSizeType

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
    this.borderDottedLines = data.EnableBorder === undefined ? undefined : data.BorderDottedLines._text;
    this.indentLB = data.IndentLB === undefined ? undefined : data.IndentLB._text; // 들여쓰기
    this.interMargin = data.InterMargin === undefined ? undefined : data.InterMargin._text; // 내부 여백

    this.lbRec = (data.LbRec === undefined ? undefined : {
        x : (data.GradientLB.LbRec.X === undefined ? 0 : data.GradientLB.LbRec.X._text),
        y : (data.GradientLB.LbRec.Y === undefined ? 0 : data.GradientLB.LbRec.Y._text),
        width : (data.GradientLB.LbRec.Width === undefined ? 0 : data.GradientLB.LbRec.Width._text),
        height : (data.GradientLB.LbRec.Height === undefined ? 0 : data.GradientLB.LbRec.Height._text)
    });

    this.indexUnderLine = (data.IndexUnderLine === undefined ? undefined : { // 이중 밑줄
        isUse : (data.IndexUnderLine.IsUse === undefined ? 0 : data.IndexUnderLine.IsUse._text),
        verSpace : (data.IndexUnderLine.VerSpace === undefined ? 0 : data.IndexUnderLine.VerSpace._text),
        edgeSpace : (data.IndexUnderLine.EdgeSpace === undefined ? 0 : data.IndexUnderLine.EdgeSpace._text),
        firstLineThickness : (data.IndexUnderLine.FirstLineThickness === undefined ? 0 : data.IndexUnderLine.FirstLineThickness._text),
        secondLineThickness : (data.IndexUnderLine.SecondLineThickness === undefined ? 0 : data.IndexUnderLine.SecondLineThickness._text)
    });

    this.text = data.Text === undefined ? undefined : data.Text._text;
    this.dziName = data.DziName === undefined ? undefined : data.DziName._text; // 데이터 셋 이름
    this.dataTableName = data.DataTableName === undefined ? undefined : data.DataTableName._text; // 데이터 테이블 이름
    this.base64ImageFromViewer = data.Base64ImageFromViewer === undefined ? undefined : data.Base64ImageFromViewer._text; // 이미지 저장값을 예로 하는 경우 해당 이미지를 Base64형태로 변환하여 저장한다

    this.labelTextType = (data.LabelTextType === undefined ? 0 : data.LabelTextType._text); // 문자 형식
    this.format = (data.Format === undefined ? 0 : data.Format._text);
    this.startBindScript = (data.StartBindScript === undefined ? 0 : data.StartBindScript._text); // 아마도 JavaScript 코드
    this.reVectorValue = (data.ReVectorValue === undefined ? 0 : data.ReVectorValue._text); // 어디서 쓰이는지 모르겠음
    this._formatFieldNone = (data._formatFieldNone === undefined ? 0 : data._formatFieldNone._text);
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

    this.isShowAtColumnSelect = data.IsShowAtColumnSelect._text;
    this.isRepeatToPageBottom = data.IsRepeatToPageBottom._text;
    this.columnCount = data.ColumnCount._text;
    this.rowCount = data.RowCount._text;
    this.relateTableList = data.RelateTableList === undefined ? 0 : data.RelateTableList._text;
    this.forceAnnex = data.ForceAnnex === undefined ? 0 : data.ForceAnnex._text;
    this.minimumRowCount = data.MinimumRowCount === undefined ? 0 : data.MinimumRowCount._text;
    this.fixRowCount = data.FixRowCount === undefined ? 0 : data.FixRowCount._text;
    this.isAnnexMark = data.isAnnexMark === undefined ? 0 : data.isAnnexMark._text;
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
    this.leftBorderColor = data.LeftBorderColor === undefined ? undefined : data.LeftBorderColor._text; // 고정 테이블에만 있는 것 같음
    this.rightBorderColor = data.RightBorderColor === undefined ? undefined : data.RightBorderColor._text; // 고정 테이블에만 있는 것 같음
    this.topBorderColor = data.TopBorderColor === undefined ? undefined : data.TopBorderColor._text; // 고정 테이블에만 있는 것 같음
    this.bottomBorderColor = data.BottomBorderColor === undefined ? undefined : data.BottomBorderColor._text; // 고정 테이블에만 있는 것 같음
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