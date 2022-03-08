
const getAuth = require("firebase/auth").getAuth;
const createUserWithEmailAndPassword = require("firebase/auth").createUserWithEmailAndPassword;
const updateProfile = require("firebase/auth").updateProfile;
const sendEmailVerification = require("firebase/auth").sendEmailVerification;
const applyActionCode = require("firebase/auth").applyActionCode;

class XO_Auth{
    constructor(){

    }
    static #auth;
    static currUserId = '';
    static errorCode = -1;
    static errorMessage = "";

    //Attach code to user later;

    static #actionCode = "#1234";

    static initAuth(){
        XO_Auth.#auth  = getAuth();

        
        
    }

    static getActionCode(){
        return XO_Auth.#actionCode;
    }

    static createUser(email, password , userDisplayName, callback=null){

        createUserWithEmailAndPassword(XO_Auth.#auth, email, password)
        .then((userCredential) => {
          // Signed in 
            XO_Auth.currUserId = userCredential.user.uid;
            console.log(`xo_auth::createUser:: registered user with ID: ${XO_Auth.currUserId}`);
            updateProfile(XO_Auth.#auth.currentUser,{
                displayName: userDisplayName
            }).then(() => {
                console.log(`xo_auth::createUser::User updated displayName: ${userDisplayName} `)
            }).catch((error) => {
                XO_Auth.errorMessage = error.message;
                XO_Auth.errorCode = error.code;
                console.log(`Error Occurred: ${XO_Auth.errorMessage}`);

            });
            if(callback != null){
                console.log(`xo_auth::createUser::Executing callback`);
                callback(XO_Auth.currUserId);
            }
          console.log("");
          // ...
        })
        .catch((error) => {
            XO_Auth.errorMessage = error.message;
            XO_Auth.errorCode = error.code;
            console.log(`xo_auth::createUser::Error Occurred: ${XO_Auth.errorMessage}`);
        })
      
    }

    static sendVerification(callback=null){
        const actionCodeSettings = {
            url: `http://localhost:3005/#1234`,
            handleCodeInApp: false
          };
        sendEmailVerification(XO_Auth.#auth.currentUser, actionCodeSettings, callback)
        .then(() =>{
            console.log("xo_auth::sendVerification::Email Verification sent...")
            if(callback != null){
                console.log(`xo_auth::handleVerification:: Executing callback`)
                callback();
            }
        })
        .catch((error) => {
            XO_Auth.errorMessage = error.message;
            XO_Auth.errorCode = error.code;
            console.log(`xo_auth::createUser::Error Occurred: ${XO_Auth.errorMessage}`);

        });
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
        /*
        applyActionCode(XO_Auth.#auth, oobCode)
        .then(() => {
            console.log(`xo_auth::handleVerification:: Successfully applied action code.`)
            if(callback != null){
                console.log(`xo_auth::handleVerification:: Executing callback`)
            }
        })
        .catch((error) => {
            XO_Auth.errorMessage = error.message;
            XO_Auth.errorCode = error.code;
            console.log(`xo_auth::createUser::Error Occurred: ${XO_Auth.errorMessage}`);


        });*/
    }

}





module.exports = {
    XO_Auth: XO_Auth,
}