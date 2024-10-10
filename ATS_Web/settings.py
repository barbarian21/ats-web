"""
Django settings for ATS_Web project.

Generated by 'django-admin startproject' using Django 2.2.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""

import os
import pymysql
import sys

pymysql.install_as_MySQLdb()

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(BASE_DIR,"Apps"))
sys.path.insert(1, os.path.join(BASE_DIR,"Extra_Apps"))



# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'l--lq_h%uk1$kh__lllg8^v^-b1e2w=scnl1f3q&d2mn5df4ps'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'django_crontab', #定时任务
    'xadmin',
    'crispy_forms',
    'common',
    'userInfo',
    'issueList',
    'testCoverage',
    'overlayList',
    'stationTrack',
    'AuditTracking',
    'tools',
    'connection',
    'sendEmail',
    'questionnaire',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'ATS_Web.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.media',
            ],
        },
    },
]

WSGI_APPLICATION = 'ATS_Web.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',   # 数据库引擎
        'NAME': 'test',  # 数据库名，先前创建的
        'USER': 'root',     # 用户名，可以自己创建用户
        'PASSWORD': 'root',  # 密码
        'HOST': '127.0.0.1',  # mysql服务所在的主机ip
        'PORT': '3306',         # mysql服务端口
        'CHARTSET': 'utf-8',
        'OPTIONS': {

            "init_command": "SET foreign_key_checks = 0;",

        }
    }
}


# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'zh-hans'

TIME_ZONE = 'Asia/Shanghai'

USE_I18N = True

USE_L10N = True

USE_TZ = False


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_ROOT = os.path.join(PROJECT_DIR, 'static')
STATIC_URL = '/static/'
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "static"),
)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

AUTH_USER_MODEL = 'userInfo.User'
AUTHENTICATION_BACKENDS = (
    'userInfo.views.CustomBackend',
)

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_USE_TLS = False
EMAIL_HOST = 'mail.sh.pegatroncorp.com'
EMAIL_PORT = 25
EMAIL_HOST_USER = 'BU3_ATS_SCM'
EMAIL_HOST_PASSWORD = 'suzhouf8@gitmail'
DEFAULT_FROM_EMAIL = 'BU3_ATS_SCM@intra.pegatroncorp.com'
SITE_ALLPROJECTINFO= {}


CRONTAB_COMMAND_PREFIX = 'LANG_ALL=zh_cn.UTF-8'
CRONJOBS_DIR = "/data/cronjobs_log/"
CRONJOBS_FILE_NAME = "ats_web.log"
CRONJOBS = [
    ('0 0-23/1 * * *', 'overlayList.views.checkOverlayDateTask', '>>'+CRONJOBS_DIR+CRONJOBS_FILE_NAME),
    ('2 * * * *', 'AuditTracking.views.checkMailNoteTask',  '>>'+CRONJOBS_DIR+CRONJOBS_FILE_NAME + ' 2>&1'),
    # ('*/1 * * * *', 'AuditTracking.views.checkMailNoteTask', '>> '+ '/Users/Yafeng/Desktop/oldweb/4/test.html 2>&1')
]
