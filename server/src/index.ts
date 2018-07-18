import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
// import * as pipeConnector from './pipeConnector';
import * as fs from 'fs';
import * as Config from './config';
import * as Util from './util';
import { PipeConnector } from './pipeConnector';


const PORT = 8080;
const app = express();
const config = new Config.Config();
const util = new Util.Util();
const pipeConnector = new PipeConnector();

// create temp folder
if (!fs.existsSync(config.tempFolder)) {
  fs.mkdirSync(config.tempFolder);
  console.log('"' + config.tempFolder + '" folder created...');
}

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
// app.use(mainRoutes);

app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});

// server.timeout = 3600000;

app.get('/', function (req, res) {
  console.log(process.argv);
  if (fs.existsSync(config.tempFolder)) {
    fs.mkdirSync(config.tempFolder);
  }
  res.status(200).send({ hello: 'I am alive...' });
});

// http://localhost/poll/<pipeId>
app.get('/poll', function (req, res) {
  var pipeId = req.query.pipe;
  let pipeInRequestIds = util.getPipeInRequestId(config.tempFolder, pipeId);
  if (pipeInRequestIds.length > 0) {
    console.log("ok");
  }
  res.status(200).send(pipeInRequestIds);
});

app.get('/pipein', function (req, res) {
  // create a unique id as pipeInId
  // create a temp folder named pipeId-pipeInId
  // wait for 2 seconds
  // start fetching data
  var pipeId = req.query.pipeId;
  pipeConnector.pipeInFromTemp(res, pipeId);
});

// http://localhost/pipeout?pipeInId=
app.post('/pipeout', function (req: express.Request, res: express.Response) {
  let fileName = '';
  let content = req.headers['content-disposition'] as string;
  let arr = content.split(';');
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].indexOf('filename') > -1) {
      var arr2 = arr[i].split('=');
      fileName = arr2[1].trim();
    }
  }

  let size = req.headers['content-size'] as string;
  let pipeInId = req.query.pipeInId;
  pipeConnector.pipeOutToTemp(fileName, size, pipeInId, req, res);
});

