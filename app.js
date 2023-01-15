const xml2js = require('xml2js')
const fs = require('fs')

const readXmlFile = fs.readFileSync('C:\\Users\\KamilBeelideBelfort\\OneDrive - Xillio\\Desktop\\NCG\\NCG export test\\NCG Uitvoering Uitvoeren Regelingen\\NCG Uitvoering Uitvoeren Regelingen.xml');

xml2js.parseString(readXmlFile, { mergeAttrs: true }, (err, result) => {
  if (err) {
    throw err
  }

  const convertToJSON = JSON.stringify(result, null, 4);

  fs.writeFileSync('C:\\Users\\KamilBeelideBelfort\\OneDrive - Xillio\\Desktop\\NCG\\NCG Uitvoering Uitvoeren Regelingen.json', convertToJSON);
})