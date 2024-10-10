import xadmin
from .models import *

class MacAppsAdmin(object):
    list_display = ('id', 'number', 'user', 'attention','group','uploadTime','isUpload')
    list_display_links = ('number')
    list_filter = ('number', 'user', 'attention','group')
    list_per_page = 20
    search_fields = ('number', 'user', 'attention','group')
    show_detail_fields=['number', 'user']
    model_icon = 'fa fa-list-alt'

class WhiteListAdmin(object):
    list_display = ('id', "name")
    list_display_links = ("name")
    list_per_page = 20
    search_fields = ('id','name')
    show_detail_fields=['name']
    model_icon = 'fa fa-list-alt'


class MessageBoardAdmin(object):
    list_display = ('id', 'title', 'message', 'time','user')
    list_display_links = ('title')
    list_filter = ('title', 'message', 'time','user')
    list_per_page = 20
    search_fields = ('title', 'message', 'time','user')
    show_detail_fields=['title','message']
    model_icon = 'fa fa-list-alt'


class MessageBoard_ReplyAdmin(object):
    list_display = ('id', 'replyMessage', 'replyTime', 'replyUser','leaveMessage')
    list_display_links = ('replyMessage')
    list_filter = ('replyMessage', 'replyTime', 'replyUser')
    list_per_page = 20
    search_fields = ('replyMessage', 'replyTime', 'replyUser')
    show_detail_fields=['replyMessage']
    model_icon = 'fa fa-list-alt'

class GrrSheetAdmin(object):
    list_display = ('id', 'project', 'station', 'radar','overlay','grrVer','toolVer','user','time','remark')
    list_display_links = ('station')
    list_filter = ('station', 'radar', 'time','user')
    list_per_page = 20
    search_fields = ('station', 'radar', 'time','user')
    show_detail_fields=['station','radar']
    model_icon = 'fa fa-list-alt'

class OverlaySheetAdmin(object):
    list_display = ('id', 'project', 'station', 'radar','overlay','baseOn','changeNote','user','time','remark')
    list_display_links = ('station')
    list_filter = ('station', 'radar', 'time','user')
    list_per_page = 20
    search_fields = ('station', 'radar', 'time','user')
    show_detail_fields=['station','radar']
    model_icon = 'fa fa-list-alt'


xadmin.site.register(WhiteList,WhiteListAdmin)
xadmin.site.register(MacApps,MacAppsAdmin)
xadmin.site.register(MessageBoard,MessageBoardAdmin)
xadmin.site.register(MessageBoard_Reply,MessageBoard_ReplyAdmin)
xadmin.site.register(GrrSheet,GrrSheetAdmin)
xadmin.site.register(OverlaySheet,OverlaySheetAdmin)

