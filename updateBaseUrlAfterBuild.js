if(process.env['Build.SourceBranchName']){
    const newBaseUrl = `https://uiappashowcases.blob.core.windows.net/$web/${process.env['Build.SourceBranchName']}/`;
    console.log(`Setting url base to ${newBaseUrl}`);
    const fs = require('fs');
    const filePath = './build/index.html';
    const indexFileText = fs.readFileSync(filePath, {
        encoding: 'UTF8'
    });

    const newText = indexFileText.replace('<base href="./"/>', `<base href="${newBaseUrl}"/>`);
    if(indexFileText === newText) {
        throw Error('Replacing <base href="./"/> in index.html after build failed.');
    }

    fs.writeFileSync(filePath, newText);
} 
