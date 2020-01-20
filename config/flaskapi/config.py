import os
_basedir = os.path.abspath(os.path.dirname(__file__))

# предотвращаем поддельные межсайтовые запросы
CSRF_ENABLED = True
SECRET_KEY = '0-ah!q5-khw@4^2n90)s'

DEBUG = False

TOKEN_WEATHERBIT = "680133cf1ae741b6b8dffc50eb55ec5f"

#здесь задаем параметры подключения к базе
SQLALCHEMY_DATABASE_URI = 'postgresql://itq_test:hello2012@postgres/itq_test_db'
