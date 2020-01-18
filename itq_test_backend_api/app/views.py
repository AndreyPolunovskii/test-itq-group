from app import app
from flask import request,jsonify
import json
from .presenter import *

#################################################
###########обертка вокруг наших вьюх#############
def get_params_exist():
    def wrapper(func):
        if request.method == 'GET' :
            args = request.args
#            print(args)
            if ('city' in args) and ('start_date' in args) and ('end_date' in args) :
                return func(args)
            return jsonify({"error":"один из параметров : (city, start_date или end_date)  не был передан"})
        return jsonify({"error":"разрешен только GET запрос"})
    return wrapper


#####################################################
########получение и запись данных в базу#############
#################не более 500 запросов в день??######
@app.route('/RR/api/v1.0/data/upload', methods=['GET'])
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
@app.route('/RR/api/v1.0/data/get', methods=['GET'])
def get_data():
    @get_params_exist()
    def source_funct(args):
        res = read_data_weather(args)
        return jsonify({'data':res})
    return source_funct
