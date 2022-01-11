console.log("STARTED_SERVER")

const fs = require('fs');

fs.readFile('./Assets/dictionary.json', 'utf-8', (err, jsonString) => {

    if (err) {
        console.log(err);
    }
    else {
        //console.log(jsonString);
        let dictObj = JSON.parse(jsonString);
        let onlyWordObject = []

        let keyList = Object.keys(dictObj);

        let keySize = keyList.length;

        console.log("Key Size : " + keySize);

        for (let index = 0; index < keySize; index++) {
            onlyWordObject.push(keyList[index]);
        }

        console.log("Conversion Success");

        SaveArrayToJSON(onlyWordObject, " wordList.json");


    }
})


SaveArrayToJSON = (inputArray, fileName) => {
    fs.writeFile(`./Output/${fileName}`, JSON.stringify(inputArray), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("File Saved Succesfuly");
        }
    })
}