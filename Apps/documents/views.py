from django.shortcuts import render, HttpResponse, redirect
from django.conf import settings
from pathlib import Path
import os
import base64


def funclist():
    funcpath = Path('/data/django/git/PSH_Atlas_Documents_Func/functions')
    funclist = []
    for i in funcpath.iterdir():  # 遍历根目录中每一个大类
        if i.name[0] != '.' and i.is_dir() == True:  # 无视掉函数根目录中“.”开头的隐藏文件，没错，我说的就是“.DS_Store”
            j = {}  # 每一个大类设定为一个字典
            j['name'] = i.name  # 设定大类name
            l = []  # 设定大类中包含的内容
            for k in i.iterdir():  # 让我康康大类里面都有什么～～
                if k.name[0] != '.':  # 再来一遍，排除大类文件夹中“.”开头的隐藏文件
                    if k.is_dir() == True:
                        j['has_sec_func'] = True  # 哟，这个大类有子类，NB！
                        n = {}  # 每一个子类设定为一个字典
                        n['name'] = k.name  # 设定子类name
                        o = []  # 设定子类包含内容start
                        for m in k.glob('*.md'):
                            if m.name[0] != '.':
                                o += [m.name[:-3]]
                        n['include'] = o  # 设定子类包含内容end
                        l += [n]  # 中国人民解放军收复失地！！
                    else:
                        j['has_sec_func'] = False  # 哈哈哈，这个大类没有子类！
                        if k.name[-3:] == '.md':
                            l += [k.name[:-3]]
            j['include'] = l
            funclist += [j]

    return funclist


def searchFunction(request):
    name = request.POST['name']
    if name == '':
        return redirect('/doc/')
    return redirect('/doc/?func=' + name)


def reset_case(a):
    funcpath_os = '/data/django/git/PSH_Atlas_Documents_Func/functions'
    a += '.md'
    for i, j, k in os.walk(funcpath_os):
        for l in k:
            if a.lower() == l.lower():
                return l[:-3]
    return False


def reading(request):
    try:
        func_name = request.GET['func']
    except:
        func_name = 'Introduction'

    name = reset_case(func_name)
    if not name:
        return HttpResponse('<script>alert("系统中无此函数！请检查函数名！"); window.history.go(-1);</script>')
    funcpath = Path('/data/django/git/PSH_Atlas_Documents_Func/functions')
    doc = sorted(funcpath.rglob(name + '.md')
                 )[0].read_text().replace('\n', '\\n')
    try:
        flow = str(base64.b64encode(
            sorted(funcpath.rglob(name + '.pdf'))[0].read_bytes()), 'utf-8')
    except:
        flow = None

    response = {'name': name, 'doc': doc, 'flow': flow, 'funclist': funclist()}
    return render(request, 'documents/reading.html', response)
