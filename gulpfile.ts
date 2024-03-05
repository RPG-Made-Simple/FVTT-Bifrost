import { src, series, dest, parallel } from 'gulp';

const fs = require('fs');
const sourcemaps = require('gulp-sourcemaps');
const jsonMinify = require('gulp-json-minify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');
const uglify = require('gulp-uglify');
const buffer = require('vinyl-buffer');
const ts = require('gulp-typescript');
const jsonEditor = require('gulp-json-editor');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

function genDeclarations() {
  let tsProject = ts.createProject('tsconfig.json', {
    declaration: true,
    emitDeclarationOnly: true,
  });

  return tsProject.src()
    .pipe(tsProject())
    .pipe(dest('./types'));
}

function langBundle() {
  return src(langSource.concat('/*.json'))
    .pipe(jsonMinify())
    .pipe(dest(langDir));
}

// This will package the module.json file at the out directory with the right
// data and information
function moduleJsonBundle() {
  return src('./module.json')
    .pipe(jsonEditor((json) => {
      const config = require('./config.json');
      const repository = config.details.repository;

      // Information
      json.id = config.details.name.toLowerCase();
      json.title = config.details.displayName.concat(" (Library)");
      json.version = config.details.version;
      json.description = config.details.internalDescription;

      // Technical
      json.library = config.details.library;
      json.socket = config.details.socket;

      // Links
      json.url = repository;
      json.license = repository.concat('/LICENSE');
      json.bugs = repository.concat('/issues');
      json.manifest = repository.concat('/releases/latest/download/module.json');
      json.download = repository.concat('/releases/latest/download/module.zip');
      json.readme = repository.concat('/blob/main/README.md');
      json.changelog = repository.concat('/blob/main/CHANGELOG.md');

      return json;
    }))
    .pipe(jsonMinify())
    .pipe(dest(packageDir));
}

// This will modify just the values that are a pain keep editing when doing new
// releases
function packageJsonBundle() {
  return src('./package.json')
    .pipe(jsonEditor((json) => {
      const config = require('./config.json');
      const repository = config.details.repository;

      json.name = 'fvtt-'.concat(config.details.name.toLowerCase());
      json.version = config.details.version;
      json.description = config.details.externalDescription
      json.repository = {
        type: "git",
        url: repository,
      }

      return json;
    }))
    .pipe(dest('./'));
}

function linkModule() {
  const config = require('./config.json');
  readline.question('Enter your FoundryVTT data folder path:', path => {

    fs.symlink(__dirname + '/module', path + '/modules/' + config.details.name.toLowerCase(), 'dir', (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Successfully created a symlink between your FoundryVTT data folder and the module');
      }
    })

    readline.close();
    return Promise.resolve('Successfully linked');
  });
}

function publish() {

}

const buildTask = process.env.NODE_ENV === 'production' ?
  series(
    parallel(
      tsBundle,
      langBundle,
      moduleJsonBundle,
      genDeclarations,
    ),
    publish,
  ) :
  series(
    clean,
    parallel(
      tsBundle,
      langBundle,
      moduleJsonBundle,
      genDeclarations,
    ),
  );

const prepareTask = series(
  clean,
  parallel(
    packageJsonBundle
  )
);

const linkTask = linkModule;

exports.build = buildTask;
exports.clean = clean;
exports.default = buildTask;
exports.prepare = prepareTask;
exports.link = linkTask;
