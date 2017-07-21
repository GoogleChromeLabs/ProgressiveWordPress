const csso = require('csso');
const fs = require('mz/fs');
const babel = require('babel-core');
const glob = require('glob');
const path = require('path');
const AsyncArray = require('./async_array.js')
const package = require('./package.json');

Promise.all([
  copyStatic(),
  copySystemJS(),
  copyCustomElements(),
  minifyCss(),
  minifyJs(),
])
  .then(_ => console.log('Done'))
  .catch(err => console.log(err.stack));

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
  filesWithPatterns([/\.php$/i, /\.htaccess$/i, /\.(png|jpe?g|svg)$/i, /\.woff$/i])
    .map(async file => copy(`src/${file}`, `dist/${file}`))
    .array;
}

async function copySystemJS() {
  const file = await fs.readFile('./node_modules/systemjs/dist/system-production.js');
  const contents = file.toString('utf-8');
  const {code} = babel.transform(contents, babelConfig);
  await fs.writeFile('dist/theme/scripts/system.js', code);
}

async function copyCustomElements() {
  const file = await fs.readFile('./node_modules/@webcomponents/custom-elements/custom-elements.min.js');
  const contents = file.toString('utf-8');
  const {code} = babel.transform(contents, babelConfig);
  await fs.writeFile('dist/theme/scripts/custom-elements.js', code);
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
      await mkdirAll(path.dirname(`dist/${file.name}`));
      await fs.writeFile(`dist/${file.name}`, `${file.csso.css}/*# sourceMappingURL=${file.name}.map */`);
      await fs.writeFile(`dist/${file.name}.map`, file.csso.map.toString());
    })
    .array;
}

async function minifyJs() {
  const orig = filesWithPatterns([/\.js$/i])
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

  const trans = filesWithPatterns([/\.js$/i])
    .map(async file => ({name: file, contents: await fs.readFile(`src/${file}`)}))
    .map(async file => Object.assign(file, {contents: file.contents.toString('utf-8')}))
    .map(async file => {
      for(const [key, val] of Object.entries(templateData)) {
        file.contents = file.contents.replace(`{%${key}%}`, val);
      }
      return file;
    })
    .map(async file => {
      const {code} = babel.transform(file.contents, {plugins: [require('babel-plugin-transform-es2015-modules-systemjs')]})
      file.contents = code;
      file.name = `${path.dirname(file.name)}/systemjs/${path.basename(file.name)}`;
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

    return await Promise.all([orig, trans]);
}

function flatten(arr) {
  return Array.prototype.concat.apply([], arr);
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
