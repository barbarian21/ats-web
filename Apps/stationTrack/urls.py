
from django.urls import path
# from Apps.IssueList import views as il_views
from Apps.stationTrack import views


urlpatterns = [
    path('StationTrack/', views.GetSTViewHtml.as_view()),
    path('getSTDataFromDb/', views.getStationTrackHttpResponse),
    path('getCommmonModelInfo/', views.getCommonModelData),
    path('download/', views.downloadFromdb),
]
