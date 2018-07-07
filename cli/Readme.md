CLI
- pipe create filename.ext
- cli saves pipe record in DB (file system)
- cli poll server until time out (default to 5 minutes)
- after time out it deletes the pipe record from DB
- poll request returns with pipeInRequestId[s]
- for each of the pipeInRequestId
   // - cli creates a temp file with pipeInRequestId
   // - ...denoting that the pipe-in request is in process
    - cli sends the file to server with pipeInRequestId
   // - on end of uploading file, cli deletes the temp file created


SERVER
[poll request]
- server checks temp folder with file name <pipeId_pipeInRequestId>
- if it finds it parses the file name
- and returns pipeInRequestId in array
- deletes the temp files

[pipe-out request]
- server finds a folder with name <pipeInRequestId>
- start streaming data into that folder

[pipe-in request]
- server creates a unique pipeInRequestId
- creates a dir in temp folder with name pipeInRequestId
- server creates a file in temp folder with name <pipeId_pipeInRequestId>
- server waits for data in the folder created
- as data received, it streams back as response

