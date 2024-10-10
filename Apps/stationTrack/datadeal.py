import json
from datetime import datetime, date
import xlsxwriter
from xlsxwriter import utility as xlTool
from common.models import Project, Station, Stage, Coco

targetDb = {"station" : Station,'project' : Project, 'stage' : Stage, 'station_name' : Station}

class DateEncoder(json.JSONEncoder):
    
    def default(self, obj):
        if isinstance(obj,datetime) or isinstance(obj,date):
            return obj.strftime("%Y-%m-%d %H:%M:%S")
        else:
            return json.JSONEncoder.default(self,obj)
        

def decorateAFiled(titleName ,aFiled, styleJson):
    if titleName in styleJson:
        return {'Content': aFiled, 'Style': styleJson[titleName]}
    return {'Content': aFiled}


def serialARow(title, aRow, ForeignKeyFiled, ManyToManyField, specJsonFiled):
    resultDic = {}
    styleJson = {}
    try:
        styleJson = json.loads(aRow.style)
    except Exception as e:
        print('get style fail, reset style info')
    for titleName in title:
        aFiled = getattr(aRow, titleName)
        resDic = {}
        resultDic[titleName] = decorateAFiled(titleName, aFiled, styleJson)
        if titleName in ForeignKeyFiled:
            if aFiled:
                resDic[aFiled.pk] = getattr(aFiled, ForeignKeyFiled[titleName])
                resultDic[titleName] = decorateAFiled(titleName, resDic, styleJson)
            resultDic[titleName]['dataType'] = 'ForeignKey'
        if titleName in ManyToManyField:
            if aFiled:
                allRealtedInfo = aFiled.all()
                for aRecord in allRealtedInfo:
                    resDic[aRecord.pk] =  getattr(aRecord, ManyToManyField[titleName])
            resultDic[titleName] = decorateAFiled(titleName, resDic, styleJson)
            resultDic[titleName]['dataType'] = 'ManyKey'
        if titleName in specJsonFiled:
            if aFiled:
                resDic = json.loads(aFiled)
            resultDic[titleName] = decorateAFiled(titleName, resDic, styleJson)
            resultDic[titleName]['dataType'] = 'jsonObject'
    return resultDic
    
    
def serialAQuerySet(aQuerySet, ForeignKeyFiled, ManyToManyField, specJsonFiled):
    ForeignKeyFiled = ForeignKeyFiled or {}
    ManyToManyField = ManyToManyField or {}
    specJsonFiled = specJsonFiled or {}
    result = []
    if aQuerySet:
        title = aQuerySet[0]._meta.fields
        title = [str(a.name) for a in title]
        title.remove('style')
        title.extend(ManyToManyField.keys())
        for aRow in aQuerySet:
            result.append(serialARow(title, aRow, ForeignKeyFiled, ManyToManyField, specJsonFiled))
    return result

def deleteARowDataToDb(aQuerySet, **kw):
    aQuerySet = aQuerySet.filter(**kw)
    for aRow in aQuerySet:
        aRow.delete()

def wishFieldsData(fieldContent, refuseKeyList, **kw):
    updateStyle = kw or {}
    updateComment = {}
    ManyFieldDic = {'fieldUpdate': False}
    for fieldName, updateData in fieldContent.items():
        if fieldName not in refuseKeyList:
            isNotManyKey = True
            if 'dataType' in updateData:
                dataType = updateData['dataType']
                if 'ManyKey' == dataType:
                    try:
                        isNotManyKey = False
                        ManyFieldDic['fieldUpdate'] = True
                        ManyFieldDic[fieldName] = [targetDb[fieldName].objects.get(pk=i) for i in updateData['Content'].keys()]
                    except Exception:
                        print('wishFieldsData ManyField error')
                        continue
                elif 'ForeignKey' == dataType:
                    try:
                        updateData['Content'] = [targetDb[fieldName].objects.get(pk=i) for i in updateData['Content'].keys()][0]
                    except Exception as e:
                        print('wishFieldsData ForeignKeyField error')
                        continue
                elif 'jsonObject' == dataType:
                    updateData['Content'] = json.dumps(updateData['Content'])
            if 'Style' in updateData:
                updateStyle[fieldName] = updateData['Style']
            else:
                updateStyle.pop(fieldName, None)
            if 'Content' in updateData and isNotManyKey:
                updateComment[fieldName] = updateData['Content']
    updateComment['style'] = json.dumps(updateStyle)
    return updateComment, ManyFieldDic

def addARowDataToDb(selectDb, aRowComment,**kw):
    print('Add new Row')
    refuseKeyList = kw.get('refuse') or ['id', 'update_time', 'add_time']
    updateComment, ManyFieldDic = wishFieldsData(aRowComment, refuseKeyList)
    newRow = selectDb(**updateComment)
    newRow.save()
    if ManyFieldDic.pop('fieldUpdate', False):
        print(ManyFieldDic)
        for fieldName, ManyField in ManyFieldDic.items():
            aFiled = getattr(newRow, fieldName)
            aFiled.add(*ManyField)
    
def updateARowDataToDb(aRowRecord, aRowComment,**kw):
    refuseKeyList = kw.get('refuse') or ['id', 'update_time', 'add_time']
    styleJson = {}
    try:
        styleJson = json.loads(aRowRecord.style)
    except Exception as e:
        print('get style fail, reset style info')
    print(aRowComment,refuseKeyList, styleJson)
    updateComment, ManyFieldDic = wishFieldsData(aRowComment, refuseKeyList, **styleJson)
    for fieldName, fieldStyle in updateComment.items():
        setattr(aRowRecord, fieldName, fieldStyle)
    aRowRecord.save()
    if ManyFieldDic.pop('fieldUpdate', False):
        print(ManyFieldDic)
        for fieldName, ManyField in ManyFieldDic.items():
            aFiled = getattr(aRowRecord, fieldName)
            aFiled.clear()
            aFiled.add(*ManyField)

def getProjectInfo(*fieldName,**kw):
    filterInfo = Project.objects.all()
    filterInfo = filterInfo.filter(**kw)
    resultInfo = []
    for aRow in filterInfo:
        aRowInfo = [aRow.pk]
        for aField in fieldName:
            aRowInfo.append(getattr(aRow, aField))
        resultInfo.append(aRowInfo)
    return resultInfo

def getStationInfo(project,*fieldName,**kw):
    filterInfo = Station.objects.filter(project = project)
    filterInfo = filterInfo.filter(**kw)
    resultInfo = []
    for aRow in filterInfo:
        aRowInfo = [aRow.pk]
        for aField in fieldName:
            aRowInfo.append(getattr(aRow, aField))
        resultInfo.append(aRowInfo)
    return resultInfo

def getStageInfo(project,*fieldName,**kw):
    filterInfo = Stage.objects.filter(project=project)
    filterInfo = filterInfo.filter(**kw)
    resultInfo = []
    for aRow in filterInfo:
        aRowInfo = [aRow.pk]
        for aField in fieldName:
            aRowInfo.append(getattr(aRow, aField))
        resultInfo.append(aRowInfo)
    return resultInfo

def getCocoInfo(project,*fieldName,**kw):
    filterInfo = Coco.objects.filter(project = project)
    filterInfo = filterInfo.filter(**kw)
    resultInfo = []
    for aRow in filterInfo:
        aRowInfo = [aRow.pk]
        for aField in fieldName:
            aRowInfo.append(getattr(aRow, aField))
        resultInfo.append(aRowInfo)
    return resultInfo

def calAStrWidth(tempStr, minWidth = 0):
    width = minWidth
    if isinstance(tempStr, str):
        strList = tempStr.split('\n')
        for aSlice in strList:
            if width < len(aSlice):
                width = len(aSlice)
    return width

def dbStyle2ExcelDict(ftStyle,bgStyle = '#FFFFFF'):
    resultDic = {'font_size': 15, 'font_color' : '#000000', 'bold': False, 'bg_color' : bgStyle, 'border': 1, 'valign': 'vcenter', 'text_wrap': 1}
    if isinstance(ftStyle, dict):
        if 'font_color' in ftStyle:
            resultDic['font_color'] = ftStyle['font_color']
        if 'Bold' in ftStyle:
            resultDic['bold'] = ftStyle['Bold']
    return resultDic


def cellCompleteContent(excelSheet,aCellData):
    if isinstance(aCellData, dict):
        bgStyle = '#FFFFFF'
        staIndex = 0
        richStr = []
        richFlag = False
        ftContent = ''
        tempContent = aCellData['Content'] if aCellData['Content'] else ''
        
        if 'dataType' in aCellData and isinstance(tempContent, dict):
            for aValue in tempContent.values():
                ftContent += aValue + ','
            ftContent = ftContent.strip(',')
        else:
            ftContent = str(tempContent)
        strWidth = calAStrWidth(ftContent, 15)
        if 'Style' in aCellData and 'bg_color' in aCellData['Style']:
            bgStyle = aCellData['Style']['bg_color']
        defaultStyle = excelSheet.add_format(dbStyle2ExcelDict({}, bgStyle))
        if 'Style' in aCellData and 'fontstyle' in aCellData['Style']:
            ftStyleList = aCellData['Style']['fontstyle']
            for aStyle in ftStyleList:
                fontColor = aStyle['color']
                colorSta = int(aStyle['staIndex'])
                colorLen = int(aStyle['lenth'])
                if staIndex < colorSta:
                    richStr.append(defaultStyle)
                    richStr.append(ftContent[staIndex: colorSta])
                richStr.append(excelSheet.add_format(dbStyle2ExcelDict({'font_color' : fontColor}, bgStyle)))
                richStr.append(ftContent[colorSta:colorSta + colorLen])
                staIndex = colorSta + colorLen
        if ftContent.__len__() > staIndex or 0 == richStr.__len__():
            richStr.append(defaultStyle)
            richStr.append(ftContent[staIndex:])
        if 3 < richStr.__len__():
            richFlag = True
        if richFlag:
            richStr.append(defaultStyle)
        return richStr, richFlag, strWidth

def generateChartSheets(dataWb, sheetDic):
    normal_Style = dataWb.add_format(dbStyle2ExcelDict({}, '#ffffff'))
    blue_Style = dataWb.add_format(dbStyle2ExcelDict({'font_color' : '#0000ff'}, '#ffffff'))
    offsetX = 5
    offsetY = 3
    # tempChart = dataWb.add_chart({'type': 'column', 'subtype': 'stacked'})
    for sheetName, sheetData in sheetDic.items():
        dataWS = dataWb.add_worksheet(sheetName)
        dataSeries = sheetData['dataSeries']
        xAxis = sheetData['xAxis']
        title = sheetData['project'] + ' Summary By ' + sheetData['firstCondition'] + ' And ' + sheetData['secondCondition']
        tempChart = dataWb.add_chart({'type': 'column', 'subtype': 'stacked'})
        cols = len(dataSeries)
        rows = len(xAxis)
        columnWidth = [10] * cols
       
        dataWS.merge_range(offsetY - 2, offsetX - 1,offsetY - 2, offsetX + cols, title, normal_Style)
        for colIndex in range(-1, cols + 1):
            for rowIndex in range(-1, rows):
                cellVal = ''
                current_Style = blue_Style
                if colIndex == cols:
                    if rowIndex == -1:
                        dataWS.write(rowIndex + offsetY, colIndex + offsetX, 'Total', current_Style)
                    else:
                        startCell = xlTool.xl_rowcol_to_cell_fast(rowIndex + offsetY, offsetX)
                        endCell = xlTool.xl_rowcol_to_cell_fast(rowIndex + offsetY, cols + offsetX - 1)
                        dataWS.write_formula(rowIndex + offsetY, cols + offsetX, '=SUM(' + startCell + ':' + endCell + ')', normal_Style)
                    continue
                if -1 == colIndex and -1 == rowIndex:
                    
                    cellVal = sheetData['project']
                elif -1 == colIndex:
                   
                    cellVal = xAxis[rowIndex]
                elif -1 == rowIndex:
                  
                    cellVal = dataSeries[colIndex]['name']
                else:
                    current_Style = normal_Style
                    cellVal = dataSeries[colIndex]['data'][rowIndex]
                columnWidth[colIndex] = len(str(cellVal)) if len(str(cellVal)) > columnWidth[colIndex] else columnWidth[colIndex]
                dataWS.write(rowIndex + offsetY, colIndex + offsetX, cellVal,current_Style)
            if -1 != colIndex:
                if cols != colIndex:
                    series = {
                        'categories': [sheetName, offsetY, -1 + offsetX, rows + offsetY - 1, -1 + offsetX],
                        'values': [sheetName, offsetY, offsetX + colIndex, rows + offsetY - 1, offsetX + colIndex],
                        'name': [sheetName, offsetY - 1, offsetX + colIndex]
                    }
                    if 'color' in dataSeries[colIndex]:
                        series['fill'] = {'color': dataSeries[colIndex]['color']}
                    tempChart.add_series(series)
                startCell = xlTool.xl_rowcol_to_cell_fast(offsetY, colIndex + offsetX)
                endCell = xlTool.xl_rowcol_to_cell_fast(rows + offsetY - 1, colIndex + offsetX)
                dataWS.write_formula(rows + offsetY, colIndex + offsetX, '=SUM(' + startCell + ':' + endCell + ')', normal_Style)
            else:
                dataWS.write(rows + offsetY, colIndex + offsetX, 'Total', current_Style)

        tempChart.set_title({
            'name': title,
            'name_font': {
                'size': 12,
            },
        })
        tempChart.set_style(12)
        dataWS.insert_chart(rows + offsetY + 2, offsetX - 1, tempChart)
        for j in range(offsetX - 1 ,cols + offsetX):
            dataWS.set_column(j, j, columnWidth[j - offsetX] * 1.2)
    

def generateRichStrSheets(dataWb, sheetDic):
    current_Style = dataWb.add_format(dbStyle2ExcelDict({}, '#ffffff'))
    for sheetName, sheetData in sheetDic.items():
        dataWS = dataWb.add_worksheet(sheetName)
        showTitle = [i[0] for i in sheetData[0]]
        showTitle.insert(0, 'Numbers')
        columnWidth = [len(i) for i in showTitle]
        dataWS.write_row(0, 0, showTitle, current_Style)
        title = [i[1] for i in sheetData[0]]
        tableData = sheetData[1]
        i = 0
        for curRowData in tableData:
            i += 1
            j = 1
            dataWS.write_string(i, 0, str(i), current_Style)
            for titleName in title:
                curCellData = curRowData[titleName]
                richStr, richFlag , strWidth = cellCompleteContent(dataWb, curCellData)
                if columnWidth[j] < strWidth:
                    columnWidth[j] = strWidth
                if richFlag:
                    dataWS.write_rich_string(i , j, *richStr)
                else:
                    dataWS.write_string(i , j, richStr[-1], richStr[-2])
                j += 1
        for j in range(len(showTitle)):
            dataWS.set_column(j, j, width=columnWidth[j]*1.2)


def generateCellData(aCellData, ftStyleList):
    ftContent = ''
    tempContent = aCellData['Content'] if aCellData['Content'] else ''
    if isinstance(tempContent, dict):
        for aValue in tempContent.values():
            ftContent += aValue + '\n'
        ftContent = ftContent.strip('\n')
    else:
        ftContent = str(tempContent)
    richStr = ''
    staIndex = 0
    for aStyle in ftStyleList:
        colorSta = int(aStyle['staIndex'])
        colorLen = int(aStyle['lenth'])
        if staIndex < colorSta:
            richStr += ftContent[staIndex: colorSta]
        richStr += '<font color="' + aStyle['color'] + '">' + ftContent[colorSta:colorSta + colorLen] + '</font>'
        staIndex = colorSta + colorLen
    if ftContent.__len__() > staIndex:
        richStr += ftContent[staIndex:]
    return richStr.replace('\n', '<br/>')
    # return ftContent


def generateTR(aRow, tdSta="<td>", tdEnd="</td>"):
    trHtml = "<tr>"
    for aCellData in aRow:
        tempSta = tdSta
        ftStyleList = []
        if 'Style' in aCellData:
            if 'bg_color' in aCellData['Style']:
                tempSta = '<td style="background:' + aCellData['Style']['bg_color'] + '">'
            if 'fontstyle' in aCellData['Style']:
                ftStyleList = aCellData['Style']['fontstyle']
        trHtml += tempSta + generateCellData(aCellData, ftStyleList) + tdEnd
    return trHtml + "</tr>"


def generateTH(aRow, thSta="<th>", thEnd="</th>"):
    trHtml = "<tr>"
    for aCellData in aRow:
        trHtml += thSta + aCellData + thEnd
    return trHtml + "</tr>"


def generateTableHtml(sheetDic):
    shellTableHtml = ''
    for sheetName, sheetData in sheetDic.items():
        tableHtml = '<table border=1 style="border-spacing: 0; white-space: nowrap">'
        showTitle = [i[0] for i in sheetData[0]]
        showTitle.insert(0, 'Numbers')
        title = [i[1] for i in sheetData[0]]
        tableHtml += generateTH(showTitle, "<th>", "</th>")
        tableData = sheetData[1]
        i = 0
        for curRowData in tableData:
            i += 1
            j = 1
            rowList = [{'Content': i}]
            for titleName in title:
                rowList.append(curRowData[titleName])
                j += 1
            tableHtml += generateTR(rowList, "<td>", "</td>")
        shellTableHtml += tableHtml + '</table>\n\n'
    return shellTableHtml

def saveData2Excel(excelName, sheetDic, chartDic = {}):
    dataWb = xlsxwriter.Workbook(excelName)
    generateChartSheets(dataWb, chartDic)
    generateRichStrSheets(dataWb, sheetDic)
    dataWb.close()

