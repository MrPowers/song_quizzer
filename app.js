/*jslint node: true */
"use strict";

const express = require('express'),
      path = require('path'),
      logger = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      favicon = require('serve-favicon');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));

app.use("/blog", require(path.join(__dirname, "controllers", "blogs_controller.js"))());

var appdata = require("./data/songs.json");
var songCategories = require("./data/song_categories.json").categories;
var _ = require("lodash");

app.get('/', function(request, response) {
  var data = songCategories.map(function(c) {
    var songs = appdata.songs.filter( s =>
      s.language === c.language && s.genre === c.genre && s.hot === c.hot
    );
    var shuffledSongs = _.shuffle(songs);
    return {
      all: _.chunk(shuffledSongs, 4),
      category: c,
      id: c.language + "-" + c.genre + "-" + c.hot
    };
  });
  response.render('index', {
    songData: data,
    showLanguageFilter: true,
    showDifficultyFilter: false
  });
});


var fs = require('fs');

app.get('/:artist/:song', function(request, response) {
  var foundSong = appdata.songs.find(s => s.name === request.params.song);
  response.render('smart_song_quiz', {
    song: foundSong,
    showLanguageFilter: false,
    showDifficultyFilter: true,
    // HARDCODED
    difficulty: "normal"
  } );
});

app.get('/lyrics', function(request, response) {
  var song = appdata.songs.find(s => s.name === request.query.song);
  var filePath = path.join(__dirname, 'song_data', song.name + '.txt');
  var newline = require('os').EOL;
  var data = fs.readFileSync(filePath).toString().split(newline);
  var difficultyToLines = {
    easy: 4,
    normal: 3,
    hard: 2,
    insane: 1
  };
  var linesPerBlank = difficultyToLines[request.query.difficulty];
  var counter = _.random(1, linesPerBlank);
  var rows = data.map(function(row) {
    if (row === '') {
      return '';
    }
    var words = row.split(" ");
    if (words[0] === "SKIP") {
      return(words.slice(1, words.length).join(" "));
    }
    if (linesPerBlank === counter) {
      counter = 1;
      var indexes = [];
      words.forEach(function(w, i) {
        if(!w.startsWith("SKIP")) { return indexes.push(i); }
      });
      var i = _.sample(indexes);
      if (indexes.length === 0) {
        return(words.join(" "));
      }
      var answer = words[i].replace(/[?.,\/#!$%\^&\*;:{}=\_`~()]/g,"");
      var inputSize = answer.length + _.random(1, 5);
      words[i] = '<input type="text" size="' + inputSize + '" data-answer="' + answer + '">';
      return(words.join(" "));
    } else {
      counter++;
      return(row);
    }
  });

  rows = rows.map(row => row.replace(/SKIP/g, ""));
  response.send(rows);
});

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
