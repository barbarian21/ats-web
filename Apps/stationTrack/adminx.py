import xadmin
from .models import *


class StationTrackAdmin(object):
    model_icon = 'fa fa-bookmark'
    list_display = ("id","project","stage","station_name","station_quantity","Overlay_Version",
											  "GRR","cofList","Setup_Issue_Remark","Daily_Issue_describe","update_time",'add_time')
    list_display_links = ("id","station_name")
    list_filter = ("id","project","stage","station_name","station_quantity","Overlay_Version",
											  "GRR","cofList","Setup_Issue_Remark","Daily_Issue_describe",)
    list_per_page = 20
    search_fields = ("id","station_quantity","Overlay_Version",
											  "GRR","cofList","Setup_Issue_Remark","Daily_Issue_describe",)

xadmin.site.register(StationTrack, StationTrackAdmin)

