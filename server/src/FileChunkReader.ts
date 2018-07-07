import * as stream from 'stream';
import * as fs from 'fs';
import { Promise } from 'es6-promise';

export class FileChunkReader extends stream.Readable {
    counter: number;
    chunkFolder: string;
    endFileId: string;
    MAX_ATTEMPT = 100;
    constructor(chunkFolder: string, endFileId: string) {
        super();
        this.counter = 0;
        this.chunkFolder = chunkFolder;
        this.endFileId = endFileId;
    }

    _read() {
        var i = ++this.counter;
        var filePath = this.chunkFolder + i + '.tmp'

        try {
            // console.log('reading file... ' + filePath);
            // var data = fs.readFileSync(filePath);
            this.readChunkFile(filePath).then((data:any)=>{
                if (data.toString() !== this.endFileId) {
                    this.push(data);
                    fs.unlinkSync(filePath);
                } else {
                    this.push(null);
                    console.log('end of file');
                    fs.unlinkSync(filePath);
                    fs.rmdirSync(this.chunkFolder);
                }
            }).catch((error)=>{
                console.log(error);
                console.log('chunk file reading error');
            });
        } catch (error) {
            console.log(error);
            console.log('my error');
        }
    }

    readChunkFile(filePath: string, attempt: number = 0) {
        return new Promise((resolve: any, reject: any) => {
            try {
                let data = fs.readFileSync(filePath);
                resolve(data);
            } catch (error) {
                if (attempt === this.MAX_ATTEMPT) {
                    reject(new Error('MAX ATTEMPT fail to read chunk'));
                }
                setTimeout(() => {
                    this.readChunkFile(filePath, +attempt).then((data) => {
                        resolve(data);
                    }).catch((error) => {
                        reject(error);
                    });

                }, 1000);
            }
        });
    }
}
