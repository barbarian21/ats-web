from django.views.generic.base import View
from django.shortcuts import render
from django.http import HttpResponse, StreamingHttpResponse, HttpResponseRedirect
from django.db.models import Q, F
from django.conf import settings
from django.core.mail import EmailMultiAlternatives

from common.models import Station
from AuditTracking.models import Audit, MailNoteTask
from AuditTracking import auditDataDeal
from stationTrack import datadeal

import datetime
import json
import os


# Create your views here.


class GetAuditHtml(View):
    def get(self, request):
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/login/')
        return render(request, 'auditTracking/auditTrack.html')
    
    def post(self, request):
        filterInfo = Audit.objects.filter(project= request.user.favor_project)
        for aFilter in request.POST.items():
            if 'delete' == aFilter[0]:
                delData = int(aFilter[1])
                if (filterInfo and delData > 0):
                    filterInfo.get(pk=delData).delete()
            if 'update' == aFilter[0]:
                saveData = json.loads(aFilter[1])
                auditDataDeal.saveDataToAudit(saveData, request.user)
        return HttpResponse('OK')

def getSummaryByIssueCategory(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/login/')
    projectCode = request.user.favor_project
    filterDic = request.GET.dict()
    return render(request, 'auditTracking/summaryByIssueCategory.html', statisticAuditByIssueCategory(projectCode, filterDic))

def getStationVersion(request):
    projectCode = request.user.favor_project
    aStationVer = Station.objects.get(pk = request.GET['reqVer']).overlay_set.filter(project = projectCode).order_by('-add_time')
    aStationVer = [[i.station.pk,i.version.split()[1]] for i in aStationVer]
    return HttpResponse(json.dumps(aStationVer, cls=datadeal.DateEncoder))


def getSummaryByDRI(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect('/login/')
    projectCode = request.user.favor_project
    filterDic = request.GET.dict()
    return render(request, 'auditTracking/summaryByDRI.html', statisticAuditByDRI(projectCode, filterDic))

# class GetReplyAuditHtml(View):
#     def get(self, request):
#         if not request.user.is_authenticated:
#             return HttpResponseRedirect('/login/')
#         return render(request, 'issueList/IssueCategory.html')
#
#     def post(self, request):
#         pass

def getAuditHttpResponse(request):
    filterDic = request.GET.dict()
    projectCode = request.user.favor_project
    result = getAuditInfo(projectCode, filterDic, ['Open', 'Ongoing', 'Keep Monitor', 'Close'])
    return HttpResponse(json.dumps(result, cls=auditDataDeal.DateEncoder))


def getReplyAuditHttpResponse(request):
    filterDic = request.GET.dict()
    reqUser = request.user
    result = getReplyAuditInfo(reqUser, filterDic)
    return HttpResponse(json.dumps(result, cls=auditDataDeal.DateEncoder))

def downloadAudit(request):
    filterDic = request.GET.dict()
    projectCode = request.user.favor_project
    path_Name = str(projectCode) + '_AuditTracking.xlsx'
    generateExcel(path_Name, projectCode, filterDic, ['Open', 'Ongoing', 'Keep Monitor', 'Close'])
    file = open('media/' + path_Name, 'rb')
    response = StreamingHttpResponse(file)
    response['Content-Type'] = 'application/octet-stream'
    response['Content-Disposition'] = 'attachment;filename="{}"'.format(path_Name)
    return response

def getShellData(tableData):
    tableData = dealTableDataBeforeWriteExcel(json.loads(tableData))
    tableTitle = [["Status", "status"], ["IssueCategory", "issueCategory"], ["IssueDescription", "issueDescription"],
                  ["ERS", "ERS"], ["Station", "station"], ["Version", "version"], ["Remark", "replyInfo"],
                  ["updateTime", "updateTime"], ["AuditDRI", "auditDRI"], ["AuditTime", "addTime"]]
    return {'detail': [tableTitle, tableData]}
    
def getChartData(projectCode, filterDic):
    chartDic = {}
    chartDic['Summary'] = statisticAuditByIssueCategory(projectCode, filterDic)
    chartDic['SummaryByDRI'] = statisticAuditByDRI(projectCode, filterDic)
    return chartDic

def generateExcel(path_Name, projectCode, filterDic, statusList):
    tableData = json.dumps(getAuditInfo(projectCode, filterDic, statusList), cls=auditDataDeal.DateEncoder)
    shellData = getShellData(tableData)
    chartDic = getChartData(projectCode, filterDic)
    datadeal.saveData2Excel(path_Name, shellData, chartDic)
    return shellData, chartDic

def dealTableDataBeforeWriteExcel(tableData):
    for aRow in tableData:
        aRow['replyInfo']['Content'] = convertReplyInfo2Str(aRow['replyInfo']['Content'])
        aRow['version']['Content'] = convertDictToStr(aRow['version']['Content'].values(), '\n')
    return tableData

def convertDictToStr(aList, sep):
    resStr = ''
    for temp in aList:
        resStr += str(temp) + sep
    return resStr.strip(sep)

def convertReplyInfo2Str(replyList):
    resStr = ''
    for aReply in replyList:
        resStr += '[' + str(list(aReply['replyUser']['Content'].values())[0]) + ' ' + aReply['addTime']['Content'][5:11] + ']' + aReply['replyMessage']['Content'] + '\n'
    return resStr
        
    
def getAuditInfo(projectCode,filterDic, statusList):
    filterInfo = Audit.objects.select_related('project', 'stage').filter(project__code=projectCode)
    filterInfo = filterInfo.filter(**filterDic)
    filterInfo =  filterInfo.order_by('-updateTime')
    result = []
    result.extend(auditDataDeal.serialAuditQuerySet(filterInfo.filter(Q(status=None))))
    for aStatus in statusList:
        result.extend(auditDataDeal.serialAuditQuerySet(filterInfo.filter(Q(status__icontains=aStatus))))
    return result

def statisticAuditByIssueCategory(projectCode, filterDic):
    filterInfo = Audit.objects.select_related('project', 'stage').filter(project__code=projectCode)
    filterInfo = filterInfo.filter(**filterDic)
    dataInfo = statisticByTwoCondition(filterInfo, 'issueCategory', 'status')
    statusColor ={'Open': '#ff0000', 'Ongoing': '#ffff00', 'Keep Monitor': '#90EE90', 'Close': '#008000'}
    for aSeries in dataInfo['dataSeries']:
        if aSeries['name'] in statusColor:
            aSeries['color'] = statusColor[aSeries['name']]
    dataInfo['project'] = projectCode.name
    return  dataInfo

def statisticAuditByDRI(projectCode, filterDic):
    filterInfo = Audit.objects.select_related('project', 'stage').filter(project__code=projectCode)
    filterInfo = filterInfo.filter(**filterDic)
    dataInfo = statisticByTwoCondition(filterInfo, 'auditDRI', 'status')
    statusColor = {'Open': '#ff0000', 'Ongoing': '#ffff00', 'Keep Monitor': '#90EE90', 'Close': '#008000'}
    for aSeries in dataInfo['dataSeries']:
        if aSeries['name'] in statusColor:
            aSeries['color'] = statusColor[aSeries['name']]
    dataInfo['project'] = projectCode.name
    return  dataInfo

def statisticByTwoCondition(filterInfo, firstCondition, secondCondition):
    dataSeries = []
    firstRes = set([i[0] for i in getAuditFiledInfo(filterInfo, [firstCondition])])
    secondRes = set([i[0] for i in getAuditFiledInfo(filterInfo, [secondCondition])])
    for sCategory in secondRes:
        secondFilter = filterInfo.filter(**{secondCondition : sCategory})
        firstSummary = []
        for fCategory in firstRes:
            firstSummary.append(len(secondFilter.filter(**{firstCondition : fCategory})))
        dataSeries.append({'name': str(sCategory), 'data': firstSummary})
    firstRes = [str(i) for i in firstRes]
    return {'dataSeries' : dataSeries , 'xAxis' : firstRes, 'firstCondition' : firstCondition, 'secondCondition' : secondCondition}
        
def getAuditFiledInfo(filterInfo, filedList):
    resultInfo = []
    for aRow in filterInfo:
        aRowInfo = []
        for aField in filedList:
            aRowInfo.append(getattr(aRow, aField))
        resultInfo.append(aRowInfo)
    return resultInfo

def getReplyAuditInfo(reqUser,filterDic):
    filterInfo = Audit.objects.select_related('replyUser', 'audit').filter(replyUser=reqUser)
    filterInfo = filterInfo.filter(**filterDic)
    # filterInfo = filterInfo.order_by('updateTime')
    result = []
    result.append(auditDataDeal.serialReplyAuditQuerySet(filterInfo))
    return result

    
def mailObj(aTask):
    fromMail = settings.DEFAULT_FROM_EMAIL
    to = aTask.emailTo.split(',')
    try:
        cc = aTask.emailCC.split(',')
    except:
        cc = []
    subject = aTask.emailSubject
    mail_title = aTask.emailTitle
    msg = EmailMultiAlternatives(subject, mail_title, fromMail, to, cc)
    return msg
    
def checktimeDescription(timeDes, nowTime):
    if 0 == timeDes[3] or nowTime.isoweekday() == timeDes[3]:
        if 0 == timeDes[2] or nowTime.month == timeDes[2]:
            if 0 == timeDes[1] or nowTime.day == timeDes[1]:
                if 0 == timeDes[0] or nowTime.hour == timeDes[0] - 1:
                    return True
    return False
    
def timerTask(timerList, nowTime):
    excuteList = []
    for aTask in timerList:
        timeDes = list(map(lambda i : int(i),aTask.timeDescription.split(',')))
        if len(timeDes) != 4:
            print("%s %s:timeDescription mistake\n" %(aTask.pk, aTask.timeDescription))
            continue
        if checktimeDescription(timeDes, nowTime):
            excuteList.append(aTask)
            if aTask.count > 0:
                aTask.count = F('count') - 1
                aTask.save()
    return excuteList


def sendAuditSummaryMail(aTask, allFile):
    projectCode = aTask.project
    result = getAuditInfo(projectCode, {}, ['Open', 'Ongoing'])
    if len(result):
        shellData = getShellData(json.dumps(result, cls=auditDataDeal.DateEncoder))
        path_Name = os.path.join(settings.MEDIA_ROOT, str(projectCode) + '_AuditTracking.xlsx')
        if not path_Name in allFile:
            generateExcel(path_Name, projectCode, {}, ['Open', 'Ongoing', 'Keep Monitor', 'Close'])
            allFile.add(path_Name)
        html_content = "<pre>" + aTask.emailTitle + "</pre>" + datadeal.generateTableHtml(shellData)
        msg = mailObj(aTask)
        msg.attach_alternative(html_content, "text/html")
        msg.attach_file(path_Name)
        msg.send()
        
def sendAuditOverTimeMail(aTask, overTime):
    projectCode = aTask.project
    filterInfo = Audit.objects.select_related('project', 'stage').filter(project__code=projectCode).filter(updateTime__lte = overTime)
    filterInfo = filterInfo.order_by('-updateTime')
    result = []
    result.extend(auditDataDeal.serialAuditQuerySet(filterInfo.filter(Q(status=None))))
    for aStatus in ['Open', 'Ongoing']:
        result.extend(auditDataDeal.serialAuditQuerySet(filterInfo.filter(Q(status__icontains=aStatus))))
    if len(result):
        shellData = getShellData(json.dumps(result, cls=auditDataDeal.DateEncoder))
        html_content = "<pre>" + aTask.emailTitle + "</pre>" + datadeal.generateTableHtml(shellData)
        msg = mailObj(aTask)
        msg.attach_alternative(html_content, "text/html")
        msg.send()

def auditTask(timerList, overTimeList, nowTime):
    allFile = set()
    for aTask in timerList:
        print('Timer Task id: %s\n' % aTask.id)
        sendAuditSummaryMail(aTask, allFile)
    
    for aTask in overTimeList:
        timeDes = list(map(lambda i: int(i), aTask.timeDescription.split(',')))
        if len(timeDes) != 4:
            print("%s %s:timeDescription mistake\n" % (aTask.pk, aTask.timeDescription))
            continue
        print('overTimer Task id: %s\n' % aTask.id)
        sendAuditOverTimeMail(aTask, nowTime - datetime.timedelta(hours=timeDes[0], days=timeDes[1]))
        

def checkMailNoteTask():
    nowTime = datetime.datetime.now()
    allTask = MailNoteTask.objects.filter(isActive = True, endTime__gte = nowTime)
    allTask = allTask.filter(~Q(count = 0))
    print(" %s begin checkMailNoteTask  allTask:%d\n" % (nowTime, len(allTask)))
    overTimeList = allTask.filter(isTimer = False)
    timerList = timerTask(allTask.filter(isTimer = True), nowTime)
    auditTask(timerList, overTimeList, nowTime)
    
    
