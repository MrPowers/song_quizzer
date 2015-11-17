var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var appdata = require("./data.json")
var _ = require("lodash")

app.get('/', function(request, response) {
  var spanishSongs = appdata.songs.filter(s => s.language === "spanish");
  var englishSongs = appdata.songs.filter(s => s.language === "english");
  response.render('index', {
    songData: [
      {
        name: "Spanish Songs",
        all: _.chunk(spanishSongs, 4),
        id: "spanish-songs",
        language: "spanish"
      },
      {
        name: "English Songs",
        all: _.chunk(englishSongs, 4),
        id: "english-songs",
        language: "english"
      }
    ]
  });
})

app.get('/:artist/:song', function(request, response) {
  var foundSong = appdata.songs.find(s => s.name === request.params.song);
  response.render('song_quiz', { song: foundSong } );
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
