# Service-Ledger-Interface

Node.js server exposing API to interact the Distributed Infrastructure [*ServiceLedger*](https://github.com/sunfish-prj/Service-Ledger/) based on a blockchain system underlying FaaS Cloud federations. The server is indeed an interface used by the SUNFISH platform components to interact with the blockchain system of the ServiceLedger. 

The offered APIs are detailed in the [SUNFISH Manual](http://sunfish-platform-docs.readthedocs.io/en/latest/). 

## Installation Guide

### Dependencies 

Install the dependencies 
- *Node.js v6.x*
- *Npm v3.x*
Releases and installation guides can be found on the official web-sites [here](https://nodejs.org) and [here](https://www.npmjs.com/) 

To check that all the depencies have been set up, execute
```
  $ node -v
  -> v6.1.0
  $ npm -v
  -> 3.10.6
```

Note that you probably also need to have installed on the machine *make* and *gyp*; if not installed, execute also
```
  $ apt-get install build-essential git
  $ npm install -g node-gyp 
```

Remember to execute the installation as superuser.


### Service-Ledger-Interface set-up

To set the service, execute the following commands
``` 
  $ git clone https://github.com/sunfish-prj/Service-Ledger-Interface.git
  $ cd Service-Ledger-Interface/server
  $ npm start
```
The server is now running and listening on the port chosen in the *config/default.yaml*. file (e.g. 8089). You can use the [client-stub interface](http://localhost:8089/docs).  

The Service-Ledger-Interface is expected to interact with the [ServiceLedger](https://github.com/sunfish-prj/Service-Ledger/), whose *url* and *port* are defined in the configuration file *config/default.yaml*.

### Server test

To test the server API, there are available in the *test-client/* folder bash files with *curl* corresponding commands; url and port must be given as input, e.g. 
```
  $ ./dm.sh localhost 8089
```



