var fs = require('fs');
var sourceFile = './store/prod.rar';
var targetFile = './store/target.rar';


// var readStream = fs.createReadStream(sourceFile);
// console.log('FILE READ SUCCESSFULLY...');
// var counter = 0;
// readStream
//     .on('data', function (chunk) {
//         counter++;
//         var path = './temp/' + counter + '.tmp';
//         console.log('writing file: ' + path);
//         fs.writeFileSync(path, chunk);
//     })
//     .on('end', function () {
//         console.log('end of file');
//     });


// var Readable = require('stream').Readable; 
// var util = require('util'); 
// function FileChunkReader() { 
//     Readable.call(this); 
//     this.counter = 0; 
//     this.chunkFolder = './temp/';
// } 
// util.inherits(FileChunkReader, Readable); 

// FileChunkReader.prototype._read = function () { 
//     var i = ++this.counter;
//     var filePath = this.chunkFolder + i + '.tmp'
//     try {
//         console.log('reading file... ' + filePath);
//         var data = fs.readFileSync(filePath);
//         this.push(data);    
//     } catch (error) {
//         console.log(error);

//         this.push(null);
//     }
// };

// var writeStream = fs.createWriteStream(targetFile);
// (new FileChunkReader()).pipe(writeStream);



var pipeInId = '123-123-123';
var pipeConnector = require('./pipeConnector');
if(process.argv[2] === 'out') {
    var readStream = fs.createReadStream(sourceFile);
    pipeConnector.pipeOutToTemp('some-file-name', pipeInId, readStream);
} else if(process.argv[2] === 'in') {
    var writeStream = fs.createWriteStream(targetFile);
    pipeConnector.pipeInFromTemp(writeStream, 'sdfas');
}

// fs.writeFileSync('test.tmp',"123-123-123");
// var data = fs.readFileSync('test.tmp');
// console.log(data.toString());
// console.log(data.toString() === '123-123-123');