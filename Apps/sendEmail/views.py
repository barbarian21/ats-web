import os
import json
import time
import csv

from django.shortcuts import render, HttpResponseRedirect,redirect
from django.http import HttpResponse,JsonResponse,FileResponse
from django.conf import settings as e
from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives
from django.contrib import messages

from . import method as m
from userInfo.views import *


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def ps(req):
	return HttpResponse(json.dumps(m.getPs()))


def email(req):
	e.EMAIL_HOST_USER = req.POST.get('usr')
	e.EMAIL_HOST_PASSWORD = req.POST.get('pwd')

	subject = req.POST.get('subject')
	body = req.POST.get('body')
	f = req.POST.get('f')
	to = req.POST.get('to')
	c = json.loads(req.POST.get('cc'))
	appendix = req.FILES.get('appendix') 
	if len(c):
		t = [to] + c
	else:
		t = [to]

	msg = EmailMultiAlternatives(subject, body, f, t)
	if appendix:
		time_stamp = time.strftime('%Y-%m-%d %H-%M-%S', time.localtime())
		file_path = BASE_DIR + '/../' + 'static/sendEmail/history/'
		# m.clsFolder(file_path)
		fname = appendix.name
		dot_pos = fname.index('.')
		name = fname[:dot_pos]
		postfix = fname[dot_pos:]
		fp_name = '/static/sendEmail/history/' + name + '_' + time_stamp + postfix
		file = file_path + name + '_' + time_stamp + postfix
		fp = open(file, 'wb+')
		for chunk in appendix.chunks():
			fp.write(chunk)
		fp.close()
		msg.attach_file(file)
	msg.send()
	mail = {
		'subject': subject,
		'content': body,
		'from': f,
		'to': to,
		'cc': c,
		'appendix': fp_name if appendix else u'空',
	}
	m.saveEmail(mail)
	return HttpResponse('邮件发送成功')

def build(req):
	term = req.GET.get('term')
	return HttpResponse(json.dumps(m.getBuild(term)))


def osx(req):
	term = req.GET.get('term')
	return HttpResponse(json.dumps(m.getOsx(term)))


def line(req):
	term = req.GET.get('term')
	return HttpResponse(json.dumps(m.getLine(term)))


def product(req):
	return HttpResponse(json.dumps(m.getProduct()))


def factoryAndServer(req):
	return HttpResponse(json.dumps(m.getFactoryAndServer()))


def server(req):
	return HttpResponse(json.dumps(m.getServer()))


def factory(req):
	return HttpResponse(json.dumps(m.getFactory()))


def emergency(req):
	return HttpResponse(json.dumps(m.getEmergency()))


def ghlogin(req):
	return render(req, 'sendEmail/ghlogin.html')


class GHlogout(LogoutView):
	def get(self,request):
		logout(request)
		return HttpResponseRedirect('/ghlogin/')


class SendEmail(LoginView):
	def get(self, request):
		# if not request.user.is_authenticated:
		# 	return HttpResponseRedirect('/ghlogin/')
		return render(request, 'sendEmail/sendEmail.html')


	def post(self,request):
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
			# return HttpResponseRedirect('/sendEmail/')
			return HttpResponse(json.dumps({'message': 'sendEmail'}))
		else:
			return HttpResponse(json.dumps({'message': message}))


def requestHistory(request):
	if not request.user.is_authenticated:
		return HttpResponseRedirect('/ghlogin/')

	#先判定用户是否有权限
	permission=m.getUserPermission(str(request.user))
	if permission:
		user_perm=True
	else:
		user_perm=False
		messages.success(request,"没有权限！")
		return redirect("/line-history/")

	data = {
		'emails': m.queryEmail(),
	}
	return render(request, 'sendEmail/request-history.html', data)

def saveEmail(request):
	subject = request.POST['subject']
	body = request.POST['body']
	f = request.POST['f']
	to = request.POST['to']
	mail = {
		'subject': subject,
		'content': body,
		'from': f,
		'to': to,
	}
	m.saveEmail_m(mail)
	return HttpResponse('邮件发送成功')

def deleteEmail(request):
	eids=request.POST['eids'].split(",")
	email_ids=[]
	for i in eids:
		if i:
			email_ids.append(int(i))
	deletemail_result=m.deleteEmail_m(email_ids)
	return HttpResponse("删除成功！")

def showContent(request):
	eid = int(request.GET.get('eid'))
	data = m.emailContent(eid)
	return render(request, 'sendEmail/email.html', data)


def search(request):
	if not request.user.is_authenticated:
		return HttpResponseRedirect('/ghlogin/')
	kind = request.GET.get('kind')
	val = request.GET.get('val')
	data = {
		'emails': m.searchEmail(kind, val)
	}
	return render(request, 'sendEmail/request-history.html', data)

def saveline(request):
	sname = request.POST['sname']
	lname = request.POST['lname']
	saveline_result=m.saveLine(sname,lname)
	return HttpResponse("添加成功！")

def deleteline(request):
	lids=request.POST['lids'].split(",")
	line_ids=[]
	for i in lids:
		if i:
			line_ids.append(int(i))
	deleteline_result=m.deleLine(line_ids)
	return HttpResponse("删除成功！")

def manyUploadLine(request):
	files = request.FILES.get('files') 
	if files:
		time_stamp = time.strftime('%Y-%m-%d %H-%M-%S', time.localtime())
		file_path = BASE_DIR + '/../' + 'static/sendEmail/history/'
		fname = files.name
		dot_pos = fname.index('.')
		name = fname[:dot_pos]
		postfix = fname[dot_pos:]
		fp_name = '/static/sendEmail/history/' + name + '_' + time_stamp + postfix
		filepath = file_path + name + '_' + time_stamp + postfix
		fp = open(filepath, 'wb+')
		for chunk in files.chunks():
			fp.write(chunk)
		fp.close()
		#读取上传的文件
		line_data=[]
		with open(filepath) as csvfile:
			csv_reader = csv.reader(csvfile)  # 使用csv.reader读取csvfile中的文件
			line_head = next(csv_reader)  # 读取第一行每一列的标题
			for row in csv_reader:  # 将csv 文件中的数据保存到birth_data中
				line_data.append(row)
		
		#删除文件
		os.remove(filepath)

		for ld in line_data:
			if len(ld)<2:
				return HttpResponse("数据格式不正确！")
			else:
				m.saveLine(ld[0],ld[1])
			

	return HttpResponse("添加成功！")

def lineHistory(request):
	rows=[]
	sfrows={}
	#先判定用户是否有权限
	permission=m.getUserPermission(str(request.user))
	if permission:
		user_perm=True
	else:
		user_perm=False
	servers=m.get_server()
	for server in servers:
		row={}
		sid=server[0]
		sname=server[1]
		saddress=server[2]
		sfid=server[3]
		row['sid']=sid
		row['sname']=sname
		row['saddress']=saddress
		rows.append(row)
		if sfid in sfrows.keys():
			sfrows[sfid].append(row)
		else:
			sfrows[sfid]=[row]
	data = {
		'server_lines': m.formatLineData(m.queryLineData()),     	#分页之后的line
		'line_count': m.countLineData(),
		'pageSize':20,
		'servers':rows,                       			 	#所有的server
		'serverbyfactory':sfrows,   						#根据站点分好类的server
		'permission':user_perm       						#判断用户是否有权限
	}
	return render(request, 'sendEmail/line-history.html', data)

def goLinePage(request):
	page = request.POST['page']
	pageSize = request.POST['pageSize']
	orderby=request.POST['orderby']
	order_dic={
		'ghLS_asc':'sendEmail_server.name asc,sendEmail_line.name asc',
		'ghLS_desc':'sendEmail_server.name desc,sendEmail_line.name asc',
		'line_asc':'sendEmail_line.name asc,sendEmail_server.name asc',
		'line_desc':'sendEmail_line.name desc,sendEmail_server.name asc'
	}
	server_lines=m.formatLineData(m.queryLineData(sortBy=order_dic[orderby],base=(int(page)-1)*int(pageSize),offset=int(pageSize)))
	return JsonResponse({'page_lines':server_lines}, safe=True)


def searchLine(request):
	if not request.user.is_authenticated:
		return HttpResponseRedirect('/ghlogin/')
	kind = request.POST['kind']
	val = request.POST['value']
	return JsonResponse({'server_lines':m.searchLine(kind, val)}, safe=True)

def downloadLines(request):
	count=m.countLineData()
	server_lines=m.formatLineData(m.queryLineData(offset=int(count)))

	f=open(BASE_DIR + '/../' + "/static/sendEmail/downloadLines.csv","w",encoding='utf-8')
	f.truncate()
	csv_writer = csv.writer(f)
	csv_writer.writerow(["#","ghLS","Line Name"])
	count=0
	for sl in server_lines:
		count=count+1
		csv_writer.writerow([count,sl["sname"],sl["lname"]])
	f.close()	
	file=open(BASE_DIR + '/../' + "/static/sendEmail/downloadLines.csv","rb")
	print(file)
	response = FileResponse(file)
	response['Content-Type'] = "application/octet-stream"
	response['Content-Disposition'] = 'attachment;filename="downloadLines.csv"'
	return response