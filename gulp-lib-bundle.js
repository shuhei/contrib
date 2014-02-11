var gutil = require('gulp-util');
var util = require('util');
var path = require('path');
var Readable = require('stream').Readable;

module.exports = function (libs, opts) {
  var cwd = opts.cwd ? path.resolve(opts.cwd) : process.cwd();
  var filepath = path.resolve(opts.path);
  var base = opts.base ? path.resolve(opts.base) : path.dirname(filepath);
  var contents = libs.map(function (lib) {
    return util.format("require('%s');", lib);
  }).join("\n");

  var fileOpts = {
    cwd: cwd,
    base: base,
    path: filepath,
    contents: new Buffer(contents)
  };

  var readable = new Readable({ objectMode: true });
  readable._read = function () {
    this.push(new gutil.File(fileOpts));
    this.push(null);
  };
  return readable;
};
