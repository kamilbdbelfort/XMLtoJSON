onst xml2js = require('xml2js')
const fs = require('fs')

const readXmlFile = fs.readFileSync('C:\\Users\\Kamil\\OneDrive - Xillio\\Desktop\\Canada_71836447_export.xml');

xml2js.parseString(readXmlFile, { mergeAttrs: true }, (err, result) => {
  if (err) {
    throw err
  }

  const convertToJSON = JSON.stringify(result, null, 4);

  fs.writeFileSync('C:\\Users\\Kamil\\OneDrive - Xillio\\Desktop\\Canada_71836447_export.json', convertToJSON);
})