var pixl = require('../pixl');
var path = require('path');

describe('Calling goPixelate with faulty paramters', function () {

  it("throws an error if input image does not exist.", function(done) {
    var callback = function (err) {
      expect(err.name).toBe('MissingInputImage');
      done();
    };
    pixl.goPixelate("", ".", 5, 1, callback);
  });

  it("throw an error if output directory does not exist.", function(done) {
    var callback = function (err) {
      expect(err.name).toBe('MissingOutputDir');
      done();
    }
    pixl.goPixelate(path.resolve(__dirname, "lenna.png"), "notexisting", 5, 2, callback);
  });

  it("returns an error if the number of initial pixels is not positive.", function (done) {
    var callback = function (err) {
      expect(err.name).toBe('NumberPixelsNonPositive');
      done();
    };
    pixl.goPixelate(path.resolve(__dirname, "lenna.png"), path.resolve(__dirname), 0, 2, callback);
  });

  it("returns an error if the number of images is not positive.", function (done) {
    var callback = function (err) {
      expect(err.name).toBe('NumberImagesNonPositive');
      done();
    };
    pixl.goPixelate(path.resolve(__dirname, "lenna.png"), path.resolve(__dirname), 1, 0, callback);
  })
});
