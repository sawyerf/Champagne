from flask import Flask, request, jsonify
import yaml
import os

app = Flask(__name__)

def read_yaml():
    with open('config.yaml') as file:
        config = yaml.safe_load(file)
        return config

def write_yaml(config):
    with open('config.yaml', 'w+') as file:
        yaml.dump(config, file)

@app.get("/config")
def config_get():
    if os.path.exists('config.yaml') == False:
        return {'error':'File not found'}, 404
    try:
        return read_yaml()
    except:
        return {'error': 'Error reading file'}, 404

@app.put("/config/<string:key>/<string:var>")
def config_put(key, var):
    body = request.get_json()
    if var not in body:
        return {'error': 'variable not found'}, 400
    
    config = read_yaml()
    if config is None:
        config = {}
    if key not in config:
        config[key] = {}
    config[key][var] = body[var]
    write_yaml(config)
    return {'success': 'variable updated'}, 200