/*
 * gulp-html-minifier
 *
 * Forked version of gulp-htmlmin
 * https://github.com/jonschlinkert/gulp-htmlmin
 *
 * Copyright (c) 2014 Jon Schlinkert
 * Licensed under the MIT license.
 */
/* globals describe, it */
'use strict';
var fs = require('fs'),
	path = require('path'),
	gutil = require('gulp-util'),
	expect = require('chai').expect,
	minify = require('../index.js'),
	expectedNormal = fs.readFileSync(path.join(__dirname, 'expected/normal.html')),
	expectedCollapse = fs.readFileSync(path.join(__dirname, 'expected/collapse.html')),
	expectedIgnorePath,
	fakeFile,
	stripFile,
	errorFile,
	errorContents;
function unixify (filepath) {
	return filepath.replace(/\\/g, '/');
}
expectedIgnorePath = unixify(path.join(__dirname, 'fixtures/index.html'));
fakeFile = new gutil.File({
	base: path.join(__dirname, 'fixtures'),
	cwd: __dirname,
	path: path.join(__dirname, 'fixtures/index.html'),
	contents: fs.readFileSync(path.join(__dirname, 'fixtures/index.html'))
});
stripFile = new gutil.File({
	base: path.join(__dirname, 'fixtures'),
	cwd: __dirname,
	path: path.join(__dirname, '/web/fixtures/index.html'),
	contents: fs.readFileSync(path.join(__dirname, 'fixtures/index.html'))
});
errorContents = '<<div>error in this file</div>';
errorFile = new gutil.File({
  base: path.join(__dirname, 'fixtures'),
  cwd: __dirname,
  path: path.join(__dirname, 'fixtures/error.html'),
  contents: new Buffer(errorContents)
});
describe('gulp-html-minifier HTML minifier', function () {
	it('should minify my HTML files', function (done) {
		var stream = minify();
		stream.once('data', function(newFile){
		  expect(newFile).to.not.be.null;
		  expect(String(newFile.contents)).to.equal(String(expectedNormal));
		  done();
		});
		stream.write(fakeFile);
	});
	it('should ignore unneeded path', function (done) {
		var stream = minify({ignorePath: '/web'});
		stream.once('data', function(newFile){
			expect(newFile).to.not.be.null;
			expect(String(newFile.path)).to.equal(String(expectedIgnorePath));
			done();
		});
		stream.write(stripFile);
	});
	it('should collapse whitespace', function (done) {
		var stream = minify({collapseWhitespace: true});
		stream.once('data', function(newFile){
			expect(newFile).to.not.be.null;
			expect(String(newFile.contents)).to.equal(String(expectedCollapse));
			done();
		});
		stream.write(fakeFile);
	});
	it('should return file.contents as a buffer', function (done) {
		var stream = minify();
		stream.once('data', function(newFile){
			expect(newFile.contents).to.be.an.instanceOf(Buffer);
			done();
		});
		stream.write(fakeFile);
	});
	it('should return file.contents as a buffer with lint option', function (done) {
		var stream = minify({ lint: true });
		stream.once('data', function(newFile){
			expect(newFile.contents).to.be.an.instanceOf(Buffer);
			done();
		});
		stream.write(fakeFile);
	});
	it('should throw a gulp error', function(done) {
		var stream = minify();
		stream.on('error', function (err) {
			expect(err.message).to.equal('Parse Error: ' + errorContents);
			done();
		});
		stream.on('end', function () {
			done();
		});
		stream.write(errorFile);
		stream.end();
	});
	it('should throw a gulp error with a stack trace', function(done) {
		var stream = minify({showStack: true});
		stream.on('error', function (err) {
			expect(err.message).to.equal('Parse Error: ' + errorContents);
			expect(err.showStack).to.be.true;
			done();
		});
		stream.on('end', function () {
			done();
		});
		stream.write(errorFile);
		stream.end();
	});
});
