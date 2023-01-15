const xml2js = require('xml2js');
const fs = require('fs');
const { MongoClient } = require("mongodb");
const { createHash } = require('crypto');
const {readFileSync} = require("fs");

const uri = "mongodb://127.0.0.1:27017";

const { readdir } = fs.promises;
const directoryPath = 'C:/Users/KamilBeelideBelfort/OneDrive - Xillio/Desktop/NCG/NCG export test';
const newDirectoryPath = 'C:/Users/KamilBeelideBelfort/OneDrive - Xillio/Desktop/NCG/NCG JSON test';

function hashSha512(string) {
    return createHash('sha512').update(string).digest('hex');
}

async function run(doc) {
    const client = new MongoClient(uri);
    try {
    const db = client.db("NCG_XMLS");
    const collection = db.collection("documents");
    await collection.insertOne(doc);
    } finally {
        await client.close();
    }
}

const convertXML2JSON = (dirName, newDirName, fileName) => {
    const readXmlFile = fs.readFileSync(`${dirName}/${fileName}`);
    let newFileName;
    xml2js.parseString(readXmlFile, { mergeAttrs: true }, (err, result) => {
        if (err) {
            throw err;
        }
        const convertToJSON = JSON.stringify(result, null, 4);
        newFileName = fileName.replace(/\.[^/.]+$/, ".json");
        const newFilePath = `${newDirName}/${newFileName}`;
        fs.writeFileSync(newFilePath, convertToJSON);
    });
    const data = readFileSync(`${newDirName}/${newFileName}`, 'utf8')
    const obj = JSON.parse(data);
    let objType;
    if(obj.Topx) {
        const agg = obj.Topx.aggregatie ? obj.Topx.aggregatie : null;
        const bestand = obj.Topx.bestand ? obj.Topx.bestand : null;
        const message = agg ? agg : bestand;
        const content = Object.values(message);
        objType = content[0].aggregatieniveau[0];
    }
    const pathToHash = objType === "Bestand" ? `${dirName}/${fileName}`.replace(/\.[^/.]+$/, "").trim() : dirName;
    const object = new Object({
        _id: hashSha512(pathToHash),
        sourcePath: dirName.replace(/\.[^/.]+$/, "").trim(),
        fileName: fileName.replace(/\.[^/.]+$/, "").trim(),
        properties: obj
    });
    run(object).catch(console.dir);
}

const getFileList = async (dirName, newDirName) => {
    try{
        const items = await readdir(dirName, { withFileTypes: true });
        for (const item of items) {
            if (item.isDirectory()) {
                if (!fs.existsSync(`${newDirName}}`)) {
                    fs.mkdir(`${newDirName}`,function(err){
                        if (err) {
                            return console.error(err);
                        }
                    });
                }
                if (!fs.existsSync(`${newDirName}/${item.name}`)) {
                    fs.mkdir(`${newDirName}/${item.name}`,function(err){
                        if (err) {
                            return console.error(err);
                        }
                    });
                }
                await getFileList(`${dirName}/${item.name}`, `${newDirName}/${item.name}`);
            } else {
                const extension = item.name.split('.').pop();
                if (extension === 'xml') {
                    convertXML2JSON(dirName, newDirName, item.name);
                }
            }
        }
    } catch (e) {
        console.error(e);
    }
};

getFileList(directoryPath, newDirectoryPath).then(() => {
    console.log('Done import');
});
