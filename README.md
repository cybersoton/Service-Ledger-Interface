# Registry-Interface

Node.js server exposing API to interact the Distributed Infrastructure [*Registry*](https://github.com/sunfish-prj/Registry/) based on a blockchain system underlying FaaS Cloud federations. The server is indeed an interface used by the SUNFISH platform components to interact with the blockchain system of the Registry. 

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

### Registry-Interface set-up

To set the service, execute the following commands
``` 
  $ git clone https://github.com/sunfish-prj/Registry-Interface.git
  $ cd Registry/server
  $ npm start
```
The server is now running and listening on the port chosen in the *config/default.yaml*. file (e.g. 60001). You can use the [client-stub interface](http://localhost:60001/docs).  

The Registry-Interface is expected to interact with the [Registry](https://github.com/sunfish-prj/Registry/), whose *url* and *port* are defined in the configuration file *config/default.yaml*.

### Server test

To test the server API, there are available in the *test-client/* folder bash files with *curl* corresponding commands; url and port must be given as input, e.g. 
```
  $ ./dm.sh localhost 60001
```



