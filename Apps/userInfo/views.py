# _*_ coding: utf-8 _*_
from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from django.contrib.auth.hashers import make_password,check_password
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.backends import ModelBackend
from django.views.generic.base import View
from django.conf import settings
from django.db.models import Q ,Count
from django.http import FileResponse

from overlayList.models import Overlay
from .models import *
from common.models import Project,Stage,Station
import ldap
import json
import re
import time
import datetime
import os 
import xlsxwriter

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Create your views here.

# 首页
class IndexView(View):
    def get(self, request):
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/login/')
        else:
            return render(request, 'index.html')

class CustomBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            user = User.objects.get(username=username)
            dbPassword = user.password
            print('new authenticate=',user, dbPassword)
            if user.check_password(password) or dbPassword==password:
                return  user
        except Exception as e:
            return  None

# 登陆
class LoginView(View):
    def get(self, request):
        return render(request, 'login.html')

    def post(self,request):
        if request.user.is_authenticated:
            return HttpResponseRedirect('/')

        username = request.POST.get('username', '').lower().strip()
        password = request.POST.get('password', '').strip()
        remember_me = request.POST.get('remember-me', False)
        result = False
        message = None
        if self.userLogin(request,username,password):
            result = True
            try:
                userInfo = ldapAuthenticate(username,checkPassword=False)
                userData = userInfo[2]
                user = User.objects.get(username=username)
                department_obj = updateDepartment(userData)
                user.department = department_obj
                access_projects = getUserProjects(userData)
                user.projects.add(*access_projects)
                user.save()
            except:
                print('LDAP ERROR!')
        else:
            userInfo = ldapAuthenticate(username, password)
            userData = userInfo[2]
            if userInfo[0] == True and userInfo[1] == 'ATS':
                if self.register(userData):
                    result = self.userLogin(request,username,password)
                else:
                    message = 'register fail!'
            else:
                message = userInfo[1]

        # check result
        if result:
            # update email setting
            settings.EMAIL_HOST_USER = 'PSH\\'+username
            settings.EMAIL_HOST_PASSWORD = password
            if remember_me:
                request.session.set_expiry(None)
            else:
                request.session.set_expiry(0)
            return HttpResponseRedirect('/')
        else:
            return render(request, 'login.html', {'message': message})

    def userLogin(self,request,username,password):
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return True
        return False

    def register(self,userData):
        user = None
        u_name = userData['username']
        u_password = make_password(userData['password'])
        u_firstName = userData['givenName'][0]
        u_lastName = userData['sn'][0]
        u_email = userData['mail'][0]
        u_workID = userData['l'][0]
        if 'mobile' in userData.keys():
            u_mvpn = userData['mobile'][0]
        else:
            u_mvpn = ''

        if User.objects.filter(workID=u_workID).exists():
            user = User.objects.get(workID=u_workID)
            user.password = u_password
        else:
            user = User.objects.create(username=u_name,
                                    password=u_password,
                                    first_name=u_firstName,
                                    last_name=u_lastName,
                                    email=u_email,
                                    workID=u_workID,
                                    mvpn=u_mvpn,)
        department_obj = updateDepartment(userData)
        user.department = department_obj
        access_projects = getUserProjects(userData)
        user.projects.add(*access_projects)
        if len(access_projects) >0:
            user.favor_project = access_projects[0]
        user.save()
        if user:
            return True
        return False

# 登出
class LogoutView(View):
    def get(self,request):
        logout(request)
        return HttpResponseRedirect('/login/')

# 用户信息页面
class userInfoView(View):
    def get(self, request):
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/login/')
        departments = Department.objects.all()
        return render(request, 'userInfo/userInfo.html', {'departments':departments})

# 个人信息页面
class myInfoView(View):
    def get(self, request):
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/login/')
        else:
            userName = request.user.username
            user_obj = User.objects.get(username=userName)
            return render(request, 'userInfo/myInfo.html', {'myInfo': user_obj})

    def post(self, request):
        userName = request.user.username
        user_obj = User.objects.get(username=userName)
        message = None
        if request.method == 'POST':
            mobile = request.POST.get('id_mobile')
            mvpn = request.POST.get('id_mvpn')
            position = request.POST.get('id_position')
            gender = request.POST.get('id_gender')
            imgfile=request.FILES.get("imgfile", None)

            #上传文件
            if(imgfile):
                uploadRes=self.uploadFile(imgfile)
                if uploadRes[0]:
                    #删除原来的图片路径
                    if user_obj.imageAddress:
                        oldImgAddress=BASE_DIR + '/..' + user_obj.imageAddress
                        os.remove(oldImgAddress)
                    user_obj.imageAddress=uploadRes[1]
                else:
                    user_obj.imageAddress='/static/img/userImg/base_img.png' 

            user_obj.mvpn = mvpn
            user_obj.position = position
            user_obj.mobile = mobile

            if gender != '':
                user_obj.gender = gender
                user_obj.save()
            message = '操作成功！'
        return render(request, 'userInfo/myInfo.html', {'myInfo': user_obj, 'message':message})

    def uploadFile(self,files):	 
        try:
            time_stamp = time.strftime('%Y-%m-%d %H-%M-%S', time.localtime())
            file_path = BASE_DIR + '/../' + 'static/img/userImg/'
            fname = files.name
            dot_pos = fname.index('.')
            name = fname[:dot_pos]
            postfix = fname[dot_pos:]
            fp_name = '/static/img/userImg/' + name + '_' + time_stamp + postfix
            filepath = file_path + name + '_' + time_stamp + postfix
            fp = open(filepath, 'wb+')
            for chunk in files.chunks():
                fp.write(chunk)
            fp.close()
            return [True,fp_name]
        except Exception as e:
            return [False,e]

            # #读取上传的文件
            # line_data=[]
            # with open(filepath) as csvfile:
            #     csv_reader = csv.reader(csvfile)  # 使用csv.reader读取csvfile中的文件
            #     line_head = next(csv_reader)  # 读取第一行每一列的标题
            #     for row in csv_reader:  # 将csv 文件中的数据保存到birth_data中
            #         line_data.append(row)
            
            # #删除文件
            # os.remove(filepath)

            # for ld in line_data:
            #     if len(ld)<2:
            #         return HttpResponse("数据格式不正确！")
            #     else:
            #         m.saveLine(ld[0],ld[1])

#个人日志/报告页面
class myReportView(View):
    def get(self, request):
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/login/')
        else:
            userName = request.user.username
            user_obj = User.objects.get(username=userName)
            return render(request, 'userInfo/myReport.html')

class myReportGetDataView(View):
    def post(self, request):
        if request.method == 'POST':
            para = request.POST.get('para')
            userName = request.user.username
            #Open 未完成的
            #Done 本周完成
            #History 本周以前完成的
            if('Open' in para):
                all_Report = Report.objects.filter(Q(status='New') | Q(status="Ongoing"),author=userName).order_by('-updateTime')
            elif('Done' in para):
                all_Report = Report.objects.filter(status='Done',author=userName,updateTime__gt=getSunday()).order_by('-updateTime')
            elif('History' in para):
                all_Report = Report.objects.filter(status="Done",author=userName,updateTime__lt=getSunday()).order_by('-updateTime')
            else:
                all_Report = Report.objects.filter().order_by('-updateTime')
            
            total = len(all_Report)
            rows = []
            data = {"total": total, "rows": rows}
            for item in all_Report:
                row_data = getRowData(item)
                rows.append(row_data)
            return HttpResponse(json.dumps(data), content_type="application/json")

class myReportAddView(View):
    def post(self, request):
        if request.method == 'POST':
            result= updateReport(request)
            overlay_add = result[0]
            data = getRowData(overlay_add)
            dumpData = {'data':data, 'refresh':result[1]}
            print(dumpData)
            return HttpResponse(json.dumps(dumpData), content_type="application/json")

class myReportRemoveView(View):
    def post(self, request):
        if request.method == 'POST':
            id=int(request.POST.get("id"))
            obj = Report.objects.get(id=id)
            obj.delete()
            print("remove report=>", id, obj.Description)
            return HttpResponse('0')

def updateReport(request, op='add'):
    refresh = False
    id = request.POST.get("id")
    fatory = request.POST.get("fatory","")
    projectBuildStage = request.POST.get("projectBuildStage","")
    station = request.POST.get("station","")
    status = request.POST.get("status",'')
    category = request.POST.get("category",'')
    radar = request.POST.get("radar",'')
    coco_DRI = request.POST.get("coco_DRI",'')
    description = request.POST.get("description","")
    note = request.POST.get("note",'')
    author= request.user.username

    #update database
    if(id != ''):
        report_obj = Report.objects.get(id=int(id))
    else:
        report_obj = Report()
    report_obj.fatory = fatory
    report_obj.projectBuildStage = projectBuildStage
    report_obj.station = station
    report_obj.status = status
    report_obj.category = category
    report_obj.radarNumber = radar
    report_obj.cocoDRI = coco_DRI
    report_obj.Description = description
    report_obj.note = note
    report_obj.category = category
    report_obj.author= author

    report_obj.save()
    return (report_obj,refresh)

def getSunday():
    now = datetime.datetime.now()
    start = now - datetime.timedelta(days=now.weekday())
    this_week_start = datetime.datetime(start.year, start.month, start.day, 0, 0, 0, 0)
    return this_week_start

def getRowData(reportObj,covert=True):
    Description = reportObj.Description
    note = reportObj.note
    if covert == True:
        if  Description != None:
            Description = Description.replace('\r','')
            Description = Description.replace('\n','<br>')
        else:
            Description=''

        if note != None:
            note=note.replace('\r','')
            note=note.replace('\n','<br>')
        else:
            note=''

    data = {
        'id':reportObj.id,
        'fatory': str(reportObj.fatory),
        'projectBuildStage': str(reportObj.projectBuildStage),
        'station': str(reportObj.station),
        'status': reportObj.status,
        'category': reportObj.category,
        'Description': Description,
        'cocoDRI':reportObj.cocoDRI,
        'radarNumber': reportObj.radarNumber,
        'author': reportObj.author,
        'note': note,
        'updateTime': reportObj.updateTime.strftime(format="%Y-%m-%d %H:%M:%S")}
    return data

#新人报告统计页面
class statisticsView(View):
    def get(self, request):
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/login/')
        else:
            userName = request.user.username
            user_obj = User.objects.get(username=userName)
            return render(request, 'userInfo/statistics.html')

#判断该时间段是否有数据
class judgeDateTimeView(View):
    def post(self, request):
        if request.method == 'POST':
            dateSelect=request.POST.get("dateSelect").split(' - ')
            startTime= datetime.datetime.strptime(dateSelect[0], '%m/%d/%Y')
            endTime= datetime.datetime.strptime(dateSelect[1]+" 23:59:59", '%m/%d/%Y %H:%M:%S')

            all_Report = Report.objects.filter(Q(updateTime__lt=endTime) & Q(updateTime__gt=startTime ))
            if len(all_Report)==0:
                return HttpResponse("0")
            else:
                return HttpResponse("1")

#新人报告统计页面
class downloadReportsView(View):
    def post(self, request):
        if request.method == 'POST':
            dateSelect=request.POST.get("dateSelect").split(' - ')
            startTime= datetime.datetime.strptime(dateSelect[0], '%m/%d/%Y')
            endTime= datetime.datetime.strptime(dateSelect[1]+" 23:59:59", '%m/%d/%Y %H:%M:%S')
            #写入全部数据
            all_Report = Report.objects.filter(Q(updateTime__lt=endTime) & Q(updateTime__gt=startTime ))
            rows=[]
            for i in all_Report:
                row=getRowData(i,False)
                rows.append(row)
            if rows==[]:
                return HttpResponse("该时间段无数据！")
            workbook = xlsxwriter.Workbook('media/new_excel.xlsx')     #新建excel表
            headings = rows[0].keys()     #设置表头
            writeDataToExcel(workbook,"AllReport",headings,rows,request.POST.get("dateSelect"))
            #循环写入每个新人的报告
            author_objs=Report.objects.filter(Q(updateTime__lt=endTime) & Q(updateTime__gt=startTime )).values('author').annotate(Count=Count('author'))
            for a in author_objs:
                author_name=a.get('author')
                author_Report = Report.objects.filter(Q(updateTime__lt=endTime) & Q(updateTime__gt=startTime),author=author_name)
                rowd=[]
                for i in author_Report:
                    row=getRowData(i,False)
                    rowd.append(row)
                if rowd==[]:
                    return HttpResponse("该时间段无数据！")
                writeDataToExcel(workbook,author_name,headings,rowd,request.POST.get("dateSelect"))

            workbook.close()

            file = open("media/new_excel.xlsx", 'rb')
            response = FileResponse(file)
            response['Content-Type'] = "application/octet-stream"
            response['Content-Disposition'] = 'attachment;filename="new_excel.xlsx"'
            return response
            
def writeDataToExcel(workbook,sheetName,headings,rows,dateSelect):
    
    worksheet = workbook.add_worksheet(sheetName)  

    # 使用add_fromat方法设置单元格的格式
    baseStyle=workbook.add_format({'font_size':16,'top':1,'left':1, 'right':1,'bottom':1,'align':'center','text_wrap':1,'valign':'vcenter'})
    noteStyle=workbook.add_format({'font_size':16,'top':1,'left':1, 'right':1,'bottom':1,'text_wrap':1,'valign':'vcenter'})
    style = workbook.add_format({'font_size':20,'top':1,'left':1, 'right':1,'bottom':1,'align':'center','fg_color':'#BADBA4','text_wrap':1})		# 添加粗体格式

    worksheet.merge_range(0,0,0,len(headings)-1,'ATS - Weekly Report',style)  
    worksheet.merge_range(1,0,1,len(headings)-1,'Activity: '+dateSelect,style)   
    worksheet.write_row(2,0,headings,baseStyle)
    worksheet.set_row(0, 20)
    headings_list=list(headings)

    for i in range(len(rows)):
        row=rows[i]
        for j in range(len(row)):
            if((headings_list[j]=='Description') or (headings_list[j] == 'note')):
                data=row.get(headings_list[j]).replace("\r",'')
                worksheet.set_column(j,j, 80)
                worksheet.write_string(3+i, j, data, noteStyle)
            else:
                worksheet.set_column(j,j, 16)
                worksheet.write(3+i, j, row.get(headings_list[j]), baseStyle)

# 专案信息页面
class projectInfoView(View):
    def get(self, request):
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/login/')
        departments = Department.objects.all()
        return render(request, 'userInfo/projectInfo.html')

# 公司员工信息查询页面
class pegaUserInfoView(View):
    def get(self, request):
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/login/')
        return render(request, 'userInfo/pegaUsers.html')

    def post(self,request):
        username = request.POST.get('username', '').lower().strip()
        context = None
        result = ldapAuthenticate(username, checkPassword=False)
        if(result[0] == True):
            userData = result[2]
            telephoneNumber = ""
            if 'telephoneNumber' in userData.keys():
                telephoneNumber = '\r\n'.join(userData["telephoneNumber"])
            company = ""
            if 'company' in userData.keys():
                company = '\r\n'.join(userData["company"])
                company = re.findall(r":(.*?)$", company)[0]
            postalCode=""
            if 'postalCode' in userData.keys():
                postalCode = '\r\n'.join(userData["postalCode"])
                postalCode = re.findall(r":(.*?)$", postalCode)[0]
            mobile=""
            if 'mobile' in userData.keys():
                mobile = '\r\n'.join(userData["mobile"])

            context = {"pegauser":{"title":  '\r\n'.join(userData["title"]),
                                   "displayName": '\r\n'.join(userData["displayName"]),
                                   "workID": '\r\n'.join(userData["l"]),
                                   "email": '\r\n'.join(userData["mail"]),
                                   "department": '\r\n'.join(userData["department"]),
                                   "st": '\r\n'.join(userData["st"]),
                                   "mvpn": mobile,
                                   "telephoneNumber": telephoneNumber,
                                   "postalCode": postalCode,
                                   "company": company,
                                   "whenCreated":'\r\n'.join(userData["whenCreated"]),
                                   }}
        return render(request, 'userInfo/pegaUsers.html',context)


class userDataView(View):
    def get(self, request):
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/login/')
        st = request.GET['departmentCode']
        stObj = Department.objects.get(code=st)
        all_users = [n for n in stObj.user_set.all()]

        if stObj.subDepartments:
            arrDepartments = stObj.subDepartments.split('\n')
            for temp in arrDepartments:
                sub_st = temp.strip()
                try:
                    de = Department.objects.get(code=sub_st)
                    users = de.user_set.all()
                    for n in users:
                        all_users.append(n)
                except:
                    print('not found department:' + sub_st)
        total = len(all_users)
        rows = []
        data = {"total": total, "rows": rows}
        for item in all_users:
            rows.append({'username': item.username,
                         'displayName': item.displayName,
                         'workID': item.workID,
                         'email': item.email,
                         'mvpn': item.mvpn,
                         'mobile': item.mobile,
                         'department': str(item.department),
                         'position': item.position, })
        return HttpResponse(json.dumps(data), content_type="application/json")


class stageDataView(View):
    def get(self, request):
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/login/')
        project = request.user.favor_project
        all_stage = Stage.objects.filter(project=project)
        total = len(all_stage)
        rows = []
        data = {"total": total, "rows": rows}
        for item in all_stage:
            rows.append({'name': item.name,
                         'description': str(item.description).replace('\r\n', '<br />'),
                         'start_date': str(item.start_date),
                         'stop_date': str(item.stop_date),
                         })
        return HttpResponse(json.dumps(data), content_type="application/json")


class stationDataView(View):
    def get(self, request):
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/login/')
        project = request.user.favor_project
        all_station = Station.objects.filter(project=project).order_by("category")
        total = len(all_station)
        rows = []
        data = {"total": total, "rows": rows}
        for item in all_station:
            rows.append({'stationID': item.stationID,
                         'name': item.name,
                         'script': item.script,
                         'description': str(item.description).replace('\r\n', '<br />'),
                         'category': str(item.category),
                         'is_POR': str(item.is_POR),
                         'is_offline': str(item.is_offline),
                         'add_time': str(item.add_time),
                         })
        return HttpResponse(json.dumps(data), content_type="application/json")


class updateProject(View):
    def post(self, request):
        username = request.user.username
        projectCode = request.POST.get('favorProject')
        project_obj = Project.objects.get(code=projectCode)
        user_obj = User.objects.get(username = username)
        user_obj.favor_project = project_obj
        user_obj.save()
        return HttpResponse(json.dumps({'project':projectCode}), content_type="application/json")

# LDAP认证
def ldapAuthenticate(name, password='', checkPassword=True):
    result = True
    message = ''
    userData = {'username':name, 'password':password}
    ldapconn = ldap.initialize('ldap://172.28.128.159:3268')
    try:
        ldapconn.set_option(ldap.OPT_REFERRALS, 0)
        ldapconn.set_option(ldap.OPT_NETWORK_TIMEOUT, 5)
        ldapconn.protocol_version = ldap.VERSION3
        ldapconn.simple_bind_s('PSH_BG3_ATS', '4eR59853')
    except ldap.INVALID_CREDENTIALS:
        message = "Admin username or password is incorrect. Please connect developers!"
        result = False
    except ldap.LDAPError as e:
        message = str(e)
        result = False

    if result==True:
        base_dn = 'DC=CORP,DC=PEGATRON'
        searchScope = ldap.SCOPE_SUBTREE
        searchFilter = '(sAMAccountName='+ name +')'
        searchAttribute = ["title","mail","department","displayName","givenName","l","mailNickname",
                           "mobile","sn","st", "memberof","postalCode","company","telephoneNumber","whenCreated"]
        try:
            ldap_result = ldapconn.search_s(base_dn, searchScope, searchFilter, searchAttribute)
        except ldap.LDAPError as e:
            message = str(e)
            result = False

        if(result and ldap_result!= []):
            searchData = ldap_result[0][1]
            for key, value in searchData.items():
                myValue = [item.decode('utf-8') for item in value]
                userData[key] = myValue
            try:
                st = userData['st'][0]
            except:
                st = ''
            if 'D580' in st:
                message = 'ATS'                
            else:
                message = 'You are not ATS members'

            if checkPassword:
                cn = ldap_result[0][0]
                try:
                    ldapconn.simple_bind_s(cn, password)
                except ldap.INVALID_CREDENTIALS:
                    message = "Invalid password"
                    result = False
                except ldap.LDAPError as e:
                    message = str(e)
                    result = False
        else:
            message = 'Invalid username'
            result = False
    ldapconn.unbind_s()
    print("LDAP auth=",result,message)
    return(result,message,userData)

def updateDepartment(userData):
    u_department = userData['department'][0]
    u_departmentCode = userData['st'][0]

    # create department table record
    department = Department.objects.filter(code=u_departmentCode)
    if department.exists():
        department_obj = department[0]
    else:
        department_obj = Department.objects.create(code=u_departmentCode,
                                                   name=u_department,
                                                   email=u_departmentCode + '@intra.pegatroncorp.com', )

    mp_projects = Project.objects.filter(status='MP')
    department_obj.projects.add(*mp_projects)
    department_obj.save()
    return department_obj

def getUserProjects(userData):
    # get department access
    u_department = userData['st'][0]
    de = Department.objects.get(code=u_department)
    access_project = [var for var in de.projects.all()]
    print('department access_project=', access_project)

    # get user access
    u_memberof = userData['memberOf']
    for item in u_memberof:
        for project in Project.objects.all():
            try:
                projectEmail= project.email.lower().strip()
                emailTitle = projectEmail.split('@')[0]
                if (emailTitle in item.lower()):
                    if (project not in access_project):
                        access_project.append(project)
            except:
                print("get error project email") 
            if (project.name in item):
                if (project not in access_project):
                    access_project.append(project)

    print('user access_project=', access_project)
    return access_project
