from django.shortcuts import render,redirect,render_to_response
from django.http import HttpResponse,HttpResponseRedirect
import smtplib
from email.mime.text import MIMEText
from userInfo.models import User
import os
from subprocess import *
def AutoBuildHome(request):
	N104_Tech_path = '/data/django/git/PSH_Bison_Atlas_QT/AtlasQT/N104_Tech'
	PG_ipx_path = '/data/django/hwte-git/PG_iPx'
	build_target = None
	if (os.path.exists(N104_Tech_path)):
		build_target = []
		files = os.listdir(N104_Tech_path)
		for file in files:
			m = os.path.join(N104_Tech_path,file)
			if (os.path.isdir(m)):
				h = os.path.split(m)
				if h[1] == '.git':
					pass
				else:
					build_target.append(h[1])
		build_target.sort()
	tag_path = '/data/django/hwte-git/PG_iPx'
	list_tag = None
	if (os.path.exists(tag_path)):
		list_tag = []
		git_commit_fields = ['id', 'author_name', 'author_email', 'date', 'message']
		git_log_format = ['%H', '%an', '%ae', '%ad', '%s']
		git_log_format = '%x1f'.join(git_log_format) + '%x1e'
		p = Popen('cd %s && git log --format="%s"' % (tag_path,git_log_format), shell=True, stdout=PIPE)
		(log, _) = p.communicate()
		log = log.strip(b'\x1e\n').split(b"\x1e")
		log = [row.strip().split(b"\x1f") for row in log]
		dic_log = [dict(zip(git_commit_fields, row)) for row in log]
		for item in dic_log:
			s_insert = item['id'].decode()[0:7]+'   '+item['date'].decode()[4:19]
			list_tag.insert(len(list_tag),s_insert)
	return render(request, 'autobuildhome.html',{'build_target':build_target,'list_tag':list_tag})
def result(request):
	return render(request, 'result.html')
def product(request):
	return render(request, 'products.html')
def contact(request):
	if request.method == 'GET':
		ticket = request.COOKIES.get('ticket')
		if not ticket:
			return HttpResponseRedirect('/login/')
		if User.objects.filter(u_ticket=ticket).exists():
			return render(request, 'contact.html')
		else:
			return HttpResponseRedirect('/login/')
	if request.method == 'POST':
		ticket = request.COOKIES.get('ticket')
		user = User.objects.filter(u_ticket=ticket)[0]
		dic_request = request.GET
		USERNAME = user.username
		PASSWORD = user.password
		text = 'Fail at start'
		content = request.POST.get('message')
		print('66666')
		print(content)
		msg = MIMEText(content+'\n\nFrom AutoBuild Web APP FeedBack')
		msg['Subject'] = 'pegatron build request'
		msg['From'] = "%s@pegatroncorp.com" % USERNAME
		msg['To'] = "Guitar_Li@pegatroncorp.com"
		msg['Cc'] = "%s@pegatroncorp.com" % USERNAME
		try:
			s_mail = smtplib.SMTP('mail.sh.pegatroncorp.com')
		except:
			text = "Send fail, SMTP error"
		else:
			try:
				s_mail.login(USERNAME, PASSWORD)
			except:
				text = "Send fail, Username or Password error"
			else:
				try:
					print(msg['From'])
					print(msg['To'].split(',')+msg['Cc'].split(','))
					print(msg.as_string())
					s_mail.sendmail(msg['From'],msg['To'].split(',')+msg['Cc'].split(','),msg.as_string())
				except:
					text = "Send fail at msg['From' and 'To' and 'Cc']"
				else:
					try:
						s_mail.quit()
					except:
						text = "Send Success,but quit fail"
					else:
						text = "Send success, Thanks for your feedback"
		response = {'result':text}
		return render(request, 'result.html',response)

def start_autobuild(request):
	if request.method == 'GET':
		ticket = request.COOKIES.get('ticket')
		if not ticket:
			print('not ticket')
			return HttpResponseRedirect('/login/')
		if User.objects.filter(u_ticket=ticket).exists():
			user = User.objects.filter(u_ticket=ticket)[0]
			dic_request = request.GET
			USERNAME = user.username
			PASSWORD = user.password
			text = 'start'
			content = '''TARGET = %s
ATLASVERS = %s
BRANCH = %s
TAG = %s
EMAIL = %s@pegatroncorp.com
BUILD = %s''' % (
				"iPhoneQT_"+dic_request["product"]+"-"+dic_request["station"],
				dic_request['atlasversion'],
				dic_request['branch'],
				dic_request['tag'],
				USERNAME,
				dic_request['build'])
			msg = MIMEText(content)
			msg['Subject'] = 'pegatron build request'
			msg['From'] = "%s@pegatroncorp.com" % USERNAME
			msg['To'] = "qt-buildrequest@buildcave.hwte.apple.com"
			# msg['To'] = "Guitar_Li@pegatroncorp.com"
			if('ccATS' in dic_request):
				if(dic_request['ccATS'] == "1"):
					msg['Cc'] ="%s@pegatroncorp.com,Bison_ATS@pegatroncorp.com" % USERNAME
				else:
					msg['Cc'] = "%s@pegatroncorp.com" % USERNAME
			else:
				msg['Cc'] = "%s@pegatroncorp.com" % USERNAME
			try:
				s_mail = smtplib.SMTP('mail.sh.pegatroncorp.com')
			except:
				text = "Send fail, SMTP error"
			else:
				try:
					s_mail.login(USERNAME, PASSWORD)
				except:
					text = "Send fail, Username or Password error"
				else:
					try:
						print(msg['From'])
						print(msg['To'].split(',')+msg['Cc'].split(','))
						print(msg.as_string())
						s_mail.sendmail(msg['From'],msg['To'].split(',')+msg['Cc'].split(','),msg.as_string())
					except:
						text = "Send fail at msg['From' and 'To' and 'Cc']"
					else:
						try:
							s_mail.quit()
						except:
							text = "Send Success,but quit fail"
						else:
							text = "Send success"
			response = {'result':text}
			return render(request, 'result.html',response)
		else:
			return HttpResponseRedirect('/login/')
def AutoBuild_pull(request):
	PG_ipx_path ='/data/django/hwte-git/PG_iPx'
	ret = os.popen('cd %s && git pull' % PG_ipx_path)
	if ret.read():
		return render(request,'result.html',{'result':"Pull success, Now try to AutoBuild"})
	else:
		return render(request,'result.html',{'result':"Pull Fail,Please contact Kid"})