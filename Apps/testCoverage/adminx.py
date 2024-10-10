import xadmin
from .models import *

class TestCoverageAdmin(object):
    list_display = ('id', 'project', 'station','branch', 'test_name','technology', 'stop_on_fail','disable','mp',
                    'eng','rel','grr','lower_limit','upper_limit','units','pattern','description','remark',
                    'update_time','add_time')
    list_display_links = ('test_name',)
    list_filter = ('project', 'station','branch', 'test_name','add_time','update_time')
    list_per_page = 200
    search_fields = ('test_name','technology')
    show_detail_fields=['test_name']
    model_icon = 'fa fa-list-alt'

xadmin.site.register(TestCoverage,TestCoverageAdmin)

