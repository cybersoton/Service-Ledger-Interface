
#Creation of Server-stub
swagger-codegen generate -i RegistryInterface.yaml -l nodejs-server -o ./server/

#Documentation
swagger-codegen generate -i https://petstore.swagger.io/v2/swagger.json -l dynamic-html -o .
