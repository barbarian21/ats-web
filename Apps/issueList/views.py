import json
from django.views.generic.base import View
from django.shortcuts import render
from django.http import HttpResponse, StreamingHttpResponse, HttpResponseRedirect
from django.db.models import Q
from issueList.models import Action, Issue, ErsDoc, Handover,TCRadar

from stationTrack import datadeal
from issueList.htmlParse import TDHTMLParser

class GetIssueViewHtml(View):
    def get(self, request):
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/login/')
        return render(request, 'issueList/IssueCategory.html')
    
    def post(self, request):
        filterInfo, serialFilterFunction, targetModel = judgeModel({}, request.GET['target'], request.user.favor_project)
        for aFilter in request.POST.items():
            if 'delete' == aFilter[0]:
                delData = int(aFilter[1])
                if (filterInfo and delData > 0):
                    filterInfo.get(pk=delData).delete()
            if 'update' == aFilter[0]:
                saveData = json.loads(aFilter[1])
                for pk, aRowData in saveData.items():
                    aRowData['author'] = {'Content': request.user.username}
                    pk = int(pk)
                    if (pk < 0):
                        aRowData['project'] = {"dataType": "ForeignKey", "Content": {request.user.favor_project:None}}
                        datadeal.addARowDataToDb(targetModel, aRowData)
                    else:
                        datadeal.updateARowDataToDb(filterInfo.get(pk=pk), aRowData)
        return HttpResponse('OK')


def downloadFromdb(request):
    stationCat = request.GET['station_category']
    projectName = str(request.user.favor_project)
    shellData = {}
    
    path_Name = projectName + '_' + stationCat + '_ATS_Action & Issue Summary.xlsx'
    filterInfo, serialFilterFunction, targetModel = judgeModel({'station_category':stationCat}, 'Handover', projectName)
    tabletitle = [["Title","title"],["Note","content"],["Update Time","update_time"],["Add Time","add_time"],["Author","author"]]
    shellData['Special Note'] = [tabletitle, json.loads(json.dumps(serialFilterFunction(filterInfo), cls=datadeal.DateEncoder))]

    result = []
    filterInfo, serialFilterFunction, targetModel = judgeModel({'station_category': stationCat}, 'Action',projectName)
    result.extend(serialFilterFunction(filterInfo.filter(status=None)))
    result.extend(serialFilterFunction(filterInfo.filter(status__icontains='New')))
    result.extend(serialFilterFunction(filterInfo.filter(status__icontains='Ongoing')))
    result.extend(serialFilterFunction(filterInfo.filter(status__icontains='Keep Monitor')))
    tabletitle = [["Radar","radar"],["Title","title"],["DRI","DRI"],["Status","status"],["Remark","remark"],["Module","functions"],["Update Time","update_time"],["Add Time","add_time"],["Author","author"]]
    shellData['Open Action'] = [tabletitle,json.loads(json.dumps(result, cls=datadeal.DateEncoder))]

    result = []
    filterInfo, serialFilterFunction, targetModel = judgeModel({'station_category': stationCat},'Action', projectName)
    result.extend(serialFilterFunction(filterInfo.filter(Q(status__icontains='Close') | Q(status__icontains='Done'))))
    shellData['Done Action'] = [tabletitle,json.loads(json.dumps(result, cls=datadeal.DateEncoder))]

    result = []
    filterInfo, serialFilterFunction, targetModel = judgeModel({'station_category': stationCat},'Issue', projectName)
    result.extend(serialFilterFunction(filterInfo.filter(category=None)))
    result.extend(serialFilterFunction(filterInfo.filter(category__icontains='New Issue')))
    result.extend(serialFilterFunction(filterInfo.filter(category__icontains='Known Issue')))
    result.extend(serialFilterFunction(filterInfo.filter(category__icontains='Retest Issue')))
    result.extend(serialFilterFunction(filterInfo.filter(category__icontains='Keep Monitor')))
    tabletitle = [["Category","category"],["Station","station"],["Failure Qty","failure_count"],["Failure Items/Message","description"],["Root Cause/Next Steps","root_cause"],["action","action"],["ETA","ETA"],["Radar","radar"],["DRI","DRI"],["Module","functions"],["Update Time","update_time"],["Add Time","add_time"],["Author","author"]]
    shellData['QTx Issue List'] = [tabletitle,json.loads(json.dumps(result, cls=datadeal.DateEncoder))]

    result = []
    filterInfo, serialFilterFunction, targetModel = judgeModel({'station_category': stationCat},'Issue', projectName)
    result.extend(serialFilterFunction(filterInfo.filter(Q(category__icontains='Close Issue') | Q(category__icontains='Fixed Issue'))))
    shellData['Fixed Issue'] = [tabletitle,json.loads(json.dumps(result, cls=datadeal.DateEncoder))]

    filterInfo, serialFilterFunction, targetModel = judgeModel({'station_category': stationCat},'ErsDoc', projectName)
    tabletitle = [["Component","component"],["Radar","radar"],["Title","title"],["To","mailTo"],["CC","mailCC"],["Remark","remark"],["Update Time","update_time"],["Add Time","add_time"],["Author","author"]]
    shellData['ERS_DOC'] = [tabletitle,json.loads(json.dumps(serialFilterFunction(filterInfo), cls=datadeal.DateEncoder))]

    filterInfo, serialFilterFunction, targetModel = judgeModel({'station_category': stationCat}, 'TCRadar', projectName)
    tabletitle = [["station","station"],["Radar","radar"],["Title","title"],["Version","version"],["Update Time","update_time"],["Add Time","add_time"],["Author","author"]]
    shellData['TC Radar'] = [tabletitle,json.loads(json.dumps(serialFilterFunction(filterInfo), cls=datadeal.DateEncoder))]
    
    datadeal.saveData2Excel('media/' + path_Name, shellData)
    file = open('media/' + path_Name, 'rb')
    response = StreamingHttpResponse(file)
    response['Content-Type'] = 'application/octet-stream'
    response['Content-Disposition'] = 'attachment;filename="{}"'.format(path_Name)
    return response

def searchIssueCategory(request):
    filterDic = request.GET.dict()
    targetModel = filterDic.pop('target')
    radarNum = filterDic.pop('radar', None)
    projectCode = request.user.favor_project
    if 'Action' == targetModel:
        statusCat = filterDic.pop('status', False)
        filterInfo, serialFilterFunction, targetModel = judgeModel(filterDic, targetModel, projectCode)
        if statusCat:
            if 'open' == statusCat:
                filterInfo = filterInfo.filter(Q(status__icontains='New') | Q(status__icontains='Ongoing') | Q(status__icontains='Keep Monitor') | Q(status=None))
            elif 'done' == statusCat:
                filterInfo = filterInfo.filter(Q(status__icontains='Close') | Q(status__icontains='Done'))
            else:
                filterInfo = filterInfo.filter(status__icontains=statusCat)
    elif 'Issue' == targetModel:
        categoryCat = filterDic.pop('category', False)
        filterInfo, serialFilterFunction, targetModel = judgeModel(filterDic, targetModel, projectCode)
        if categoryCat:
            if 'new' == categoryCat:
                filterInfo = filterInfo.filter(Q(category__icontains='New Issue') | Q(category__icontains='Retest Issue') |
                                               Q(category__icontains='Known Issue') | Q(category__icontains='Keep Monitor')| Q(category=None))
            elif 'fixed' == categoryCat:
                filterInfo = filterInfo.filter(Q(category__icontains='Close Issue') | Q(category__icontains='Fixed Issue'))
            else:
                filterInfo = filterInfo.filter(category__icontains=categoryCat)
    else:
        filterInfo, serialFilterFunction, targetModel = judgeModel(filterDic, targetModel, projectCode)
        
    if radarNum:
        filterInfo = filterInfo.filter(radar__icontains=radarNum)
    return HttpResponse(len(filterInfo))

def getIssueCategoryHttpResponse(request):
    filterDic = request.GET.dict()
    targetModel = filterDic.pop('target')
    radarNum = filterDic.pop('radar', None)
    projectCode = request.user.favor_project
    if 'Action' == targetModel:
        result = []
        statusCat = filterDic.pop('status', False)
        filterInfo, serialFilterFunction, targetModel = judgeModel(filterDic, targetModel, projectCode)
        if radarNum:
            filterInfo = filterInfo.filter(radar__icontains=radarNum)
        if statusCat:
            if 'open' == statusCat:
                result.extend(serialFilterFunction(filterInfo.filter(status=None)))
                result.extend(serialFilterFunction(filterInfo.filter(status__icontains='New')))
                result.extend(serialFilterFunction(filterInfo.filter(status__icontains='Ongoing')))
                result.extend(serialFilterFunction(filterInfo.filter(status__icontains='Keep Monitor')))
                
            elif 'done' == statusCat:
                result.extend(serialFilterFunction(filterInfo.filter(Q(status__icontains='Close') | Q(status__icontains='Done'))))
            else:
                result.extend(serialFilterFunction(filterInfo.filter(status__icontains=statusCat)))
        else:
            result = serialFilterFunction(filterInfo)
    elif 'Issue' == targetModel:
        result = []
        categoryCat = filterDic.pop('category', False)
        filterInfo, serialFilterFunction, targetModel = judgeModel(filterDic, targetModel, projectCode)
        if radarNum:
            filterInfo = filterInfo.filter(radar__icontains=radarNum)
        if categoryCat:
            if 'new' == categoryCat:
                result.extend(serialFilterFunction(filterInfo.filter(category=None)))
                result.extend(serialFilterFunction(filterInfo.filter(category__icontains='New Issue')))
                result.extend(serialFilterFunction(filterInfo.filter(category__icontains='Known Issue')))
                result.extend(serialFilterFunction(filterInfo.filter(category__icontains='Retest Issue')))
                result.extend(serialFilterFunction(filterInfo.filter(category__icontains='Keep Monitor')))
            elif 'fixed' == categoryCat:
                result.extend(serialFilterFunction(filterInfo.filter(Q(category__icontains='Close Issue') | Q(category__icontains='Fixed Issue'))))
            else:
                result.extend(serialFilterFunction(filterInfo.filter(category__icontains=categoryCat)))
        else:
            result = serialFilterFunction(filterInfo)
    else:
        filterInfo, serialFilterFunction, targetModel = judgeModel(filterDic, targetModel, projectCode)
        if radarNum:
            filterInfo = filterInfo.filter(radar__icontains=radarNum)
        result = serialFilterFunction(filterInfo)
    return HttpResponse(json.dumps(result, cls=datadeal.DateEncoder))
    
def judgeModel(filterDic, targetModel, projectCode):
    if 'Action' == targetModel:
        return getActionInfo(projectCode, filterDic), serialActionInfo, Action
    if 'Issue' == targetModel:
        return getIssueInfo(projectCode, filterDic), serialIssueInfo, Issue
    if 'ErsDoc' == targetModel:
        return getErsDocInfo(projectCode, filterDic), serialErsDocInfo, ErsDoc
    if 'Handover' == targetModel:
        return getHandoverInfo(projectCode, filterDic), serialHandoverInfo, Handover
    if 'TCRadar' == targetModel:
        return getTCRadarInfo(projectCode, filterDic), serialTCRadarInfo, TCRadar
    
def getActionInfo(projectCode,filterDic):
    filterInfo = Action.objects.select_related('project', 'stage', 'station').filter(project__code=projectCode)
    filterInfo = filterInfo.filter(**filterDic)
    return filterInfo.order_by('-update_time')

def serialActionInfo(filterInfo):
    result = datadeal.serialAQuerySet(filterInfo, {'station': 'name', 'project': 'code', 'stage': 'name'}, None, None)
    return result

def getIssueInfo(projectCode,filterDic):
    filterInfo = Issue.objects.select_related('project', 'stage').filter(project__code=projectCode)
    filterInfo = filterInfo.filter(**filterDic)
    return filterInfo.order_by('-update_time')

def serialIssueInfo(filterInfo):
    result = datadeal.serialAQuerySet(filterInfo, {'project': 'code', 'stage': 'name'}, {'station': 'name'}, None)
    return result

def getErsDocInfo(projectCode,filterDic):
    filterInfo = ErsDoc.objects.select_related('project').filter(project__code=projectCode)
    filterInfo = filterInfo.filter(**filterDic)
    return filterInfo.order_by('-update_time')

def serialErsDocInfo(filterInfo):
    result = datadeal.serialAQuerySet(filterInfo, {'project': 'code'}, None, {'mailCC': 1, 'mailTo':2})
    return result

def getHandoverInfo(projectCode,filterDic):
    filterInfo = Handover.objects.select_related('project', 'stage', 'station').filter(project__code=projectCode)
    filterInfo = filterInfo.filter(**filterDic)
    return filterInfo.order_by('-update_time')

def serialHandoverInfo(filterInfo):
    result = datadeal.serialAQuerySet(filterInfo, {'station': 'name', 'project': 'code', 'stage': 'name'}, None, None)
    return result

def getTCRadarInfo(projectCode,filterDic):
    filterInfo = TCRadar.objects.select_related('project').filter(project__code=projectCode)
    filterInfo = filterInfo.filter(**filterDic)
    return filterInfo.order_by('-update_time')

def serialTCRadarInfo(filterInfo):
    result = datadeal.serialAQuerySet(filterInfo, {'project': 'code'}, None, None)
    return result


def fixedAllModelStyle(request):
    filterDic = request.GET.dict()
    projectCode = filterDic.pop('project')
    password = filterDic.pop('password', None)
    targetList = ['Action', 'Issue', 'ErsDoc', 'Handover', 'TCRadar']
    result = []
    for targetModelStr in targetList:
        filterInfo, serialFilterFunction, targetModel = judgeModel(filterDic, targetModelStr, projectCode)
        result.append('<br><br>' + targetModelStr + ':<br>')
        filterRes = serialFilterFunction(filterInfo)
        result.append(json.dumps(filterRes, cls=datadeal.DateEncoder))
        if 'ATS123' == password:
            tdParser = TDHTMLParser()
            for aRow in filterRes:
                fieldChange = {}
                pk = None
                for fieldName, filedData in aRow.items():
                    filedContent = filedData['Content']
                    if 'id' == fieldName:
                        pk = int(filedContent)
                        continue
                    if isinstance(filedContent, str):
                        tdParser.dataInit()
                        tdParser.feed(filedContent)
                        if tdParser.isTdStyle:
                            fieldChange[fieldName] = tdParser.generateResult()
                datadeal.updateARowDataToDb(filterInfo.get(pk=pk), fieldChange)
            
    return HttpResponse(result)
    
    
