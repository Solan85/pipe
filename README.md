# pipe (UNDER PROGRESS)
pipe is a file transfer system between computers, where developers create short lived pipe[s] to quicky transfer files between their machines. It creates a url for you, which you can wget or fetch from any machine.

"Files will be transfered by p2p mechanism"

## How to use:

Computer 1

`$ apt-get install pipe' (NOT DONE)`

`$ pipe create /home/usr/log.txt`

`..pipe created id: UNIQUE_ID`

`..its alive for 120 seconds`


Computer 2

`$ wget pipe.io/UNIQUE_ID`

`...log.txt downloaded`

OR

Computer 2

`$ apt-get install pipe' (NOT DONE)`

`$ pipe get UNIQUE_ID`

`... log.txt downloaded`


Send text as well

`pipe create "some text or long command"`


`pipe create <file/text> -p <access_password> -t <life_of_pipe_in_seconds> -c <max_get_count>`
  
  
  
  
