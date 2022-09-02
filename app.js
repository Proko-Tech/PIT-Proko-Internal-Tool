const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const parkingLotRouter = require('./routes/parking_lot');
const ticketsRouter = require('./routes/tickets');
const complaintsRouter = require('./routes/complaints');
const dashboardRouter = require('./routes/dashboard');
const firmwareRouter = require('./routes/firmware');
const defectsRouter = require('./routes/defects');
const spotsRouter = require('./routes/spots');
const v0Router = require('./routes/v0');

const verifyToken = require('./middleware/verifyToken');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', verifyToken, usersRouter);
app.use('/parking', verifyToken, parkingLotRouter);
app.use('/tickets', verifyToken, ticketsRouter);
app.use('/complaints', verifyToken, complaintsRouter);
app.use('/defects', verifyToken, defectsRouter);
app.use('/dashboard', verifyToken, dashboardRouter);
app.use('/firmware', verifyToken, firmwareRouter);
app.use('/spots', verifyToken, spotsRouter);
app.use('/v0', verifyToken, v0Router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
