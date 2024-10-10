from django.shortcuts import render,HttpResponse,HttpResponseRedirect
import json
from .models import *
from django.db.models import Avg, Sum, Max, Min, Count


import numpy as np 
from matplotlib import pyplot as plt 
import base64
from io import BytesIO
import re

# Create your views here.

#获取调查问卷首页
def getQuestionnaire(request):
    if request.method == 'GET':
        return  render(request, 'questionnaire/questionnaire.html')
    if request.method == 'POST':
        quesTheme = QuestionnarieTheme.objects.all()
        rows = []
        data = {"total": len(quesTheme), "rows": rows}
        for item in quesTheme:
            row_data = getQuestionnaireRowData(request, item)
            rows.append(row_data)
        return HttpResponse(json.dumps(data), content_type="application/json")

#获取调查问卷首页操作
def questionnaireOperation(request,type):
    if request.method == 'POST':
        data = {"status":0}
        if type == "add":
            theme = request.POST.get("theme",None)
            author = request.POST.get("author",None)
            password = request.POST.get("password","").strip()
            sign = request.POST.get("sign","off")
            isActive = request.POST.get("isActive","off")
            if theme!= None and  theme!= '':
                ques_obj = QuestionnarieTheme()
                ques_obj.theme = theme
                ques_obj.author = author
                ques_obj.password = password
                if sign == "on":
                    ques_obj.isSign = True
                else:
                    ques_obj.isSign = False
                if isActive == "on":
                    ques_obj.isActive = True
                else:
                    ques_obj.isActive = False
                ques_obj.save()
                if password != "":
                    request.session["questionnairePassword"]=password
                value = getQuestionnaireRowData(request, ques_obj)
                data["data"] = value
            else:
                data["status"] = 1
        elif type == "remove":
            id = request.POST.get("ID")
            password = request.session.get("questionnairePassword","")
            obj = QuestionnarieTheme.objects.get(id=id)
            dbPasword = obj.password 
            if dbPasword == None:
                dbPasword = ""
            dbPasword = dbPasword.strip()
            if dbPasword == "" or obj.password == password:
                obj.delete()  
            else:
                data["status"] = 1 
                data["data"] = 'error password'
        elif type == "confirmPassword":
            password = request.POST.get("password").strip()
            request.session["questionnairePassword"]=password
        return HttpResponse(json.dumps(data), content_type="application/json")

def getQuestionnaireRowData(request, obj):
    password = request.session.get("questionnairePassword","")
    password = password.strip()

    dbPassword = obj.password 
    if dbPassword == None:
        dbPassword = ""
    dbPassword = dbPassword.strip()
    type = "是"
    if dbPassword == "":
        type = "否"
    elif dbPassword == password:
        type = "已认证"
    return {"id": obj.id,
    "theme": obj.theme,
    "add_time": obj.add_time.strftime(format="%Y-%m-%d %H:%M:%S"),
    "author": obj.author,
    "passwordProtect": type,
    "isSign":obj.isSign,
    "isActive":obj.isActive,
    }


#调查问卷内容页面
def getDetailQuestionnaire(request, num):
    if request.method == 'GET':
        quesTheme = QuestionnarieTheme.objects.get(id=num)
        quesContent = QuestionnarieContent.objects.filter(quesTheme=quesTheme).order_by('index')
        data= []
        index = 1
        for item in quesContent:
            szOptions = item.options
            arrOptions = szOptions.split('\n')
            arrOptionRet = []
            for j in range(0,len(arrOptions)):
                if arrOptions[j].strip() != "":
                    key = chr(j+65)
                    arrOptionRet.append({"key": key, "value":arrOptions[j]})
            title = item.title.replace('\r','')
            data.append({"title": title.replace('\n','<br>'), 
                "options":arrOptionRet, 
                "index":item.index,
                "optionType":item.optionType,
                "id": item.id,
                })
            index = index+1  
        context = {"questionnaireContent":data, 
        "questionnaireTheme":quesTheme.theme, 
        "questionnaireThemeID": quesTheme.id, 
        "count":len(data),
        "isSign":quesTheme.isSign,
        "isActive":quesTheme.isActive}
        return render(request, 'questionnaire/questionDetail.html',context)
    if request.method == 'POST':
        quesTheme = QuestionnarieTheme.objects.get(id=num)
        yourname = request.POST.get("yourname","").lower().strip()
        yourst = request.POST.get("yourst",None)
        ip = get_client_ip(request)
        data = {"status":0}
        dicPost = request.POST
        bRet = True
        #check yourname
        if quesTheme.isSign:
            user_quesAnswe = QuestionnarieAnswer.objects.filter(quesTheme=quesTheme, name=yourname)
            if user_quesAnswe.exists():
                bRet = False
                data["status"] = 1
                data["data"] = "you have answered question!"
        #check ip
        user_quesAnswe = QuestionnarieAnswer.objects.filter(quesTheme=quesTheme, ipAddress=ip)
        if user_quesAnswe.exists():
            # bRet = False
            # data["status"] = 1
            data["data"] = "This IP have answered question!"
        if bRet:
            myIndex = None
            for key in dicPost:
                if key == "yourname" or key == "yourst":
                    continue
                value = dicPost[key]
                quesContent = QuestionnarieContent.objects.get(id=int(key))
                obj_quesAnswer = QuestionnarieAnswer()
                obj_quesAnswer.quesTheme = quesTheme
                obj_quesAnswer.quesContent = quesContent
                obj_quesAnswer.answer = value
                obj_quesAnswer.index = myIndex
                obj_quesAnswer.name = yourname
                obj_quesAnswer.department = yourst
                obj_quesAnswer.ipAddress = ip
                obj_quesAnswer.save()
                if myIndex == None:
                    myIndex = obj_quesAnswer.id
                    obj_quesAnswer.index = myIndex
                    obj_quesAnswer.rawAnswer = json.dumps(dicPost)
                    obj_quesAnswer.save()
        return HttpResponse(json.dumps(data), content_type="application/json")



#问卷编辑页面
def questionnaireEdit(request, num):
    if request.method == 'GET':
        quesTheme = QuestionnarieTheme.objects.get(id=num)
        return render(request, 'questionnaire/questionEdit.html',{"quesTheme":quesTheme})
    if request.method == 'POST':
        quesTheme = QuestionnarieTheme.objects.get(id=num)
        quesContent = QuestionnarieContent.objects.filter(quesTheme=quesTheme).order_by('-index')
        rows = []
        data = {"total": len(quesContent), "rows": rows}
        for item in quesContent:
            title = item.title.replace('\r','')
            title = title.replace('\n','<br>')
            options = item.options.replace('\r','')
            options = options.replace('\n','<br>')
            rows.append({
                "id":item.id,
                "index":item.index,
                "title":title,
                "options": options,
                "optionType":item.optionType,
            })
        return HttpResponse(json.dumps(data), content_type="application/json")

#问卷编辑页面操作
def questionnaireEditOperation(request, num, type):
    if request.method == 'POST':
        # check password
        data = {"status":0}
        password = request.session.get("questionnairePassword","")

        quesTheme_obj = QuestionnarieTheme.objects.get(id=num)
        dbPasword = quesTheme_obj.password
        if dbPasword == None:
            dbPasword = ""
            dbPasword = dbPasword.strip()
        if dbPasword != "" and dbPasword != password:
            data["status"] = 1 
            data["data"] = 'error password'
            return HttpResponse(json.dumps(data), content_type="application/json")
        ## remove action
        if type == "remove":
            id = request.POST.get("ID")
            obj = QuestionnarieContent.objects.get(id=id)
            obj.delete() 
        ## edit action
        elif type == "edit":
            id = request.POST.get("id",None)
            field = request.POST.get("field",None)
            value = request.POST.get("value",None)
            if value!=None and field!=None and id!=None:
                re_br=re.compile('<br.*?>')
                value = re_br.sub('\n',value)
                obj = QuestionnarieContent.objects.get(id=id)
                if field == 'index':
                    obj.index = value
                elif field == 'title':
                    obj.title = value
                elif field == 'options':
                    obj.options = value
                elif field == 'optionType':
                    listOption = QuestionnarieContent.optionTypeList()
                    if value in listOption:
                        obj.optionType = value
                    else:
                        data["status"] = 1 
                        data["data"] = "please input:"+ ",".join(listOption)
                obj.save()
            else:
                data["status"] = 1 
        ## add action
        elif type == "add":
            quesTheme = QuestionnarieTheme.objects.get(id=num)
            quesContent = QuestionnarieContent.objects.filter(quesTheme=quesTheme).order_by('-index')
            index = 1
            if quesContent.exists():
                index = quesContent[0].index + 1
            obj = QuestionnarieContent()
            obj.quesTheme = quesTheme
            obj.index = index
            obj.title = request.POST.get("title","")
            obj.options = options = request.POST.get("options","")
            obj.optionType = request.POST.get("optionType","radio")
            obj.save()
            data["data"] = {"id":obj.id, "index":obj.index, "title":obj.title, "options":obj.options, "optionType":obj.optionType}
        elif type == "themeEdit":
            id = request.POST.get("id",None)
            theme = request.POST.get("theme",None)
            author = request.POST.get("author","")
            sign = request.POST.get("sign","off")
            active = request.POST.get("isActive","off")
            if theme!=None and id!=None:
                obj = QuestionnarieTheme.objects.get(id=id)
                obj.theme = theme
                obj.author = author
                if sign == "on":
                    obj.isSign = True
                else:
                    obj.isSign = False
                if active == "on":
                    obj.isActive = True
                else:
                    obj.isActive = False
                obj.save()
            else:
                data["status"] = 1
                data["data"] = 'error password'
        return HttpResponse(json.dumps(data), content_type="application/json")



#调查问卷结果页面
def questionnaireAnswer(request,num):
    if request.method == 'GET':
        password = request.session.get("questionnairePassword","")            
        quesTheme = QuestionnarieTheme.objects.get(id=num)
        dbPasword = quesTheme.password 
        if dbPasword == None:
            dbPasword = ""
        dbPasword = dbPasword.strip()
        if dbPasword != "" and dbPasword != password:
            return HttpResponseRedirect('/questionnaire/')
        result = []
        quesContent = QuestionnarieContent.objects.filter(quesTheme=quesTheme).order_by('index')
        for content_obj in quesContent:
            all_quesAnswe = QuestionnarieAnswer.objects.filter(quesTheme=quesTheme, quesContent=content_obj)
            totalPeople = len(all_quesAnswe)
            szTitle = content_obj.title
            szOptions = content_obj.options
            index = content_obj.index

            if(content_obj.optionType == "textarea" or content_obj.optionType == "text"):
                answers = []
                quesAnswer = QuestionnarieAnswer.objects.filter(quesTheme=quesTheme, quesContent=content_obj)
                for answerObj in quesAnswer:
                    name = answerObj.name
                    department = answerObj.department
                    answer = answerObj.answer
                    answers.append({"name":name, "department":department, "answer":answer})
                result.append({"totalPeople":totalPeople, 
                "totalCount":totalPeople, 
                "questionTitle":szTitle, 
                "answers":answers, 
                "index":index,
                "optionType":content_obj.optionType,})
            else:
                answers = []
                optArray = []
                countArray=[]
                count = 0
                arrOptions = szOptions.split('\n')
                for j in range(0,len(arrOptions)):
                    key = chr(j+65)
                    if(content_obj.optionType == "radio"):
                        quesAnswer = QuestionnarieAnswer.objects.filter(quesTheme=quesTheme, quesContent=content_obj, answer=key)
                        count = len(quesAnswer)
                    elif(content_obj.optionType == "checkbox"):
                        quesAnswer = QuestionnarieAnswer.objects.filter(quesTheme=quesTheme, quesContent=content_obj)
                        for answerObj in quesAnswer:
                            if key in answerObj.answer:
                                count = count+1
                    answers.append({"key":key, "value":count, "content":arrOptions[j]})
                    optArray.append(key)
                    countArray.append(count)
                    count = 0

                sum = 0
                for count in countArray:
                    sum = sum+count
                totalCount = sum
                #柱状图
                imdBar = drawBar(optArray,countArray)
                imdPie = drawPie(optArray,countArray)
            
                result.append({"totalPeople":totalPeople, 
                "totalCount":totalCount, 
                "questionTitle":szTitle, 
                "answers":answers, 
                "index":index,
                "barChart": imdBar,
                "pieChart": imdPie,
                })
        context = {"questionnaireTheme":quesTheme.theme, 
            "result":result, 
            "questionnaireThemeID": quesTheme.id,
            "questionnaireContent": quesContent}
        return  render(request, 'questionnaire/questionResult.html',context)
    if request.method == 'POST':
        quesTheme = QuestionnarieTheme.objects.get(id=num)
        quesContent = QuestionnarieContent.objects.filter(quesTheme=quesTheme)
        initRow = {}
        for obj in quesContent:
            key = obj.id
            initRow[key] = ""
     
        list_row = QuestionnarieAnswer.objects.filter(quesTheme=quesTheme).values('index').distinct().order_by('index')
        row_count = len(list_row)
        rows = []
        data = {"total": row_count, "rows": rows}
        for obj in list_row:
            dicRow = initRow.copy()
            index = obj['index']
            list_answers = QuestionnarieAnswer.objects.filter(quesTheme=quesTheme, index=index)
            name = list_answers.first().name
            department = list_answers.first().department
            ipAddress = list_answers.first().ipAddress
            add_time = list_answers.first().add_time.strftime(format="%Y-%m-%d %H:%M:%S"),
            dicRow.update({'name':name, "department":department, "ipAddress":ipAddress, "add_time":add_time}) 
            for obj_answer in list_answers:
                key = obj_answer.quesContent.id
                value = obj_answer.answer
                dicRow[key] = value
            rows.append(dicRow)
        return HttpResponse(json.dumps(data), content_type="application/json")


def drawBar(labels,y_data):
    rects = plt.bar(x=labels, height=y_data,color='steelblue', alpha=0.8, width=0.3)
    x = range(len(labels))
    plt.xlabel("Options")
    plt.ylabel("Count")
    plt.xticks(x, labels)

    for rect in rects:
        height = rect.get_height()
        plt.annotate('{}'.format(height),
                    xy=(rect.get_x() + rect.get_width() / 2, height),
                    xytext=(0, 1),  # 1 points vertical offset
                    textcoords="offset points",
                    ha='center', va='bottom')

    # figure 保存为二进制文件
    buffer = BytesIO()
    plt.savefig(buffer,format='png')  
    plot_data = buffer.getvalue()
    # 图像数据转化为 HTML 格式
    imb = base64.b64encode(plot_data)  
    ims = imb.decode()
    imd = "data:image/png;base64,"+ims
    plt.close()
    return imd

def drawPie(labels,sizes):
    plt.pie(sizes, labels=labels, autopct='%1.1f%%',shadow=True, startangle=90)
    plt.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle.

    # figure 保存为二进制文件
    buffer = BytesIO()
    plt.savefig(buffer,format='png')  
    plot_data = buffer.getvalue()
    # 图像数据转化为 HTML 格式
    imb = base64.b64encode(plot_data)  
    ims = imb.decode()
    imd = "data:image/png;base64,"+ims
    plt.close()
    return imd


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[-1].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip