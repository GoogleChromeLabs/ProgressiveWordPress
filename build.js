const csso = require('csso');
const fs = require('mz/fs');

Promise.all([
  copyStatic(),
  minifyCss(),
])
  .then(_ => console.log('Done'))
  .catch(err => console.log(err));

const cssoConfig = {
  restructure: true,
  sourceMap: true,
};

async function copyStatic() {
  let files = await filesWithPattern(/\.php$/i);
  files = files.map(file => copy(`src/${file}`, `dist/${file}`))
  await Promise.all(files);
}

async function minifyCss() {
  let files = await filesWithPattern(/\.css$/i);
  files = await readAll(files);
  files.forEach(file => file.csso = csso.minify(file.content, Object.assign({}, cssoConfig, {filename: file.name})));
  const cssFiles = files.map(file => fs.writeFile(`dist/${file.name}`, `${file.csso.css}/*# sourceMappingURL=${file.name}.map */`));
  const maps = files.map(file => fs.writeFile(`dist/${file.name}.map`, file.csso.map.toString()));
  await Promise.all([...cssFiles, ...maps]);
}

async function filesWithPattern(regexp) {
  let files = await fs.readdir('src')
  return files.filter(file => regexp.test(file));
}

async function copy(from, to) {
  const data = await fs.readFile(from);
  await fs.writeFile(to, data);
}

async function readAll(files) {
  const contents = await Promise.all(files.map(file => fs.readFile(`src/${file}`)));
  return files.map((_, i) => ({name: files[i], content: contents[i].toString('utf-8')}));
}
