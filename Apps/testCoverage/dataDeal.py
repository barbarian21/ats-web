import os
import csv
import re
import datetime
import time

class ParseGit(object):
    allStation_Result = {}
    # localGitPath = '/Users/Luther/Documents/PSH_Bison_Atlas_QT/AtlasQT/N104_Tech'
    # localGitPath = '/data/django/git/PSH_Bison_Atlas_QT/AtlasQT/N104_Tech'
    # localGitPath = '/Users/xiaoqian/PSH_Bison_Atlas_QT/AtlasQT/N104_Tech'
    SearchListByItem = []
    SearchListByComm = []
    localGitPath=""

    def parseLocalGit(path):
        ParseGit.localGitPath=path
        stations = []
        if not os.path.exists(path):
            return
        else:
            for item in os.listdir(path):
                if not item in ['Tech_CSVs', '.DS_Store', 'README.md', 'TEST2', 'TEST4']:
                    stations.append(item)
        N104_Tech = {}
        # 0.befor parse station,load Tech_CSVs only once
        Tech_CSVs = ParseGit.loadTechCsvs(os.path.join(ParseGit.localGitPath, 'Tech_CSVs'))

        for station in stations:
            # 1.parse single station,stationInfo List for all info
            stationInfoList = ParseGit.stationParse(station, Tech_CSVs)
            # TEST2 and TEST4 info
            if station == 'QT0':
                N104_Tech['TEST2'] = ParseGit.pickEngItem(stationInfoList)
            if station == 'QT1-PREBURN':
                N104_Tech['TEST4'] = ParseGit.pickEngItem(stationInfoList)
            N104_Tech[station] = stationInfoList
        return N104_Tech


    def pickEngItem(infoList):
        resList = []
        if not infoList:
            return resList

        for item in infoList:
            if item['eng'] == '1':
                resList.append(item)
        return resList


    def loadTechCsvs(techPath):
        Tech_CSVs = {}
        techs = []
        if not os.path.exists(techPath):
            return
        else:
            for tech in os.listdir(techPath):
                techs.append(tech)

        for tech in techs:
            techFile = os.path.join(techPath, tech)
            techContent = ParseGit.getCsvContent(techFile)
            techinfo = ParseGit.techParse(techContent)
            Tech_CSVs[tech] = techinfo
        return Tech_CSVs


    def techParse(content):
        TechDic = {}
        for line in content[1:]:
            logicDic = {
                'TestName': '',
                'TestActions': '',
                'TestParameters': '',
                'TestCommands': '',
                'StopOnError': ''
            }
            if line == []:
                continue

            logicDic['TestName'] = line[0]
            logicDic['TestActions'] = line[1]
            logicDic['TestParameters'] = line[2]
            logicDic['TestCommands'] = line[3]
            logicDic['StopOnError'] = line[4] if len(line) > 4 else ''

            if logicDic['TestName'] == '':
                logicDic['TestName'] = previouName
                name = logicDic['TestName']
                TechDic[name].append(logicDic)
            else:
                previouName = logicDic['TestName']
                TechDic[previouName] = []
                TechDic[previouName].append(logicDic)

        return TechDic


    def stationParse(name, techInfo):
        sequence = []
        mainFile = os.path.join(ParseGit.localGitPath, name, name + '_Main.csv')
        limitFile = os.path.join(ParseGit.localGitPath, name, name + '_Limits.csv')

        parseMain = ParseGit.parseMainCsv(mainFile)
        parseLimit = ParseGit.parseLimitCsv(limitFile)
        stationName = name

        for item in parseMain:
            name = item['name']
            tech = item['tech']
            techKey = tech + '.csv'
            limit = parseLimit[name] if name in parseLimit.keys() else {}
            try:
                logic = techInfo[techKey][name]
            except Exception as e:
                logic = []
                print(e)

            # add for append search list
            ParseGit.appendSearchList(stationName, name, logic)
            ParseGit.SearchListByItem.append('%s:%s' % (stationName, name))

            item['limit'] = limit
            item['logic'] = logic

            sequence.append(item)
        return sequence


    def appendSearchList(sta, item, logicList):
        if not logicList:
            searchInfo = '%s:%s:%s' % (sta, item, '')
            ParseGit.SearchListByItem.append(searchInfo)
        for line in logicList:
            command = line['TestCommands'] if 'TestCommands' in line.keys() else ''
            searchInfo = '%s:%s:%s' % (sta, item, command)
            ParseGit.SearchListByComm.append(searchInfo)


    def parseMainCsv(mainPath):
        main = ParseGit.getCsvContent(mainPath)
        mainItems = []
        if main == []:
            return mainItems
        for line in main[2:]:
            item = {
                'name': '',
                'tech': '',
                'stoponfail': '',
                'disable': '',
                'mp': '',
                'eng': '',
                'grr': '',
                'rel': ''
            }
            item['name'] = line[0]
            item['tech'] = line[1]
            item['stoponfail'] = line[2]
            item['disable'] = line[3]
            item['mp'] = line[4]
            item['eng'] = line[5]
            item['grr'] = line[6]
            item['rel'] = line[7]

            mainItems.append(item)
        return mainItems


    def parseLimitCsv(limitPath):
        limit = ParseGit.getCsvContent(limitPath)
        limitItems = {}
        if limit == []:
            return limitItems
        header = limit[0]
        for line in limit[1:]:
            limit = {}
            for i in range(len(header)):
                limit[header[i]] = line[i]
            limitItems[line[1]] = limit
        return limitItems


    def getCsvContent(csvPath):
        csvContent = []
        try:
            with open(csvPath, 'rU') as csvFile:
                reader = csv.reader(csvFile)
                for row in reader:
                    csvContent.append(row)
        except Exception as e:
            # logger this exception if need
            print('read csv error:%s' % e)

        return csvContent