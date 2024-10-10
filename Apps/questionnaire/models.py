from django.db import models

# Create your models here.
class QuestionnarieTheme(models.Model):
    theme = models.CharField(max_length=300,verbose_name=u'主题')
    password = models.CharField(max_length=30,null=True, blank=True,default='',verbose_name=u'密码')
    add_time = models.DateTimeField(auto_now_add=True, verbose_name=u'添加时间')
    author = models.CharField(max_length=256, null=True, blank=True,default='',verbose_name=u'作者')
    isSign = models.BooleanField(default=False,verbose_name=u'是否署名')
    isActive = models.BooleanField(default=False,verbose_name=u'是否活跃')

    class Meta:
        verbose_name = u'问卷主题'
        verbose_name_plural=verbose_name

    def __str__(self):
        return self.theme

class QuestionnarieContent(models.Model):
    OPTIONTYPEs = (
        ('radio', u'radio'),
        ('checkbox', u'checkbox'),
        ('text', u'text'),
        ('textarea', u'textarea'),
    )
    quesTheme = models.ForeignKey(QuestionnarieTheme,on_delete=models.CASCADE, null=True, blank=True, verbose_name=u'主题')
    index = models.IntegerField(null=True,blank=True,verbose_name=u'序列')
    title = models.TextField(verbose_name=u'标题',null=True,blank=True,default='')
    options = models.TextField(verbose_name=u'选项',null=True,blank=True,default='')
    optionType = models.CharField(max_length=25, choices=OPTIONTYPEs, default='radio',verbose_name=u'选项类型')

    class Meta:
        verbose_name = u'问卷内容'
        verbose_name_plural=verbose_name

    def __str__(self):
        return self.title
    
    def optionTypeList():
        return ['radio','checkbox','text','textarea']

class QuestionnarieAnswer(models.Model):
    quesTheme = models.ForeignKey(QuestionnarieTheme,on_delete=models.CASCADE, null=True, blank=True, verbose_name=u'主题')
    quesContent = models.ForeignKey(QuestionnarieContent,on_delete=models.CASCADE, null=True, blank=True, verbose_name=u'内容')
    answer = models.TextField(null=True,blank=True,default='',verbose_name=u'答案')
    rawAnswer = models.TextField(verbose_name=u'提交原始答案',null=True,blank=True,default='')
    index = models.IntegerField(null=True,blank=True,verbose_name=u'序列')
    name = models.CharField(max_length=50, null=True, blank=True,default='',verbose_name=u'姓名')
    department = models.CharField(max_length=50, null=True, blank=True,default='',verbose_name=u'部门')
    ipAddress = models.CharField(max_length=50, null=True, blank=True,default='',verbose_name=u'电脑标识')
    add_time = models.DateTimeField(auto_now_add=True, verbose_name=u'添加时间')

    class Meta:
        verbose_name = u'问卷答案'
        verbose_name_plural=verbose_name

    def __str__(self):
        return self.answer

