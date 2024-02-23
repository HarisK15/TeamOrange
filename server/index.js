//import statements
const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv').config()
const cors = require('cors')
const {mongoose} = require('mongoose')
const app = express();


//database connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('Database connected'))
.catch((err) => console.log('Database not connected', err))

//middleware because this is the entry point for the backend
app.use(express.json())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use('/',require('./routes/authRoutes'))
app.use('/', require('./routes/passwordRoutes') );

//set up port to listen
const port = 8000;
app.listen(port,() => console.log(`Server is running on port ${port}`))

