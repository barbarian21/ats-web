import xadmin
from .models import *


class DepartmentAdmin(object):
    list_display = ('code', 'name', 'email','subDepartments', 'projects',)
    list_display_links = ('code',)
    list_filter = ('code', 'name', 'email','subDepartments', 'projects',)
    list_per_page = 20
    search_fields = ('code', 'name', 'email',)
    model_icon = 'fa fa-user'

class UserAdmin(object):
    model_icon = 'fa fa-user'
    list_display = ('workID', 'username','last_name','first_name','email', 'mvpn', 'department','imageAddress','projects','mobile','position','is_active',)
    list_display_links = ('workID','username',)
    list_filter = ('last_login','is_superuser','username','first_name','last_name','email','is_staff','is_active','date_joined','workID','gender','mobile','mvpn','position','department','favor_project','projects',)
    list_per_page = 20
    search_fields = ('is_superuser','username','first_name','last_name','email','is_staff','is_active','workID','gender','mobile','mvpn','position',)

class ReportAdmin(object):
    list_display = ('fatory', 'projectBuildStage','station','status','category', 'Description', 'cocoDRI','radarNumber','author','note','updateTime',)
    list_display_links = ('Description',)
    list_filter = ('fatory','projectBuildStage','station','status','category','cocoDRI','radarNumber','author','updateTime',)
    list_per_page = 20
    search_fields = ('fatory','projectBuildStage','station','status','category','cocoDRI','radarNumber','author','updateTime',)


xadmin.site.register(Department,DepartmentAdmin)
xadmin.site.unregister(User)
xadmin.site.register(User, UserAdmin)
xadmin.site.register(Report, ReportAdmin)
