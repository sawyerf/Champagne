import requests
import threading
import random

# Il y a besoin d'installer le module requests
# pip install requests

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

url = 'http://localhost:5000'

# Nombre total de requêtes
total_requests = 1000
# Nombre de requêtes par thread
requests_per_thread = 10

# Fonction pour effectuer des requêtes
def make_requests(start, end):
    for i in range(start, end):
        try:
            if i % 3 == 0:
                response = requests.put(f'{url}/config/test_user/age', timeout=5, json={'age': random.randint(1, 100)})
            elif i % 3 == 1:
                response = requests.get(f'{url}/config', timeout=5)
            else:
                response = requests.put(f'{url}/config/test_list', timeout=5, json={'test_list': [random.randint(1, 100) for _ in range(3)]})
            if response.status_code != 200:
                print(f"Request {i + 1}: Status Code {response.status_code}")
        except Exception as e:
            print(f"Request {i + 1}: Error {e}")

# Créer une liste pour stocker les threads
threads = []

# Lancer les threads
for i in range(0, total_requests, requests_per_thread):
    end = min(i + requests_per_thread, total_requests)
    thread = threading.Thread(target=make_requests, args=(i, end))
    threads.append(thread)
    thread.start()

# Attendre que tous les threads soient terminés
for thread in threads:
    thread.join()
