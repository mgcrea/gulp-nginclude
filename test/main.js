var pkg = require('../package.json');
var nginclude = require('../' + pkg.main);
var fs = require('fs');
var path = require('path');
var extend = require('lodash.assign');
var File = require('gulp-util').File;
var Buffer = require('buffer').Buffer;
var should = require('should');
require('mocha');

describe('gulp-nginclude', function() {

  var defaults = {
    path: path.join(__dirname, 'fixtures/file.html'),
    cwd: __dirname,
    base: path.join(__dirname, 'fixtures')
  };
  console.log(defaults);

  beforeEach(function() {
  });

  describe('nginclude()', function() {

    it('should pass through file', function(done) {

      var fixture = new File(extend({contents: new Buffer('<div>foo</div>')}, defaults));

      var stream = nginclude();
      stream.on('data', function(newFile) {
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.relative);
        should.exist(newFile.contents);
        should.equal(newFile.contents.toString(), '<div>foo</div>');
        newFile.path.should.equal(path.join(__dirname, 'fixtures/file.html'));
        newFile.relative.should.equal('file.html');
      });
      stream.once('end', done);
      stream.write(fixture);
      stream.end();

    });

    it('should properly include default templates', function(done) {

      var fixture = new File(extend({contents: fs.readFileSync(__dirname + '/fixtures/test-default.html')}, defaults));
      var expected = fs.readFileSync(__dirname + '/expected/test-default.html');

      var stream = nginclude();
      stream.on('data', function(newFile) {
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.relative);
        should.exist(newFile.contents);
        should.equal(newFile.contents.toString(), expected.toString());
        newFile.path.should.equal(path.join(__dirname, 'fixtures/file.html'));
        newFile.relative.should.equal('file.html');
      });
      stream.once('end', done);
      stream.write(fixture);
      stream.end();

    });

    it('should properly include recursive templates', function(done) {

      var fixture = new File(extend({contents: fs.readFileSync(__dirname + '/fixtures/test-recursive.html')}, defaults));
      var expected = fs.readFileSync(__dirname + '/expected/test-recursive.html');

      var stream = nginclude();
      stream.on('data', function(newFile) {
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.relative);
        should.exist(newFile.contents);
        should.equal(newFile.contents.toString(), expected.toString());
        newFile.path.should.equal(path.join(__dirname, 'fixtures/file.html'));
        newFile.relative.should.equal('file.html');
      });
      stream.once('end', done);
      stream.write(fixture);
      stream.end();

    });


    it('should properly ignore variables templates', function(done) {

      var fixture = new File(extend({contents: fs.readFileSync(__dirname + '/fixtures/test-variables.html')}, defaults));
      var expected = fs.readFileSync(__dirname + '/expected/test-variables.html');

      var stream = nginclude();
      stream.on('data', function(newFile) {
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.relative);
        should.exist(newFile.contents);
        should.equal(newFile.contents.toString(), expected.toString());
        newFile.path.should.equal(path.join(__dirname, 'fixtures/file.html'));
        newFile.relative.should.equal('file.html');
      });
      stream.once('end', done);
      stream.write(fixture);
      stream.end();

    });


    // it('should properly handle dynamic ngIncludes', function(done) {

    //   var fixture = new File(extend({contents: new Buffer('<div ng-include="foo"></div>\n<div ng-include="\'bar.html\'"></div>\n<div>baz</div>')}, defaults));
    //   var include = '<!-- ngInclude: \'bar.html\' -->\n<div>bar</div>';

    //   var stream = nginclude();
    //   stream.on('data', function(newFile) {
    //     should.exist(newFile);
    //     should.exist(newFile.path);
    //     should.exist(newFile.relative);
    //     should.exist(newFile.contents);
    //     should.equal(newFile.contents.toString(), ['<div ng-include="foo"></div>', include, '<div>baz</div>'].join('\n'));
    //     newFile.path.should.equal(path.join(__dirname, 'fixtures/file.html'));
    //     newFile.relative.should.equal('file.html');
    //   });
    //   stream.once('end', done);
    //   stream.write(fixture);
    //   stream.end();

    // });

  });

});
