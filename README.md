# pipe (UNDER PROGRESS)
pipe is a file transfer system between computers, where developers create short lived pipe[s] to quicky transfer files between their machines. It creates a url for you, which you can wget or fetch from any machine.
"File is not stored on the server instead it takes a de tour."


# How to use:
`$ apt-get install pipe` (NOT DONE)
`$ pipe create /home/usr/log.txt `
`pipe created: 2345fdv3sd`
`pipe will last for 5 minutes`

To fetch file from another machine:
EITHER
`$pipe in 2345fdv3sd` (NOT DONE)
OR
https://www.pipe.io/2345fdv3sd
(http://localhost:8080/pipein/pipeId=2345fdv3sd)

`$ pipe create <file-name> --timeout 15m`  (NOT DONE)
s - seconds
m - minutes
h - hours

To download or fetch the file on other machine
$ pipe in 466dsfgd3d
