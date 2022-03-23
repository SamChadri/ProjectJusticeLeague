
const { Collection, Db, MongoClient } = require("mongodb");
const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });

const uuid = require("uuid");

const bcrypt = require('bcrypt');


const TAG = `xo_auth`;



class XO_Auth{
    constructor(){
        this.connectToCluster(XO_Auth.#uri);
        this.initAuth();

    }
    static #uri =  process.env.AUTH_URI;

    
    #mongoClient ;

    #auth;
    #users;
    #saltOrRounds = 10;


    static #configInit;
    
    static currUserEmail = '';
    static errorCode = -1;
    static errorMessage = "";

    //Attach code to user later;

    static #actionCode = "#1234";
    static #resetCode = "#6969";


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

    async #hashPassword(text){
        try{
            const salt = await bcrypt.genSalt(this.#saltOrRounds);
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
            if(callback != null){
                callback(document.insertedId);
                console.log(`${TAG}::createUser::Executing callback`);

            }

        })
        .catch((error) => {

            console.log(`xo_auth::handleVerification::Error Occurred: ${XO_Auth.errorMessage}`);

        })
      
    }

    static getActionCode(){
        return XO_Auth.#actionCode;
    }

    static sendVerification(callback=null){
        //TODO: Implement Here
    }
    static handleVerification(oobCode, callback=null){
        //check with server later
        if(oobCode == XO_Auth.#actionCode){
            if(callback != null){
                console.log(`xo_auth::handleVerification:: Executing callback`);
                callback();
            }
        }else{
            console.log(`xo_auth::handleVerification:: Error: Code does not matchs`);

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




