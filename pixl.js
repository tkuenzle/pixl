var Jimp = require("jimp");
var path = require("path")
var fs = require("fs");

function pixelateImage(image, pixelsize, path, callback) {
  var width = image.bitmap.width;
  var height = image.bitmap.height;
  var small = image.resize(width/pixelsize, Jimp.AUTO);
  var big = new Jimp(width, height, function (err, image) {
    for (var x=0; x<small.bitmap.width; x++) {
      for (var y=0; y<small.bitmap.height; y++) {
        image.composite(new Jimp(pixelsize, pixelsize, small.getPixelColor(x,y)), x*pixelsize, y*pixelsize);
      }
    }
    image.write(path, callback);
  });
}

function goPixelate(imagepath, outputdir, numberPixel, numberImages, callback) {
  fs.stat(outputdir, function (err, stats) {
    if (err) {
      if (err.code == 'ENOENT') {
        err.message = 'The output directory "' + '" does not exist.';
        err.name = 'MissingOutputDir'
      }
      callback(err);
      return;
    }
    if (!stats.isDirectory()) {
      err = new Error('The output directory "' + '" is not a directory.');
      err.name = 'OutputDirND';
      callback(err);
      return;
    }
    Jimp.read(imagepath, function(err, image) {
      if (err) {
        if (err.code == 'ENOENT') {
          err.message = 'The image at "' + err.path + '" does not exist.';
          err.name = 'MissingInputImage'
        }
        callback(err);
        return;
      }
      if (numberPixel<=0) {
        err = new Error('The initial number of Pixels must be at least one.')
        err.name = 'NumberImagesNonPositive';
        callback(err);
        return;
      }
      var initPixelSize = calcPixelSize(image, numberPixel, numberImages);
      image.crop(0,0,parseInt(image.bitmap.width/initPixelSize)*initPixelSize, parseInt(image.bitmap.height/initPixelSize)*initPixelSize);
      console.log(initPixelSize)
      var parsedInputPath = path.parse(imagepath);
      var outputbase = path.join(outputdir, parsedInputPath.name);
      var counter = numberImages;
      for (var i=0; i<numberImages; i++) {
        var pixelSize = initPixelSize/Math.pow(2,i);
        pixelateImage(image.clone(), pixelSize, outputbase+"_"+i+parsedInputPath.ext, function (err) {
          counter--;
          if (err) {
            if (err.code == 'ENOENT') {
              err.message = 'The image at "' + err.path + '" could not be written.';
              err.name = 'FailOutputImage'
            }
            callback(err);
            return;
          }
          if (counter==0) {
            callback();
          }
        });
      }
    });
  });

}

function calcPixelSize(image, numberPixel, numberImages) {
  var shorterSide = Math.min(image.bitmap.width, image.bitmap.height);
  var idealPixelSize = parseInt(shorterSide/numberPixel);
  return parseInt(idealPixelSize/Math.pow(2,numberImages-1)) * Math.pow(2,numberImages-1)
}

module.exports.goPixelate = goPixelate
