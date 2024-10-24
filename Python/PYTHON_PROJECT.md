
**Exercice:** Créez une API REST en python permettant de modifier un fichier de configuration à distance. Le fichier de configuration fourni avec l'exemple doit être de type YAML et doit pouvoir avoir quatre paramètres modifiables: un dans une liste et les autres des valeurs classiques sur des paires clé/valeur. Le serveur doit comprendre une requête GET et une requête PUT.

**Exemple 1:**

Le fichier de configuration YAML initial peut ressembler à ceci:

```yaml
database:
  host: localhost
  port: 5432
  username: admin
  password: secret

allowed_users:
  - user1
  - user2
  - user3
```

Une requête GET peut retourner le contenu du fichier de configuration:

```
GET /config
```

Une requête PUT peut modifier un paramètre spécifique dans le fichier de configuration:

```
PUT /config/database/host
{
  "host": "new_host"
}
```

**Exemple 2:**

Le fichier de configuration YAML initial peut ressembler à ceci:

```yaml
server:
  name: my_server
  max_connections: 100

logging:
  level: info
  file: /var/log/server.log

features:
  - feature1
  - feature2
  - feature3
```

Une requête GET peut retourner le contenu du fichier de configuration:

```
GET /config
```

Une requête PUT peut modifier un paramètre spécifique dans le fichier de configuration:

```
PUT /config/server/max_connections
{
  "max_connections": 200
}
```