const http = require('http')    // include the HTTP module
var fs = require('fs')         // file system module
const port = 5000

const server = http.createServer( function(req, res){
    // req : request received
    // res : response sent
    res.writeHead(200, {'Content-Type': 'text/html'});
    // 200 : status sent (200 means all is ok, 404 means page not found ...)
    // 2nd argument : object containing the response headers

    fs.readFile('demo1.html', function(error, data){ // index.html
        if(error){
            res.writeHead(404)
            console.log(404)
            res.write("Error : file not found")
        }
        else{
            res.write(data)
        }
        //res.write("Hello people !")
        res.end()
    })
    
})

server.listen(port, function(err){
    if (err){
        console.log("Somethig went wrong !")
    }
    else{
        console.log("Server is listening the port " + port)
    }
})