from flask import Flask, request, jsonify
import yaml
from threading import Lock
import os


def create_app():
    app = Flask(__name__)
    return app

app = create_app()
lock = Lock()

def read_yaml():
    try:
        with open('config.yaml') as file:
            config = yaml.safe_load(file)
            return config
    except:
        return None

def write_yaml(config):
    with open('config.yaml', 'w+') as file:
        yaml.dump(config, file)

@app.get("/config")
def config_get():
    if os.path.exists('config.yaml') == False:
        return {'error':'File not found'}, 404
    try:
        with lock:
            with open('config.yaml') as file:
                return file.read()
    except:
        return {'error': 'Error reading file'}, 404

@app.put("/config/<string:key>") # entry point for updating list
@app.put("/config/<string:key>/<string:var>") # entry point for updating variable
def config_put(key, var=None):
    body = request.get_json()
    if (var is not None and var not in body) or (var is None and key not in body):
        return {'error': 'variable not found'}, 400
    
    with lock:
        config = read_yaml()
        if config is None:
            config = {}
        if key not in config or (var is not None and var not in config[key]):
            return {'error': 'key not found'}, 404
        # edit list
        if var is None: 
            if type(config[key]) is not list or type(body[key]) is not list:
                return {'error': 'type mismatch'}, 400
            for i in config[key]:
                if type(i) not in [int, float, str]:
                    return {'error': 'type mismatch'}, 400
            config[key] = body[key]
        # edit variable
        else: 
            if type(config[key][var]) not in [int, float, str] or type(body[var]) not in [int, float, str]:
                return {'error': 'type mismatch'}, 400
            config[key][var] = body[var]
        try:
            write_yaml(config)
        except:
            return {'error': 'Error writing file'}, 500
    return {'success': 'variable updated'}, 200