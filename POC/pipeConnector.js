var fs = require('fs');
var tempFolder = './temp/'
const uuidv4 = require('uuid/v4');

function pipeOutToTemp(fileName, pipeInId, stream) {
    var counter = 0;
    var data = {
        fileName: fileName
    };
    var folder = tempFolder + pipeInId + '/';
    fs.writeFileSync(folder + '0.json', JSON.stringify(data));
    stream
        .on('data', (chunk) => {
            counter++;
            var path = folder + counter + '.tmp';
            console.log('writing file: ' + path);
            fs.writeFileSync(path, chunk);
        })
        .on('end', function () {
            console.log('end of file');
            counter++;
            var path = folder + counter + '.tmp';
            fs.writeFileSync(path, pipeInId);
        });
}

function pipeInFromTemp(stream, pipeId) {
    var fileName = undefined;
    var pipeInId =  '123-123-123'; // uuidv4();
    var pipeInTempFolder = tempFolder + pipeId + '_' + pipeInId + '/';
    // var pipeInTempFolder = tempFolder + pipeInId + '/';
    if (fs.existsSync(pipeInTempFolder)) {
        fs.rmdirSync(pipeInTempFolder);
    }
    fs.mkdirSync(pipeInTempFolder);

    // give some time to stream in file data from file sender
    setTimeout(() => {
        var metadataFileRead = false;
    do {
        try {
            var metadataFilePath = pipeInTempFolder + '0.json';
            var metadata = fs.readFileSync(metadataFilePath);
            fileName = JSON.parse(metadata).fileName;
            console.log(fileName);
            metadataFileRead = true;
            fs.unlinkSync(metadataFilePath);
        } catch (error) {
            // do nothing...
        }
    } while (!metadataFileRead);

    (new FileChunkReader(pipeInTempFolder, pipeInId)).pipe(stream);
    }, 2000);
    
}


var Readable = require('stream').Readable;
var util = require('util');
function FileChunkReader(chunkFolder, endFileId) {
    Readable.call(this);
    this.counter = 0;
    this.chunkFolder = chunkFolder;
    this.endFileId = endFileId;
}
util.inherits(FileChunkReader, Readable);

FileChunkReader.prototype._read = function () {
    var i = ++this.counter;
    var filePath = this.chunkFolder + i + '.tmp'
   
    try {
        console.log('reading file... ' + filePath);
        var data = fs.readFileSync(filePath);
        if(data.toString() !== '123-123-123') {
            this.push(data);
        } else {
            console.log('end of file');
            this.push(null);
        }
        fs.unlinkSync(filePath);
    } catch (error) {
        console.log('my error');
        // try {
        //     filePath = this.chunkFolder + i + '.end';
        //     console.log('end of file reading');
        //     fs.unlinkSync(filePath);
        //    //  fs.rmdirSync(this.chunkFolder);
        // } catch(error) {
        //     console.log('Some other serious error occured');
        //     console.log(error);
        //     this.counter--;
        // }
    }
};

module.exports = {
    pipeOutToTemp : pipeOutToTemp,
    pipeInFromTemp: pipeInFromTemp
}