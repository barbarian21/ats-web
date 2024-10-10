import xadmin

from .models import *


class ActionAdmin(object):
	model_icon = 'fa fa-wrench'
	list_display = ('project', 'station_category', 'radar', 'title', 'DRI', 'status', 'remark', 'functions', 'update_time', 'add_time', 'author')
	list_display_links = ('project',)
	list_filter = ('project',)
	search_fields = ('station_category', 'radar', 'title', 'DRI', 'status', 'remark', 'functions', 'author')
	list_per_page = 10


class IssueAdmin(object):
	model_icon = 'fa fa-wrench'
	list_display = ('project', 'station_category', 'category', 'station', 'failure_count', 'description', 'root_cause', 'ETA', 'radar', 'DRI', 'functions', 'update_time', 'add_time', 'author')
	list_display_links = ('project',)
	list_filter = ('project',)
	search_fields = ('station_category', 'category', 'failure_count', 'description', 'root_cause', 'ETA', 'radar', 'DRI', 'functions', 'author')
	list_per_page = 10


class ErsDocAdmin(object):
	model_icon = 'fa fa-wrench'
	list_display = ('project', 'station_category', 'component', 'radar', 'title', 'cocoDRI', 'remark', 'update_time', 'add_time', 'author')
	list_display_links = ('project',)
	list_filter = ('project',)
	search_fields = ('station_category', 'component', 'radar', 'title', 'cocoDRI', 'remark', 'author')
	list_per_page = 10


class HandoverAdmin(object):
	model_icon = 'fa fa-wrench'
	list_display = ('project', 'station_category', 'content', 'status', 'update_time', 'add_time', 'author')
	list_display_links = ('project',)
	list_filter = ('project',)
	search_fields = ('station_category', 'content', 'status', 'author')
	list_per_page = 10


class TCRadarAdmin(object):
	model_icon         = 'fa fa-wrench'
	list_display       = ('project', 'station_category', 'station', 'radar', 'title', 'version', 'update_time', 'add_time', 'author')
	list_display_links = ('project',)
	list_filter        = ('project',)
	search_fields      = ('station_category', 'radar', 'title', 'version', 'author')
	list_per_page      = 10


xadmin.site.register(Action  , ActionAdmin)
xadmin.site.register(Issue   , IssueAdmin)
xadmin.site.register(ErsDoc  , ErsDocAdmin)
xadmin.site.register(Handover, HandoverAdmin)
xadmin.site.register(TCRadar, TCRadarAdmin)
