from flask import Flask
from flask_migrate import Migrate, MigrateCommand
from flask_sqlalchemy import SQLAlchemy
from flask_script import Manager, Command, Shell
import os, config
from flask_cors import CORS


# создание экземпляра приложения
app = Flask(__name__)
CORS(app)
app.config.from_object('config')

app.config['JSON_AS_ASCII'] = False


# инициализирует расширения
db = SQLAlchemy(app)
migrate = Migrate(app, db)


# import views
from . import views
# from . import forum_views
# from . import admin_views
