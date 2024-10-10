import xadmin

from .models import *


class FactoryAdmin(object):
	model_icon = 'fa fa-envelope'
	list_display = ('name', 'update_time', 'add_time')
	list_display_links = ('name',)
	list_filter = ('name',)
	search_fields = ('name',)
	list_per_page = 10


class ServerAdmin(object):
	model_icon = 'fa fa-envelope'
	list_display = ('name', 'address', 'factory', 'update_time', 'add_time')
	list_display_links = ('name',)
	list_filter = ('name',)
	search_fields = ('name',)
	list_per_page = 10


class LineAdmin(object):
	model_icon = 'fa fa-envelope'
	list_display = ('name', 'server', 'update_time', 'add_time')
	list_display_links = ('name',)
	list_filter = ('name',)
	search_fields = ('name',)
	list_per_page = 10


class StationAdmin(object):
	model_icon = 'fa fa-envelope'
	list_display = ('name', 'line', 'update_time', 'add_time')
	list_display_links = ('name',)
	list_filter = ('name',)
	search_fields = ('name',)
	list_per_page = 10


class ProductAdmin(object):
	model_icon = 'fa fa-envelope'
	list_display = ('name', 'update_time', 'add_time')
	list_display_links = ('name',)
	list_filter = ('name',)
	search_fields = ('name',)
	list_per_page = 10


class EmailAdmin(object):
	model_icon = 'fa fa-envelope'
	list_display = ('subject', 'from_people', 'to_people', 'cc', 'add_time')
	list_display_links = ('subject',)
	list_filter = ('subject',)
	search_fields = ('subject',)
	list_per_page = 10


class EmergencyAdmin(object):
	model_icon = 'fa fa-envelope'
	list_display = ('priority', 'name', 'iphone', 'duty_time', 'sign', 'team', 'update_time', 'add_time')
	list_display_links = ('name',)
	list_filter = ('name',)
	search_fields = ('name',)
	list_per_page = 10


class OsxAdmin(object):
	model_icon = 'fa fa-envelope'
	list_display = ('name', 'series', 'update_time', 'add_time')
	list_display_links = ('name',)
	list_filter = ('name',)
	search_fields = ('name',)
	list_per_page = 10


class BuildAdmin(object):
	model_icon = 'fa fa-envelope'
	list_display = ('name', 'update_time', 'add_time')
	list_display_links = ('name',)
	list_filter = ('name',)
	search_fields = ('name',)
	list_per_page = 10


class PsAdmin(object):
	model_icon = 'fa fa-envelope'
	list_display = ('name', 'page', 'content', 'update_time', 'add_time')
	list_display_links = ('name',)
	list_filter = ('name',)
	search_fields = ('name',)
	list_per_page = 10

class PermissionAdmin(object):
	model_icon = 'fa fa-envelope'
	list_display = ('name', 'update_time', 'add_time')
	list_display_links = ('name',)
	list_filter = ('name',)
	search_fields = ('name',)
	list_per_page = 10


xadmin.site.register(Factory,   FactoryAdmin)
xadmin.site.register(Server,    ServerAdmin)
xadmin.site.register(Line,      LineAdmin)
# xadmin.site.register(Station,   StationAdmin)
xadmin.site.register(Product,   ProductAdmin)
xadmin.site.register(Email,     EmailAdmin)
xadmin.site.register(Emergency, EmergencyAdmin)
xadmin.site.register(Osx,       OsxAdmin)
xadmin.site.register(Build,     BuildAdmin)
xadmin.site.register(Ps,     	PsAdmin)
xadmin.site.register(Permission,PermissionAdmin)
