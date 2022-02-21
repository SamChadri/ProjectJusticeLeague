const http = require('http');
const fsp = require('fs').promises;
const fs = require('fs');
var path = require('path');

const hostname = '127.0.0.1';
const port = 3005;

const requestListener = function (req, res){
    if(req.url == "/"){
        fsp.readFile(__dirname + "/../dist/home.html")
        .then(contents => {
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(contents);
        });

    }
    else if(req.url.match("\.css$")){
        console.log(req.url)
        var cssPath = path.join(__dirname + "/../", req.url);
        var fileStream = fs.createReadStream(cssPath, "UTF-8");
        res.writeHead(200, {"Content-Type": "text/css"});
        fileStream.pipe(res); 
    }else if (req.url.match("\.jpg$") || req.url.match("\.jpeg$")){
        var imagePath = path.join(__dirname + "/../", req.url);
        var imageStream = fs.createReadStream(imagePath);
        res.writeHead(200, {"Content-Type": "text/jpeg"});
        imageStream.pipe(res);

    }else if(req.url.match("\.js$")){
        if(req.url.includes("src")){
            console.log(req.url);
            var scriptPath = path.join(__dirname + "/../", req.url);

        }else{
            var scriptPath = path.join(__dirname + "/../dist/", req.url);
            console.log(scriptPath)

        }
        var scriptStream = fs.createReadStream(scriptPath);
        res.writeHead(200, {"Content-Type": "text/javascript"});
        scriptStream.pipe(res);
    }else if(req.url.match("\.mp4$")){
        console.log(`Requested Video file with url ${req.url}`);
        var vidPath = path.join(__dirname + "/../", req.url);
        var vidStream = fs.createReadStream(vidPath);
        res.writeHead(200,{"Content-Type": "video/mp4"});
        vidStream.pipe(res);
    }

};

const server = http.createServer(requestListener);



server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});