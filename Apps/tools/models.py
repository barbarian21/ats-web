from django.db import models
from userInfo.models import User
from common.models import Project

# Create your models here.
class MacApps(models.Model):
    id = models.AutoField(primary_key=True,verbose_name="主键")
    number=models.CharField(max_length=60,verbose_name="财编")
    uploadTime=models.CharField(max_length=60,verbose_name="上传时间")
    isUpload=models.BooleanField(default=False,verbose_name="是否上传")
    attention=models.CharField(max_length=60,verbose_name="提醒人")
    group=models.CharField(max_length=60,verbose_name="课别")
    user=models.CharField(max_length=60,verbose_name="用户")
    mail=models.CharField(max_length=100,default='',verbose_name="邮箱")

    def __str__(self):
        return self.number

    class Meta:
        verbose_name = u'mac apps'
        verbose_name_plural = verbose_name

class WhiteList(models.Model):
    id = models.AutoField(primary_key=True,verbose_name="主键")
    name=models.CharField(max_length=120,verbose_name="AppName")
    
    def __str__(self):
        return self.name

    class Meta:
        verbose_name = u'white list'
        verbose_name_plural = verbose_name

class MessageBoard(models.Model):
    id = models.AutoField(primary_key=True,verbose_name="主键")
    message = models.TextField(null=True, blank=True, verbose_name=u"信息")
    title = models.CharField(max_length=150,verbose_name="标题")
    time = models.DateTimeField(verbose_name=u'留言时间',null=True,blank=True,auto_now=True)
    user = models.ForeignKey(User,on_delete=models.CASCADE,verbose_name=u'用户')
    # user=models.CharField(max_length=60,verbose_name="用户")
    def __str__(self):
        return self.title

    class Meta:
        verbose_name = u'Message Board'
        verbose_name_plural = verbose_name

class GrrSheet(models.Model):

    id = models.AutoField(primary_key=True,verbose_name="主键")
    project = models.ForeignKey(Project,null=True, on_delete = models.CASCADE)
    remark = models.TextField(null=True, blank=True, verbose_name=u"备注")
    radar = models.CharField(max_length=40,verbose_name="雷达")
    station = models.CharField(max_length=60,verbose_name="站位")
    overlay = models.CharField(max_length=200,verbose_name="Overlay版本")
    grrVer = models.CharField(max_length=200,verbose_name="Grr版本")
    toolVer = models.CharField(max_length=80,verbose_name="工具版本")
    time = models.DateTimeField(verbose_name=u'改动时间',null=True,blank=True,auto_now=True)
    user = models.ForeignKey(User,on_delete=models.CASCADE,verbose_name=u'用户')

    def __str__(self):
        return self.station

    class Meta:
        verbose_name = u'Grr_Sheet'
        verbose_name_plural = verbose_name

class OverlaySheet(models.Model):
    
    id = models.AutoField(primary_key=True,verbose_name="主键")
    project = models.ForeignKey(Project,null=True, on_delete = models.CASCADE)
    changeNote = models.TextField(null=True, blank=True, verbose_name=u"改动")
    radar = models.CharField(max_length=40,verbose_name="雷达")
    station = models.CharField(max_length=60,verbose_name="站位")
    overlay = models.CharField(max_length=200,verbose_name="Overlay版本")
    baseOn = models.CharField(max_length=200,verbose_name="基础版本")
    remark = models.CharField(max_length=200,verbose_name="备注")

    time = models.DateTimeField(verbose_name=u'改动时间',null=True,blank=True,auto_now=True)
    user = models.ForeignKey(User,on_delete=models.CASCADE,verbose_name=u'用户')

    def __str__(self):
        return self.station

    class Meta:
        verbose_name = u'Overlay_Sheet'
        verbose_name_plural = verbose_name

class MessageBoard_Reply(models.Model):
    id = models.AutoField(primary_key=True,verbose_name="主键")
    replyMessage = models.TextField(null=True, blank=True, verbose_name=u"回复信息")
    replyTime = models.DateTimeField(verbose_name=u'回复时间',null=True,blank=True,auto_now=True)
    # replyUser=models.CharField(max_length=60,verbose_name="用户")
    replyUser = models.ForeignKey(User,on_delete=models.CASCADE,verbose_name=u'用户')
    leaveMessage =models.ForeignKey(MessageBoard, on_delete=models.CASCADE, null=True, blank=True, verbose_name=u'留言信息')
    
    def __str__(self):
        return self.replyMessage

    class Meta:
        verbose_name = u'Message Board Reply'
        verbose_name_plural = verbose_name