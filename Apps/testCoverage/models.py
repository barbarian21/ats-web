from django.db import models
from common.models import Project,Station
# Create your models here.

class TestCoverage(models.Model):
    id = models.AutoField(primary_key=True,verbose_name="主键")
    # project = models.CharField(max_length=64,null=True, blank=True, verbose_name=u'专案')
    # station = models.CharField( max_length=64,null=True, blank=True, verbose_name=u'站位')
    project =models.ForeignKey(Project, on_delete=models.CASCADE, null=True, blank=True, verbose_name=u'专案')
    station = models.ForeignKey(Station, on_delete=models.CASCADE, null=True, blank=True, verbose_name=u'站位')
    branch=models.CharField(max_length=64,verbose_name="分支")
    test_name=models.CharField(max_length=64,null=True,blank=True,verbose_name="测项名")
    technology=models.CharField(max_length=64,null=True,blank=True,verbose_name="分类")
    stop_on_fail=models.BooleanField(default=False,verbose_name="失败停止测试")
    disable=models.BooleanField(default=False,verbose_name="禁用")
    mp=models.BooleanField(default=False)
    eng = models.BooleanField(default=False)
    rel = models.BooleanField(default=False)
    grr = models.BooleanField(default=False)
    lower_limit = models.CharField(max_length=64,verbose_name="下限")
    upper_limit = models.CharField(max_length=64,verbose_name="上限")
    relaxed_lower_limit = models.CharField(max_length=64,verbose_name="COF下限")
    relaxed_upper_limit = models.CharField(max_length=64,verbose_name="COF上限")
    units=models.CharField(max_length=64,verbose_name="单位")
    pattern=models.CharField(max_length=64,verbose_name="正则")
    materialKey=models.CharField(max_length=64)
    materialValue=models.CharField(max_length=64)
    logic=models.TextField(null=True,blank=True,verbose_name="逻辑")
    description=models.TextField(max_length=200,null=True,blank=True,default="",verbose_name="描述")
    remark=models.TextField(null=True,blank=True,default="",verbose_name="标注")
    update_time=models.DateTimeField(auto_now=True,verbose_name="最后更新时间")
    add_time=models.DateTimeField(auto_now_add=True,verbose_name="添加时间")

    def __str__(self):
        return "test coverage"

    class Meta:
        indexes = [
            models.Index(fields=['project','station','branch','test_name','description']),
        ]