const Router = require("express").Router,
      appdata = require("../data/songs.json"),
      songCategories = require("../data/song_categories.json").categories,
      _ = require("lodash");

module.exports = function() {
  const router = new Router();

  router.route('/').get(function(request, response) {
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

  router.route('/:artist/:song').get(function(request, response) {
    var foundSong = appdata.songs.find(s => s.name === request.params.song);
    response.render('smart_song_quiz', {
      song: foundSong,
      showLanguageFilter: false,
      showDifficultyFilter: true,
      // HARDCODED
      difficulty: "normal"
    } );
  });

  return router;
};

