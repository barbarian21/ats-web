from django.db import models


'''
厂区 => 服务器 => 线体 => 站位
产品
邮件
紧急联系人
'''


# 厂区
class Factory(models.Model):
	name = models.CharField(max_length=32, null=True, blank=True, verbose_name=u'站点名称')
	update_time = models.DateTimeField(auto_now=True, verbose_name=u'更新时间')
	add_time = models.DateTimeField(auto_now_add=True, verbose_name=u'创建时间')

	class Meta:
		verbose_name = u'站点信息'
		verbose_name_plural = verbose_name

	def __str__(self):
		return self.name


# 服务器
class Server(models.Model):
	name = models.CharField(max_length=64, null=True, blank=True, verbose_name=u'服务器名称')
	address = models.CharField(max_length=256, null=True, blank=True, verbose_name=u'服务器地址')
	update_time = models.DateTimeField(auto_now=True, verbose_name=u'更新时间')
	add_time = models.DateTimeField(auto_now_add=True, verbose_name=u'创建时间')
	# 外键
	factory = models.ForeignKey(Factory, on_delete=models.CASCADE, verbose_name=u'所属站点')

	class Meta:
		verbose_name = u'服务器信息'
		verbose_name_plural = verbose_name

	def __str__(self):
		return self.name


# 线体
class Line(models.Model):
	name = models.CharField(max_length=512, null=True, blank=True, verbose_name=u'线体名称')
	update_time = models.DateTimeField(auto_now=True, verbose_name=u'更新时间')
	add_time = models.DateTimeField(auto_now_add=True, verbose_name=u'创建时间')
	# 外键
	server = models.ForeignKey(Server, on_delete=models.CASCADE, verbose_name=u'所属服务器')

	class Meta:
		verbose_name = u'线体信息'
		verbose_name_plural = verbose_name

	def __str__(self):
		return self.name


# 站位
class Station(models.Model):
	name = models.CharField(max_length=256, null=True, blank=True, verbose_name=u'站位名称')
	update_time = models.DateTimeField(auto_now=True, verbose_name=u'更新时间')
	add_time = models.DateTimeField(auto_now_add=True, verbose_name=u'创建时间')
	# 外键
	line = models.ForeignKey(Line, on_delete=models.CASCADE, verbose_name=u'所属线体')

	class Meta:
		verbose_name = u'站位信息'
		verbose_name_plural = verbose_name

	def __str__(self):
		return self.name


# 产品
class Product(models.Model):
	name = models.CharField(max_length=32, null=True, blank=True, verbose_name=u'产品名称')
	update_time = models.DateTimeField(auto_now=True, verbose_name=u'更新时间')
	add_time = models.DateTimeField(auto_now_add=True, verbose_name=u'创建时间')

	class Meta:
		verbose_name = u'产品信息'
		verbose_name_plural = verbose_name

	def __str__(self):
		return self.name


# 邮件
class Email(models.Model):
	from_people = models.CharField(max_length=512, null=True, blank=True, verbose_name=u'发信人')
	to_people = models.CharField(max_length=512, null=True, blank=True, verbose_name=u'收信人')
	cc = models.TextField(null=True, blank=True, verbose_name=u'抄送')
	subject = models.CharField(max_length=512, null=True, blank=True, verbose_name=u'主题')
	content = models.TextField(null=True, blank=True, verbose_name=u'内容')
	appendix = models.CharField(max_length=2048, null=True, blank=True, verbose_name=u'附件')
	update_time = models.DateTimeField(auto_now=True, verbose_name=u'更新时间')
	add_time = models.DateTimeField(auto_now_add=True, verbose_name=u'创建时间')

	class Meta:
		verbose_name = u'邮件信息'
		verbose_name_plural = verbose_name

	def __str__(self):
		return self.subject


# 紧急联系人
class Emergency(models.Model):
	name = models.CharField(max_length=64, null=True, blank=True, verbose_name=u'姓名')
	iphone = models.CharField(max_length=11, null=True, blank=True, verbose_name=u'手机号')
	duty_time = models.CharField(max_length=32, null=True, blank=True, verbose_name=u'工作时间')
	sign = models.CharField(max_length=32, null=True, blank=True, verbose_name=u'班别')
	team = models.CharField(max_length=32, null=True, blank=True, verbose_name=u'所属团队')
	priority = models.SmallIntegerField(null=True, blank=True, verbose_name=u'优先级')
	update_time = models.DateTimeField(auto_now=True, verbose_name=u'更新时间')
	add_time = models.DateTimeField(auto_now_add=True, verbose_name=u'创建时间')

	class Meta:
		verbose_name = u'联系人信息'
		verbose_name_plural = verbose_name

	def __str__(self):
		return self.name


class Osx(models.Model):
	name = models.CharField(max_length=1024, null=True, blank=True, verbose_name=u'OSX IMAGE')
	series = models.CharField(max_length=1024, null=True, blank=True, verbose_name=u'系列')
	update_time = models.DateTimeField(auto_now=True, verbose_name=u'更新时间')
	add_time = models.DateTimeField(auto_now_add=True, verbose_name=u'创建时间')

	class Meta:
		verbose_name = u'OSX IMAGE'
		verbose_name_plural = verbose_name

	def __str__(self):
		return self.name


class Build(models.Model):
	name = models.CharField(max_length=256, null=True, blank=True, verbose_name=u'Build Stage')
	update_time = models.DateTimeField(auto_now=True, verbose_name=u'更新时间')
	add_time = models.DateTimeField(auto_now_add=True, verbose_name=u'创建时间')

	class Meta:
		verbose_name = u'Build Stage'
		verbose_name_plural = verbose_name

	def __str__(self):
		return self.name


class Ps(models.Model):
	page = models.CharField(max_length=256, null=True, blank=True, verbose_name=u'页面标题')
	name = models.CharField(max_length=256, null=True, blank=True, verbose_name=u'页面别名')
	content = models.TextField(null=True, blank=True, verbose_name=u'备注内容')
	update_time = models.DateTimeField(auto_now=True, verbose_name=u'更新时间')
	add_time = models.DateTimeField(auto_now_add=True, verbose_name=u'创建时间')

	class Meta:
		verbose_name = u'提示信息'
		verbose_name_plural = verbose_name

	def __str__(self):
		return self.page

# 人员权限表
class Permission(models.Model):
	name = models.CharField(max_length=64, null=True, blank=True, verbose_name=u'姓名')
	update_time = models.DateTimeField(auto_now=True, verbose_name=u'更新时间')
	add_time = models.DateTimeField(auto_now_add=True, verbose_name=u'创建时间')

	class Meta:
		verbose_name = u'人员权限'
		verbose_name_plural = verbose_name

	def __str__(self):
		return self.name
