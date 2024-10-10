from django.urls import path
from Apps.AuditTracking import views



urlpatterns = [
	path('detail/', views.GetAuditHtml.as_view()),
	path('summaryByIssueCategory/', views.getSummaryByIssueCategory),
    path('summaryByDRI/', views.getSummaryByDRI),
    path('getAuditData/', views.getAuditHttpResponse),
    path('getStationVerson/', views.getStationVersion),
    path('download/', views.downloadAudit),
]
