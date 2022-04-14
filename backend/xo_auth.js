
const { Collection, Db, MongoClient } = require("mongodb");
const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });

const uuid = require("uuid");

const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const { createNoSubstitutionTemplateLiteral } = require("typescript");
const {Auth} = require("../backend/xo_auth_models.js")
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
    #salt;

    #currUser;
    #users;
    static #saltOrRounds = 10;


    static #configInit;
    
    static currUserEmail = '';
    static errorCode = -1;
    static errorMessage = "";

    //Attach code to user later;

    static #verificationCode = () =>{
        return this.#generateRandomCode();
    } 
    static  get #resetCode(){
        return this.#generateRandomCode();
    }

    constructor(){
        this.connectToCluster(XO_Auth.#uri);
        this.initAuth();
        this.setupMailService();

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

            //AuthModel Connection
            await Auth.setupMongooseModel();
        
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


    async #populateDb(collection){

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

    async #generateSalt(){
        try{
            var salt = await bcrypt.genSalt(XO_Auth.#saltOrRounds);
            console.log(`${TAG}:: Auth Salt generated.`)
            return salt

        }catch(error){
            console.log(`${TAG}::generatesalt:: Error occurred `, error);
            //TODO: Instead of process exit return error to user and handle error page.
        }
        

    }

    async #hashPassword(text, storedSalt=null){
        try{
            //TODO: Generate unique salt for each password and store within database
            var salt;
            if(storedSalt == null){
                salt =  await this.#generateSalt();
            }else{
                salt = storedSalt;
            }
            
            const hash = await bcrypt.hash(text, salt);
            return {
                hash: hash,
                salt: salt,
            }

        }catch(error){
            console.log(`${TAG}::hashPassword:: Error occured `, error);
            process.exit();
        }
    }



    async loginUser(email, password, callback=null){
        var user = await this.findUser(email,true);
        this.#hashPassword(password, user.salt)
        .then((res) =>{
            var compare = res.hash == user.password;
            if(compare){
                console.log(`${TAG}:: Password verfication a match. Loging in user...`)
                this.#currUser = user
            }else{
                console.log(`${TAG}:: Password verfication not a match. Inform user...`)
            }
            if(callback != null){
                callback(res)
            }
        })
        .catch((error) =>{
            console.error(`${TAG}::loginUser::Error occured `, error)
        });
        
    }

    



    async createUser(email, password , userDisplayName, callback=null){
        const result = await this.#hashPassword(password);
        const encrypted_password = result.hash
        const storedSalt = result.salt
        var dateCreation = new Date();
        const userData = {
            email: email,
            password: encrypted_password,
            salt: storedSalt,
            displayName: userDisplayName,
            dateCreated: dateCreation,
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

            console.error(`xo_auth::handleVerification::Error Occurred: `, error);

        })
      
    }

    async findUser(param, email=true, callback=null){
        var result;
        if(email){
            result = Auth.authModel.findByEmail(param)
            .then((document) => {
                console.log(`${TAG}::findUser:: Query successful, found user : `,document);
                var user = Auth.parseDocument(document);
                console.log(user);
                //TODO: Impement parseDocument
                if(callback != null){
                    callback()
                }
                return user;

            })
            .catch((error) =>{
                console.log(`${TAG}::findUser:: Error occured`, error)
                return error;
            });

        }else{
            result = Auth.authModel.findByDisplayName(param)
            .then((document) => {
                console.log(`${TAG}::findUser:: Query successful, found user : `,document);
                //TODO: Impement parseDocument
                var user = Auth.parseDocument(document);

                if(callback != null){
                    callback()
                }
                return user;

            })
            .catch((error) =>{
                console.log(`${TAG}::findUser:: Error occured`, error)
                return error;
            });

        }
        return result;
        
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
        var mailOptions =  {
            from: 'iam@xo_service.org',
            to: email,
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


    async sendResetEmail(email, callback=null){
        try{
            var user = await this.findUser(email,true);
            if(user != null){
                this.#currUser = user;
                //Set Current User for the Password reset process.
                this.#service_type = 'password reset';
                this.#service_code = XO_Auth.#resetCode;
                var mailOptions =   {
                    from: 'iam@xo_service.org',
                    to: email,
                    subject: 'Password Reset',
                    text: `Hi There!\n 
                     This is a ${this.#service_type} email.\n
                     Please enter the follwing code into our website to continue the process.\n
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
            }else{
                console.log(`${TAG}::sendResetEmail::User Result: `,user)
                throw new Error('User Does Not Exist');
            }

        }catch(error){
            console.error(`${TAG}::sendResetEmail:: Error occured`, error)
            return (error)
        }

        //TODO: Implement Later
    }

    handlePasswordReset(oobCode, callback=null){
        if(oobCode == this.#service_code){
            if(callback != null){
                console.log(`xo_auth::handlePasswordReset:: Executing callback`);
                callback();
            }
        }else{
            console.log(`xo_auth::handleVerification:: Error: Code does not match`);

        }

    }



    async updateUserPassword(new_password, callback=null){
        var hash_password = await this.#hashPassword(new_password);

        this.#currUser.model.password = hash_password;
        //TODO: Decide if I want ot use save or not later
        
        Auth.authModel.findByIdAndUpdatePassword(this.#currUser._id, hash_password)
        .then((document) =>{
            console.log(`${TAG}::updateUserPassword:: Updated password successfully for user`, this.#currUser)
            console.log(document);

            if(callback != null){
                console.log(`${TAG}::updateUserPassword:: Executing callback`);
                callback();
            }

        })
        .catch((error) =>{
            console.error(`${TAG}::updateUserPassword:: `, error);
        });
        //TODO: Implement Later.

    }

}

module.exports = {
    XO_Auth: XO_Auth,
}




