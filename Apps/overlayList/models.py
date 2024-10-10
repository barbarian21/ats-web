from django.db import models
from  common.models import Project, Station, Stage
# Create your models here.


class Overlay(models.Model):
    STATUS = (
        ('New', u'New'),
        ('Validation', u'Validation'),
        ('Online', u'Online'),
        ('Expire', u'Expire'),
        ('Damage', u'Damage'),
    )
    version = models.CharField(max_length=128, verbose_name=u'版本')
    based_on = models.CharField(null=True, blank=True, default='', max_length=128, verbose_name=u'基于版本')
    core_overlay = models.CharField(null=True, blank=True, default='', max_length=128, verbose_name=u'核心版本')
    based_on_core = models.CharField(null=True, blank=True, default='', max_length=128, verbose_name=u'基于核心版本')
    radar = models.CharField(max_length=30, verbose_name=u'radar')
    status = models.CharField(max_length=30, choices=STATUS, verbose_name=u'状态')
    change_list = models.TextField(null=True, blank=True,verbose_name=u'修改记录')
    remark = models.TextField(null=True, blank=True,verbose_name=u'标注')
    fixIssue = models.TextField(null=True, blank=True,default='',verbose_name=u'解决的问题')
    audit_DRI = models.CharField(max_length=30, null=True, blank=True,default='',verbose_name=u'GRR负责人')
    audit_time = models.DateTimeField(null=True, blank=True, verbose_name=u'GRR时间')
    rollin_time = models.DateTimeField(null=True, blank=True, verbose_name=u'上线时间')
    update_time = models.DateTimeField(auto_now=True, verbose_name=u'更新时间')
    add_time = models.DateTimeField(auto_now_add=True, verbose_name=u'添加时间')
    author = models.CharField(max_length=256, null=True, blank=True,default='',verbose_name=u'作者')
    isNote = models.BooleanField(verbose_name=u'是否通知', default = True)
    noteTimeout = models.IntegerField(verbose_name=u'超时通知',null=True)
    project = models.ForeignKey(Project,on_delete=models.CASCADE, null=True, blank=True,  verbose_name=u'专案')
    stage = models.ForeignKey(Stage,on_delete=models.CASCADE, null=True, blank=True,  verbose_name=u'阶段')
    station = models.ForeignKey(Station,on_delete=models.CASCADE, null=True, blank=True,  verbose_name=u'站位')

    class Meta:
        verbose_name = u'Overlay'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.version

    def statusList():
        return ['New','Validation','Online','Expire','Damage']


class OverlayMailNote(models.Model):
    project = models.ForeignKey(Project,on_delete=models.CASCADE, null=True, blank=True,  verbose_name=u'专案')
    isNote = models.BooleanField(verbose_name=u'是否通知')
    hours = models.IntegerField(verbose_name=u'超出时间(小时)',default=12)
    emailTo = models.EmailField(verbose_name=u'接收人')
    emailCC = models.CharField(max_length=500, default='', null=True, blank=True, verbose_name=u'抄送')
    emailSubject = models.CharField(max_length=200, default='', null=True, blank=True, verbose_name=u'邮件标题')
    emailTitle = models.TextField(null=True, blank=True,verbose_name=u'邮件开头')

    class Meta:
        verbose_name = u'OverlayMailNote'
        verbose_name_plural = verbose_name


class OveralyTrackingRadar(models.Model):
    project = models.ForeignKey(Project,on_delete=models.CASCADE, null=True, blank=True,  verbose_name=u'专案')
    station = models.ForeignKey(Station,on_delete=models.CASCADE, null=True, blank=True, verbose_name=u'站位')
    radar = models.CharField(max_length=200, default='', null=True, blank=True, verbose_name=u'radar')
    
    class Meta:
        verbose_name = u'OveralyTrackingRadar'
        verbose_name_plural = verbose_name