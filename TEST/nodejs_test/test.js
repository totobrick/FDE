var http = require('http');     // include the HTTP module
var url = require('url');
var fs = require('fs');         // file system module
var dt = require('./date.js');  //include my own module : my date.js file

http.createServer(function (req, res) { // req : request from the client (as an object)
    // Include a HTTP header
    res.writeHead(200, {'Content-Type': 'text/html'});
        // 200 : status sent (200 means all is ok, 404 means page not found ...)
        // 2nd argument : object containing the response headers

    // Module use
    res.write("Date : " + dt.date_time());
    res.write("<br> URL : " + req.url);
        // req.url : property url of req object, return url part coming after domain name
    
    // URL
    var q = url.parse(req.url, true).query;
    var txt = q.year + " " + q.month;
    res.write("<br>" + txt);

    // File use
    fs.readFile("demo1.html", function(err, data){
        //res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });


    //res.end();
}).listen(8080);

console.log("Texte affiché dans la console");

/**
 * In terminal : node test.js
 * In URL : http://localhost:8080/?year=2017&month=July
 *      Date : Wed Apr 02 2025 22:01:50 GMT+0200 (heure dâ€™Ã©tÃ© dâ€™Europe centrale)
 *      URL : /?year=2017&month=July
 *      2017 July
 * 
 * 
 * 
 * A METTRE sur site :
 *      -> URL module ("page not found" : https://www.w3schools.com/nodejs/nodejs_url.asp)
 *      -> BDD MySQL
 *      -> upload file (voir comment ?)
 */

