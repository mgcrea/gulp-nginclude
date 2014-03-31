/* jshint node:true */
'use strict';

var fs = require('fs');
var path = require('path');
var cheerio = require('cheerio');
var glob = require('glob');
var gutil = require('gulp-util');
var through = require('through2');
var PluginError = gutil.PluginError;

module.exports = function(opt) {

  function transform(file, encoding, next) {

    if(file.isNull()) {
      return next(null, file); // pass along
    }

    var $ = cheerio.load(file.contents.toString('utf8'));

    // This function receives an ng-include src and tries to read it from the filesystem
    function readSource(src) {
      var cwd = path.dirname(file.path);
      var match = glob.sync(src, {cwd: cwd});
      if(!match.length) return next(new PluginError('gulp-nginclude', 'File "' + src + '" not found'));
      return fs.readFileSync(path.join(cwd, match[0])).toString();
    }

    function processTag(i, ng) {
      var $ng = $(ng);
      var src = $ng.attr('src') || $ng.attr('ng-include');
      if(!src.match(/^'[^']+'$/g)) return;

      // Remove old ng-include attributes so Angular doesn't read them
      $ng.removeAttr('src').removeAttr('ng-include');

      var before = "\n<!-- ngInclude: " + src + " -->\n";
      var after = "\n<!--/ngInclude: " + src + " -->\n";
      var include = readSource(src.substr(1, src.length - 2));
      $ng.html(before + include + after);
    }

    // Use while to make the task recursive
    while (true) {
      var tags = $('ng-include, [ng-include]');

      // If we don't find any more ng-include tags, we're done
      if (tags.length === 0) {
        file.contents = new Buffer($.html());
        return next(null, file);
      }

      // For each tag, grab the associated source file and sub it in
      tags.each(processTag);
    }

  }

  return through.obj(transform);

};
