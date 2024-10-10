import xadmin
from .models import *


class OverlayAdmin(object):
    model_icon = 'fa fa-list'
    list_display = ('project', 'stage', 'station', 'version', 'status', 'change_list', 'rollin_time',)
    list_display_links = ('project', 'stage', 'station','version',)
    list_filter = ('project', 'stage', 'station', 'version', 'based_on', 'core_overlay','radar', 'status', 'change_list', 'remark', 'rollin_time', 'update_time','add_time','author')
    list_per_page = 20
    search_fields = ('version', 'based_on', 'core_overlay','radar', 'status', 'change_list', 'remark','author')


class OverlayMailNoteAdmin(object):
    model_icon = 'fa fa-list'
    list_display = ('project', 'isNote', 'hours', 'emailTo', 'emailCC', 'emailSubject', 'emailTitle',)
    list_display_links = ('project',)
    list_filter = ('project', 'isNote', 'hours', 'emailTo', 'emailCC', 'emailSubject', 'emailTitle',)
    list_per_page = 20
    search_fields = ('hours', 'emailTo', 'emailCC', 'emailSubject', 'emailTitle',)


class OveralyTrackingRadarAdmin(object):
    model_icon = 'fa fa-list'
    list_display = ('project', 'station', 'radar', )
    list_display_links = ('station','radar')
    list_filter = ('project', 'station', 'radar', )
    list_per_page = 20
    search_fields = ('radar',)


xadmin.site.register(Overlay,OverlayAdmin)
xadmin.site.register(OverlayMailNote,OverlayMailNoteAdmin)
xadmin.site.register(OveralyTrackingRadar,OveralyTrackingRadarAdmin)

