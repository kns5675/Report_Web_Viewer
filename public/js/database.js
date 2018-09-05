
function hello() {
    alert('hello');
}

function DataBinding(dataTreeJson){

    var DZIList = getDZIList(dataTreeJson);
    console.log(DZIList);
    // console.log(DZIList.DZI[0].dBAdapter);
    console.log(Array.isArray(DZIList.DZI));
    console.log(DZIList.DZI.hasOwnProperty('dBAdapter'));


    if(Array.isArray(DZIList.DZI)){
        DZIList.DZI.forEach(function(value, i){
            if(DZIList.DZI[i].hasOwnProperty('dBAdapter')) {
                console.log('DB Connection');
            }else{
                console.log('임의 데이터');
            }
        });
    }else{
            if(DZIList.DZI.hasOwnProperty('dBAdapter')){
                console.log('DB Conenction');
            }else{
                console.log('임의 데이터');
                var result = DZIList.DZI.DZITableList.DZITable.DZIFieldList.DZIField;
                $("#dataBand").html(result);
                console.log(DZIList.DZI.DZITableList.DZITable.DZIFieldList.DZIField[0].Comment._text);

            }
    }

    alert('hello');

}

function getDZIList(dataTreeJson){

    return dataTreeJson.DataTree.DZIList;
}