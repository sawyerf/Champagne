# Python

## Run Project
### Install dependencies
```bash
pip install -r requirements.txt
```

### Run project
```bash
flask run
```

### Run project development
```bash
./dev.sh
. .venv/bin/activate
flask run --debug
```

### Run tests
```bash
pytest
```

## Test requests with curl
### Read
```bash
curl http://localhost:5000/config
```

### Edit Variable
```bash
curl 'localhost:5000/config/test_user/age' -X PUT -d '{"age": 56}' -H "Content-Type: application/json"
```
```bash
curl 'localhost:5000/config/test_user/height' -X PUT -d '{"height":175.5}' -H "Content-Type: application/json"
```

### Edit list
```bash
curl 'localhost:5000/config/test_list' -X PUT -d '{"test_list": [4, 5, 6]}' -H "Content-Type: application/json"
```