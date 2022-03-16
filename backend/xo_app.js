

const initializeApp = require("firebase/app").initializeApp;
const analytics = require("firebase/analytics");
const getAnalytics = require("firebase/analytics").getAnalytics;
const XO_Auth = require("../backend/xo_auth.js").XO_Auth;
const XO_Database = require("../backend/xo_database.js").XO_Database;
const http = require('http');
const fsp = require('fs').promises;
const fs = require('fs');
var path = require('path');
var qs = require('querystring');

const hostname = '127.0.0.1';
const port = 3005;

const firebaseConfig = {
    apiKey: "AIzaSyCCWjqHm5NyfZdytfmLRJhVWaJlPI1OinE",
    authDomain: "projectjusticeleague.firebaseapp.com",
    projectId: "projectjusticeleague",
    storageBucket: "projectjusticeleague.appspot.com",
    messagingSenderId: "526020515693",
    appId: "1:526020515693:web:8d48034452c396c245ec64",
    measurementId: "G-KSC4M5RH33"
};
const app = initializeApp(firebaseConfig);

analytics.isSupported().then((isSupported) => {
    if (isSupported) {
      const fbAnalytics = getAnalytics(app);
    }
})


XO_Auth.initAuth();
XO_Database.initDatabase();


const requestListener = function (req, res){
    if(req.url == "/"){
        fsp.readFile(__dirname + "/../dist/password_reset.html")
        .then(contents => {
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(contents);
        });


    }
    else if(req.url == "/#"){
        console.log(req.url);
        fsp.readFile(__dirname + "/../dist/password_reset.html")
        .then(contents => {
            res.setHeader("Content-Type", "text/html");
            //res.setHeader("oobCode", XO_Auth.getActionCode());
            res.writeHead(200);
            res.end(contents);
        
        });

    }

    else if(req.url == "/register" && req.method == 'POST'){
        console.log(`xo_app::POST on /register route`);
        var body = ""
        req.on('data', function(data) {
            body += data
            console.log('xo_app::Partial body: ' + body);
          })
          req.on('end', function() {
            var postData = qs.parse(body);
            const callback  = function(id){
                var userData = {
                    id: id,
                    age: postData.age,
                    displayName : postData.displayName,
                    email: postData.email,
                };
                var dbCallback = function(){
                    console.log("xo_database::createUser:: Reigstriation complete. Informing client.");
                    res.end('post received');

                }
                XO_Database.createUser(id, userData, dbCallback);
                console.log("xo_auth::createUser::Executed Auth callback")
            }
            XO_Auth.createUser(postData.email, postData.password, postData.displayName, callback);
            console.log(postData.email);
            console.log('Body: ' + body);
            res.writeHead(200, {'Content-Type': 'text/html'});
          })

    }

    else if(req.url == "/send_verification_email"){
        console.log(`xo_app::GET of /send_verification_email`);
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        var callback = function(){
            console.log(`xo_auth::sendVerification::Email Verification sent. Informing client`);
            res.end("Sent Email")
        }
        XO_Auth.sendVerification(callback);
    }

    else if(req.url == "/verify_email" && req.method == 'POST'){
        console.log(`xo_app::POST on /verify_email route`);
        var body = ""
        req.on('data', function(data){
            body += data;
            console.log(`xo_app::Partial body: ${body}`);

        });
        req.on('end', function(){
            var postData = qs.parse(body);
            var callback = function() {
                console.log(`xo_auth::handleVerification:: Verification complete. Informing client`);
                res.end("Email Verified")
            }
            console.log(postData);
            console.log(`Code: ${postData.actionCode}`);
            XO_Auth.handleVerification(postData.actionCode, callback);
        });
    }
    else if(req.url == "/reset_email" && req.method == 'POST'){
        console.log(`xo_app::POST of /reset_email`);
        var body = ""
        req.on('data', function(data){
            body += data;
            console.log(`xo_app::Partial body: ${body}`);

        });
        req.on('end', function(){
            var postData = qs.parse(body);
            var callback = function() {
                console.log(`xo_auth::sendResetEmail::Reset Email sent. Informing client`);
                res.end("Sent Email")
            }
            console.log(`xo_app::Post Data Email: ${postData.email}`);
            XO_Auth.sendResetEmail(postData.email, callback);
        });

    }
    else if(req.url == "/update_password" && req.method == 'POST'){
        console.log(`xo_app::POST of /reset_email`);
        var body = ""
        req.on('data', function(data){
            body += data;
            console.log(`xo_app::Partial body: ${body}`);

        });
        req.on('end', function(){
            var postData = qs.parse(body);
            var callback = function() {
                console.log(`xo_auth::updateUserPassword::Reset Email sent. Informing client`);
                res.end("Updated Password")
            }
            console.log(`xo_app::Post Data Email: ${postData.email}`);
            XO_Auth.updateUserPassword(postData.old_password,postData.new_password, callback);
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