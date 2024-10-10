from django.urls import path

from . import views as email


urlpatterns = [
	path('emergency/', email.emergency),
	path('factory/', email.factory),
	path('server/', email.server),
	path('factoryAndServer/', email.factoryAndServer),
	path('product/', email.product),
	path('sendEmail/line/', email.line),
	path('sendEmail/osx/', email.osx),
	path('sendEmail/build/', email.build),
	path('email/', email.saveEmail),
	path('ps/', email.ps),
	path('showContent/', email.showContent),
	path('search/', email.search),
	path('search-line/', email.searchLine),
	path('sendEmail/', email.SendEmail.as_view(),name="sendemail"),
	path('line-history/', email.lineHistory),
	path('save-line/', email.saveline),
	path('delete-line/', email.deleteline),
	path('line-history/download-line/', email.downloadLines),
	path('manyupload-line/', email.manyUploadLine),
	path('goPage/', email.goLinePage),
	path('request-history/', email.requestHistory),
	path('delete-email/', email.deleteEmail),
	path('ghlogin/', email.ghlogin),
	path('ghlogout/', email.GHlogout.as_view()),
]
