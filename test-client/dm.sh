curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
  "requestorID": "string",
  "token": "string",
  "dataID": "string",
  "key": "chiave2"
}' 'http://$1/ri/dm/store'


curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
  "requestorID": "string",
  "token": "string",
  "dataId": "string"
}' 'http://$1/ri/dm/read'


curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
  "requestorID": "string",
  "token": "string",
  "dataId": "string"
}' 'http://$1/ri/dm/delete'
