import json
from datetime import datetime, date
from common.models import Station, Stage
from AuditTracking.models import Audit, ReplyAudit, MailNoteTask


class DateEncoder(json.JSONEncoder):
    
    def default(self, obj):
        if isinstance(obj, datetime) or isinstance(obj, date):
            return obj.strftime("%Y/%m/%d %H:%M:%S")
        else:
            return json.JSONEncoder.default(self, obj)

def decorateaField(titleName, aField, styleJson):
    if titleName in styleJson and styleJson[titleName]:
        return {'Content': aField, 'Style': styleJson[titleName]}
    return {'Content': aField}

def separateField(fieldName, fieldContent, styleJson):
    styleJson[fieldName] = fieldContent.setdefault('Style', None)
    return fieldContent.setdefault('Content', '')
    
def serialAuditArow(aRow):
    try:
        styleJson = json.loads(aRow.style)
    except Exception as e:
        styleJson = {}
        print('get style fail, reset style info')
    
    resultDic = {}
    resultDic['id'] = decorateaField('id', aRow.pk, styleJson)
    resultDic['issueCategory'] = decorateaField('issueCategory', aRow.issueCategory, styleJson)
    resultDic['ERS'] = decorateaField('ERS', aRow.ERS, styleJson)
    try:
        verJson = json.loads(aRow.version)
    except Exception as e:
        verJson = {}
    resultDic['version'] = decorateaField('version', verJson, styleJson)
    resultDic['issueDescription'] = decorateaField('issueDescription', aRow.issueDescription, styleJson)
    resultDic['status'] = decorateaField('status', aRow.status, styleJson)
    resultDic['addTime'] = decorateaField('addTime', aRow.addTime, styleJson)
    resultDic['updateTime'] = decorateaField('updateTime', aRow.updateTime, styleJson)
    
    resultDic['project'] = decorateaField('project', {aRow.project.pk : aRow.project.code}, styleJson)
    resultDic['project']['dataType'] = 'ForeignKey'
    # resultDic['stage'] = decorateaField('stage', {aRow.stage.pk, aRow.stage.name}, styleJson)
    # resultDic['stage']['dataType'] = 'ForeignKey'
    resultDic['auditDRI'] = decorateaField('auditDRI', {aRow.auditDRI.pk : aRow.auditDRI.username}, styleJson)
    resultDic['auditDRI']['dataType'] = 'ForeignKey'

    stationList = aRow.station.all()
    resultDic['station'] = decorateaField('station', {aStation.pk : aStation.name for aStation in stationList}, styleJson)
    resultDic['station']['dataType'] = 'ManyKey'
    
    resultDic['replyInfo'] = {'Content':serialReplyAuditQuerySet(aRow.replyaudit_set.all())}
    # resultDic['replyInfo']['dataType'] = 'relatedKey'
    
    return resultDic
    
    
def serialAuditQuerySet(aQuerySet):
    resList = []
    for aRow in aQuerySet:
        resList.append(serialAuditArow(aRow))
    return resList
    
def updateAuditRecord(aRecord, updateContent, reqUser):
    try:
        styleJson = json.loads(aRecord.style)
    except Exception as e:
        styleJson = {}
    for fieldName, fieldContent in updateContent.items():
        rawContent = separateField(fieldName, fieldContent, styleJson)
        if fieldName in ['id', 'project', 'updateTime', 'addTime', 'style']:
            continue
        if fieldName == 'replyInfo':
            aRecord.save()
            saveDataToReplyAudit(rawContent, reqUser, aRecord)
            continue
        if fieldName == 'station':
            relatedStation = [Station.objects.get(pk=i) for i in rawContent.keys()]
            aRecord.save()
            aRecord.station.clear()
            aRecord.station.add(*relatedStation)
            continue
        if fieldName == 'stage':
            rawContent = Stage.objects.get(pk = rawContent.keys()[0])
        if fieldName == 'version':
            try:
                print(rawContent)
                rawContent = json.dumps(rawContent)
            except Exception as e:
                rawContent = {}
        setattr(aRecord, fieldName, rawContent)
    aRecord.style = json.dumps(styleJson)
    aRecord.save()
    
def saveDataToAudit(saveData, reqUser):
    for pk, aRowData in saveData.items():
        pk = int(pk)
        if (pk < 0):
            updateAuditRecord(Audit(project = reqUser.favor_project, auditDRI = reqUser), aRowData, reqUser)
        else:
            record = Audit.objects.filter(project= reqUser.favor_project).get(pk = pk)
            updateAuditRecord(record, aRowData, reqUser)

def serialReplyAuditArow(aRow):
    try:
        styleJson = json.loads(aRow.style)
    except Exception as e:
        styleJson = {}
        print('get style fail, reset style info')
    resultDic = {}
    resultDic['id'] = decorateaField('id', aRow.id, styleJson)
    resultDic['replyMessage'] = decorateaField('replyMessage', aRow.replyMessage, styleJson)
    resultDic['addTime'] = decorateaField('addTime', aRow.addTime, styleJson)
    resultDic['updateTime'] = decorateaField('updateTime', aRow.updateTime, styleJson)
    resultDic['replyUser'] = decorateaField('replyUser', {aRow.replyUser.pk : aRow.replyUser.username}, styleJson)
    resultDic['replyUser']['dataType'] = 'ForeignKey'
    return resultDic

def serialReplyAuditQuerySet(aQuerySet):
    resList = []
    for aRow in aQuerySet:
        resList.append(serialReplyAuditArow(aRow))
    return resList

def updateAuditReplyRecord(aRecord, updateContent):
    try:
        styleJson = json.loads(aRecord.style)
    except Exception as e:
        styleJson = {}
    for fieldName, fieldContent in updateContent.items():
        if fieldName in ['id', 'updateTime', 'addTime', 'style']:
            continue
        rawContent = separateField(fieldName, fieldContent, styleJson)
        setattr(aRecord, fieldName, rawContent)
    aRecord.style = json.dumps(styleJson)
    aRecord.save()

def saveDataToReplyAudit(saveData, reqUser, auditRecord):
    for pk, aRowData in saveData.items():
        pk = int(pk)
        if (pk < 0):
            updateAuditReplyRecord(ReplyAudit(replyUser = reqUser, audit = auditRecord), aRowData)
        else:
            record = ReplyAudit.objects.filter(audit=auditRecord).get(pk = pk)
            updateAuditReplyRecord(record, aRowData)

    
