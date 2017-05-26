const csso = require('csso');
const fs = require('mz/fs');
const babel = require('babel-core');
const glob = require('glob');
const path = require('path');

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

async function copyStatic() {
  let files = await filesWithPatterns([/\.php$/i]);
  files = files.map(file => copy(`src/${file}`, `dist/${file}`))
  await Promise.all(files);
}

async function minifyCss() {
  let files = await filesWithPatterns([/\.css$/i]);
  files = await readAll(files);
  files.forEach(file => file.csso = csso.minify(file.content, Object.assign({}, cssoConfig, {filename: file.name})));
  const cssFiles = files.map(file => fs.writeFile(`dist/${file.name}`, `${file.csso.css}/*# sourceMappingURL=${file.name}.map */`));
  const maps = files.map(file => fs.writeFile(`dist/${file.name}.map`, file.csso.map.toString()));
  await Promise.all([...cssFiles, ...maps]);
}

async function minifyJs() {
  let files = await filesWithPatterns([/\.js$/i]);
  files = files.map(file => new Promise((resolve, reject) => babel.transformFile(`src/${file}`, babelConfig, (err, result) => err ? reject(err) : resolve({code: result.code, name: file}))));
  files = await Promise.all(files);
  files = files.map(async file => {
    const dir = path.dirname(file.name);
    await mkdirAll(`dist/${dir}`);
    return fs.writeFile(`dist/${file.name}`, file.code);
  });
  await Promise.all(files);
}

var files = [];
async function filesWithPatterns(regexps) {
  if(!files) {
    files = await new Promise((resolve, reject) => glob('src/**', (err, f) => err ? reject(err) : resolve(f)));
    files = files.map(file => file.substr(4));
  }
  return files.filter(file => regexps.some(regexp => regexp.test(file)));
}

async function copy(from, to) {
  const data = await fs.readFile(from);
  const dir = path.dirname(to);
  await mkdirAll(dir);
  await fs.writeFile(to, data);
}

async function readAll(files) {
  const contents = await Promise.all(files.map(file => fs.readFile(`src/${file}`)));
  return files.map((_, i) => ({name: files[i], content: contents[i].toString('utf-8')}));
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
