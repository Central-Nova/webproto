const express = require('express');
const sessionStore = require('./config/db');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const helmet = require('helmet');
const apiLoggerMiddleware = require('./middleware/apiLogger');
const httpContext = require('express-http-context');
const reqId = require('./middleware/reqId');



require('dotenv').config();

const app = express();

// Init Middleware
app.use(express.json({ extended: false }));

// Express body parser
app.use(express.urlencoded({ extended: true }))

// Http Context
app.use(httpContext.middleware);

// Set Request Id
app.use(reqId);

// Helmet
app.use(helmet());

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    }
}));

app.use(apiLoggerMiddleware);

// Passport Config
require('./config/passport')(passport);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());




// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/companies', require('./routes/api/companies'));
app.use('/api/roles', require('./routes/api/roles'));
app.use('/api/invitation', require('./routes/api/invitation'));
app.use('/api/products', require('./routes/api/products'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
