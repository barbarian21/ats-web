from django.db import models

from common.models import Project, Stage, Station


class Action(models.Model):
	# 任务状态
	STATUSES = (
		('New'          , 'New'),
		('Ongoing'      , 'Ongoing'),
		('Keep monitor' , 'Keep monitor'),
		('Close'        , 'Close'),
		('Done'         , 'Done'),
	)
	# 是否需要highlight
	IS_HIGHLIGHT = (
		(True , '是'),
		(False, '否'),
	)

	radar = models.CharField(max_length=1024, null=True, blank=True, verbose_name=u'雷达号')
	status = models.CharField(max_length=1024, null=True, blank=True, verbose_name=u'任务状态')
	functions = models.CharField(max_length=1024, null=True, blank=True, verbose_name=u'执行函数')
	title = models.CharField(max_length=1024, null=True, blank=True, verbose_name=u'标题')
	remark = models.TextField(null=True, blank=True, verbose_name=u'标注')
	DRI = models.CharField(max_length=1024, null=True, blank=True, verbose_name=u'负责人')
	is_highlight = models.BooleanField(choices=IS_HIGHLIGHT, null=True, blank=True, verbose_name=u'是否需要highlight')
	style = models.TextField(null=True, blank=True, verbose_name=u'样式')
	author = models.CharField(max_length=256, null=True, blank=True, verbose_name=u'作者')
	add_time = models.DateTimeField(auto_now_add=True, verbose_name=u'创建时间')
	update_time = models.DateTimeField(auto_now=True, verbose_name=u'更新时间')
	station_category = models.CharField(max_length=256, null=True, blank=True, verbose_name=u'站位分类')
	# 通过外键关联的字段
	project = models.ForeignKey(Project, on_delete=models.CASCADE, verbose_name=u'专案')
	stage = models.ForeignKey(Stage, on_delete=models.CASCADE, verbose_name=u'阶段', null=True, blank=True)
	station = models.ForeignKey(Station, on_delete=models.CASCADE, verbose_name=u'站位', null=True, blank=True)

	class Meta:
		verbose_name = u'任务信息'
		verbose_name_plural = verbose_name
	
	def __str__(self):
		return u'任务信息'


class Issue(models.Model):
	# 问题分类
	CATEGORIES = (
		('New issue'    , 'New issue'),
		('Retest issue' , 'Retest issue'),
		('Known issue'  , 'Known issue'),
		('Close issue'  , 'Close issue'),
		('Fixed issue'  , 'Fixed issue'),
	)
	# 是否需要highlight
	IS_HIGHLIGHT = (
		(True , '是'),
		(False, '否'),
	)

	radar = models.CharField(max_length=1024, null=True, blank=True, verbose_name=u'雷达号')
	category = models.CharField(max_length=1024, null=True, blank=True, verbose_name=u'问题分类')
	functions = models.CharField(max_length=1024, null=True, blank=True, verbose_name=u'执行函数')
	failure_count = models.CharField(max_length=1024, null=True, blank=True, verbose_name=u'失败机台数量')
	description = models.TextField(null=True, blank=True, verbose_name=u'问题描述')
	root_cause = models.TextField(null=True, blank=True, verbose_name=u'产生原因')
	action = models.TextField(null=True, blank=True, verbose_name=u'解决动作')
	ETA = models.CharField(max_length=256, null=True, blank=True, verbose_name=u'预计解决日期')
	DRI = models.CharField(max_length=1024, null=True, blank=True, verbose_name=u'负责人')
	is_highlight = models.BooleanField(choices=IS_HIGHLIGHT, null=True, blank=True, verbose_name=u'是否需要highlight')
	style = models.TextField(null=True, blank=True, verbose_name=u'样式')
	author = models.CharField(max_length=256, null=True, blank=True, verbose_name=u'作者')
	add_time = models.DateTimeField(auto_now_add=True, verbose_name=u'创建时间')
	update_time = models.DateTimeField(auto_now=True, verbose_name=u'更新时间')
	station_category = models.CharField(max_length=256, null=True, blank=True, verbose_name=u'站位分类')
	# 通过外键关联的字段
	project = models.ForeignKey(Project, on_delete=models.CASCADE, verbose_name=u'专案')
	stage = models.ForeignKey(Stage, on_delete=models.CASCADE, verbose_name=u'阶段', null=True, blank=True)
	# 多对多
	station = models.ManyToManyField(Station, verbose_name=u'站位', blank=True)

	class Meta:
		verbose_name = u'问题信息'
		verbose_name_plural = verbose_name
	
	def __str__(self):
		return u'问题信息'


class ErsDoc(models.Model):
	radar = models.CharField(max_length=1024, null=True, blank=True, verbose_name=u'雷达号')
	title = models.CharField(max_length=1024, null=True, blank=True, verbose_name=u'标题')
	remark = models.TextField(null=True, blank=True, verbose_name=u'标注')
	component = models.CharField(max_length=1024, null=True, blank=True, verbose_name=u'分组')
	cocoDRI = models.CharField(max_length=1024, null=True, blank=True, verbose_name=u'负责人')
	mailCC = models.CharField(max_length=1024, null=True, blank=True)
	mailTo = models.CharField(max_length=1024, null=True, blank=True)
	style = models.TextField(null=True, blank=True, verbose_name=u'样式')
	author = models.CharField(max_length=256, null=True, blank=True, verbose_name=u'作者')
	add_time = models.DateTimeField(auto_now_add=True, verbose_name=u'创建时间')
	update_time = models.DateTimeField(auto_now=True, verbose_name=u'更新时间')
	station_category = models.CharField(max_length=256, null=True, blank=True, verbose_name=u'站位分类')
	# 通过外键关联的字段
	project = models.ForeignKey(Project, on_delete=models.CASCADE, verbose_name=u'专案')

	class Meta:
		verbose_name = u'ErsDoc信息'
		verbose_name_plural = verbose_name

	def __str__(self):
		return u'ErsDoc信息'


class Handover(models.Model):
	title = models.CharField(max_length=1024, null=True, blank=True, verbose_name=u'标题')
	content = models.TextField(null=True, blank=True, verbose_name=u'内容')
	status = models.TextField(null=True, blank=True, verbose_name=u'状态')
	style = models.TextField(null=True, blank=True, verbose_name=u'样式')
	author = models.CharField(max_length=256, null=True, blank=True, verbose_name=u'作者')
	add_time = models.DateTimeField(auto_now_add=True, verbose_name=u'创建时间')
	update_time = models.DateTimeField(auto_now=True, verbose_name=u'更新时间')
	station_category = models.CharField(max_length=256, null=True, blank=True, verbose_name=u'站位分类')
	# 通过外键关联的字段
	project = models.ForeignKey(Project, on_delete=models.CASCADE, verbose_name=u'专案')
	stage = models.ForeignKey(Stage, on_delete=models.CASCADE, verbose_name=u'阶段', null=True, blank=True)
	station = models.ForeignKey(Station, on_delete=models.CASCADE, verbose_name=u'站位', null=True, blank=True)

	class Meta:
		verbose_name = u'交接信息'
		verbose_name_plural = verbose_name

	def __str__(self):
		return u'交接信息'


class TCRadar(models.Model):
	station = models.CharField(max_length=256, null=True, blank=True, verbose_name=u'站位')
	radar = models.CharField(max_length=256, null=True, blank=True, verbose_name=u'雷达')
	title = models.CharField(max_length=1024, null=True, blank=True, verbose_name=u'标题')
	version = models.CharField(max_length=1024, null=True, blank=True, verbose_name=u'版本')
	author = models.CharField(max_length=256, null=True, blank=True, verbose_name=u'作者')
	add_time = models.DateTimeField(auto_now_add=True, verbose_name=u'创建时间')
	update_time = models.DateTimeField(auto_now=True, verbose_name=u'更新时间')
	station_category = models.CharField(max_length=256, null=True, blank=True, verbose_name=u'站位分类')
	style = models.TextField(null=True, blank=True, verbose_name=u'样式')
	# 外键
	project = models.ForeignKey(Project, on_delete=models.CASCADE, verbose_name=u'专案')

	class Meta:
		verbose_name = u'TCRadar信息'
		verbose_name_plural = verbose_name
	
	def __str__(self):
		return u'TCRadar信息'
