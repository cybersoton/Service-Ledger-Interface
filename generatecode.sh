
#Creation of Server-stub
swagger-codegen generate -i ./../SUNFISH-Platform-API/ServiceLedger/ServiceLedgerInterface.yaml -l nodejs-server -o ./server/

#https://raw.githubusercontent.com/sunfish-prj/SUNFISH-Platform-API/master/RegistryInterfaceAPI/swagger/RegistryInterface.yaml -l nodejs-server -o ./server/

#Documentation
#swagger-codegen generate -i https://raw.githubusercontent.com/sunfish-prj/SUNFISH-Platform-API/master/RegistryInterfaceAPI/swagger/RegistryInterface.yaml -l dynamic-html -o .
