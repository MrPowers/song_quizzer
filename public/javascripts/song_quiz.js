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
    var s = $input.next("span");
    if ($input.hasClass("correct")) {
      s.replaceWith("<span class='correct fa-stack fa-1x'><i class='fa fa-check-circle fa-2x'></i></span>")
    } else if ($input.hasClass("incorrect")) {
      s.replaceWith("<span class='incorrect fa-stack fa-1x'><i class='fa fa-times-circle fa-2x'></i></span>")
    }
  }

  $.each($("input"), function( index, value ) {
    // add spans after all the input boxes for the markCorrectness() function
    $("<span></span>").insertAfter($(value))
    checkCorrectness($(value));
  });

});
