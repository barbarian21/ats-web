from django.db import models
from common.models import Project, Station, Stage

# Create your models here.

class StationTrack(models.Model):
    id = models.AutoField(primary_key=True)
    project = models.ForeignKey(Project,null=True, on_delete = models.CASCADE)
    stage = models.ForeignKey(Stage,null=True, on_delete = models.CASCADE)
    station_name = models.ForeignKey(Station, null=True,on_delete = models.CASCADE)
    station_quantity = models.TextField(null=True, blank=True)
    Overlay_Version = models.CharField(max_length=512)
    GRR = models.CharField(max_length=1024)
    cofList = models.TextField(null=True, blank=True)
    Setup_Issue_Remark = models.TextField(null=True, blank=True)
    Daily_Issue_describe = models.TextField(null=True, blank=True)
    style = models.TextField(null=True, blank=True)
    update_time = models.DateTimeField(auto_now=True)
    add_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "QTx Station Setup"


