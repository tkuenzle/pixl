pixl = require('./pixl.js')
const {dialog} = require('electron').remote

function chooseImage () {
  dialog.showOpenDialog({title: "Please choose an image",
    properties: ["openFile"],
    filters: [
    {name: 'Images', extensions: ['jpg', 'jpeg', 'png']},
    {name: 'All Files', extensions: ['*']}
  ]
}, function (filename) {
    if (filename !== undefined)
      $('.form-control')[0].value = filename;
  });
}

function chooseOutputDir () {
  dialog.showOpenDialog({
    title: "Please choose an output path",
    properties: ["openDirectory"]
  }, function (outputpath) {
    if (outputpath !== undefined)
      $('.form-control')[1].value = outputpath;
  });
}

function go () {
  $('.btn').prop('disabled', true);
  $('.alert').prop('hidden', true);
  pixl.goPixelate($('.form-control')[0].value, $('.form-control')[1].value, parseInt($('.form-control')[2].value), parseInt($('.form-control')[3].value),done);
}

function done() {
  $('.btn').prop('disabled', false);
  $('.alert').prop('hidden', false);
}

module.exports.chooseImage = chooseImage
module.exports.chooseOutputDir = chooseOutputDir
module.exports.go = go
