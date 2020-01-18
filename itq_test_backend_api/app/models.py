from app import db
from app.mixins import OutputMixin

class Weather(OutputMixin,db.Model):
    __tablename__ = 'weather'
    id = db.Column(db.Integer, primary_key = True) # индетификатор конкретной записи
    indentity = db.Column(db.String(30),index = True, unique = True) # уникальное значение строкиы
    city_name = db.Column(db.String(120)) # имя города
    city_id = db.Column(db.Integer) # id города
    country_code = db.Column(db.String(30)) #код страны
    dt = db.Column(db.DateTime) # момент времени
    pres = db.Column(db.Float) # давление
    temp = db.Column(db.Float) # температура
    rh = db.Column(db.Integer) # относительная влажность
    wind_spd = db.Column(db.Float) # скорость ветра


###################################################
###для обьектов с повторяющимся уникальным значением indentity####
####если такой обьект уже существует - True, если нет то - False
    @classmethod
    def get_or_create(cls, indentity):
        exists = db.session.query(Weather.id).filter_by(indentity=indentity).scalar() is not None
        if exists:
            return True
        return False


##################################################
##############наш конструктор#####################

    def __init__(self,city_name=None,city_id=None,country_code=None,dt=None,pres=None,temp=None,rh=None,wind_spd=None,indentity=None):
        self.city_name = city_name
        self.city_id = city_id
        self.country_code = country_code
        self.dt = dt
        self.pres = pres
        self.temp = temp
        self.rh = rh
        self.wind_spd = wind_spd
        self.indentity = city_name +" "+ self.dt.strftime("%Y-%m-%dT%H:%M:%S")

    def __repr__(self):
        return '<Weather in %r at %r>' % (self.city_name,self.dt.strftime("%Y-%m-%dT%H:%M:%S"))
