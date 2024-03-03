import { src, series, dest, parallel } from 'gulp';

const fs = require('fs');
const sourcemaps = require('gulp-sourcemaps');
const jsonMinify = require('gulp-json-minify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');
const uglify = require('gulp-uglify');
const buffer = require('vinyl-buffer');

const scriptSource = './src';
const langSource = './lang'

const packageDir = './module';
const langDir = packageDir.concat('/lang');

function clean() {
  // Clean package dir
  if (fs.existsSync(packageDir)) {
    try {
      fs.rmSync(packageDir, { recursive: true, force: true });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  return Promise.resolve('Successfully cleaned');
}


function tsBundle() {
  return browserify({
    baseDir: scriptSource,
    debug: true,
    entries: [scriptSource.concat('/module.ts')],
  })
    .plugin(tsify)
    .bundle()
    .pipe(source('module.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(dest(packageDir));
}

function langBundle() {
  return src(langSource.concat('/*.json'))
    .pipe(jsonMinify())
    .pipe(dest(langDir));
}

function moduleJsonBundle() {
  return src('./module.json')
    .pipe(jsonMinify())
    .pipe(dest(packageDir));
}

function publish() {

}

const buildTask = process.env.NODE_ENV === 'production' ?
  series(
    parallel(
      tsBundle,
      langBundle,
      moduleJsonBundle,
    ),
    publish,
  ) :
  series(
    clean,
    parallel(
      tsBundle,
      langBundle,
      moduleJsonBundle,
    ),
  );

exports.build = buildTask;
exports.clean = clean;
exports.default = buildTask;
