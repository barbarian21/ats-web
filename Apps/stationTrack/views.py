
import json
from django.views.generic.base import View
from django.shortcuts import render
from django.http import HttpResponse, StreamingHttpResponse, HttpResponseRedirect
from stationTrack.models import StationTrack

from stationTrack import datadeal

class GetSTViewHtml(View):
    
    def get(self, request):
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/login/')
        stationCategory = datadeal.getStationInfo(request.user.favor_project,'category')
        stationCategory = {l[1] for l in stationCategory}
        return render(request, 'stationTrack/StationTrack.html',{'Category' : stationCategory})
    
    def post(self, request):
        filterInfo = StationTrack.objects.select_related('project', 'stage', 'station_name').filter(
            project__code=request.user.favor_project)
        for aFilter in request.POST.items():
            print(aFilter)
            if 'delete' == aFilter[0]:
                delData = int(aFilter[1])
                if(delData > 0):
                    filterInfo.get(pk = delData).delete()
            if 'update'  == aFilter[0]:
                saveData = json.loads(aFilter[1])
                for pk,aRowData in saveData.items():
                    pk = int(pk)
                    if(pk < 0):
                        aRowData['project'] = {"dataType": "ForeignKey", "Content": {request.user.favor_project:None}}
                        datadeal.addARowDataToDb(StationTrack, aRowData)
                    else:
                        datadeal.updateARowDataToDb(filterInfo.get(pk = pk), aRowData)
        return HttpResponse('OK')

def downloadFromdb(request):
    path_Name =  str(request.user.favor_project) + '_StationTrack.xlsx'
    tabletitle = [["project","project"],["stage","stage"],["station_name","station_name"],["station_quantity","station_quantity"],["Overlay_Version","Overlay_Version"],["GRR","GRR"],["cofList","cofList"],["Setup_Issue_Remark","Setup_Issue_Remark"],["Daily_Issue_describe","Daily_Issue_describe"],["update_time","update_time"],["add_time","add_time"]]
    tableData = json.loads(getStationTrackHttpResponse(request).content)
    shellData = {'StationTrack' : [tabletitle, tableData]}
    datadeal.saveData2Excel('media/'+ path_Name, shellData)
    file = open('media/'+ path_Name, 'rb')
    response = StreamingHttpResponse(file)
    response['Content-Type'] = 'application/octet-stream'
    response['Content-Disposition'] = 'attachment;filename="{}"'.format(path_Name)
    return response

def getStationTrackHttpResponse(request):
    return serialStationTrackInfo(getStationTrackInfo(request))
    
def getStationTrackInfo(request):
    filterInfo = StationTrack.objects.select_related('project','stage','station_name').filter(
        project__code = request.user.favor_project)
    filterInfo = filterInfo.filter(**request.GET.dict())
    return filterInfo.order_by('-update_time')

def serialStationTrackInfo(filterInfo):
    result = datadeal.serialAQuerySet(filterInfo , {'station_name' : 'name', 'project' : 'code', 'stage' : 'name'}, None, None)
    return HttpResponse(json.dumps(result, cls = datadeal.DateEncoder))

def getCommonModelData(request):
    targetModel = request.GET['target']
    result = None
    favorProject = request.user.favor_project
    if 'stage' == targetModel:
        result = datadeal.getStageInfo(favorProject, 'name')
    if 'station' == targetModel:
        result = datadeal.getStationInfo(favorProject, 'name')
    if 'project' == targetModel:
        result = datadeal.getProjectInfo('code',code = favorProject)
    if 'mail' == targetModel:
        result = datadeal.getCocoInfo(favorProject, 'email','name')
        result = [[i[1], i[2]] for i in result]
        result.append([favorProject.email, favorProject.name])
    return HttpResponse(json.dumps(result, cls = datadeal.DateEncoder))
        
    
