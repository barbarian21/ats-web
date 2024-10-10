var dicChangeList = {};
var arrSteps = [];
var limitsChange = "Update Limits";
var reNameChange = "Rename Item";
var moveChange = "Move Item";
var removeChange = "Remove Item";
var otherChange = "Other Logic";

function getStations()
{
    var arrChooseStation = new Array();
    // 遍历多选框按钮
    var items = document.getElementsByName("Station");    
    for (var i = 0; i < items.length; ++i)
    {
        if(items[i].checked){
            arrChooseStation.push(items[i].value);
        }
    }
    // 获取station输入框内容
    var inputStation = document.getElementById("inputStatoin").value;
    inputStation = trim(inputStation)
    if (inputStation != "") {
        arrChooseStation.push(inputStation);
    }

    return arrChooseStation;
}

function getAllstations()
{
    var allStation = [];  
    for (var key in dicChangeList){
        allStation.push(key);
    }
    if(allStation.length == 0){
        allStation= getStations();
    }
    
    strStation = allStation.join("&");
    return strStation;
}

function add(text)
{
    // Check stations
    var arrStation = getStations();
    if (arrStation.length == 0) {
        alert('Please select station!');
        return;
    }
    // Add Change List 
    if(text == limitsChange){
        var itemName = document.getElementById("ItemName");
        var LSL = document.getElementById("LSL");
        var USL = document.getElementById("USL");
        var Units = document.getElementById("Units");
        var Match = document.getElementById("Match");

        var szItemName = trim(itemName.value);
        var szLSL = trim(LSL.value);
        var szUSL = trim(USL.value);
        var szUnits = trim(Units.value);
        var szMatch = trim(Match.value);

        if(szItemName != ""){
            if(szMatch==""){
                if(szLSL == ""){
                    szLSL = "NA";
                }
                if(szUSL == ""){
                    szUSL = "NA";
                }
                if(szLSL!="NA" && szUSL!="NA"){
                    numLSL = Number(szLSL);
                    numUSL = Number(szUSL);
                    if (!isNaN(numLSL) && !isNaN(szUSL)) {
                        if(numLSL>numUSL){
                            alert("LSL>USL, please check!")
                            return;
                        }
                    }
                }
                dicValue = {"Item":szItemName, "LSL":szLSL, "USL":szUSL, "Units":szUnits}

            }else{
                dicValue = {"Item":szItemName, "Match":szMatch}
            }
            
            dicChangeList = formatDic(dicChangeList,arrStation,limitsChange,dicValue);
            itemName.value = ""; LSL.value = ""; USL.value = ""; Units.value = ""; Match.value = "";
        }
    }
    else if(text == reNameChange){
        var oldItemName = document.getElementById("OldItemName");
        var oldValue = trim(oldItemName.value);
        var newItemName = document.getElementById("NewItemName");
        var newValue = trim(newItemName.value);
        if(oldValue != "" &&  newValue != ""){
            dicValue = {"OldItemName":oldValue, "NewItemName":newValue}
            dicChangeList = formatDic(dicChangeList,arrStation,reNameChange,dicValue);
            oldItemName.value = ""; newItemName.value = "";
        }
       
    }
    else if(text == removeChange){
        var removedItemName = document.getElementById("RemovedItemName");
        var value = trim(removedItemName.value);
        if(value != ""){
            arrValue = value.split('\n')
            dicChangeList = formatDic(dicChangeList,arrStation,removeChange,arrValue);
            removedItemName.value = "";
        }
    }
    else if(text == moveChange){
        var movedItem = document.getElementById("MovedItem");
        var itemValue = trim(movedItem.value);
        var beforeItem = document.getElementById("BeforeItem");
        var beforeValue = trim(beforeItem.value);
        var afterItem = document.getElementById("AfterItem");
        var afterValue = trim(afterItem.value);
        if(itemValue != "" && (beforeValue!="" || afterValue!="")){
            dicValue = {"MovedItem":itemValue.split('\n'), "BeforeItem":beforeValue, "AfterItem":afterValue}
            dicChangeList = formatDic(dicChangeList,arrStation,moveChange,dicValue);
            movedItem.value= ""; beforeItem.value=""; afterItem.value="";
        }
  
    }else if(text == otherChange){
        var ohterLogic = document.getElementById("OhterLogic");
        var value = trim(ohterLogic.value);
        if(value != ""){
            dicChangeList = formatDic(dicChangeList,arrStation,otherChange,value);
            ohterLogic.value="";
        }
    }

    console.log(dicChangeList)
    //Show change List
    document.getElementById('changeList_textarea').value = appendDic(dicChangeList);
}

function rollBack()
{
    var lastStep = arrSteps.pop();
    for(var index in lastStep){
        // console.log(JSON.stringify(dicChangeList))
        stationInfo = lastStep[index];
        var station = stationInfo.split(":")[0];
        var changeType = stationInfo.split(":")[1];
        var arrList = dicChangeList[station][changeType];
        arrList.pop();
        if(arrList.length == 0){
            delete dicChangeList[station][changeType];
            var dic = dicChangeList[station];
            if(isEmptyObject(dic)){
                delete dicChangeList[station];
            }
        }else{
            dicChangeList[station][changeType] = arrList;
        }
        
    }
    document.getElementById('changeList_textarea').value = appendDic(dicChangeList);
}

function appendDic(dict){
    var textarea = "";
    for(var station in dict){
        textarea+="["+station+"]\n";
        var dicTemp = dict[station];
        var index = 1;
        for(var key in dicTemp){
            listValue = dicTemp[key];
            textarea+= index+". "+key+":\n";
            for(var i=0; i<listValue.length; i++){
                aValue = listValue[i];
                if(key == limitsChange){
                    if(!aValue["Match"]){
                        textValue= "Item="+aValue['Item']+" Limits="+"["+aValue['LSL']+","+aValue['USL']+"]";
                        if(aValue["Units"]!=""){
                            textValue+= " Units="+aValue["Units"]
                        }
                        textarea+= "\t("+(i+1)+") "+ textValue + "\n"
                    }else{
                        textValue= "Item="+aValue['Item']+" Limits="+aValue['Match']+ " Units=match";;
                        textarea+= "\t("+(i+1)+") "+ textValue + "\n"
                    }

                }else if(key == reNameChange){
                    var textValue = aValue['OldItemName']+"==>"+aValue['NewItemName'];
                    textarea+= "\t("+(i+1)+") "+ textValue + "\n"

                }else if(key == removeChange){
                    textarea+= '\t'+aValue.join('\n\t') + "\n"
                }else if(key == moveChange){

                    var textValue = "MovedItem="+ aValue['MovedItem'].join("\n\t") + "\n\t";
                    if(aValue['BeforeItem']!=""){
                        textValue+="BeforeItem=" + aValue['BeforeItem'];
                    }
                    if(aValue['AfterItem']!=""){
                        textValue+= " AfterItem="+aValue['AfterItem'];
                    }
                    textarea+= "\t("+(i+1)+") "+ textValue + "\n"

                }else if(key == otherChange){
                    aValue = aValue.replace(/(\n)/g, "\n\t");
                    textarea+= "\t("+(i+1)+") "+ aValue + "\n"

                }else{
                }

            }
            index++;
        }
        textarea+="\n";
    }
    if(!isEmptyObject(dict)){
        textarea+= "\nJSON STRING:\n"+JSON.stringify(dict)
    }
    return textarea;
}


function formatDic(dic,arrStation,changeType,appedValue){
    var currentStep = [];
    for(var i = 0; i< arrStation.length; i++){
        station = arrStation[i];
        if (! dic[station]){
            dic[station] = {};
        }
        if(! dic[station][changeType]){
            dic[station][changeType] = [];
        }
        dic[station][changeType].push(appedValue);
        currentStep.push(station+":"+changeType);
    }
    arrSteps.push(currentStep);
    return dic
}

function sendMail()
{
    var subject = document.getElementById("subText").value;
    var to = document.getElementById("toText").value;
    var cc = document.getElementById("ccText").value;

    var title = "Hi Team, \n\n"+"Please help to follow below change list, thanks."+"\n\n";
    var content = trim(document.getElementById("changeList_textarea").value);
    var radarInfo = trim(document.getElementById("document_textarea").value)
    if ( radarInfo != "") {
        radarInfo = "\n\nRequest Mail or Radar:\n"+radarInfo;
    }

    if(content=="" || subject==""){
        alert("Please input ChangeList and Subject!");
        return;
    }

    var body = title+content+radarInfo;

    body = encodeURIComponent(body);
    subject = encodeURIComponent(subject);
    // subject = escape(subject);

    mailTo.href="mailto:"+to+"?cc="+cc+"&subject="+subject+"&body="+body;
    mailTo.click();
}


function chooseSubText(text)
{
    var doeBtn= document.getElementById("subTextDOEType");
    var overlayBtn = document.getElementById("subTextOverlayType");
    var project = document.getElementById("project");
    var project_stage = document.getElementById("project-stage");
    var title = "";
    var urgent = document.getElementById("isUrgent");
    if (urgent.checked) {
        title = "urgent! "
    }

    if(text == "DOE"){
        overlayBtn.checked = false;
        title = title+"["+project.value+"]["+project_stage.value+"]"+" [DOE Request]";
    }else if(text == "Overlay"){
        doeBtn.checked = false;
        title = title+"["+project.value+"]["+project_stage.value+"]"+" [Overlay Request]";
    }else{
        if(overlayBtn.checked){
            title =title+ "["+project.value+"]["+project_stage.value+"]"+" [Overlay Request]";
        }else if(doeBtn.checked){
            title = title+"["+project.value+"]["+project_stage.value+"]"+" [DOE Request]";
        }
    }
    //Get all stations
    var strStations = getAllstations();
    title += " For stations:"+strStations;
    document.getElementById("subText").value = title;
}

function chooseStation()
{
    document.getElementById("subText").value = "";
    var doeBtn= document.getElementById("subTextDOEType");
    var overlayBtn = document.getElementById("subTextOverlayType");
    doeBtn.checked = false;
    overlayBtn.checked = false;
    return;
}

function chosseUrgent()
{
    document.getElementById("subText").value = "";
    var doeBtn= document.getElementById("subTextDOEType");
    var overlayBtn = document.getElementById("subTextOverlayType");
    doeBtn.checked = false;
    overlayBtn.checked = false;
    return;   
}

function stageChange() {
    // body...
    // var stage = document.getElementById("project-stage");
    document.getElementById("subText").value = "";
    var doeBtn= document.getElementById("subTextDOEType");
    var overlayBtn = document.getElementById("subTextOverlayType");
    doeBtn.checked = false;
    overlayBtn.checked = false;
    return;
}

function projectChange()
{
    // var project = document.getElementById("project");
    document.getElementById("subText").value = "";
    var doeBtn= document.getElementById("subTextDOEType");
    var overlayBtn = document.getElementById("subTextOverlayType");
    doeBtn.checked = false;
    overlayBtn.checked = false;
    return;

}

function contains(arr,obj)
{
    bRet = false;
    for(var i = 0; i<arr.length; i++){
        if(arr[i] == obj){
            bRet = true;
            break;
        }
    }
    return bRet;
}

function trim(str)
{
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

function isEmptyObject(obj){
    for (var n in obj) {
        return false
    }
    return true; 
} 
