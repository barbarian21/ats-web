from django.urls import path
from Apps.issueList import views



urlpatterns = [
	path('issue/', views.GetIssueViewHtml.as_view()),
    path('getIssueDataFromDb/', views.getIssueCategoryHttpResponse),
	path('searchIssue/', views.searchIssueCategory),
    path('issue/download/', views.downloadFromdb),
    path('issue/fixStyle/', views.fixedAllModelStyle),
]
