import requests
from .models import Weather
import datetime
from app import db
import config

######адаптер для записи из json (от api) в обьект базы базу####
def adapter_dw(dataset,row_id):
    city_name = dataset['city_name']
    city_id = int(dataset['city_id'])
    country_code = dataset['country_code']
#    print(city_id)

    datarow = dataset['data'][row_id]
    dt = datetime.datetime.strptime(datarow['timestamp_utc'],"%Y-%m-%dT%H:%M:%S")
    pres = float(datarow['pres'])
    temp = float(datarow['temp'])
    rh = float(datarow['rh'])
    wind_spd = float(datarow['wind_spd'])

    res = Weather(city_name = city_name,\
                  city_id = city_id,\
                  country_code = country_code,\
                  dt = dt,\
                  pres = pres,\
                  temp = temp,\
                  rh = rh,\
                  wind_spd=wind_spd)

    return  res


######запись данных в базу##########################
def write_data_weather(dataset):
#    print(dataset)
    for row_id, _ in enumerate(dataset['data']):
        res = adapter_dw(dataset,row_id)
#        print(res.city_id)
        #для проверки на наличие строк с повторяющимися уникальными значениями
        res_control = Weather.get_or_create(indentity=res.indentity)
        if not res_control:
            db.session.add(res)
    db.session.commit()
    return dataset


######чтение данных из базы##########################
def read_data_weather(args):
    query = Weather.query.filter_by(city_name=args['city']).filter(Weather.dt > args['start_date']).filter(Weather.dt < args['end_date'])
    resp = []
    for obj in query:
        resp.append(obj.to_json())
    return resp


######получаем исторические погодные данные#########
#######источник https://www.weatherbit.io/ #########
def get_and_put_data_weather(args):
    WEATHERBIT_ROOT = "https://api.weatherbit.io"
    TOKEN = config.TOKEN_WEATHERBIT
    URL = WEATHERBIT_ROOT + '/v2.0/history/hourly'
    params = {"key" : TOKEN, "tz" : "local" }
    params.update(args)
    try:
          r = requests.get( URL, params = params )
    except:
          return {"error":"weatherbit not avalible"}

    if r.status_code !=404 and r.status_code != 204:
          if r.status_code !=502:
              if 'error' in r.json():
                return r.json()
              else:
                write_data_weather(r.json()) # здесь записываем данные
                return {"done":"данные загружены"}
          else:
                return {"error":"не удалось подключиться к удаленному ресурсу"}
    else:
          return {"error":"запрашиваемая информация не была найдена"}
