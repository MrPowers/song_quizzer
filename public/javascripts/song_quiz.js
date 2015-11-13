$(document).ready(function() {
  function colorize(input) {
    input.focus(function() {
      console.log('in');
    }).blur(function() {
        var v = $(this).val();
        var a = $(this).data("answer");
        if (v === a) {
          $(this).addClass("correct");
          $(this).removeClass("incorrect");
        } else {
          $(this).addClass("incorrect");
          $(this).removeClass("correct");
        }
    });
  }
  $.each($("input"), function( index, value ) {
    colorize($(value));
  });
});
