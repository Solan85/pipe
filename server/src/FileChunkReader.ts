// import { Stream } from "stream";
import * as stream from 'stream';
import * as fs from 'fs';

// const Readable = require('stream').Readable;
// var util = require('util');
// var fs = require('fs');

export class FileChunkReader extends stream.Readable {
    counter: number;
    chunkFolder: string;
    endFileId: string;

    constructor(chunkFolder: string, endFileId: string) {
        super();
        // Readable.call(this);
        this.counter = 0;
        this.chunkFolder = chunkFolder;
        this.endFileId = endFileId;
        // util.inherits(FileChunkReader, Readable);
    }

    _read() {
        var i = ++this.counter;
        var filePath = this.chunkFolder + i + '.tmp'

        try {
            console.log('reading file... ' + filePath);
            var data = fs.readFileSync(filePath);
            if (data.toString() !== this.endFileId) {
                this.push(data);
                fs.unlinkSync(filePath);
            } else {
                this.push(null);
                console.log('end of file');
                fs.unlinkSync(filePath);
                fs.rmdirSync(this.chunkFolder);
            }
        } catch (error) {
            console.log(error);
            console.log('my error');
        }
    }
}

// function FileChunkReader(chunkFolder, endFileId) {
//     Readable.call(this);
//     this.counter = 0;
//     this.chunkFolder = chunkFolder;
//     this.endFileId = endFileId;
// }
// util.inherits(FileChunkReader, Readable);

// FileChunkReader.prototype._read = function () {
//     var i = ++this.counter;
//     var filePath = this.chunkFolder + i + '.tmp'

//     try {
//         console.log('reading file... ' + filePath);
//         var data = fs.readFileSync(filePath);
//         if (data.toString() !== '123-123-123') {
//             this.push(data);
//         } else {
//             console.log('end of file');
//             this.push(null);
//         }
//         fs.unlinkSync(filePath);
//     } catch (error) {
//         console.log('my error');
//     }
// };