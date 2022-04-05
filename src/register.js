
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import ReactDOMServer from 'react-dom/server';
import { Container } from 'react-bootstrap';
import { Col, Row, Form, Spinner } from "react-bootstrap";
import * as CryptoJS from 'crypto-js'
import { getAuth, isSignInWithEmailLink, signInWithEmailLink, applyActionCode } from "firebase/auth";
import { nanoid } from "nanoid";

//import { XO_Auth } from '../backend/xo_auth';
//import { XO_Database } from '../backend/xo_database';



//Question: Should I encrypt then hash, or hash then hash again, encrypt, decrpyt then hash, or just hash once here.

//Another Question: Well I tried it. My question is can you basically limit the password visibility as much as possible.
//Reducing security risks on the developer end by encrypting everything as you type while creating some sort of black box a black box.

//I think I saw something similar with micrsofts security program when I was developing the football app.
//An secure abstraction maybe. I don't know, just an idea.
//Cuz I just realized, bro  you could just console log the passwords unless they do something fancier in the big leagues.


let num_states = 5;
//FOR THE LIFE OF ME, TELL THEM NIGGAS TO STOP FUCKING WIT THE INTERNET. RETROACTIVELY and PROACTIVELY.
class RegisterForms extends React.Component{
    constructor(props){
        super(props);
        this.createKey = this.createKey.bind(this);
        this.setInitializationVector = this.setInitializationVector.bind(this);

        const iv = CryptoJS.lib.WordArray.random(16).toString();


        this.state = {
            'id': 1,
            'register_state': 1,
            'register_items':[
                {'state': 1, 'type':'text','label':'Email Address', 'placeholder':'name@example.com'},
                {'state': 2, 'type':'text', 'label': 'Display Name','placeholder':'John Doe'},
                {'state': 3, 'type':'number', 'label': 'Age', 'placeholder':'21'},
                {'state': 4, 'type':'password', 'label': 'Password', 'placeholder':''},
                {'state': 5, 'type':'number', 'label': 'Verification Code', 'placeholder':''},

            ],
            'email':null,
            'displayName': null,
            'age': null,
            'password': null,
            'curr_state': {'state': 1, 'type':'text','label':'Email Address', 'placeholder':'name@example.com'},
            'loading': false,
            'submit': false,
            'val': "",
            'user_message':'Sent Email Verification',
            'more_info':'',
            'algorithm': 'aes-256-ctr',
            'secretKey': '',
            'iv': iv,

        }
        
        this.handleClick = this.handleClick.bind(this);
        this.handleUrl = this.handleUrl.bind(this);
        this.getParameterByName = this.getParameterByName.bind(this);
        this.sendVerification = this.sendVerification.bind(this);
        this.requestEmail = this.requestEmail.bind(this);
        this.submitData = this.submitData.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.encrypt = this.encrypt.bind(this);
        this.decrypt = this.decrypt.bind(this);
        this.setInitializationVector = this.setInitializationVector.bind(this);
        this.showVal= this.showVal.bind(this);
        this.requestKey = this.requestKey.bind(this);

        //const secretKey = this.createKey();
        //const iv = this.setInitializationVector();



    }
    handleClick(){
        var instance = this;
        const register_state = this.state.register_state;
        console.log(`Register state: ${register_state}`);

        var new_state = this.state.register_state + 1;
        this.setState(function(state,props){
            return{
                register_state: new_state
            }
        })
        $(`.register-info`).fadeOut(300,function(){
            var item = instance.state.register_items[instance.state.register_state -1];
            instance.setState(function(state, props) {
                return {
                    loading: true,
                    curr_state: item,
                };
            });
            $(`.register-info`).fadeIn(300, function(){});
            var value = instance.state.val;
            switch(register_state){
                case 1:
                    instance.setState(function(state,props){
                        return {
                            email:value,
                            val:"",
                        }
                    });
                    window.setTimeout(function(){
                        $(`.register-info`).fadeOut(300, function(){
                            instance.setState(function(state, props) {
                                return {
                                    loading: false,
                                };
                            });
                            $(`.register-info`).fadeIn(300, function(){});
        
                        });
                    }, 1000);
                    break;
                case 2:
                    instance.setState(function(state,props){
                        return {
                            displayName:value,
                            val:"",
                        }
                    });
                    window.setTimeout(function(){
                        $(`.register-info`).fadeOut(300, function(){
                            instance.setState(function(state, props) {
                                return {
                                    loading: false,
                                };
                            });
                            $(`.register-info`).fadeIn(300, function(){});
        
                        });
                    }, 1000);
                    break;
                case 3:
                    instance.requestKey();
                    instance.setState(function(state,props){
                        return {
                            age:value,
                            val:"",
                        }
                    },function(){
                        window.setTimeout(function(){
                            $(`.register-info`).fadeOut(300, function(){
                                instance.setState(function(state, props) {
                                    return {
                                        loading: false,
                                    };
                                });
                                $(`.register-info`).fadeIn(300, function(){});
            
                            });
                        }, 1000);
                    });

                    break;
                case 4:
                    instance.submitData()
                    break;
                
                case 5:
                    instance.sendVerification(value);
                    break;

                default:
                    console.log(`Error occurred`);
            }
            
            

            
        });




    }

    requestKey(){
        var instance = this;
        $.ajax({
            url: 'http://127.0.0.1:3005/request_key',
            type:"GET",
            success: function(result){
                console.log(result);
                instance.setState(function(state,props){
                    return{
                        key: result,
                    }
                });
                
            },
            error: function(error){
                console.log(`xo_register::requestKey::Error ${error}`)

            }
        })

    }


    submitData(){
        var instance = this;
        var value = instance.state.val;
        instance.setState(function(state, props) {
            return {
              password: value,
            };
        }, function(){
            console.log(`Password ${value}`);
            var userData = {
                age: instance.state.age,
                displayName : instance.state.displayName,
                email: instance.state.email,
                password: instance.state.password,
            };
            console.log(`Making Post Request with data... `);
            console.log(userData);
            $.ajax({
                url: 'http://127.0.0.1:3005/register',
                type:"POST",
                data: userData,
                success: function(result){
                    console.log(result);
                    console.log("Updating Register Info.");
                    instance.requestEmail();
                    var message = `Email Verification Sent to ${instance.state.email}`
                    $(`.register-info`).fadeOut(300, function(){
                        instance.setState(function(state, props) {
                            return {
                              more_info: message,
                              loading:false,
                            };
                        });

                        $(`.register-info`).fadeIn(300);
                    });

                },
                error: function(error){
                    console.log(`Error ${error}`)

                }
            })

        });

    }
    handleUrl(){
        document.addEventListener('DOMContentLoaded', () => {
            // TODO: Implement getParameterByName()
          
            // Get the action to complete.
            const actionCode = this.getParameterByName('hashCode');
            if(actionCode != ''){
                console.log(`handleUrl::Sending verification to server`)
                this.sendVerification(actionCode);

            }


          }, false);

    }

    getParameterByName(paramName){
        const url = new URL(window.location.href);
        console.log(`Parsing URL: ${url}`);
        var retval;
        if(paramName == 'hashCode'){
            retval = url.hash;
        }else{
            reval = url.searchParams.get(paramName);
        }
        return retval
    }

    requestEmail(){
        var instance = this;
        $.ajax({
            url: 'http://127.0.0.1:3005/send_verification_email',
            type:"GET",
            success: function(result){
                console.log(result);
                
            },
            error: function(error){
                console.log(`Error ${error}`)

            }
        })
    }


    handleChange(event){
        var value;

        if(this.state.register_state == 4 && event.target.value != ''){
            value = this.encrypt(event.target.value);
            console.log(`register::handleChange:: Encrypted password ${value}`);

        }else{
            value = event.target.value;
        }
        this.setState(function(state,props){
            return{
                val: value,
            }
        });
        


    }

    showVal(){
        console.log(`Value: ${this.state.val}`);
        if(this.state.register_state == 4 && this.state.curr_state.state == 4 && this.state.val != ''){
            return this.decrypt(this.state.val);
            //return this.state.val;
        }else{
            return this.state.val;
        }
    }

    createKey(){
        const currKey = this.state.secretKey
        if(currKey != null){
            return;
        }
        var instace = this;
        const key = CryptoJS.lib.WordArray.random(32);
        console.log(`Key: ${key}`);
        return key;

    }

    setInitializationVector(){
        const curr_iv = this.state.iv
        if(curr_iv != null){
            return;
        }
        const iv = CryptoJS.lib.WordArray.random(16);
        return iv;
    }


    encrypt(text){
        console.log(`Text: ${text}, SecretKey: ${this.state.secretKey}`);
        const key = CryptoJS.enc.Hex.parse(this.state.secretKey);
        const encryptedData= CryptoJS.AES.encrypt(text,key,{iv: this.state.iv, mode: CryptoJS.mode.ECB });
        return encryptedData.toString();

    }

    decrypt(hash){
        //I'll Keep this here so that the user can see what he is typing, however I would like to make some sort of
        //black box for anyone using "this utility".
        const key = CryptoJS.enc.Hex.parse(this.state.secretKey);
        const bytes = CryptoJS.AES.decrypt(hash, key, {iv: this.state.iv, mode: CryptoJS.mode.ECB })
        const decipheredData = bytes.toString(CryptoJS.enc.Utf8);


        return decipheredData;

    }

    

    sendVerification(code){
        var instance = this;
        var userData = {
            actionCode:code,
        };
        console.log(userData);
        $.ajax({
            url: 'http://127.0.0.1:3005/verify_email',
            type:"POST",
            data: userData,
            success: function(result){
                console.log(result);
                $(`.register-info`).fadeOut(300,function(){
                    instance.setState(function(state,props){
                        return{
                            loading:false,
                            submit:true,
                            user_message: "Email Verified"
                        }
                    });
                    
                    $(`.register-info`).fadeIn(300);
                })

                
            },
            error: function(error){
                console.log(`Error ${error.message}`)

            }
        })

    }

    render(){
        const loading = this.state.loading;
        const submited = this.state.submit;
        let content;
        if(loading){
            content = 
            <Spinner animation="border" />
        }else if(submited){
            content = 
            <>
                <h1>{this.state.user_message}</h1>
            </>
        }else{
            content = 
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>{this.state.curr_state.label}</Form.Label>
                    <Form.Control id="register_box" onChange={this.handleChange} value={this.showVal()} type={this.state.curr_state.type} placeholder={this.state.curr_state.placeholder} />
                </Form.Group>
                <Button onClick={this.handleClick} variant="outline-light" >
                    Submit
                </Button>
                <p className="lead">{this.state.more_info}</p>
            </Form>

        }
        return(
            <div className="register-info">
                {content}
            </div>

        );
    }
}
var registerContainer = ReactDOM.render(
    <RegisterForms/>,
    document.getElementById('form-info')
  );

registerContainer.handleUrl();
