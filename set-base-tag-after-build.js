const fs = require('fs');

const filePath = './dist/index.html';

let text = fs.readFileSync(filePath, { encoding: 'utf8'});

text = text.replace('<head>', '<head>\r\n  <base href="https://ikoshelev.github.io/ui-app-architecture-showcases/solidjs/">');

text = text.replaceAll(`="/assets/`, `="./assets/`)

fs.writeFileSync(filePath, text, { encoding: 'utf8'});