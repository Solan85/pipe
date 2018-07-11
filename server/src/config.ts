export class Config {
    readonly tempFolder:string;
    
    constructor() {
        let inDebugMode = process.argv[2] === 'debug'? true: false;
        if(inDebugMode) {
            this.tempFolder = './server/src/temp/';
        } else {
            this.tempFolder = './temp/';            
        }

    }
}