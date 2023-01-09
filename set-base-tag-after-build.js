const fs = require('fs');

const filePath = './dist/index.html';

let text = fs.readFileSync(filePath, { encoding: 'utf8'});

text = text.replace('<head>', '<head>\r\n  <base href="https://uiappashowcases.blob.core.windows.net/$web/solidjs/">');

fs.writeFileSync(filePath, text, { encoding: 'utf8'});