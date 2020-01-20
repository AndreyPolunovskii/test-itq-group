import os
_basedir = os.path.abspath(os.path.dirname(__file__))

# предотвращаем поддельные межсайтовые запросы
CSRF_ENABLED = True
SECRET_KEY = 'you-will-never-guess'

DEBUG = False

TOKEN_WEATHERBIT = "db6c57d00863437aa49c607996e4d302"

#здесь задаем параметры подключения к базе
SQLALCHEMY_DATABASE_URI = 'postgresql://flask_user:pain2012@localhost/test_flask_weather'
