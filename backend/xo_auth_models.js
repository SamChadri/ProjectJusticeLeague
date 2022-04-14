const { Collection, Db, MongoClient, ObjectId } = require("mongodb");
const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

const TAG = 'AuthModels'

class Auth{

    static #uri = process.env.AUTH_URI;

    static get #schema(){

        return this.#mongooseData.schema;

    }
    
    static #mongooseData = {
        schema: mongoose.Schema,
        model : mongoose.Model,
    }



    static get authModel(){
        return this.#mongooseData.model;
    }
    _id;
    email;
    #password;
    #salt;
    displayName;


    constructor(_id, email, password, salt, displayName, dateCreated){
        this._id = _id;
        this.email = email;
        this.#password = password;
        this.dateCreated = dateCreated;
        this.displayName = displayName;
        this.#salt = salt;
        var mongoId = new mongoose.Types.ObjectId(_id);

        this.model = new Auth.authModel({
            _id:mongoId,
            email: email,
            password: password,
            dateCreated: dateCreated,
            displayName: displayName,
            salt: salt
        });

    }

    get salt(){
        return this.#salt;
    }

    get password(){
        return this.#password;
    }



    static parseDocument(document){
        return new Auth(document._id, document.email, document.password, document.salt, document.displayName, document.dateCreated);
    }
    
    
    static async setupMongooseModel(){
        try{
            this.connectToCluster();
            this.initHelpers();
            console.log(`${TAG}::setupMongooseModel:: Initialized mongoose model.`);

        }catch(error){
            console.log(`${TAG}::setupMongooseModel::Error occurred `, error);
        }
    }

    static async connectToCluster(){
        try{
            console.log(`${TAG}::connectToCluster::Establishing mongoose connection`);
            var uri = Auth.#uri + '/auth';
            console.log(`Mongoose URI: ${uri}`)
            mongoose.connect(uri);
            console.log(`${TAG}::connectToCluster::Connection established`);


        }catch(error){
            console.log(`${TAG}::connectToCluter:: Error occurred`, error);
        }
        
    }

    static initHelpers(){
        const schema =  new mongoose.Schema({
            _id: ObjectId,
            email: String,
            password: String,
            salt: String,
            displayName: String,
            dateCreated: Date
        });

        schema.statics.findByEmail = function(email) {
            return this.findOne({email: email});
        }

        schema.statics.findByDisplayName = function(displayName){
            return this.findOne({displayName: displayName});
        }

        schema.statics.findByIdAndUpdatePassword = function(id, password){
            var mongoId = new ObjectId(id);
            var filter = {_id: mongoId};
            console.log(mongoId);
            console.log(`Updated Password: `, password);
            var new_values = { $set: {password: password}};
            return this.updateOne(filter, new_values);
        }

        Auth.#mongooseData.schema = schema;
        const AuthModel = mongoose.model('user', Auth.#schema);

        Auth.#mongooseData.model = AuthModel;
    }


}

module.exports = {
    Auth: Auth,
}
