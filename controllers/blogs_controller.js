const Router = require("express").Router;

module.exports = function() {
  const router = new Router();

  router.route('/learn-spanish-music-television-movies').get(function(request, response) {
    response.render('learn_spanish', {
      showLanguageFilter: false,
      showDifficultyFilter: false
    });
  });

  router.route('/language-tutor').get(function(request, response) {
    response.render('language_tutor', {
      showLanguageFilter: false,
      showDifficultyFilter: false
    });
  });

  return router;
};

