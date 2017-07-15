
#Creation of Server-stub
swagger-codegen generate -i https://raw.githubusercontent.com/sunfish-prj/SUNFISH-Platform-API/newRI/RegistryInterfaceAPI/swagger/RegistryInterface.yaml -l nodejs-server -o ./server/

#Documentation
swagger-codegen generate -i https://raw.githubusercontent.com/sunfish-prj/SUNFISH-Platform-API/newRI/RegistryInterfaceAPI/swagger/RegistryInterface.yaml -l dynamic-html -o .
