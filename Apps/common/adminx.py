import xadmin
from .models import *
from xadmin.views import BaseAdminView
from xadmin.views import CommAdminView


#设置主题
class ThemeAdmin(object):
    enable_themes=True
    use_bootswatch=True


#网页头部导航标题 底部信息
class GlobalSetting(object):
    site_title='ATS网站后台管理'
    site_footer='PEGA-ATS'
    menu_style='accordion'


class ProjectAdmin(object):
    list_display = ('code', 'name', 'email','site', 'status', 'description','start_date','stop_date')
    list_display_links = ('code','name')
    list_filter = ('code', 'name', 'email','site', 'status', 'description','start_date','stop_date')
    list_per_page = 20
    search_fields = ('code', 'name', 'email','site', 'status', 'description')


class StationAdmin(object):
    list_display = ('stationID', 'name', 'script', 'description', 'category', 'is_POR', 'is_offline', 'add_time', 'project')
    list_display_links = ('stationID', 'name')
    list_filter = ('stationID', 'name', 'script', 'description', 'category', 'is_POR', 'is_offline', 'add_time', 'project')
    list_per_page = 20
    search_fields = ('stationID', 'name', 'script', 'description', 'category',)


class StageAdmin(object):
    list_display = ('name', 'description', 'start_date', 'stop_date', 'project',)
    list_display_links = ('name', )
    list_filter = ('name', 'description', 'start_date', 'stop_date', 'project',)
    list_per_page = 20
    search_fields = ('name', 'description',)


class CocoAdmin(object):
    list_display = ('name', 'email', 'group', 'is_active', 'project',)
    list_display_links = ('name','email' )
    list_filter = ('name', 'email', 'group', 'is_active', 'project',)
    list_per_page = 20
    search_fields = ('name', 'email', 'group',)


class GitAdmin(object):
    list_display = ('id', 'project', 'git','address','branch','latestCommitId','pullTime')
    list_display_links = ('id','project')
    list_filter = ('project', 'git', 'branch',)
    list_per_page = 20
    search_fields = ('project', 'git')


# xadmin.site.register(BaseAdminView,ThemeAdmin)
xadmin.site.register(CommAdminView, GlobalSetting)
xadmin.site.register(Project, ProjectAdmin)
xadmin.site.register(Station, StationAdmin)
xadmin.site.register(Stage, StageAdmin)
xadmin.site.register(Coco, CocoAdmin)
xadmin.site.register(Git, GitAdmin)
