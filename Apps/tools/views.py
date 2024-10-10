import csv
import os
import re
import time
import datetime
import sqlite3
import smtplib
from email.mime.text import MIMEText
from collections import Counter

from django.conf import settings
from django.contrib import messages
from django.shortcuts import render,redirect
from django.http import HttpResponse, HttpResponseRedirect, FileResponse,JsonResponse,HttpResponseNotFound

from tools.models import *
from common.models import Station,Project,Stage,Git
from userInfo.models import User as User_Object


# Create your views here.
def messageBoardindex(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/login/')
    else:
        allLeaveInfo=[]
        leaveInfo=MessageBoard.objects.all().order_by("-time")
        for l in leaveInfo:
            replyInfo=MessageBoard_Reply.objects.filter(leaveMessage=l)
            info={"id":l.id,"message":l.message,"title":l.title,
            "time":l.time,"user":l.user,"replyInfo":replyInfo}
            allLeaveInfo.append(info)
            print(l.user.username)
            print(l.user.imageAddress)
        context={'leavemessages':allLeaveInfo}
        return render(request,'tools/MessageBoard.html',context)

def submitMessage(request):
     context={}
     message = request.POST['message']
     title = request.POST['title']
     user = request.user
     user=User_Object.objects.get(username=user)
     messageModel = MessageBoard(message=message,title=title,user=user)
     messageModel.save()    
     context['messages'] = MessageBoard.objects.all()

     return JsonResponse({},safe=True)
    
def submitReplyMessage(request):
     message = request.POST['replyMessage']
     leaveInfoId = request.POST['leaveInfo']
     user = request.user
     user=User_Object.objects.get(username=user)
     leaveId=int(leaveInfoId[1:])
     messageBoard=MessageBoard.objects.get(id=leaveId)
     messageReplyModel = MessageBoard_Reply(replyMessage=message,leaveMessage=messageBoard ,replyUser=user)
     messageReplyModel.save()    
     return JsonResponse({},safe=True)

def deleteMessage(request):
    if request.method == "POST":
        messageId = request.POST['MessageId']
        if messageId[0:2]=="dl":
            MessageBoard.objects.filter(id=messageId[2:]).delete()
        else:
            MessageBoard_Reply.objects.filter(id=messageId[2:]).delete()
            
        return JsonResponse({},safe=True)

def autoBuildindex(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/login/')
    else:
        return render(request, 'tools/AutoBuild.html')

def requestBaseDate(request):
    content={}
    stations=[]
    stages=[]
    ccmail=''
    fivelogs=[]
    if request.method == "POST":
        p = request.POST['project']

        project=Project.objects.get(code=p)
        station=Station.objects.filter(project=project).order_by('category')
        stage=Stage.objects.filter(project=project)
        for sta in station:
            stations.append(sta.stationID)
        for s in stage:
            stages.append(s.name)
        ccmail=project.email

        #得到该案子hwte-git，master的 Git log -5信息
        try:
            the_Git=Git.objects.get(project=project,git='hwte-git',branch='master')
            git_adress_psh=os.path.split(os.path.split(the_Git.address)[0])[0]
            os.popen("cd %s && git pull -f" %git_adress_psh)
            #读取代码history的最新一条记录的时间，并截取
            res_log=os.popen("cd %s && git log -5" %git_adress_psh)
            logs=res_log.read()
            updatetime=re.findall('Date:\s*(.*?)\s\+', logs)
            commits=re.findall('commit\s*(.{7})', logs)
            author=re.findall('Author:\s*(.*?)<',logs)
            
            for i in range(0,len(updatetime)):
                log_dic={}
                log_dic['commitId']=commits[i]
                log_dic['author']=author[i]
                time_strp=datetime.datetime.strptime(updatetime[i],'%a %b %d %H:%M:%S %Y')
                log_dic['updatetime']=datetime.datetime.strftime(time_strp,'%H:%M:%S %m/%d/%Y')
                fivelogs.append(log_dic)
        except Exception as e:
            print("read git log fail!! %s" % e)
            content['gitlog']=[]
        else:
            content['gitlog']=fivelogs

        content['stations']=stations
        content['stages']=stages
        content['ccmail']=ccmail
        return JsonResponse(content, safe=True)

def sendBuildMail(request):
    if request.method == "POST":
        project = request.POST['project']
        stage=request.POST['stage']
        station=request.POST['station']
        atlas_version = request.POST['atlas_version']
        branch = request.POST['branch']
        Tag = request.POST['Tag']
        CCMail = request.POST['CCMail']
        user = request.user
        print(request.user.username)
        print(request.user.password)
        password = settings.EMAIL_HOST_PASSWORD
        res = sendMail(user,password,station=station,project=project,stage=stage,version=atlas_version,branch=branch,tag=Tag,ccMail=CCMail)
        if res:
            return JsonResponse({'result':'ok'}, safe=True)
        else:
            return JsonResponse({'result':'fail'},safe=True)


def macAppsindex(request):
    context={}
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/login/')
    else:
        #permission?
        # print(request.user)
    
        if str(request.user) in ['howard6_wu','allen8_liu','sky_ge','calvin2_liu','luther_wu','xiaoqian_ma','belle8_li','miky_wang','tina3_huang','shirley_shen','felix1_zhang','shuai5_li']:     
            context['records'] = MacApps.objects.all().order_by("-uploadTime")
            return render(request, 'tools/MacApps.html',context)
        else:
            messages.success(request,"没有权限！")
            return redirect("/messageBoard/")

def grrSheetindex(request):
    context={}
    user = request.user
    user=User_Object.objects.get(username=user)
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/login/')
    else:
        grrInfos=GrrSheet.objects.filter(project=request.user.favor_project).order_by("-time")
        overlayInfos=OverlaySheet.objects.filter(project=request.user.favor_project).order_by("-time")
        context={'grrAllInfos':grrInfos,'overlayAllInfos':overlayInfos}
        return render(request,'tools/GrrAndoverlay.html',context)  

def submitGrrOrOverlay(request):
    context={}
    mark = request.POST['mark']
    user = request.user
    user=User_Object.objects.get(username=user)
    if mark == 'grr':
        station = request.POST['station']
        radar = request.POST['radar']
        version = request.POST['version']
        overlay = request.POST['overlay']
        toolVer = request.POST['toolVer']
        remark = request.POST['remark']

        grrInfo = GrrSheet.objects.filter(project=request.user.favor_project,station=station)
        if grrInfo:
            grrInfo = GrrSheet.objects.get(project=request.user.favor_project,station=station)

            grrInfo.station = station
            grrInfo.radar = radar
            grrInfo.grrVer = version
            grrInfo.overlay = overlay
            grrInfo.toolVer = toolVer
            grrInfo.remark = remark
            grrInfo.save()
        else:
            grrInfo = GrrSheet(project=request.user.favor_project,station=station,radar=radar,grrVer=version,overlay=overlay,
            toolVer=toolVer,remark=remark,user=user)
            grrInfo.save()
    else:
        station = request.POST['station']
        radar = request.POST['radar']
        baseOn = request.POST['baseOn']
        overlay = request.POST['overlay']
        change = request.POST['change']
        remark = request.POST['remark']

        overlayInfo = OverlaySheet.objects.filter(project=request.user.favor_project,station=station)
        if overlayInfo:
            overlayInfo = OverlaySheet.objects.get(project=request.user.favor_project,station=station)

            overlayInfo.station = station
            overlayInfo.radar = radar
            overlayInfo.baseOn = baseOn
            overlayInfo.overlay = overlay
            overlayInfo.changeNote = change
            overlayInfo.remark = remark
            overlayInfo.save()
        else:
            overlayInfo = OverlaySheet(radar=radar,project=request.user.favor_project,station=station,baseOn=baseOn,changeNote=change,overlay=overlay,remark=remark,user=user)
            overlayInfo.save()

    
    grrInfos=GrrSheet.objects.filter(project=request.user.favor_project).order_by("-time") 
    overlayInfos=OverlaySheet.objects.filter(project=request.user.favor_project).order_by("-time")

    context={'grrAllInfos':grrInfos,'overlayAllInfos':overlayInfos}

    return JsonResponse({},safe=True)


def delGrrOrOverlay(request):
    if request.method == "POST":
        markId = request.POST['markId']
        mark = request.POST['mark']
        if mark == 'grr':
            GrrSheet.objects.filter(id=markId[2:]).delete()
        else:
            OverlaySheet.objects.filter(id=markId[2:]).delete()   
        return JsonResponse({},safe=True)


def loadRecord():
    recordList=[]
    path = '/home/Luther/Documents/monitordb.db'
    #path = '/Users/luther/Desktop/monitordb.db'
    conn = sqlite3.connect(path)
    cur = conn.cursor()

    recordInfos = cur.execute('select * from record')

    for row in recordInfos:
        lineList = []
        for item in row:
            lineList.append(item)

        recordList.append(lineList)

    conn.close()
    
    return recordList

def loadAppsDetail(request):
    number = request.POST['number']
    path = '/home/Luther/Documents/AppDir/'+number
    # path = '/Users/mac/Desktop/MacApps/AppDir/'+number
    if not os.path.exists(path):
        appList= []
    else:
        appList = readApps(path)
    context = {'Apps':list(set(appList))}
    return JsonResponse(context,safe=True)

def downloadTable(request):
    if request.method == 'POST':
        tableName = request.POST['downloadTable']
        print(tableName)
        if tableName == 'collection':
            path = createSummery()
            name = 'SummeryApps.csv'
        if tableName == 'whiteList':
            path = createWhiteList()
            name = 'WhiteList.csv'
        if tableName == 'allList':
            path = createUserinfo()
            name = 'UserInfo.csv'
        if tableName.startswith('S'):
            path = readPersonApps(tableName)
            name = tableName+'_Apps.csv'
        print('path is :',path)
        if path:
            file = open(path, 'rb')
            response = FileResponse(file)
            response['Content-Type'] = 'application/octet-stream'
            response['Content-Disposition'] = 'attachment;filename=%s' % name
            return response
        else:
            return HttpResponse('File Not Found!')

def createSummery():
    #collect all mac apps and summery install count
    path = '/home/Luther/Documents/AppDir'
    #path = '/users/Luther/Documents/AppDir'
    summeryList = []
    for dirName in os.listdir(path):
        if dirName.startswith('S'):
            apps = readApps(os.path.join(path,dirName))
            summeryList = summeryList + apps[1:]

    summ = Counter(summeryList)

    contents = []
    for key in dict(summ).keys():
        contents.append([key,dict(summ)[key]])

    filePath = writeCsvFile('SummeryApps.csv',['name','count'],contents)
    return filePath


def createWhiteList():

    allApps = WhiteList.objects.all()

    finalList = []
    for line in allApps:
        lineList = [line.id,line.name]
        finalList.append(lineList)

    filePath = writeCsvFile('whiteList.csv',['id','name'],finalList)
    return filePath

def createUserinfo():
    
    allUsers = MacApps.objects.all()

    finalList = []
    for line in allUsers:
        lineList = [line.number,line.uploadTime,line.isUpload,line.attention,line.group,line.user,line.mail]
        finalList.append(lineList)
    header = ['number','uploadTime','isUpload','attention','group','user','mail']
    filePath = writeCsvFile('userInfo.csv',header,finalList)
    return filePath

def readPersonApps(name):
    
    path = '/home/Luther/Documents/AppDir'
    #path = '/users/Luther/Documents/AppDir'
    filePath = os.path.join(path,name,'Apps.csv')

    if os.path.exists(filePath):
        return filePath
    else:
        return None

def writeCsvFile(name,header,contents):
    path = '/home/Luther/Documents/AppDir'
    #path = '/users/Luther/Documents/AppDir'
    filePath = os.path.join(path,name)
    with open(filePath,'w') as file:
        cWriter = csv.writer(file)
        cWriter.writerow(header)
        for row in contents:
            cWriter.writerow(row)
    if os.path.exists(filePath):
        return filePath
    else:
        return None  

def readApps(path):
    csvFile = os.path.join(path,'Apps.csv')
    appList=[]
    if not os.path.exists(csvFile):
        return appList
    else:
        with open(csvFile,'r') as file:
            csvReader = csv.reader(file)
            for line in csvReader:
                appList.append(line[0])
        return appList

def sendMail(user, pwd, **kw):
    
    mailContent='''
    TARGET = iPhoneQT_%s_%s
    ATLASVERS = %s
    BRANCH = %s
    TAG = %s
    EMAIL = %s@pegatroncorp.com
    BUILD = %s
    ''' % (kw['project'],kw['station'],kw['version'],kw['branch'],kw['tag'],user,kw['stage'])
    mailMessage = MIMEText(mailContent)
    mailMessage['Subject'] = 'pegatron build request'
    mailMessage['From'] = '%s@pegatroncorp.com' % user
    # mailMessage['To'] = 'lanbo_lan@pegatroncorp.com'
    mailMessage['To'] = 'qt-buildrequest@buildcave.hwte.apple.com,'
    mailMessage['Cc'] = '%s@pegatroncorp.com,%s' % (user,kw['ccMail'])
    try:
        mail = smtplib.SMTP('mail.sh.pegatroncorp.com')

    except Exception as e:
        print(e)
    try:
        mail.login(str(user),str(pwd))
    except Exception as e:
        print("ffff%s"%e)
    mail.sendmail(mailMessage['From'],mailMessage['To'].split(',') +mailMessage['Cc'].split(','),mailMessage.as_string())
    mail.quit()
    return True
