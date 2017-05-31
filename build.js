const csso = require('csso');
const fs = require('mz/fs');
const babel = require('babel-core');
const glob = require('glob');
const path = require('path');
const AsyncArray = require('./async_array.js')
const package = require('./package.json');

Promise.all([
  copyStatic(),
  minifyCss(),
  minifyJs(),
])
  .then(_ => console.log('Done'))
  .catch(err => console.log(err));

const cssoConfig = {
  restructure: true,
  sourceMap: true,
};

const babelConfig = {
  presets: ["babili"],
};

const templateData = {
  'VERSION': package.version,
};

async function copyStatic() {
  filesWithPatterns([/\.php$/i, /.htaccess$/i])
    .map(async file => copy(`src/${file}`, `dist/${file}`))
    .array;
}

async function minifyCss() {
  filesWithPatterns([/\.css$/i])
    .map(async file => ({name: file, contents: await fs.readFile(`src/${file}`)}))
    .map(async file => Object.assign(file, {contents: file.contents.toString('utf-8')}))
    .map(async file => {
      const cssoConfigCopy = Object.assign({}, cssoConfig, {filename: file.name});
      return Object.assign(file, {csso: csso.minify(file.contents, cssoConfigCopy)});
    })
    .map(async file => {
      await fs.writeFile(`dist/${file.name}`, `${file.csso.css}/*# sourceMappingURL=${file.name}.map */`);
      await fs.writeFile(`dist/${file.name}.map`, file.csso.map.toString());
    })
    .array;
}

async function minifyJs() {
  filesWithPatterns([/\.js$/i])
    .map(async file => ({name: file, contents: await fs.readFile(`src/${file}`)}))
    .map(async file => Object.assign(file, {contents: file.contents.toString('utf-8')}))
    .map(async file => {
      for(const [key, val] of Object.entries(templateData)) {
        file.contents = file.contents.replace(`{%${key}%}`, val);
      }
      return file;
    })
    .map(async file => Object.assign(file, {code: babel.transform(file.contents, babelConfig).code}))
    // .map(async file => Object.assign(file, {code: file.contents, map: ''}))
    .map(async file => {
      const dir = path.dirname(file.name);
      await mkdirAll(`dist/${dir}`);
      await fs.writeFile(`dist/${file.name}`, file.code);
    })
    .array;
}

var files;
function filesWithPatterns(regexps) {
  if(!files) {
    files = AsyncArray.from(new Promise((resolve, reject) => glob('src/**', {dot: true}, (err, f) => err ? reject(err) : resolve(f))))
      .map(async file => file.substr(4));
  }
  return files.filter(async file => regexps.some(regexp => regexp.test(file)));
}

async function copy(from, to) {
  const data = await fs.readFile(from);
  const dir = path.dirname(to);
  await mkdirAll(dir);
  await fs.writeFile(to, data);
}

async function mkdirAll(dir) {
  const elems = dir.split(path.delimiter);
  await elems.reduce(async (p, newPath) => {
    const oldPath = await p;
    const newDir = path.join(oldPath, newPath);
    await fs.mkdir(newDir).catch(_ => {});
    return newDir;
  }, Promise.resolve(''));
}
