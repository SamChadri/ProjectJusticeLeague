


const XO_Auth = require("../backend/xo_auth.js").XO_Auth;
//import {XO_Auth}from '../backend/xo_auth.ts';
//import { XO_Database } from './xo_database.js';
const XO_Database = require("../backend/xo_database.js").XO_Database;
//import * as http from 'http';
const http = require('http');
//import { promises }  from 'fs';
const promises = require('fs').promises;
//import * as fs from 'fs';
const fs = require('fs');
//import * as path from 'path';
const path = require('path');
//import * as qs from 'querystring';

const qs = require('querystring');

const hostname = '127.0.0.1';
const port = 3005;



const authDB = new XO_Auth();
const xoDB = new XO_Database();


const requestListener = function (req, res){
    if(req.url == "/"){
        promises.readFile(__dirname + "/../dist/register_1.html")
        .then(contents => {
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(contents);
        });


    }
    else if(req.url == "/#"){
        console.log(req.url);
        promises.readFile(__dirname + "/../dist/register_1.html")
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
                    _id: id,
                    age: postData.age,
                    displayName : postData.displayName,
                    email: postData.email,
                };
                var dbCallback = function(){
                    console.log("xo_database::createUser:: Reigstriation complete. Informing client.");
                    res.end('post received');

                }
                xoDB.createUser(id, userData, dbCallback);
                console.log("xo_auth::createUser::Executed Auth callback")
            }
            authDB.createUser(postData.email, postData.password, postData.displayName, callback);
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
        
        authDB.sendVerification(authDB.getCurrUserEmail(),callback);
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
            authDB.handleVerification(postData.actionCode, callback);
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
            authDB.sendResetEmail(postData.email, callback);
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
            authDB.updateUserPassword(postData.old_password,postData.new_password, callback);
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