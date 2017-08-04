#!/bin/bash

echo

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
  "requestorID": "string",
  "token": "string",
  "dataID": "string",
  "key": "chiave2"
}' 'http://'$1':'$2'/ri/dm/store'

echo

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
  "requestorID": "string",
  "token": "string",
  "dataId": "string"
}' 'http://'$1':'$2'/ri/dm/read'

echo

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
  "requestorID": "string",
  "token": "string",
  "dataId": "string"
}' 'http://'$1':'$2'/ri/dm/delete'

echo 
