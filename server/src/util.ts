
const { readdirSync } = require('fs');
import * as fs from 'fs';
const { join } = require('path');

export class Util {
    getPipeInRequestId(path: string, pipeId: string) {
        let files = readdirSync(path);
        let filtered = [];
        filtered = files.filter((file: any) => {
            // return statSync(join(path, file)).isDirectory()
            //     && file.indexOf(pipeId) > -1;
            let retVal = file.indexOf(pipeId) > -1;
            if (retVal) {
                fs.unlinkSync(join(path, file));
            }

            return retVal;
        });

        let pipeInRequestIds: any = [];
        filtered.forEach((element: any) => {
            //TODO: delete temp file
            // fs.unlink(element);
            var arr = element.split('_');
            return pipeInRequestIds.push(arr[1]);
        });


        return pipeInRequestIds ? pipeInRequestIds : [];
    }
}