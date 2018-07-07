var pipeManager = require('./pipeManager');
var fs = require('fs');
const fileExists = require('file-exists');
console.log(process.argv);
switch (process.argv[2].toUpperCase()) {
    case "CREATE":
        var file = process.argv[3];
        if (validateFile(file)) {
            pipeManager.createPipe(file);
        }
        break;
}

function validateFile(file) {
    var retVal = true;
    if (!fileExists.sync(file, {})) {
        console.log("Invalid file");
        retVal = false;
    }

    return retVal;
}