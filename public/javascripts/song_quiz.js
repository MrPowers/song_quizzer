$(document).ready(function() {


  function setLyrics() {
    var params = $('.parameters').data();
    $.get( '/lyrics', params, function(data) {
      var $lyrics = $('.lyric-quiz');
      $lyrics.empty();
      data.forEach(function(row) {
        $lyrics.append(row + "<br />");
      });
      main();
    });
  }

  setLyrics();

  function updateDifficultyDisplay() {
    var difficulty = $('.parameters').data('difficulty');
    $('.current-difficulty').text(difficulty);
  }

  $.each($(".language-selector"), function( index, value ) {
    $( value ).click(function() {
      var difficulty = $(this).data('difficulty');
      $('.parameters').data('difficulty', difficulty);
      setLyrics();
      updateDifficultyDisplay();
    });
  });

  // code for the input boxes for lyric answers

  function checkCorrectness($input) {
    $input.focus(function() {
      // can add stuff here
    }).blur(function() {
      markCorrectness($input);
    });
  }

  function markCorrectness($input) {
    addCorrectnessClass($input);
    showCorrectness($input);
    grade();
  }

  function grade() {
    var numCorrect = $("input.correct").length;
    $('.score').html(numCorrect);
  }

  function setInitialScore() {
    var totalQuestions = $("input").length;
    $('.total-questions').html(totalQuestions);
    grade()
  }

  function addCorrectnessClass($input) {
    var userAnswer = $input.val().toLowerCase();
    var correctAnswer = $input.data("answer").toLowerCase();
    if (userAnswer === "") return;
    if (userAnswer === correctAnswer) {
      $input.addClass("correct");
      $input.removeClass("incorrect");
    } else {
      $input.addClass("incorrect");
      $input.removeClass("correct");
    }
  }

  function showCorrectness($input) {
    var s = $input.next(".answer-correctness");
    if ($input.hasClass("correct")) {
      var correctCheck = "<span class='correct fa-stack fa-1x'><i class='fa fa-check-circle fa-2x'></i></span>";
      s.html(correctCheck)
    } else if ($input.hasClass("incorrect")) {
      var correctAnswer = $input.data("answer");
      var incorrectCross = "<span class='incorrect fa-stack fa-1x'><i class='fa fa-times-circle fa-2x'></i></span>"
      var help = '<span data-toggle="tooltip" data-placement="top" data-original-title="' + correctAnswer + '" class="fa-stack fa-1x"><i class="fa fa-question-circle fa-2x"></i></span>'
      s.html(incorrectCross + help)
      $('[data-toggle="tooltip"]').tooltip({ container: 'body' });
    }
  }

  function addEnterListener($input) {
    $input.on('keypress', function (event) {
      if(event.which === 13){
        markCorrectness($input);
      }
    });
  }


  function main() {
    $.each($("input"), function( index, value ) {
      var $value = $(value);
      // add spans after all the input boxes for the markCorrectness() function
      $("<span class='answer-correctness'></span>").insertAfter($value)
      setInitialScore();
      checkCorrectness($value);
      addEnterListener($value);
    });
  }

  $(window).resize(function() {
    // This will fire each time the window is resized:
    if($(window).width() >= 1024) {
      // if larger or equal
      $('.lyric-quiz').addClass('quiz-scroller');
    } else {
      $('.lyric-quiz').removeClass('quiz-scroller');
    }
  }).resize(); // This will simulate a resize to trigger the initial run.

});
