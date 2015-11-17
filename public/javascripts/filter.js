$(document).ready(function() {

  // code for the language selection dropdown

  function addFilterListener($language_selector) {
    $language_selector.click(function () {
      var language = $(this).text().toLowerCase();
      $('.song-category').each(function(index, category) {
        var $c = $(category);
        if (!$c.hasClass(language)) {
          $c.addClass("hide");
        } else {
          $c.removeClass("hide");
        }
      });
    })
  }

  $('.language-selector').each(function () {
    addFilterListener($(this));
  });

});
