from django.db import models

# Create your models here.


class Project(models.Model):
    STATUS = (
        ('MP', 'MP'),
        ('NPI', 'NPI'),
    )
    code = models.CharField(primary_key=True,max_length=30,verbose_name=u'代号',unique=True)
    name = models.CharField(max_length=30,verbose_name=u'名称',unique=True)
    email = models.EmailField(verbose_name=u'邮箱')
    status = models.CharField(max_length=30, choices=STATUS,verbose_name=u'状态')
    site = models.CharField(max_length=30,verbose_name=u'地点',null=True,blank=True, default='')
    description = models.TextField(verbose_name=u'描述',null=True,blank=True, default='')
    start_date = models.DateField(verbose_name=u'开始日期',null=True,blank=True)
    stop_date = models.DateField(verbose_name=u'结束日期',null=True,blank=True)


    class Meta:
        verbose_name = u'专案'
        verbose_name_plural=verbose_name

    def __str__(self):
        return self.code



class Station(models.Model):
    stationID = models.CharField(max_length=100,verbose_name=u'站位ID')
    name = models.CharField(max_length=100,verbose_name=u'站位名')
    script = models.CharField(max_length=100,verbose_name=u'脚本名')
    description = models.TextField(verbose_name=u'描述',null=True,blank=True,default='')
    category = models.CharField(max_length=100,verbose_name=u'分类')
    is_POR = models.BooleanField(default=False, verbose_name=u'POR站位')
    is_offline = models.BooleanField(default=False, verbose_name=u'Offline站位')
    add_time = models.DateTimeField(verbose_name=u'添加时间',auto_now_add=True)
    project = models.ManyToManyField(Project, blank=True, verbose_name=u'专案')

    class Meta:
        verbose_name = u'站位'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.script


class Stage(models.Model):
    name = models.CharField(max_length=100,verbose_name=u'阶段名',unique=True)
    description = models.TextField(verbose_name=u'描述',null=True,blank=True,default='')
    start_date = models.DateField(verbose_name=u'开始日期', null=True, blank=True)
    stop_date = models.DateField(verbose_name=u'结束日期', null=True, blank=True)
    project = models.ForeignKey(Project,on_delete=models.CASCADE, null=True, blank=True, verbose_name=u'专案')

    class Meta:
        verbose_name = u'阶段'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.name


class Coco(models.Model):
    name = models.CharField(max_length=100,verbose_name=u'姓名')
    email = models.EmailField(verbose_name=u'邮箱')
    group = models.CharField(max_length=100,verbose_name=u'组别')
    is_active = models.BooleanField(default=True, verbose_name=u'活跃')
    project = models.ManyToManyField(Project, verbose_name=u'专案')

    class Meta:
        verbose_name = u'客户'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.name


class Git(models.Model):
    GIT = (
        ('local-git', 'local-git'),
        ('hwte-git', 'hwte-git'),
    )
    id = models.AutoField(primary_key=True,verbose_name="主键")
    project =models.ForeignKey(Project, on_delete=models.CASCADE, null=True, blank=True, verbose_name=u'专案')
    git = models.CharField(max_length=50,choices=GIT,verbose_name=u'GIT类型',default='')
    branch=models.CharField(max_length=50,verbose_name=u'分支',null=True, blank=True)
    address=models.CharField(max_length=200,verbose_name=u'地址',null=True, blank=True)
    latestCommitId=models.CharField(max_length=200,verbose_name=u'最新的提交ID',null=True, blank=True)
    pullTime=models.DateTimeField(verbose_name=u'更新(pull)时间', auto_now=True,null=True, blank=True)

    class Meta:
        verbose_name = u'GIT'
        verbose_name_plural = verbose_name

    def __str__(self):
        return 'git'

