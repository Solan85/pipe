Algo should be like this:
--------------------------
- client2 request (pipe-in request) for pipe data
- pipe-in request creates a pipe-in-ID
- request and response is sent to pipe-connector object
- it creates a folder named: pipe-id-pipe-in-ID
- it wait for file 0.json file
- 0.json file contains files metadata to be transfered
- delete 0.json file
- response headers are set using this metadata
- it creates a tmp-file-reader which accepts folder path
- tmp-file-reader starts reading file from 1.tmp,2.tmp and so on
- as it reads and push data it also deletes file (<counter>.tmp)
- until data in one of the file has pipe-id
- delete folder created
- this tmp-file-reader will be piped into response stream


- client1 request (pipe-out request) to pipe out data
- request has pipe-id-pipe-in-ID
- request and response is sent to pipe-connector object
- pipe-connector first creates a 0.json file
- writes file metadata into it
- request stream is pipe
- each chunk of data is read
- written into ./tmp/pipe-id-pipe-in-ID folder
- with name <counter>.tmp file, starting from 1.tmp file
- when http request stream is finished
- another file is written <counter>.tmp file with pipe-id in it.