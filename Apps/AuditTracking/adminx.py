import xadmin

from .models import *


class AuditAdmin(object):
    model_icon = 'fa fa-wrench'
    list_display = (
    'project', 'issueCategory', 'status', 'ERS', 'station', 'version', 'issueDescription', 'auditDRI', 'updateTime',
    'addTime', 'style')
    list_display_links = ('project',)
    list_filter = ('project',)
    search_fields = ('issueCategory', 'status', 'ERS', 'version', 'issueDescription',)
    list_per_page = 10


class ReplyAuditAdmin(object):
    model_icon = 'fa fa-wrench'
    list_display = ('audit', 'replyUser', 'replyMessage', 'updateTime', 'addTime', 'style')
    list_display_links = ('audit',)
    list_filter = ('audit',)
    search_fields = ('replyMessage',)
    list_per_page = 10
    

class MailNoteTaskAdmin(object):
    model_icon = 'fa fa-wrench'
    list_display = ('project','isActive', 'timeDescription', 'isTimer', 'endTime', 'count', 'emailTo', 'emailCC', 'emailSubject', 'emailTitle', 'addTime')
    list_display_links = ('project',)
    list_filter = ('project',)
    search_fields = ('isActive', 'timeDescription', 'isTimer','count', 'emailTo', 'emailCC', 'emailSubject', 'emailTitle')
    list_per_page = 10


xadmin.site.register(Audit, AuditAdmin)
xadmin.site.register(ReplyAudit, ReplyAuditAdmin)
xadmin.site.register(MailNoteTask, MailNoteTaskAdmin)
