from django.db import models
from common.models import Project, Stage, Station
from userInfo.models import User

# Create your models here.


class Audit(models.Model):
    
    issueCategory = models.CharField(max_length=1024, null=True, blank=True, verbose_name=u'问题分类')
    ERS = models.CharField(max_length=1024, null=True, blank=True, verbose_name=u'ERS')
    version = models.CharField(max_length=1024, null=True, blank=True, verbose_name=u'版本')
    issueDescription = models.TextField(null=True, blank=True, verbose_name=u'问题描述')
    status = models.CharField(max_length=1024, null=True, blank=True, verbose_name=u'任务状态')
    addTime = models.DateTimeField(auto_now_add=True, verbose_name=u'创建时间')
    updateTime = models.DateTimeField(auto_now=True, verbose_name=u'更新时间')
    style = models.TextField(null=True, blank=True, verbose_name=u'样式')

    # 通过外键关联的字段
    project = models.ForeignKey(Project, on_delete=models.CASCADE, verbose_name=u'专案')
    stage = models.ForeignKey(Stage, on_delete=models.CASCADE, verbose_name=u'阶段', null=True, blank=True)
    auditDRI = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name=u'DRI')
    
    # 多对多
    station = models.ManyToManyField(Station, verbose_name=u'站位', blank=True)
    
    class Meta:
        verbose_name = u'AuditInfo'
        verbose_name_plural = verbose_name
    
    def __str__(self):
        return str(self.auditDRI)

    __repr__ = __str__

    
class ReplyAudit(models.Model):
 
    replyMessage = models.TextField(null=True, blank=True, verbose_name=u'回复信息')
    addTime = models.DateTimeField(auto_now_add=True, verbose_name=u'创建时间')
    updateTime = models.DateTimeField(auto_now=True, verbose_name=u'更新时间')
    style = models.TextField(null=True, blank=True, verbose_name=u'样式')
    # 通过外键关联的字段
    audit = models.ForeignKey(Audit, on_delete=models.CASCADE, verbose_name=u'Audit')
    replyUser = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name=u'回复人')

    class Meta:
        verbose_name = u'ReplyAuditInfo'
        verbose_name_plural = verbose_name

    def __str__(self):
        return str(self.replyUser) + ' : ' + str(self.replyMessage)
    
    __repr__ = __str__
    
class MailNoteTask(models.Model):
    isActive = models.BooleanField(verbose_name=u'是否启用')
    # 符合条件时要执行的函数
    callFunctin = models.CharField(max_length=100, verbose_name=u'调用函数')
    # hours, day, month, week
    timeDescription = models.TextField(verbose_name=u'时间描述',default='9,0,0,1')
    isTimer = models.BooleanField(verbose_name=u'定时任务')
    endTime = models.DateTimeField(verbose_name=u'终止时间')
    count = models.IntegerField(default=-1, verbose_name=u'剩余执行次数')
    emailTo = models.EmailField(verbose_name=u'接收人')
    emailCC = models.CharField(max_length=500, default='', null=True, blank=True, verbose_name=u'抄送')
    emailSubject = models.CharField(max_length=200, default='', null=True, blank=True, verbose_name=u'邮件标题')
    emailTitle = models.TextField(null=True, blank=True, verbose_name=u'邮件开头')
    addTime = models.DateTimeField(auto_now_add=True, verbose_name=u'创建时间')
    updateTime = models.DateTimeField(auto_now=True, verbose_name=u'更新时间')
    
    # 通过外键关联的字段
    project = models.ForeignKey(Project, on_delete=models.CASCADE, null=True, blank=True, verbose_name=u'专案')

    class Meta:
        verbose_name = u'MailNoteTask'
        verbose_name_plural = verbose_name