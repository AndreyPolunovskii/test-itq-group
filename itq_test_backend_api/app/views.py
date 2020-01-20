from app import app
from flask import request,jsonify
import json,re
from .presenter import *

#################################################
###########обертка вокруг наших вьюх#############
def get_params_exist():
    def wrapper(func):
        if request.method == 'GET' :
            args = request.args
#            print(args)
            if ('city' in args) and ('start_date' in args) and ('end_date' in args) :
                if len(args['city']) != 0 and len(args['start_date']) != 0 and len(args['end_date']) != 0:
                    if (re.fullmatch(r"\d{4}-\d{2}-\d{2}",args['start_date']) is not None) and (re.fullmatch(r"\d{4}-\d{2}-\d{2}",args['end_date']) is not None):
                        return func(args)
                    return jsonify({"error":"даты переданы в неправильном формате"})
                return jsonify({"error":"переданы пустые параметры"})
            return jsonify({"error":"один из параметров : (city, start_date или end_date)  не был передан"})
        return jsonify({"error":"разрешен только GET запрос"})
    return wrapper


#####################################################
########получение и запись данных в базу#############
#################не более 500 запросов в день??######
@app.route('/data/upload', methods=['GET'])
def upload_data():
    @get_params_exist()
    def source_funct(args):
        res = get_and_put_data_weather(args)
        if 'done' in res:
            res = read_data_weather(args)
            return jsonify({"data":res})
        return jsonify(res)
    return source_funct


##################################################
###############получение данных из базы###########
@app.route('/data/get', methods=['GET'])
def get_data():
    @get_params_exist()
    def source_funct(args):
        res = read_data_weather(args)
        return jsonify({'data':res})
    return source_funct
