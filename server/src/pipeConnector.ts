import * as fs from 'fs';
import * as uuidv4 from 'uuid/v4';
import * as Config from './config';
import { FileChunkReader } from './FileChunkReader';
import { Promise } from 'es6-promise';
const config = new Config.Config();


export class PipeConnector {
    pipeOutToTemp(fileName: string, pipeInId: string, request: any) {
        var counter = 0;
        // var pipeInFolder = pipeId + '_' + pipeInId;
        // var pipeInFolder = pipeId + '-' + pipeInId;
        var data = {
            fileName: fileName
        };
        var folder = config.tempFolder + pipeInId + '/';
        fs.writeFileSync(folder + '0.json', JSON.stringify(data));
        request
            .on('data', (chunk: any) => {
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

    pipeInFromTemp(response: any, pipeId: any) {
        // var fileName = undefined;
        var pipeInId = uuidv4();
        var pipeInTempFolder = config.tempFolder + pipeInId + '/';
        fs.mkdirSync(pipeInTempFolder);
        fs.writeFileSync(config.tempFolder + pipeId + '_' + pipeInId, '');
        // var pipeInTempFolder = config.tempFolder + pipeInId + '/';
        // if (fs.existsSync(pipeInTempFolder)) {
        //     fs.rmdirSync(pipeInTempFolder);
        // }

        // give some time to stream in file data from file sender
        this.readMetadataFile(response, pipeInTempFolder)
            .then(() => {
                (new FileChunkReader(pipeInTempFolder, pipeInId)).pipe(response);
            }).catch(() => {
                response.status(500).send("Failed to pipe in file");
            });
    }

    // readMetadataFile(response: any, pipeInTempFolder: string, counter: number = 0) {
    //     let metadataFileRead = false;
    //     if (counter === 5) {
    //         return metadataFileRead;
    //     }
    //     try {
    //         let metadataFilePath = pipeInTempFolder + '0.json';
    //         let metadata = fs.readFileSync(metadataFilePath);
    //         let fileName = JSON.parse(metadata.toString()).fileName;
    //         metadataFileRead = true;
    //         response.setHeader('Content-Type', 'application/octet-stream');
    //         response.setHeader('Content-Disposition', 'attachment; filename="' + fileName + '"');
    //         fs.unlinkSync(metadataFilePath);
    //     } catch (error) {
    //         setTimeout((response: any, pipeInTempFolder: string, counter: number) => {
    //             metadataFileRead = this.readMetadataFile(response, pipeInTempFolder, ++counter);
    //         }, 2000);
    //     }

    //     return metadataFileRead;
    // }


    readMetadataFile(response: any, pipeInTempFolder: string, counter: number = 0): Promise<void> {
        return new Promise((resolve: any, reject: any) => {
            if (counter === 5) {
                reject();
            }
            try {
                let metadataFilePath = pipeInTempFolder + '0.json';
                let metadata = fs.readFileSync(metadataFilePath);
                let fileName = JSON.parse(metadata.toString()).fileName;
                response.setHeader('Content-Type', 'application/octet-stream');
                response.setHeader('Content-Disposition', 'attachment; filename="' + fileName + '"');
                fs.unlinkSync(metadataFilePath);
                resolve();
            } catch (error) {
                setTimeout(() => {
                    this.readMetadataFile(response, pipeInTempFolder, ++counter)
                        .then(() => {
                            resolve();
                        }).catch(() => {
                            reject();
                        });
                }, 2000);
            }
        });
    }
}
