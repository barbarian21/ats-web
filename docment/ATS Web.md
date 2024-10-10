# ATS Web

## 简介

ATS  Web是用于收集和管理专案信息，人员信息，提高工作效率的自动化办公系统

## 开发环境

Python ： 3.7

MySQL :  Ver 14.14 Distrib 5.7.19, for Linux	(Ver 8.0.16 for osx10.13)

Django==2.2.2

### xadmin

django-crispy-forms==1.7.2   

django-import-export==1.2.0   

django-formtools==2.1     

future==0.17.1  

httplib2==0.13.1   

six==1.12.0 

### userInfo

python-ldap==3.2.0    



## Server搭建

URL : http://172.28.137.66:8080

架设： Django+ Nignx + uWSGI + mysql

![image-20190926091913824](/Users/scott/Library/Application Support/typora-user-images/image-20190926091913824.png)



## 开发流程

![image-20190926091957529](/Users/scott/Library/Application Support/typora-user-images/image-20190926091957529.png)

## 目录结构

![image-20190926093341262](/Users/scott/Library/Application Support/typora-user-images/image-20190926093341262.png)

## Web APPs

![image-20190926092123400](/Users/scott/Library/Application Support/typora-user-images/image-20190926092123400.png)

## 



# APP设计

## common APP

### 简介

​	 公有APP， 用于设计公有的数据表格，作为公有模块由其他APP导入。

### 数据表

#### Project(专案)

保存专案信息的数据库表

| **Project** |            |                     |      |
| ----------- | ---------- | ------------------- | ---- |
| 字段        | 类型       | 说明                | 依赖 |
| code        | CharField  | 代号                | 主键 |
| name        | CharField  | 名称                |      |
| email       | EmailField | 邮箱                |      |
| site        | CharField  | 地点(PSH , PKS ...) |      |
| status      | CharField  | 状态(MP, NPI)       |      |
| description | CharField  | 描述                |      |
| start_date  | DateField  | 开始日期            |      |
| stop_date   | DateField  | 结束日期            |      |

#### Station(站位)

保存站位信息的数据库表

| **Station** |               |             |          |
| ----------- | ------------- | ----------- | -------- |
| 字段        | 类型          | 说明        | 依赖     |
| id          | AutoField     | id          | 主键     |
| stationID   | CharField     | 站位ID      |          |
| name        | CharField     | 站位名      |          |
| script      | CharField     | 脚本名      |          |
| description | TextField     | 描述        |          |
| is_POR      | BooleanField  | POR站位     |          |
| is_offline  | BooleanField  | Offline站位 |          |
| category    | CharField     | 分类        |          |
| add_time    | DateTimeField | 添加时间    |          |
| project     | ForeignKey    | 专案        | 1:N 外健 |

#### Stage(阶段)

保存阶段信息的数据库表

| **Stage**   |            |          |          |
| ----------- | ---------- | -------- | -------- |
| 字段        | 类型       | 说明     | 依赖     |
| id          | AutoField  | id       | 主键     |
| name        | CharField  | 名称     |          |
| description | TextField  | 描述     |          |
| start_date  | DateField  | 开始时间 |          |
| stop_date   | DateField  | 结束时间 |          |
| project     | ForeignKey | 专案     | 1:N 外健 |

#### Coco(客户)

保存客户信息的数据库表

| **Coco**  |                 |          |      |
| --------- | --------------- | -------- | ---- |
| 字段      | 类型            | 说明     | 依赖 |
| name      | CharField       | 名称     | 主键 |
| email     | EmailField      | 邮箱     |      |
| group     | CharField       | 组别     |      |
| is_active | BooleanField    | 是否有效 |      |
| project   | ManyToManyField | 负责专案 | N:M  |

#### Git

保存GIT路径信息的数据库表

| **Git** |            |         |          |
| ------- | ---------- | ------- | -------- |
| 字段    | 类型       | 说明    | 依赖     |
| id      | AutoField  | id      | 主键     |
| project | ForeignKey | 专案    | 1:N 外健 |
| git     | CharField  | GIT类型 |          |
| branch  | CharField  | 分支    |          |
| address | CharField  | 地址    |          |

### 后台功能

使用xadmin框架实现后台管理功能



## userInfo APP

### 简介

用于实现用户的登陆，注册，注销，所有用户信息的查看，个人信息的查看/修改，网站首页，专案查询，公司员工查询功能。

### 数据表

#### Department(部门)

用于保存部门信息的数据库表

| **Department** |                 |          |      |
| -------------- | --------------- | -------- | ---- |
| 字段           | 类型            | 说明     | 依赖 |
| code           | CharField       | 代号     | 主键 |
| name           | CharField       | 名称     |      |
| email          | EmailField      | 邮箱     |      |
| subDepartments | TextField       | 下属部门 |      |
| projects       | ManyToManyField | 专案权限 | N:M  |

#### User(用户)

用于保存部门信息的数据库表，继承 django.contrib.auth.models 中的AbstractUser 。

| User(AbstractUser) |                 |                     |          |
| ------------------ | --------------- | ------------------- | -------- |
| 字段               | 类型            | 说明                | 依赖     |
| id                 | AutoField       | id, 继承            | 主键     |
| username           | CharField       | 用户名，继承        |          |
| password           | CharField       | 密码，继承          |          |
| last_login         | DateTimeField   | 最后登陆时间，继承  |          |
| first_name         | CharField       | 姓，继承            |          |
| last_name          | CharField       | 名，继承            |          |
| email              | EmailField      | 邮箱，继承          |          |
| is_superuser       | BooleanField    | 超级用户，继承      |          |
| is_staff           | BooleanField    | 是否管理后台，继承  |          |
| is_active          | BooleanField    | 是否有效，继承      |          |
| date_joined        | DateTimeField   | 创建时间，继承      |          |
| workID             | CharField       | 工号                |          |
| gender             | CharField       | 性别 (male，female) |          |
| mvpn               | CharField       | 简码                |          |
| mobile             | CharField       | 手机                |          |
| position           | CharField       | 职位                |          |
| department         | ForeignKey      | 部门                | 1:N 外健 |
| projects           | ManyToManyField | 专案权限            | N:M      |
| favor_project      | ForeignKey      | 专案                | 1:N 外健 |



### 后台功能

#### 1.登陆+自动注册

![image-20190904090701673](/Users/scott/Library/Application Support/typora-user-images/image-20190904090701673.png)



#### 2.注销

退出登陆，返回登陆页面

#### 3.查询所有用户信息

查询User表，展示用户名，工号，姓名，邮箱，简码，手机，部门，职位

#### 4.查询/修改个人信息

查询/更新/修改个人信息。

### 前台设计

#### 1.登陆页

![image-20190926090442303](/Users/scott/Library/Application Support/typora-user-images/image-20190926090442303.png)

#### 2.首页

![image-20190926091337239](/Users/scott/Library/Application Support/typora-user-images/image-20190926091337239.png)

#### 3.用户信息页

![image-20190926091346299](/Users/scott/Library/Application Support/typora-user-images/image-20190926091346299.png)

#### 4.专案信息页

![image-20190926091528781](/Users/scott/Library/Application Support/typora-user-images/image-20190926091528781.png)

#### 5.PEGA员工查询页

![image-20190926093158541](/Users/scott/Library/Application Support/typora-user-images/image-20190926093158541.png)

#### 6.个人信息页

![image-20190926091355921](/Users/scott/Library/Application Support/typora-user-images/image-20190926091355921.png)





## issueList APP

### 简介

​		用于实现专案开发过程中issues的搜集和管理, 实现issue 的增删改查/上传/下载等基本功能。

### 数据表

#### Issue

用于保存所有issue信息的数据表 。

| **Issue**    |               |                                                              |          |
| ------------ | ------------- | :----------------------------------------------------------- | -------- |
| 字段         | 类型          | 说明                                                         | 依赖     |
| id           | AutoField     | id                                                           | 主键     |
| project      | ForeignKey    | 专案                                                         | 1:N 外健 |
| stage        | ForeignKey    | 阶段                                                         | 1:N 外健 |
| station      | ForeignKey    | 站位                                                         | 1:N 外健 |
| radar        | CharField     | radar号                                                      |          |
| title        | CharField     | 主题                                                         |          |
| category     | CharField     | 分类： Task <br />Serious issue <br /> Retest issue <br /> Reset issue  <br />Known issue <br />Other issue |          |
| status       | CharField     | 状态： Open <br />Ongoing <br />Keep Monitor <br />Done      |          |
| DRI          | CharField     | 负责人                                                       |          |
| ETA          | DateField     | 预计解决日期                                                 |          |
| is_highlight | BooleanField  | 是否需要high light                                           |          |
| description  | TextField     | 描述                                                         |          |
| remark       | TextField     | 标注                                                         |          |
| root_cause   | TextField     | 产生原因                                                     |          |
| action       | TextField     | 动作                                                         |          |
| style        | TextField     | 样式                                                         |          |
| update_time  | DateTimeField | 最后更新时间                                                 |          |
| add_time     | DateTimeField | 添加时间                                                     |          |

#### DocERS(文档和ERS)

用于保存所有文档和ERS信息的数据表 。

| **DocERS**  |               |              |          |
| ----------- | ------------- | ------------ | -------- |
| 字段        | 类型          | 说明         | 依赖     |
| id          | AutoField     | Id           | 主键     |
| project     | ForeignKey    | 专案         | 1:N 外健 |
| radar       | CharField     | radar号      |          |
| title       | CharField     | 主题         |          |
| component   | CharField     | 分组         |          |
| cocoDRI     | CharField     | 负责人       |          |
| remark      | TextField     | 标注         |          |
| style       | TextField     | 样式         |          |
| update_time | DateTimeField | 最后更新时间 |          |
| add_time    | DateTimeField | 添加时间     |          |

#### Handover(交接)

用于保存交接信息数据表 。

| **Handover** |               |              |          |
| ------------ | ------------- | ------------ | -------- |
| 字段         | 类型          | 说明         | 依赖     |
| id           | AutoField     | Id           | 主键     |
| project      | ForeignKey    | 专案         | 1:N 外健 |
| stage        | ForeignKey    | 阶段         | 1:N 外健 |
| title        | CharField     | 主题         |          |
| content      | CharField     | 分组         |          |
| remark       | TextField     | 标注         |          |
| style        | TextField     | 样式         |          |
| update_time  | DateTimeField | 最后更新时间 |          |
| add_time     | DateTimeField | 添加时间     |          |

### 后台功能

#### 1.增删改查数据库表格

#### 2.导出

导出excel表格，包含样式

### 前台设计

#### 1.Open Action 页面

#### 2.Done Action 页面

#### 3.Issue List 页面

#### 4.Done Issue 页面

#### 5.ERS and DOC 页面

#### 6.Handover 页面



## overlayList APP

### 简介

用于实现专案开发过程中Overlay 版本信息的搜集和整理

### 数据表

#### Overlay

用于保存Overlay 版本信息的数据库表

| **Overlay**   |               |                                                              |          |
| ------------- | ------------- | ------------------------------------------------------------ | -------- |
| 字段          | 类型          | 说明                                                         | 依赖     |
| id            | AutoField     | id                                                           | 主键     |
| project       | ForeignKey    | 专案                                                         | 1:N 外健 |
| stage         | ForeignKey    | 阶段                                                         | 1:N 外健 |
| station       | ForeignKey    | 站位                                                         | 1:N 外健 |
| version       | CharField     | 版本号                                                       |          |
| based_on      | CharField     | 基于版本                                                     |          |
| core_overlay  | CharField     | 核心版本                                                     |          |
| based_on_core | CharField     | 基于核心版本                                                 |          |
| radar         | CharField     | Radar号                                                      |          |
| status        | CharField     | 状态： New <br />Validation<br />Online <br />Expire  <br />Damage |          |
| change_list   | TextField     | 修改记录                                                     |          |
| remark        | TextField     | 标注                                                         |          |
| fixIssue      | TextField     | 解决的issue                                                  |          |
| rollin_time   | DateTimeField | 上线时间                                                     |          |
| update_time   | DateTimeField | 最后更新时间                                                 |          |
| add_time      | DateTimeField | 添加时间                                                     |          |



### 后台功能

#### 1. overlay 表格增删改查

#### 2. 自动发Email功能

#### 3.导出Excel功能

### 前台设计

#### 1.Overlay List 页面

![image-20190926094346811](/Users/scott/Library/Application Support/typora-user-images/image-20190926094346811.png)

#### 2.Request Mail 页面

![image-20190926094449118](/Users/scott/Library/Application Support/typora-user-images/image-20190926094449118.png)

#### 3.Autobuild Mail 页面

#### 4.Validation Mail 页面

#### 5.Sign Mail 页面

#### 6.Roll In Request Mail 页面



## stationTrack APP

### 简介

用于追踪站位的状态

### 数据表

#### stationTrack(站位追踪)

用于保存站位状态的数据库表

| **StationTrack** |               |              |          |
| ---------------- | ------------- | ------------ | -------- |
| 字段             | 类型          | 说明         | 依赖     |
| id               | AutoField     | id           | 主键     |
| project          | ForeignKey    | 专案         | 1:N 外健 |
| stage            | ForeignKey    | 阶段         | 1:N 外健 |
| station          | ForeignKey    | 站位         | 1:N 外健 |
| setup            | TextField     | 站位设备     |          |
| GRR              | CharField     | GRR 状态     |          |
| cof_list         | TextField     | COF 的测项   |          |
| remark           | TextField     | 标注         |          |
| style            | TextField     | 样式         |          |
| update_time      | DateTimeField | 最后更新时间 |          |
| add_time         | DateTimeField | 添加时间     |          |

### 后台功能

#### 1. stationTrack 表格增删改查

### 前台设计

#### 1. Station Track页面



## testCoverage APP

### 简介

用于显示和生成站位的测试项和测试逻辑

### 数据表

#### TestCoverage

用户保存测试项和逻辑的数据库表

| **TestCoverage**    |               |              |          |
| ------------------- | ------------- | ------------ | -------- |
| 字段                | 类型          | 说明         | 依赖     |
| id                  | AutoField     | id           | 主键     |
| project             | ForeignKey    | 专案         | 1:N 外健 |
| station             | ForeignKey    | 站位         | 1:N 外健 |
| branch              | CharField     | 分支         |          |
| test_name           | CharField     | 测向名       |          |
| technology          | CharField     | 分类         |          |
| stop_on_fail        | BooleanField  | 失败停止测试 |          |
| disable             | BooleanField  | 禁用         |          |
| mp                  | BooleanField  |              |          |
| eng                 | BooleanField  |              |          |
| rel                 | BooleanField  |              |          |
| grr                 | BooleanField  |              |          |
| lower_limit         | CharField     | 下限         |          |
| upper_limit         | CharField     | 上限         |          |
| relaxed_upper_limit | CharField     | COF上限      |          |
| relaxed_lower_limit | CharField     | COF下限      |          |
| units               | CharField     | 单位         |          |
| pattern             | CharField     | 正则         |          |
| materialKey         | CharField     |              |          |
| materialValue       | CharField     |              |          |
| logic               | TextField     | 逻辑         |          |
| descriptionn        | TextField     | 描述         |          |
| remark              | TextField     | 标注         |          |
| update_time         | DateTimeField | 最后更新时间 |          |
| add_time            | DateTimeField | 添加时间     |          |

### 后台功能

#### 1. 解析CSV，更新数据库表格

#### 2.展示test coverage

#### 3. 导出Excel

### 前台设计

#### 1.testCoverage 页面

#### 2.download 页面



## tools APP

TBD

### 

## connection APP

### 简介

实现APPs之间的关联

### 数据表

#### Issue_Overlay

用于关联issue和overlay版本的数据库表

| **Issue_Overlay** |               |              |          |
| ----------------- | ------------- | ------------ | -------- |
| 字段              | 类型          | 说明         | 依赖     |
| id                | AutoField     | id           | 主键     |
| issue             | ForeignKey    | Issue        | 1:N 外健 |
| overlay_ver       | ForeignKey    | Overlay 版本 | 1:N 外健 |
| update_time       | DateTimeField | 最后更新时间 |          |
| add_time          | DateTimeField | 添加时间     |          |

#### Issue_TestCoverage

用于关联issue和testCoverage的数据库表

| **Issue_TestCoverage** |               |              |          |
| ---------------------- | ------------- | ------------ | -------- |
| 字段                   | 类型          | 说明         | 依赖     |
| id                     | AutoField     | id           | 主键     |
| Issue                  | ForeignKey    | issue        | 1:N 外健 |
| testItem               | ForeignKey    | 侧项名       | 1:N 外健 |
| update_time            | DateTimeField | 最后更新时间 |          |
| add_time               | DateTimeField | 添加时间     |          |

### 后台功能

TBD

### 前台设计

TBD

### 



#### 

