import os
import shutil

from django.db import connection
from .models import *


# 获取紧急联系人
def getEmergency():
    d = {}
    teams = ['PGPD', 'PGKS']
    for team in teams:
        sql = ' \
            SELECT \
                sign, name, iphone, duty_time \
            FROM \
                sendEmail_emergency \
            WHERE \
                team = "%s" \
            ORDER BY priority ASC \
        ' % (team)
        d[team] = sql_query(sql)
    return d


# 查询
def sql_query(sql):
    cursor = connection.cursor()
    cursor.execute(sql)
    return cursor.fetchall()


# 执行
def sql_exec(sql):
    cursor = connection.cursor()
    cursor.execute(sql)


# 获取factory
def getFactory():
    sql = ' \
        SELECT \
            id, name \
        FROM \
            sendEmail_factory \
    '
    return sql_query(sql)


# 获取server
def getServer():
    sql = ' \
        SELECT \
            s.id, s.name, s.address \
        FROM \
            sendEmail_server AS s, \
            sendEmail_factory AS f \
        WHERE \
            f.id = s.factory_id \
    '
    return sql_query(sql)


# 获取factory和server
def getFactoryAndServer():
    d = {}
    factories = getFactory()
    for factory in factories:
        fid = factory[0]
        fname = factory[1]
        sql = ' \
            SELECT \
                id, name \
            FROM \
                sendEmail_server \
            WHERE \
                factory_id = %d \
        ' % (fid)
        s = sql_query(sql)
        d[str(fid)+','+fname] = s

    return d


# 获取产品信息
def getProduct():
    sql = ' \
        SELECT \
            id, name \
        FROM \
            sendEmail_product \
    '
    return sql_query(sql)


# 获取build
def getBuild(term):
    sql = ' \
        SELECT \
            id, name \
        FROM \
            sendEmail_build \
        WHERE \
            name LIKE "%%%s%%" \
    ' % (term)
    return format_auto(sql_query(sql))


# 获取osx
def getOsx(term):
    sql = ' \
        SELECT \
            id, name \
        FROM \
            sendEmail_osx \
        WHERE \
            name LIKE "%%%s%%" \
        OR \
            series LIKE "%%%s%%" \
    ' % (term, term)
    return format_auto(sql_query(sql))


# 获取line
def getLine(term):
    sql = ' \
        SELECT \
            id, name \
        FROM \
            sendEmail_line \
        WHERE \
            name LIKE "%%%s%%" \
    ' % (term)
    return format_auto(sql_query(sql))


# 格式化
def format_auto(rows):
    r = []
    for row in rows:
        d = {}
        id = row[0]
        name = row[1]
        d['id'] = id
        d['value'] = name
        r.append(d)
    return r


# 提示信息
def getPs():
    sql = ' \
        SELECT \
            page, content \
        FROM \
            sendEmail_ps \
    '
    infos = sql_query(sql)
    d = {}
    for info in infos:
        key = info[0]
        val = info[1]
        d[key] = [val]
    return d


# 清空文件夹
def clsFolder(path):
    delList = os.listdir(path)
    for f in delList:
        delTarget = os.path.join(path, f)
        if os.path.isfile(delTarget):
            os.remove(delTarget)
        elif os.path.isdir(delTarget):
            shutil.rmtree(delTarget, True)

#删除邮件
def deleteEmail_m(email_ids):
    for id in email_ids:
        id=int(id)
        sql = ' \
            DELETE \
            FROM \
                sendEmail_email \
            WHERE \
                id = "%d" \
        ' % (id)
        s=sql_exec(sql)
    return True

# 保存邮件
def saveEmail_m(email):
    sql = ' \
        INSERT INTO \
            sendEmail_email \
            (subject, content, from_people, to_people,\
            update_time, add_time) \
        VALUES \
            ("%s", "%s", "%s", "%s", now(), now()) \
    ' % ( 
        email['subject'], email['content'], email['from'], 
        email['to']
    )
    sql_exec(sql)


# 格式化
def format(result):
    emails = []
    for e in result:
        email = {}
        email['id'] = e[0]
        email['subject'] = e[1]
        email['from'] = e[2]
        email['to'] = e[3]
        email['cc'] = e[4]
        email['add_time'] = e[5]
        emails.append(email)
        
    return emails


# 查询邮件
def queryEmail():
    sql = ' \
        SELECT \
            id, subject, from_people, to_people, cc, add_time \
        FROM \
            sendEmail_email \
        ORDER BY id DESC \
    '
    result = sql_query(sql)
    return format(result)


# 邮件内容
def emailContent(eid):
    sql = ' \
        SELECT \
            subject, content, from_people, to_people, cc, add_time, \
            appendix \
        FROM \
            sendEmail_email \
        WHERE \
            id = %d \
    ' % (eid)
    email = sql_query(sql)[0]
    return {
        'subject': email[0],
        'content': email[1],
        'from': email[2],
        'to': email[3],
        'cc': email[4],
        'add_time': email[5],
        'appendix': email[6],
    }


# 搜索
def searchEmail(kind, val):
    sql = ' \
        SELECT \
            id, subject, from_people, to_people, cc, add_time \
        FROM \
            sendEmail_email \
        WHERE \
            %s LIKE "%%%s%%" \
    ' % (kind, val)
    result = sql_query(sql)
    return format(result)
  

# 服务器
def get_server():
    sql = ' \
        SELECT \
            id, name, address,factory_id\
        FROM \
            sendEmail_server order by factory_id\
    '
    return sql_query(sql)


# 线体
def get_line(sid):
    sql = ' \
        SELECT \
            id, name \
        FROM \
            sendEmail_line \
        WHERE \
            server_id = %d \
    ' % (sid)
    return sql_query(sql)

#保存线体
def saveLine(servername,linename):
    server=get_server_byName(servername)[0]
    sid = server[0]
    sql = ' \
        INSERT INTO \
            sendEmail_line \
            (name, update_time, add_time, server_id) \
        VALUES \
            ("%s", now(), now(), "%d") \
    ' % (linename, sid)
    return sql_exec(sql)

def deleLine(lids):
    for id in lids:
        id=int(id)
        sql = ' \
            DELETE \
            FROM \
                sendEmail_line \
            WHERE \
                id = "%d" \
        ' % (id)
        s=sql_exec(sql)
    return True

#使用分页查询线体
def queryLineData(sortBy="sendEmail_server.name",base=0, offset=20):
    sql = ' \
    select sendEmail_line.*,\
            sendEmail_server.name,sendEmail_server.address \
            from sendEmail_line \
            left join sendEmail_server \
            on sendEmail_line.server_id=sendEmail_server.id \
            order by %s  limit %d,%d\
	    ' % (sortBy, base, offset)
    return sql_query(sql)

def countLineData():
    sql = ' \
    select count(*) \
            from sendEmail_line \
            left join sendEmail_server \
            on sendEmail_line.server_id=sendEmail_server.id \
	    ' 
    result=sql_query(sql)
    # print(result[0][0])
    return result[0][0]

def formatLineData(data):
    rows = []
    for line in data:
        row={}
        row['lid'] = line[0]
        row['sname'] = line[5]
        row['saddress'] = line[6]
        row['lname'] = line[1]
        row['utime']=line[2]
        rows.append(row)
    return rows
# 拼接线体
def formatLine(servers):
    rows = []
    for server in servers:
        sid = server[0]
        sname = server[1]
        saddress = server[2]
        lines = get_line(sid)
        for line in lines:
            row = {}
            lid = line[0]
            lname = line[1]
            row['lid'] = lid
            row['sname'] = sname
            row['saddress'] = saddress
            row['lname'] = lname
            rows.append(row)
    return rows

def get_server_byName(sname):
    sql = ' \
        SELECT \
            id, name, address \
        FROM \
            sendEmail_server \
        WHERE \
            name = "%s" \
    ' % (sname)
    return sql_query(sql)

def get_server_where(sid):
    sql = ' \
        SELECT \
            name, address \
        FROM \
            sendEmail_server \
        WHERE \
            id = %d \
    ' % (sid)
    return sql_query(sql)


# 搜索线体
def searchLine(kind, val):
    if kind=='sname':
        sql = ' \
            SELECT \
                id, name, address \
            FROM \
                sendEmail_server \
            WHERE \
                name LIKE "%%%s%%" \
        ' % (val)
        return formatLine(sql_query(sql))
    if kind=='lname':
        rows = []
        sql = ' \
            SELECT \
                id, name, server_id \
            FROM \
                sendEmail_line \
            WHERE \
                name LIKE "%%%s%%" \
        ' % (val)
        result = sql_query(sql)
        for row in result:
            item = {}
            item['lid'] = row[0]
            item['lname'] = row[1]
            sid = row[2]
            server = get_server_where(sid)[0]
            item['sname'] = server[0]
            item['saddress'] = server[1]
            rows.append(item)
        return rows

# 查找用户是否在权限表里
def getUserPermission(name):
	sql = ' \
		select `name` \
		from sendEmail_permission \
		where name="%s"\
	' %(name)
	return sql_query(sql)
