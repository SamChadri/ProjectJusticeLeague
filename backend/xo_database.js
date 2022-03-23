
const {Collection,MongoClient, Db} = require("mongodb");

//Look into Mongoose for Models
const {config} = require("dotenv") ;

const TAG = `xo_database`;

// Ideally two different clusters for Authentication and another for Database


class XO_Database {
    constructor(){
        const uri = XO_Database.#uri();
        this.connectToCluster(uri);
        this.initDatabase();
        //Decide if I want to init

    }
    
    static #config_init = false;
    #mongoClient;
    #iamDb;
    #contentDb;
    #users;
    #movies;
    #shows;
    #media;

    static #uri = () => {
        if(XO_Database.#config_init == false){
            config();
            XO_Database.#config_init = true;
        }
        return process.env.DB_URI;
    }
    

    
    async connectToCluster(uri ){
        try{
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
 

    async initDatabase(){

        try{
            this.#iamDb = this.#mongoClient.db('iam');
            this.#users = this.#iamDb.collection('users');
            this.populateDb(this.#users);
    
    
            this.#contentDb = this.#mongoClient.db('content');
            this.#movies = this.#contentDb.collection('movies');
            this.populateDb(this.#movies);
            this.#shows = this.#contentDb.collection('shows');
            this.populateDb(this.#shows);
            this.#media = this.#contentDb.collection('media');
            this.populateDb(this.#media);

        } catch(error){
            console.log(`${TAG}::initDatabase:: Error occured `, error)
            process.exit();
        }

    }

    async populateDb(collection ){

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

    async createUser(id , userData, callback=null){
        //userData[id]= id;
        this.#users.insertOne(userData)
        .then((document) =>{
            console.log(`xo_database::createUser:: user created with ID: ${document}`);
            if(callback != null){
                console.log("xo_database::createUser::excecuting callback")
                callback();
            }        })
        .catch((error) => {
            console.log(`xo_database::createUser::Error adding document: ${error}`);

        });

    }

    


    
}


module.exports = {
    XO_Database: XO_Database,
}







