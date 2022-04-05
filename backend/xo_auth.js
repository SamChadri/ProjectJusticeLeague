
const { Collection, Db, MongoClient } = require("mongodb");
const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });

const uuid = require("uuid");

const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const { createNoSubstitutionTemplateLiteral } = require("typescript");

const TAG = `xo_auth`;



class XO_Auth{

    static #uri =  process.env.AUTH_URI;
    
    #serviceAccount;
    #service_email = process.env.EMAIL_USER;
    #service_type = '';
    #service_code = '';
    #service_password = process.env.EMAIL_PASSWORD;

    static #encryptionKey = process.env.ENCRYPTION_KEY;


    #mongoClient;
    #transporter;
    #auth;

    #currUser;
    #users;
    static #saltOrRounds = 10;


    static #configInit;
    
    static #salt;
    static currUserEmail = '';
    static errorCode = -1;
    static errorMessage = "";

    //Attach code to user later;

    static #verificationCode = () =>{
        return this.#generateRandomCode();
    } 
    static #resetCode = ()  =>{
        return this.#generateRandomCode();
    }

    constructor(){
        this.connectToCluster(XO_Auth.#uri);
        this.initAuth();
        this.setupMailService();
        XO_Auth.#generateSalt();

    }


    async setupMailService(){
        console.log(`${TAG}::setupMailService:: Setting up mail service...`)
        try{
            const serviceAccount = await nodemailer.createTestAccount();
            this.#serviceAccount = serviceAccount;
            this.#transporter = nodemailer.createTransport({
                host: 'smtp-relay.sendinblue.com',
                port: 587,
                auth: {
                  user:this.#service_email,
                  pass:this.#service_password,
                },
                logger: true,
                transactionLog: true
            });
            console.log(`${TAG}::setupMailSerice:: Mail Service setup successfully`)

        }catch(error){
            console.log(`${TAG}::setupMailService:: Error occurred`, error)
            process.exit();

        }



    }


    async connectToCluster(uri){
        try{
            console.log(process.env)
            console.log(`${TAG}::connectToCluster():: Cluster Uri ${uri}`);
            this.#mongoClient = new MongoClient(uri);
            console.log(`${TAG}::connectToCluster()::Connecting to JLMongoDB cluster...`);
            await this.#mongoClient.connect();
            console.log(`${TAG}::connectToCluster()::Successfully connected to JLMongoDB cluster...`);
        
        } catch (error) {
            console.error(`Connection to MongoDB Atlas failed`, error);
            process.exit();
        }
    }

    async initAuth(){
        try{
            
            this.#auth = this.#mongoClient.db('auth');
            this.#users = this.#auth.collection('users');

            this.#populateDb(this.#users);
            console.log(`${TAG}::initAuth:: Finished initializing authentication Database`)
        }catch (error){
            console.log(`${TAG}::initAuth:: Error occured`, error)
        }
        
    }


    async #populateDb(collection ){

        try{
            const docCount = await collection.countDocuments();
            if(docCount == 0){
                //TODO: Populate database Implement Later;
            }else{
                
            }

        }catch(error){
            console.log(`${TAG}::populateDatabase:: Error occured `, error)
            process.exit();
        }

    }

    static async #generateSalt(){
        try{
            this.#salt = await bcrypt.genSalt(this.#saltOrRounds);
            console.log(`${TAG}:: Auth Salt generated.`)

        }catch(error){
            console.log(`${TAG}::generatesalt:: Error occurred `, error);
            //TODO: Instead of process exit return error to user and handle error page.
        }
        

    }

    async #hashPassword(text){
        try{
            //TODO: Generate unique salt for each password and store within database
            const salt = XO_Auth.#salt;
            const hash = await bcrypt.hash(text, salt);
            return hash;

        }catch(error){
            console.log(`${TAG}::hashPassword:: Error occured `, error);
            process.exit();
        }

    }

    



    async createUser(email, password , userDisplayName, callback=null){
        const encrypted_password = await this.#hashPassword(password);
        const userData = {
            email: email,
            password: encrypted_password,
            displayName: userDisplayName,
        };

        this.#users.insertOne(userData)
        .then((document) => {
            console.log(`${TAG}::createUser::User created with id: ${document.insertedId}`);
            //replace with mongoose model later
            this.#currUser = {
                id: document.insertedId,
                email: email,
                displayName: userDisplayName
            };
            if(callback != null){
                callback(document.insertedId);
                console.log(`${TAG}::createUser::Executing callback`);
            }

        })
        .catch((error) => {

            console.log(`xo_auth::handleVerification::Error Occurred: ${XO_Auth.errorMessage}`);

        })
      
    }

    getCurrUserEmail(){
        return this.#currUser.email;
    }

    getCurrUser(){
        return this.#currUser;
    }

    static #generateRandomCode(){
        return Math.floor(Math.random() * (999-100+1)+100)
    }

    static getKey(){
        return XO_Auth.#encryptionKey;
    }

    sendVerification(email, callback=null){
        this.#service_type = 'verification';
        this.#service_code = XO_Auth.#verificationCode();
        var mailOptions =   {
            from: 'iam@xo_service.org',
            to: "beatfreak50@gmail.com",
            subject: 'Email Verification',
            text: `Hi There!\n 
             This is a ${this.#service_type} email.\n
             Please enter the follwing code into our website to finalize the process.\n
             Code: ${this.#service_code}\n,
             Let us know if the code does not work\n
             The XO Team.`,
        }
        this.#transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(`${TAG}::sendVerification:: Error Occured`, error);
                process.exit(1);
            }
            console.log(info);
            console.log(`${TAG}::sendVerification:: Email sent successfully to ${email}.`);
            if(callback != null){
                console.log(`${TAG}::sendVerification:: Executing Callback...`)
                callback()
            }
    
        });
    }



    handleVerification(oobCode, callback=null){
        if(oobCode == this.#service_code){
            if(callback != null){
                console.log(`xo_auth::handleVerification:: Executing callback`);
                callback();
            }
        }else{
            console.log(`xo_auth::handleVerification:: Error: Code does not match`);

        }

    }

    static sendResetEmail(email, callback=null){
        //TODO: Implement Later
    }


    static updateUserPassword(old_password, new_password, callback=null){

        //TODO: Implement Later.

    }

}

module.exports = {
    XO_Auth: XO_Auth,
}




