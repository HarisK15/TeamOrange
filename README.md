# Team *Orange* Large Group project

## Team members
The members of the team are:
- *DIWAS RAI*
- *DILSAD KAYA*
- *HARIS KAMRAN*
- *DEIVIDAS JUSKA*
- *JIAXIN CAI*
- *MANU SIBICHAN*
- *TANRAJ SEHRA*
- *RAGHAV THUMMURU*
- *YOUSSEF DOUBI-KADMIRI*

## Project structure
The project is called `Clucker` and utilises the MERN stack. This project is organised into two main components:

- Frontend: Located in the client directory, the frontend is built with React, utilizing Vite.
- Backend: Located in the server directory, the backend is built with Node.js and uses the Express web framework. All interactions with the MongoDB are also handled here.

## Deployed version of the application
The deployed version of the application can be found at https://cluckerteamorange-b4381c5c6c08.herokuapp.com/

**Could we please get an email as soon as you have finished marking our work? Thank you.**

## Installation instructions
To install the software and use it in your local development environment, you must first git clone the project:  

```
$ git clone https://github.com/HarisK15/TeamOrange.git
```

Then, Install all the required packages by running (In the root, server and client directories):

```
$ npm install
```

Thereafter, add your mongoDB to the .env file's MONGO_URL and add a JWT_SECRET (randomly generated string for security).
For example:

```
MONGO_URL = mongodb+srv://johnDoe:-dX4hH0F6Wm2Rqd@cluster0.axvsrx0.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET = a62525857b51ebe738e1542d1d9ba0267b5fae4d8d7820c0c89b08e9f9f25cbd
```

To run the application on your local machine run (in the client directory):
```
npm run dev
```
While also running (in the server directory):
```
npm start
```


Seed/Unseed the MongoDB with (in the server directory):
All seeded users will have the password 'testPassword'. 
If you create a user with the username 'admin' their model and related clucks will not be unseeded. 

```
$ npm run seed
```
```
$ npm run unseed
```

Run the frontend/backend tests with (in the client/server directory):
```
$ npm run test
```

Run the frontend tests with coverage(in the client directory):
```
$ npm run coverage
```

Run the backend tests with coverage(in the server directory):
```
$ npm run test:coverage
```

## Sources
The packages used by this application are specified in the `package.json` files in the root, server and client directories.



