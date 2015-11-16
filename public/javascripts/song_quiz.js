$(document).ready(function() {

  function checkCorrectness(input) {
    input.focus(function() {
      // can add stuff here
    }).blur(function() {
        var userAnswer = $(this).val();
        var correctAnswer = $(this).data("answer");
        if (userAnswer === "") return;
        if (userAnswer === correctAnswer) {
          $(this).addClass("correct");
          $(this).removeClass("incorrect");
        } else {
          $(this).addClass("incorrect");
          $(this).removeClass("correct");
        }
        markCorrectness(input);
    });
  }

  function markCorrectness($input) {
    var s = $input.next(".answer-correctness");
    if ($input.hasClass("correct")) {
      var correctCheck = "<span class='correct fa-stack fa-1x'><i class='fa fa-check-circle fa-2x'></i></span>";
      s.html(correctCheck)
    } else if ($input.hasClass("incorrect")) {
      var correctAnswer = $input.data("answer");
      var incorrectCross = "<span class='incorrect fa-stack fa-1x'><i class='fa fa-times-circle fa-2x'></i></span>"
      var help = "<span data-toggle='tooltip' data-placement='top' data-original-title=" + correctAnswer + " class='fa-stack fa-1x'><i class='fa fa-question-circle fa-2x'></i></span>"
      s.html(incorrectCross + help)
      $('[data-toggle="tooltip"]').tooltip();
    }
  }

  $.each($("input"), function( index, value ) {
    // add spans after all the input boxes for the markCorrectness() function
    $("<span class='answer-correctness'></span>").insertAfter($(value))
    checkCorrectness($(value));
  });

});
