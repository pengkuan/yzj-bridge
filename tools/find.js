var path = require('path');
var through2 = require('through2');
var gutil = require('gulp-util');


module.exports = function(callback){


  var stream = through2.obj(function (file, enc, cb) {
    if (file.isStream()) {
      this.push(file);
      return cb();
    }


    var filepath = file.path;
    var cwd = file.cwd;
    // var relative = path.relative(cwd, filepath);
    callback(filepath , file);
    this.push(file)
    this.resume()
    cb();
  });

  return stream;
};