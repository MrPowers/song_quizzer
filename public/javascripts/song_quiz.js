$(document).ready(function() {

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

  function addCorrectnessClass($input) {
    var userAnswer = $input.val().toLowerCase();
    var correctAnswer = $input.data("answer");
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
      var help = "<span data-toggle='tooltip' data-placement='top' data-original-title='" + correctAnswer + "' class='fa-stack fa-1x'><i class='fa fa-question-circle fa-2x'></i></span>"
      s.html(incorrectCross + help)
      $('[data-toggle="tooltip"]').tooltip();
    }
  }

  function addEnterListener($input) {
    $input.on('keypress', function (event) {
      if(event.which === 13){
        markCorrectness($input);
      }
    });
  }


  $.each($("input"), function( index, value ) {
    var $value = $(value);
    // add spans after all the input boxes for the markCorrectness() function
    $("<span class='answer-correctness'></span>").insertAfter($value)
    checkCorrectness($value);
    addEnterListener($value);
  });

});
