
// Import the functions you need from the SDKs you need

const getFirestore = require("firebase/firestore").getFirestore;
const collection = require("firebase/firestore").collection;
const addDoc = require("firebase/firestore").addDoc;




// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
//const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);


class XO_Database {
    constructor(){
        this.x = "hello"
        //TODO: Might decide if I want a instance app or not

    }
    static #users;
    static initDatabase(){
        this.db = getFirestore();
        this.#users = collection(this.db, "users");
    }


    static createUser(id, userData, callback=null){
        addDoc(collection(this.db, "users"),userData)
        .then((docRef) =>{

            console.log(`xo_database::createUser:: user created with ID: ${docRef.id}`);
            if(callback != null){
                console.log("xo_database::createUser::excecuting callback")
                callback();
            }
        })
        .catch((error) => {
            console.log(`xo_database::createUser::Error adding document: ${error}`);
        });
    }


    
}

module.exports = {
    XO_Database: XO_Database,
}






