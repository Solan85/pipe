var config = require('./config.json');
var http = require('http');
var request = require('request');
var events = require('events');
var promise = require('promise');
var fs = require('fs');
var httpEventEmitter = new events.EventEmitter();
// var TEMP_FOLDER = "./temp/";
var counter = 0;
// function poll(pipeObj) {
//     var pollInterval = setInterval(function () {
//         var now = (new Date).getTime();
//         if (now < pipeObj.expiry) {
//             pollRequest(pipeObj);
//         } else {
//             httpEventEmitter.emit('pollingEnd', pipeObj);
//             clearInterval(pollInterval);
//         }
//     }, 1000);
// }

function poll(pipeObj) {
    pollRequest(pipeObj).then(function () {
        setTimeout(function () {
            if ((new Date).getTime() < pipeObj.expiry) {
                poll(pipeObj);
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

// function pollRequest(pipeObj) {
//     var pollingUrl = config.server + '/poll?pipe=' + pipeObj.name;
//     console.log(pollingUrl);
//     request.get(pollingUrl, function (error, response, body) {
//         console.log("Polling response: " + ++counter);
//         if (error) {
//             console.log(error);
//         } else {
//             console.log(body);
//             if (response.statusCode === 200) {
//                 var data = JSON.parse(body);
//                 data.forEach(pipeInRequestId => {
//                     processQueue(pipeInRequestId, pipeObj);
//                 });
//             }
//         }
//     });
// }

// function isQueueProcessed(queueName, pipeObj) {
//     var retVal = false;
//     var queueTempFileName = queueName + '.tmp';
//     fs.readdirSync(TEMP_FOLDER).forEach(file => {
//         if (file.name === queueTempFileName) {
//             retVal = true;
//         } else {
//             processQueue(queueName, pipeObj);
//         }
//     });

//     return retVal;
// }

function processQueue(pipeInRequestId, pipeObj) {
    // var queueTempFileName = TEMP_FOLDER + pipeInRequestId + '.tmp';
    // console.log(queueTempFileName);
    // fs.writeFileSync(queueTempFileName, '');
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