from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from connection.models import *
from django.core.mail import send_mail
from django.db.models import Q
from apscheduler.schedulers.background import BackgroundScheduler
from django.conf import settings
from django.core.mail import EmailMultiAlternatives


import os
import json
import datetime

# Create your views here.
def overlayRequest(request):
    if request.method == 'GET':
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/login/')
        favor_project = request.user.favor_project
        stage = Stage.objects.filter(project=favor_project).order_by('-id')
        station = Station.objects.filter(project=favor_project)
        department = Department.objects.all()
        mailTo = "D580140R04@intra.pegatroncorp.com"
        sidebar = {'New Overlay':'/overlay/1/',
                    'Validating Overlay':'/overlay/2/',
                    'Online Overlay':'/overlay/3/',
                    'Expired Overlay':'/overlay/4/',
                    'Request Email':'/overlay/request/'}
        context = {"stage": stage, 
                    "station":station,
                    "mailTo":mailTo,
                    "Department":department,
                    "index":5,
                    "sidebar": sidebar}
        return render(request, 'overlayList/request.html', context)


def showOverlays(request,num):
    if request.method == 'GET':
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/login/')
        favor_project = request.user.favor_project
        stage = Stage.objects.filter(project=favor_project).order_by('-id')
        station = Station.objects.filter(project=favor_project)
        status = Overlay.statusList()
        try:
            radar = getStationTrackRadar(favor_project, station[0])
        except:
            radar = ""

        sidebar = {'New Overlay':'/overlay/1/',
                    'Validating Overlay':'/overlay/2/',
                    'Online Overlay':'/overlay/3/',
                    'Expire Overlay':'/overlay/4/',
                    'Request Email':'/overlay/request/'}

        # issues = Issue.objects.filter(project=favor_project).order_by('id')
        context = {"project":favor_project ,
                    "stage": stage, 
                    "station":station, 
                    "status":status,
                    "radar":radar,
                    "index":num,
                    "sidebar": sidebar}
        return render(request,"overlayList/overlayList.html",context)


def getOverlayData(request):
    if request.method == 'POST':
        para = request.POST.get('para')
        favor_project = request.user.favor_project
        if('1' in para):
            all_overlays = Overlay.objects.filter(project=favor_project,status='New')
        elif('2' in para):
            all_overlays = Overlay.objects.filter(project=favor_project,status='Validation')
        elif('3' in  para):
            all_overlays = Overlay.objects.filter(project=favor_project,status='Online')
        elif('4' in para):
            all_overlays = Overlay.objects.filter(Q(project=favor_project),Q(status='Expire') | Q(status="Damage"))
        else:
            all_overlays = Overlay.objects.filter(project=favor_project)
        total = len(all_overlays)
        rows = []
        data = {"total": total, "rows": rows}
        for item in all_overlays:
            row_data = getRowData(item)
            rows.append(row_data)
        return HttpResponse(json.dumps(data), content_type="application/json")


def removeOverlay(request):
    if request.method == 'POST':
        ids = request.POST.get("recordID")
        arrID = ids.split(',')
        for id in arrID:
            obj = Overlay.objects.get(id=id)
            obj.delete()
            print("remove overlay=>", id, obj.version)
        return HttpResponse('0')


def addOverlay(request):
    if request.method == 'POST':
        result= updateRecord(request)
        overlay_add = result[0]
        data = getRowData(overlay_add)
        dumpData = {'data':data, 'refresh':result[1]}
        return HttpResponse(json.dumps(dumpData), content_type="application/json")


def editOverlay(request):
    if request.method == 'POST':
        result= updateRecord(request,op='editor')
        overlay_obj = result[0]
        data = getRowData(overlay_obj)
        dumpData = {'data':data, 'refresh':result[1]}
        return HttpResponse(json.dumps(dumpData), content_type="application/json")
    return HttpResponse(json.dumps({}), content_type="application/json")


def updateRecord(request, op='add'):
    refresh = False
    project_code = request.POST.get("project",None)
    stage_id = request.POST.get("stage",None)
    station_id = request.POST.get("station",None)
    version = request.POST.get("version",'')
    based_on = request.POST.get("based_on",'')
    core_overlay = request.POST.get("core_overlay",'')
    based_on_core = request.POST.get("based_on_core",'')
    radar = request.POST.get("radar",'')
    status = request.POST.get("status",None)
    change_list = request.POST.get("change_list",'')
    remark = request.POST.get("remark",'')
    fixIssue = request.POST.get("fixIssue",'')
    audit_DRI = request.POST.get("audit_DRI",'')
    audit_time = request.POST.get("audit_time",'')
    note = request.POST.get("isNote",True)
    isNote = False
    if(note == "on"):
        isNote = True
    noteTimeout = request.POST.get("noteTimeout",None)
    if noteTimeout =="":
        noteTimeout=None

    if(audit_time == '' or audit_time.lower() =='none'):
        audit_time = None
    rollin_time = request.POST.get("rollin_time",'')
    if(rollin_time == '' or rollin_time.lower() =='none'):
        rollin_time = None
    if status == 'Online':
        onLineOverlay=Overlay.objects.filter(project=Project.objects.get(code=project_code), 
                                        station=Station.objects.get(id=station_id),
                                        status= status,
                                        )
        if onLineOverlay.exists():
            refresh = True
            for overlay in onLineOverlay:
                overlay.status = 'Expire'
                overlay.save()

    #update database
    if(op!='add'):
        id = request.POST.get("id")
        ovelray_obj = Overlay.objects.get(id=id)
    else:
        ovelray_obj = Overlay()
    ovelray_obj.project = Project.objects.get(code=project_code)
    ovelray_obj.stage = Stage.objects.get(id=stage_id)
    ovelray_obj.station = Station.objects.get(id=station_id)
    ovelray_obj.version = version
    ovelray_obj.based_on = based_on
    ovelray_obj.core_overlay = core_overlay
    ovelray_obj.based_on_core = based_on_core
    ovelray_obj.radar = radar
    ovelray_obj.status = status
    ovelray_obj.change_list = change_list
    ovelray_obj.remark = remark
    ovelray_obj.fixIssue = fixIssue
    ovelray_obj.audit_DRI = audit_DRI
    ovelray_obj.audit_time = audit_time
    ovelray_obj.rollin_time = rollin_time
    ovelray_obj.author = request.user.username
    ovelray_obj.isNote = isNote
    ovelray_obj.noteTimeout = noteTimeout

    ovelray_obj.save()
    return (ovelray_obj,refresh)


def getOverlayRadar(request):
    if request.method == 'POST':
        station_id = request.POST.get("station_id",'')        
        try:
            stationObj = Station.objects.get(id=station_id)
            trackRadarObj = OveralyTrackingRadar.objects.get(station=stationObj,project=request.user.favor_project)
            radar = trackRadarObj.radar
        except:
            radar = ''        
        return HttpResponse(json.dumps({'data':radar}), content_type="application/json") 

def getRowData(overlayObj):
    fixIssue = overlayObj.fixIssue
    if fixIssue != None:
        fixIssue = fixIssue.replace('\r','')
        fixIssue = fixIssue.replace('\n','<br>')
    else:
        fixIssue=''

    change_list = overlayObj.change_list
    if change_list != None:
        change_list=change_list.replace('\r','')
        change_list=change_list.replace('\n','<br>')
    else:
        change_list=''

    remark = overlayObj.remark
    if remark != None:
        remark=remark.replace('\r','')
        remark=remark.replace('\n','<br>')
    else:
        remark=''

    radar = getStationTrackRadar(overlayObj.project, overlayObj.station)
    data = {
        'id': overlayObj.id,
        'project': str(overlayObj.project),
        'stage': str(overlayObj.stage),
        'station': str(overlayObj.station),
        'version': overlayObj.version,
        'based_on': overlayObj.based_on,
        'core_overlay': overlayObj.core_overlay,
        'based_on_core':overlayObj.based_on_core,
        'radar': radar,
        'status': overlayObj.status,
        'isNote': overlayObj.isNote,
        'noteTimeout': overlayObj.noteTimeout,
        'change_list': change_list,
        'remark': remark,
        'fixIssue': fixIssue,
        'author': overlayObj.author,
        'audit_DRI': overlayObj.audit_DRI,
        'audit_time': str(overlayObj.audit_time),
        'rollin_time': str(overlayObj.rollin_time),
        'update_time': overlayObj.update_time.strftime(format="%Y-%m-%d %H:%M:%S"),
        'add_time': overlayObj.add_time.strftime(format="%Y-%m-%d %H:%M:%S")}
    return data


def requestMailData(request):
    if request.method == 'POST':
        szChangeList = request.POST.get("changeList",None)
        szStationChange = request.POST.get("stationChange",None)
        szFixissue = request.POST.get("radar_document",None)
        szProject = request.POST.get("project",None)
        szStage = request.POST.get("stage",None)
        data = {"result":False,"info":""}

        favorProject = request.user.favor_project
        stage_obj = Stage.objects.filter(name=szStage,project=favorProject)
        stationChange = json.loads(szStationChange)

        submit = True
        if szProject != favorProject.name:
            submit = False
            data["info"] = "Fail create overlay recrod for invid Project"
        elif not stage_obj.exists():
            submit = False
            data["info"] = "Fail create overlay recrod for invid Stage"
        if stationChange == {}:
            submit = False
            data["info"] = "Fail create overlay recrod for invid Change List"

        if submit:
            # changeList = json.loads(szChangeList)
            for key in stationChange:
                change_list = stationChange[key]
                ovelray_obj = Overlay()
                ovelray_obj.project = favorProject
                ovelray_obj.stage = stage_obj[0]
                if not Station.objects.filter(script=key, project=favorProject).exists():
                    data["info"] = "Fail create overlay recrod for station:" + key
                    continue
                ovelray_obj.station = Station.objects.get(script=key,project=favorProject) 
                ovelray_obj.status = Overlay.statusList()[0]
                ovelray_obj.change_list = change_list
                ovelray_obj.fixIssue = szFixissue
                ovelray_obj.save()
                data["result"] = True
        return HttpResponse(json.dumps(data), content_type="application/json")
    return HttpResponse(json.dumps({}), content_type="application/json")


def requestMail(request):
    if request.method == 'POST':
        data={}
        fromMail = request.user.email
        to = request.POST.get("mail_to",'')
        cc = request.POST.get("mail_cc",'')
        mail_body = request.POST.get("mail_body",'')
        subject = request.POST.get("mail_subject",'')
        send_mail(subject, mail_body, fromMail, [to,cc], fail_silently=False)
        return HttpResponse(json.dumps(data), content_type="application/json")
    return HttpResponse(json.dumps({}), content_type="application/json") 

def getStationItems(request):
    data=[]
    if request.method == 'POST':
        szStation = request.POST.get("station",'')
        if szStation != "":
            favorProject = request.user.favor_project
            station = Station.objects.get(script=szStation, project=favorProject)
            stationTC =  TestCoverage.objects.filter(project=favorProject,station=station)
            for obj in stationTC:
                data.append(obj.test_name)
            return HttpResponse(json.dumps(data), content_type="application/json") 
    return HttpResponse(json.dumps({}), content_type="application/json") 
  
def overlayTask(request):
    if request.method == 'GET':
        return  render(request, 'overlayList/overlayTask.html')

def getStationTrackRadar(projectObj, stationObj):
    try:
        trackRadarObj = OveralyTrackingRadar.objects.get(station=stationObj, project=projectObj)
        radar = trackRadarObj.radar
    except:
        radar = ''
    return radar
  
def get_fileSize(filePath):
    try:
        fsize = os.path.getsize(filePath)
        fsize = fsize/float(1024 * 1024)
        return round(fsize, 2)
    except:
        return 0

def checkOverlayDateTask():
    now_time = datetime.datetime.now()
    print(now_time,"====begin checkOverlayDateTask====")

    #check log size
    logPath = settings.CRONJOBS_DIR
    fileName = settings.CRONJOBS_FILE_NAME 
    fSize = get_fileSize(logPath+fileName)
    if fSize>=100:
        str_time = now_time.strftime(format="%Y-%m-%d %H:%M:%S")
        os.rename(logPath+fileName ,logPath+str_time+".log")
        os.system('touch '+logPath+fileName)

    # Get all new overlays by projects
    dic_overlays = {}    
    all_overlays = Overlay.objects.filter(Q(status='New') | Q(status="Validation"))
    for overlayObj in all_overlays:
        project = overlayObj.project
        str_project = str(project)

        #judge project is need to note?
        try:
            noteObj = OverlayMailNote.objects.get(project=project)
            isNote = noteObj.isNote
        except:
            isNote = False
        if not isNote:
            continue
        if not overlayObj.isNote:
            continue
        
        #获取timeout
        if overlayObj.noteTimeout!=None:
            timeout = overlayObj.noteTimeout
        else:
            try:
                timeout = noteObj.hours
            except:
                timeout = 12
        days = (now_time-overlayObj.add_time).days
        seconds = (now_time-overlayObj.add_time).seconds
        hours = days*24 + seconds/3600

        #超时添加
        if hours>timeout:
            dicInfo = {}
            dicInfo["timeout"] = timeout
            dicInfo["lifeTime"] = hours
            dicInfo["overlay"] = overlayObj
            if str_project in dic_overlays:
                dic_overlays[str_project].append(dicInfo)
            else:
                dic_overlays[str_project] = [dicInfo]
    print(dic_overlays)

    #Check note and send mail
    for project_code in dic_overlays:
        project=Project.objects.get(code=project_code)
        noteObj = OverlayMailNote.objects.get(project=project)
        fromMail = settings.DEFAULT_FROM_EMAIL
        to = noteObj.emailTo
        try:
            cc = noteObj.emailCC.split(',')
        except:
            cc = []
        subject = noteObj.emailSubject
        mail_title = noteObj.emailTitle

        html = []
        html.append("<pre>"+mail_title+"</pre>")
        overlay_versions = "<table border='1'><tr><th>Version</th><th>Over Time</th><th>Status</th><th>Create Time</th></tr>\n"
        overlay_Detail = "<table border='1' cellpadding='5'><caption>Overlay Detail</caption>\n"
        
        overlayList = dic_overlays[project_code]
        for dicInfo in overlayList:
            overlayObj = dicInfo["overlay"]
            timeout = dicInfo["timeout"]
            lifetime = dicInfo["lifeTime"]
            status = overlayObj.status
            version = overlayObj.version
            creatTime = overlayObj.add_time.strftime(format="%Y-%m-%d %H:%M:%S")

            overlay_Detail=overlay_Detail+"<tr><td colspan='2' align='center'><b>"+version+"</b></td></tr>\n"

            changeList = overlayObj.change_list
            overlay_Detail=overlay_Detail+"<tr><td>changeList</td><td><pre>"+changeList+"</pre></td></tr>\n"

            fixIssue = overlayObj.fixIssue
            if fixIssue and fixIssue!="":
                overlay_Detail=overlay_Detail+"<tr><td>fixIssue</td><td><pre>"+fixIssue+"</pre></td></tr>\n"

            radar = overlayObj.radar
            if radar and radar!="":
                overlay_Detail=overlay_Detail+"<tr><td>stationRadar</td><td>"+radar+"</td></tr>\n"
            
            # overlay_Detail=overlay_Detail+"<tr><td colspan='2'>&nbsp;</td></tr>\n"
            overlay_versions = overlay_versions +"<tr><td>"+version+"</td>"
            overlay_versions = overlay_versions +"<td>"+format(lifetime-timeout,'.1f')+"</td>"
            overlay_versions = overlay_versions +"<td>"+status+"</td>"
            overlay_versions = overlay_versions +"<td>"+creatTime+"</td>"
            overlay_versions = overlay_versions + "</tr>\n"

        overlay_versions = overlay_versions +"</tr></table>\n"
        html.append(overlay_versions)
        html.append("<br>")
        overlay_Detail = overlay_Detail+ "</table>\n"
        html.append(overlay_Detail)

        html_content = "\n".join(html)
        msg = EmailMultiAlternatives(subject, mail_title, fromMail, [to], cc)
        msg.attach_alternative(html_content, "text/html")
        os.system("echo \""+html_content+ "\" >/Users/scott/test.html")
        msg.send()
