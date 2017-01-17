var lyrics_controller = require("../../controllers/lyrics_controller.js");

var chai = require("chai");
var expect = chai.expect;

describe("song", function() {

  it("converts difficulty to an integer", function() {
    var expected = {
      easy: 4,
      normal: 3,
      hard: 2,
      insane: 1
    };
    expect(difficultyToLines()).to.equal(expected);
  });

});

