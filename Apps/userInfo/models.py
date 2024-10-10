from django.db import models
from common.models import Project
from django.contrib.auth.models import AbstractUser

# Create your models here.

class Department(models.Model):
    code = models.CharField(primary_key=True,max_length=128, verbose_name=u'代号')
    name = models.CharField(max_length=128, verbose_name=u'名称')
    email = models.EmailField( verbose_name=u'邮箱')
    projects = models.ManyToManyField(Project,blank=True, verbose_name=u'专案权限')
    subDepartments = models.TextField(null=True,blank=True, verbose_name=u'下属部门')

    class Meta:
        verbose_name = u'部门'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.code

class User(AbstractUser):
    GENDER = (
        ('male',  u'男'),
        ('female', u'女'),
    )
    workID = models.CharField(max_length=32, verbose_name=u'工号')
    gender = models.CharField(max_length=10, choices=GENDER, null=True, blank=True, default='', verbose_name=u'性别')
    mobile = models.CharField(max_length=32, default='', null=True, blank=True, verbose_name=u'手机')
    mvpn = models.CharField(max_length=32,  default='', null=True, blank=True, verbose_name=u'简码')
    position = models.CharField(max_length=32, default='', null=True, blank=True, verbose_name=u'职位')
    imageAddress=models.CharField(max_length=200,verbose_name=u'头像地址',null=True, blank=True)
    department = models.ForeignKey(Department,on_delete=models.CASCADE, null=True, blank=True, verbose_name=u'部门')
    projects = models.ManyToManyField(Project, blank=True, verbose_name=u'专案')
    favor_project = models.ForeignKey(Project,related_name='favorProject',on_delete=models.CASCADE, null=True, blank=True,  verbose_name=u'喜爱的专案')

    class Meta:
        verbose_name = u'用户'
        verbose_name_plural = verbose_name


    @property
    def info(self):
        return '%s %s' %(self.username, self.workID)

    @property
    def displayName(self):
        return '%s%s' %(self.last_name, self.first_name)

    @property
    def list_projects(self):
        myProjects = []
        for project in self.projects.all():
            myProjects.append(str(project))
        return myProjects

    @property
    def str_projects(self):
        myProjects = []
        for project in self.projects.all():
            myProjects.append(str(project))
        return ' '.join(myProjects)

    def __str__(self):
        return self.username

class Report(models.Model):
    fatory = models.CharField(max_length=64, verbose_name=u'工厂名称')
    projectBuildStage = models.CharField(max_length=128, verbose_name=u'专案-阶段')
    station = models.CharField(max_length=128, verbose_name=u'站位')
    status = models.CharField(max_length=64, null=True, blank=True, verbose_name=u'任务状态')
    category = models.CharField(max_length=128,null=True, blank=True, verbose_name=u'工作分类')
    Description=models.TextField(null=True,blank=True, verbose_name=u'工作描述')
    cocoDRI = models.CharField(max_length=128,null=True, blank=True, verbose_name=u'coco')
    radarNumber = models.CharField(max_length=64,null=True, blank=True, verbose_name=u'雷达号')
    author = models.CharField(max_length=64, verbose_name=u'author')
    note = models.TextField(null=True,blank=True, verbose_name=u'备注')
    updateTime = models.DateTimeField(auto_now=True, verbose_name=u'更新时间')

    class Meta:
        verbose_name = u'新人报告'
        verbose_name_plural = verbose_name



