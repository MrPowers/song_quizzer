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
  var categories = [
    ['english', 'hot'],
    ['spanish', 'hot'],
    ['english', 'pop'],
    ['spanish', 'pop'],
    ['english', 'rap'],
    ['spanish', 'chill'],
    ['english', 'boy-band'],
  ];
  var data = categories.map(function(c) {
    var songs = appdata.songs.filter(s => s.language === c[0] && s.genre === c[1]);
    return {
      all: _.chunk(songs, 4),
      language: c[0],
      genre: c[1]
    }
  });
  response.render('index', {
    songData: data,
    showLanguageFilter: true,
    showDifficultyFilter: false
  });
})

var fs = require('fs');
var path = require('path');

app.get('/:artist/:song', function(request, response) {
  var filePath = path.join(__dirname, 'song_data', request.params.song + '.txt');
  var newline = require('os').EOL;
  var data = fs.readFileSync(filePath).toString().split(newline);
  var difficultyToLines = {
    easy: 4,
    normal: 3,
    hard: 2,
    insane: 1
  };
  var difficulty = request.query.difficulty;
  var linesPerBlank = difficultyToLines[difficulty]
  var counter = _.random(1, linesPerBlank);
  var rows = data.map(function(row) {
    if (row === '') {return ''};
    var words = row.split(" ");
    if (words[0] === "SKIP") { return(words.slice(1, words.length).join(" ")) };
    if (linesPerBlank == counter) {
      counter = 1;
      var indexes = [];
      words.forEach(function(w, i) { if(!w.startsWith("SKIP")) {return indexes.push(i)} });
      var i = _.sample(indexes);
      if (indexes.length === 0) { return(words.join(" ")) };
      var answer = words[i].replace(/[?.,\/#!$%\^&\*;:{}=\_`~()]/g,"");
      words[i] = '<input type="text" data-answer="' + answer + '" placeholder="ingrese la palabra">';
      return(words.join(" "));
    } else {
      counter++;
      return(row);
    }
  });

  rows = rows.map(row => row.replace(/SKIP/g, ""));

  var foundSong = appdata.songs.find(s => s.name === request.params.song);
  response.render('smart_song_quiz', {
    song: foundSong,
    songData: rows,
    showLanguageFilter: false,
    showDifficultyFilter: true,
    difficulty: difficulty
  } );
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
