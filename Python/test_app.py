import pytest
from app import app as flask_app
import yaml

file_data = '''test_user:
    name: test
    age: 20
    height: 180
    weight: 70

test_list:
    - 1
    - 2
    - 3'''

with open('config.yaml', 'w+') as file:
    file.write(file_data)

@pytest.fixture()
def app():
    yield flask_app

@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def runner(app):
    return app.test_cli_runner()


def test_config_get(client):
    # test read file
    response = client.get('/config')
    assert response.status_code == 200
    assert response.data == file_data.encode()
  
def test_config_put_list(client):
    # test good request
    response = client.put('/config/test_list', json={'test_list': [4, 5, 6]} )
    assert response.status_code == 200

    # test type mismatch
    response = client.put('/config/test_list', json={'test_list':'test'})
    assert response.status_code == 400
    # test key not found
    response = client.put('/config/test_list', json={'unknown':'test'})
    assert response.status_code == 400
    response = client.put('/config/unknown', json={'test_list':'test'})
    assert response.status_code == 400

    # check if list is updated
    response = client.get('/config')
    assert response.status_code == 200
    data = yaml.safe_load(response.data)
    assert data['test_list'] == [4, 5, 6]

def test_config_put_var(client):
    # test good request
    response = client.put('/config/test_user/age', json={'age': 30})
    assert response.status_code == 200
    response = client.put('/config/test_user/name', json={'name': 'lol'})
    assert response.status_code == 200
    reponse = client.put('/config/test_user/height', json={'height': 180.4})
    assert response.status_code == 200

    # test unknown var
    response = client.put('/config/test_user/unknown', json={'unknown':'test'})
    assert response.status_code == 404

    # test unknown key
    response = client.put('/config/unknown/age', json={'age': 30})
    assert response.status_code == 404

    # test type mismatch
    response = client.put('/config/test_user/age', json={'age':[1, 2, 3]})
    assert response.status_code == 400

    # test if variable is updated
    response = client.get('/config')
    assert response.status_code == 200
    data = yaml.safe_load(response.data)
    assert data['test_user']['age'] == 30
    assert data['test_user']['name'] == 'lol'
    assert data['test_user']['height'] == 180.4
    assert data['test_user']['weight'] == 70