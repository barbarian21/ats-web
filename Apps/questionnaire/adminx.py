import xadmin
from .models import *


class QuestionnarieThemeAdmin(object):
    model_icon = 'fa fa-list'
    list_display = ('id','theme', 'password', 'add_time', 'author')
    list_display_links = ('id','title')
    list_filter = ('theme', 'add_time', 'author')
    list_per_page = 20
    search_fields = ('theme', 'author')

class QuestionnarieContentAdmin(object):
    model_icon = 'fa fa-list'
    list_display = ('id','quesTheme','index','title','options','optionType')
    list_display_links = ('id',)
    list_filter = ('quesTheme', 'title', 'options','optionType')
    list_per_page = 20
    search_fields = ('title', 'options','optionType')


class QuestionnarieAnswerAdmin(object):
    model_icon = 'fa fa-list'
    list_display = ('id','quesTheme','quesContent', 'answer', 'name','department')
    list_display_links = ('id',)
    list_filter = ('id','quesTheme','quesContent', 'answer', 'name','department')
    list_per_page = 20
    search_fields = ('answer', 'name','department')


xadmin.site.register(QuestionnarieTheme, QuestionnarieThemeAdmin)
xadmin.site.register(QuestionnarieContent, QuestionnarieContentAdmin)
xadmin.site.register(QuestionnarieAnswer, QuestionnarieAnswerAdmin)
