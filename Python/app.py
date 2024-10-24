from flask import Flask, request, jsonify
import yaml
import os

app = Flask(__name__)

@app.get("/config")
def config_get():
    if os.path.exists('config.yaml') == False:
        return {'error':'File not found'}, 404
    try:
        with open('config.yaml') as file:
            config = yaml.load(file, Loader=yaml.FullLoader)
            # config = file.read()
            return config
    except:
        return {'error': 'Error reading file'}, 404

@app.put("/config/<string:key>/<string:var>")
def config_put(key, var):
    print(key, var)
    body = request.get_json()
    if var not in body:
        return {'error': 'variable not found'}, 400
    with open('config.yaml', 'w+') as file:
        config = yaml.load(file, Loader=yaml.FullLoader)
        if config is None:
            config = {}
        if key not in config:
            config[key] = {}
        config[key][var] = body[var]
        yaml.dump(config, file)
        return {'success': 'variable updated'}, 200
