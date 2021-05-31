const express = require('express');
const sessionStore = require('./config/db');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const helmet = require('helmet');
const apiStartLog = require('./middleware/apiStartLog');
const httpContext = require('express-http-context');
const setHttpContext = require('./middleware/setHttpContext');
const apiEndLog = require('./middleware/apiEndLog');
const cors = require('cors');

require('dotenv').config();

const app = express();

// Cors
app.use(cors());

// Init Middleware
app.use(express.json({ extended: false }));

// Express body parser
app.use(express.urlencoded({ extended: true }))

// Http Context
app.use(httpContext.middleware);

// Set Request Id
app.use(setHttpContext);

// Afterware
app.use(apiEndLog)

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

// Passport Config
require('./config/passport')(passport);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Logger for request starts middleware
app.use(apiStartLog);

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/companies', require('./routes/api/companies'));
app.use('/api/roles', require('./routes/api/roles'));
app.use('/api/invitation', require('./routes/api/invitation'));
app.use('/api/products', require('./routes/api/products'));
app.use('/api/lots', require('./routes/api/lots'));
app.use('/api/inventory', require('./routes/api/inventory'));
app.use('/api/count', require('./routes/api/count'));
app.use('/api/countGroups', require('./routes/api/countGroups'));

const PORT = process.env.BACKEND_PORT || 5000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => console.log(`Server started on port ${PORT}`));
