const Router = require("express").Router,
      appdata = require("../data/songs.json"),
      _ = require("lodash"),
      fs = require('fs'),
      os = require('os'),
      path = require('path');

module.exports = function() {
  const router = new Router();

  function song(songName) {
    return appdata.songs.find(s => s.name === songName);
  }

  function difficultyToLines() {
    return {
      easy: 4,
      normal: 3,
      hard: 2,
      insane: 1
    };
  }

  router.route('/').get(function(request, response) {
    var filePath = path.join(__dirname, '..', 'song_data', song(request.query.song).name + '.txt');
    var newline = os.EOL;
    var data = fs.readFileSync(filePath).toString().split(newline);
    var linesPerBlank = difficultyToLines()[request.query.difficulty];
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

  return router;
};

