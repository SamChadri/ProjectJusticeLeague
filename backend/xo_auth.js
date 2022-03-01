
const getAuth = require("firebase/auth").getAuth;
const createUserWithEmailAndPassword = require("firebase/auth").createUserWithEmailAndPassword;
const updateProfile = require("firebase/auth").updateProfile;

class XO_Auth{
    constructor(){

    }
    static #auth;
    static currUserId = '';
    static errorCode = -1;
    static errorMessage = "";

    static initAuth(){
        XO_Auth.#auth  = getAuth();

        
        
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

}


module.exports = {
    XO_Auth: XO_Auth,
}