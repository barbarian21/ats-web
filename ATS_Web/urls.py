"""ATS_Web URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
import xadmin
from ATS_Web.settings import MEDIA_ROOT


from userInfo.views import *
from overlayList import views as ov_view
from testCoverage.views import *
from tools import views as tools_views
from questionnaire import views as question_views
from documents import views as doc_views


urlpatterns = [
    # 后台管理
    path('xadmin/', xadmin.site.urls),

    # userInfo APP
    path('', IndexView.as_view()),
    path('index/', IndexView.as_view(), name='index'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('userInfo/', userInfoView.as_view(), name='userInfo'),
    path('myInfo/', myInfoView.as_view(), name='myInfo'),
    path('getUserData/', userDataView.as_view(), name='getUserData'),
    path('favorProject/', updateProject.as_view(), name='favorProject'),
    path('projectInfo/', projectInfoView.as_view(), name='projectInfo'),
    path('getStageData/', stageDataView.as_view(), name='getStageData'),
    path('getStationData/', stationDataView.as_view(), name='getStationData'),
    path('pegaUserInfo/', pegaUserInfoView.as_view(), name='pegaUserInfo'),
    path('myReport/', myReportView.as_view(), name='myReport'),
    path('myReport/loadData/',myReportGetDataView.as_view(),name='myReportGetData'),
    path('myReport/reportAdd/', myReportAddView.as_view() , name='reportAddRow'),
    path('myReport/reportRemove/', myReportRemoveView.as_view() , name='ReportRemoveRow'),
    path('statistics/', statisticsView.as_view(), name='statistics'),
    path('statistics/judgeDateTime/', judgeDateTimeView.as_view() , name='judgeDateTime'),
    path('statistics/downloadReport/', downloadReportsView.as_view() , name='downloadReports'),
    

    # overlayList APP
    path('overlay/<int:num>/', ov_view.showOverlays, name='overlay'),
    path('overlay/overlayData/', ov_view.getOverlayData, name='overlayGetData'),
    path('overlay/overlayRemove/', ov_view.removeOverlay, name='overlayRemoveRow'),
    path('overlay/overlayAdd/', ov_view.addOverlay , name='overlayAddRow'),
    path('overlay/overlayEdit/', ov_view.editOverlay, name='overlayEditRow'),
    path('overlay/getOverlayRadar/', ov_view.getOverlayRadar, name='getOverlayRadar'),


    path('overlay/request/', ov_view.overlayRequest, name='requestMail'),
    path('overlay/requestMailData/', ov_view.requestMailData, name='requestMailData'),
    path('overlay/requestMail/', ov_view.requestMail, name='sendRequestMail'),
    path('overlay/getStationItems/', ov_view.getStationItems, name='getStationItems'),

    path('overlay/task/', ov_view.overlayTask, name='overlayTask'),

    #questionnaire
    path("questionnaire/",question_views.getQuestionnaire, name='getQuestionnaire'),
    path('questionnaireOperation/<type>/', question_views.questionnaireOperation),
    path('questionnaire/<int:num>/', question_views.getDetailQuestionnaire),
    path("questionnaireAnswer/<int:num>/",question_views.questionnaireAnswer),
    path('questionnaireEdit/<int:num>/', question_views.questionnaireEdit),
    path('questionnaireEdit/<int:num>/<type>/', question_views.questionnaireEditOperation),


    # stationTrack APP
    path('ST/', include('stationTrack.urls')),


    # testCoverage APP
    path('tc/', InitTC.as_view(),name="tcIndex"),
    path('tc/getAllGit/',InitTC.as_view(),name="initTC"),
    path('tc/pull_TC/',PullTC.as_view(),name="pullTC"),
    path('tc/search_station/', StationView.as_view(),name="searchStation"),
    path('tc/get_ItemTech/',ItemTechView.as_view(),name="getItemTech"),
    path('tc/get_ItemLimit/',ItemLimitView.as_view(),name="getItemLimit"),
    path('tc/createTc/',CreateTCFile.as_view(),name="createTCFile"),
    path('tc/searchByItemOrCommand/',SearchView.as_view(),name="searchByItemOrCommand"),


    # issueList 路由
    path('', include('issueList.urls')),
    
    # AuditTracking APP
    path('Audit/', include('AuditTracking.urls')),


    # sendEmail
    path('', include('sendEmail.urls')),

    # documents url
    path('doc/', doc_views.reading, name="getDocuments"),
    path('doc/searchFunction/', doc_views.searchFunction),

    #Tools
    path('autoBuild/', tools_views.autoBuildindex, name='autoBuild'),
    path('autoBuild/requestBaseDate/', tools_views.requestBaseDate, name='requestBaseDate'),
    path('autoBuild/sendBuildMail/', tools_views.sendBuildMail, name='sendBuildMail'),

    path('macApps/', tools_views.macAppsindex, name='macApps'),
    path('macApps/appsDetail/',tools_views.loadAppsDetail,name='appsDetail'),
    path('macApps/downloadTable/',tools_views.downloadTable,name='downloadTable'),

    path('messageBoard/', tools_views.messageBoardindex, name='messageBoard'),
    path('messageBoard/submitMessage/',tools_views.submitMessage,name='submitmessage'),
    path('messageBoard/submitReplyMessage/',tools_views.submitReplyMessage,name='submitReplyMessage'),
    path('messageBoard/deleteMessage/',tools_views.deleteMessage,name='deleteMessage'),

    path('grrSheet/',tools_views.grrSheetindex,name='grrSheet'),
    path('grrSheet/submitGrrOrOverlay/',tools_views.submitGrrOrOverlay,name='submitGrrOrOverlay'),
    path('grrSheet/delGrrOrOverlay/',tools_views.delGrrOrOverlay,name='delGrrOrOverlay'),
]
