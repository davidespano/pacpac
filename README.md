# pacpac
Source code for the PACPAC game editor

### Prerequisites
- Install Neo4j. 
- Install node.js

At the first execution, neo4j should prompt you to change the default credentials.
Set username and password to, respectively, neo4j and password. If you wish to use
different username and password, just modify the default values in the file
``./api/config.js`` with your credentials. DO NOT PUSH ANY CHANGE TO THAT FILE.

### Set up
These steps are mandatory before the first execution of the project, and should also be repeated
after pulling a new version.
- Open a terminal inside the folder of the project. Move to the folder api, and run
``npm install``.
- Open a terminal inside the folder of the project. Move to the folder app, and run
``npm install``.

### Execution
To execute the project
- Open a terminal inside the folder of the project. Move to the folder api, and run
``node app.js``.
- Open a terminal inside the folder of the project. Move to the folder app, and run
``npm start``.

Now open your browser and go to <http:\\localhost:3006>