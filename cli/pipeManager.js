var fs = require('fs');
// var DB_FOLDER = './db/';
var httpCalls = require('./httpCalls');
var config = require('./config.json');
const uuidv4 = require('uuid/v4');
httpCalls.httpEventEmitter.on('pollingEnd', unregisterPipe);

function createPipe(file) {
    // store in database
    // file, expiry time, pipe name
    var pipeName = uuidv4();
    var pipeObj = {
        name: pipeName,
        expiry: (new Date).getTime() + (5 * 60 * 1000),
        file: file
    };

    registerPipe(pipeObj);
    httpCalls.poll(pipeObj);
}

function registerPipe(pipeObj) {
    fs.writeFile(config.dbFolder + pipeObj.name + ".json", JSON.stringify(pipeObj), function (err) {
        if (err) {
            console.log("Failed to create the pipe");
            return console.log(err);
        }
        console.log("pipe created: " + pipeObj.name);
        // console.log("To fetch file: ")
    });
}

function unregisterPipe(pipeObj) {
    fs.unlinkSync(config.dbFolder + pipeObj.name + ".json");
}

module.exports = {
    createPipe: createPipe
}