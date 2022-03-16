
const getAuth = require("firebase/auth").getAuth;
const createUserWithEmailAndPassword = require("firebase/auth").createUserWithEmailAndPassword;
const updateProfile = require("firebase/auth").updateProfile;
const sendEmailVerification = require("firebase/auth").sendEmailVerification;
const applyActionCode = require("firebase/auth").applyActionCode;
const sendPasswordResetEmail = require("firebase/auth").sendPasswordResetEmail;
const updatePassword = require("firebase/auth").updatePassword;
const reauthenticateWithCredential = require("firebase/auth").reauthenticateWithCredential;
const signInWithEmailAndPassword =  require("firebase/auth").signInWithEmailAndPassword

class XO_Auth{
    constructor(){

    }
    static #auth;
    static currUserEmail = '';
    static errorCode = -1;
    static errorMessage = "";

    //Attach code to user later;

    static #actionCode = "#1234";
    static #resetCode = "#6969";

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
            
            console.log(`xo_auth::handleVerification::Error Occurred: ${XO_Auth.errorMessage}`);
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

    static sendResetEmail(email, callback=null){
        const actionCodeSettings = {
            url: `http://localhost:3005/${XO_Auth.#resetCode}`,
            handleCodeInApp: false
          };
        sendPasswordResetEmail(XO_Auth.#auth, email, actionCodeSettings)
        .then(() => {
            console.log(`xo_auth::sendResetEmail:: Password Reset Email send successfully`);
            XO_Auth.currUserEmail = email;
            if( callback != null){
                console.log(`xo_auth::sendResetEmail:: Executing callback.`)
                callback();
            }

        })
        .catch((error) => {
            XO_Auth.errorMessage = error.message;
            XO_Auth.errorCode = error.code;
            console.log(`xo_auth::sendResetEmail::Error Occurred: ${XO_Auth.errorMessage}`);

        })
    }


    static updateUserPassword(old_password, new_password, callback=null){

        console.log(`Email: ${XO_Auth.currUserEmail}`)
        signInWithEmailAndPassword(XO_Auth.#auth, XO_Auth.currUserEmail, old_password)
        .then((userCredential) =>{
            console.log(`xo_auth::SignInUser:: Reauthenticated user: ${userCredential.user}`)
            updatePassword(XO_Auth.#auth.currentUser,new_password)
            .then(() => {
                console.log(`xo_auth::updateUserPassword:: Updated password successfully.`);
                if( callback != null){
                    console.log(`xo_auth::updateUserPassword:: Executing callback.`)
                    callback();
                }
            })
            .catch((error) => {
                XO_Auth.errorMessage = error.message;
                XO_Auth.errorCode = error.code;
                console.log(`xo_auth::updateUserPassword::Error Occurred: ${XO_Auth.errorMessage}`);
            })
        })
        .catch((error) => {
            XO_Auth.errorMessage = error.message;
            XO_Auth.errorCode = error.code;
            console.log(`xo_auth::SignInUser::Error Occurred: ${XO_Auth.errorMessage}`);

        })



    }

}





module.exports = {
    XO_Auth: XO_Auth,
}