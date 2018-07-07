var config = require('./config.json');
var http = require('http');
var request = require('request');
var events = require('events');
var promise = require('promise');
var fs = require('fs');
var httpEventEmitter = new events.EventEmitter();
var counter = 0;

function poll(pipeObj) {
    pollRequest(pipeObj).then(function () {
        var pollInterval = setTimeout(function () {
            if ((new Date).getTime() < pipeObj.expiry) {
                poll(pipeObj);
            } else {
                httpEventEmitter.emit('pollingEnd', pipeObj);
            }
        }, 1000);

    });
}

function pollRequest(pipeObj) {
    return new Promise(function (resolve, reject) {
        var pollingUrl = config.server + '/poll?pipe=' + pipeObj.name;
        console.log(pollingUrl);
        request.get(pollingUrl, function (error, response, body) {
            resolve();
            console.log("Polling response: " + ++counter);
            if (error) {
                console.log(error);
            } else {
                console.log(body);
                if (response.statusCode === 200) {
                    var data = JSON.parse(body);
                    data.forEach(pipeInRequestId => {
                        processQueue(pipeInRequestId, pipeObj);
                    });
                }
            }
        });
    });
}

function processQueue(pipeInRequestId, pipeObj) {
    var fileUploadUrl = config.server + '/pipeout?pipename=' + pipeObj.name + '&pipeInId=' + pipeInRequestId;
    var options = {
        headers: {
            'Content-Disposition': 'attachment;filename=' + pipeObj.file
        }
    };
    fs.createReadStream(pipeObj.file)
        .pipe(request.post(fileUploadUrl,options));
}

module.exports = {
    poll: poll,
    httpEventEmitter: httpEventEmitter
};