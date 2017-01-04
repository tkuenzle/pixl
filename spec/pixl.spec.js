var pixl = require('../pixl');
var path = require('path');

describe('Calling goPixelate with faulty paramters', function () {

  it("throws an error if input image does not exist.", function(done) {
    var callback = function (err) {
      expect(err).not.toBe(0);
      done();
    };
    pixl.goPixelate("", ".", 5, 1, callback);
  });

  it("throw an error if output directory does not exist.", function(done) {
    var callback = function (err) {
      expect(err).not.toBe(0);
      done();
    }
    pixl.goPixelate(path.resolve(__dirname, "lenna.png"), "notexisting", 5, 1, callback);
  });
});
