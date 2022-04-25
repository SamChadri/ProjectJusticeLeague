import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import ReactDOMServer from 'react-dom/server';
import { Container } from 'react-bootstrap';
import { Col, Row, Form, Spinner } from "react-bootstrap";
import * as CryptoJS from 'crypto-js'


const TAG = `password_reset`


class PasswordResetForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            'reset_state': 1,
            'reset_items':[
                {'state': 1, 'type':'text','label':'Email Address', 'placeholder':'name@example.com','message':"We'll send a recovery email to this address."},
                {'state': 2, 'type':'number','label':'Password Reset Code', 'placeholder':'','message':"Enter in the verification sent to your recovery email."},
                {'state': 3, 'type':'password', 'label': 'New Password', 'placeholder':'', 'message':"Enter in your old password."},
                {'state': 4, 'type':'password', 'label': 'Confirm Password', 'placeholder':'', 'message': "Enter in your new password."},

            ],
            'curr_state': {'state': 1, 'type':'text','label':'Email Address', 'placeholder':'name@example.com','message':"We'll send a recovery email to this address."},
            'email': null,
            'actionCode': null,
            'confirm_password': null,
            'new_password':null,
            'val': "",
            'status':'PASSIVE',
            'user_message': null,
            'secretKey': '',
            'iv': '4855d45a4d3e04f9448def4b88e24cc3',

        }

        this.handleClick = this.handleClick.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.getParameterByName = this.getParameterByName.bind(this);
        this.handleUrl = this.handleUrl.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
        this.verifyCode = this.verifyCode.bind(this);
        this.encrypt = this.encrypt.bind(this);
        this.decrypt = this.decrypt.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.showVal = this.showVal.bind(this);
    }

    handleClick(){
        var instance = this;
        const reset_state = this.state.reset_state;
        console.log(`Register state: ${reset_state}`);
        var new_state = this.state.reset_state + 1;
        this.setState(function(state,props){
            return{
                reset_state: new_state
            }
        })
        $(`.reset-info`).fadeOut(500,function(){
            var item = instance.state.reset_items[instance.state.reset_state -1];
            instance.setState(function(state, props) {
                return {
                    status: 'LOADING',
                    curr_state: item,
                };
            });
            $(`.reset-info`).fadeIn(500, function(){});
            var value = instance.state.val;
            switch(reset_state){
                case 1:
                    instance.setState(function(state,props){
                        return {
                            email:value,
                            val:"",
                        }
                    },function(){
                        instance.sendEmail();
                    });
                    
                    break;
                case 2:
                    instance.setState(function(state,props){
                        return{
                            actionCode: value,
                        }
                    }, function(){
                        instance.verifyCode(instance.state.actionCode,item );
                    });

                    break;
                case 3:
                    window.setTimeout(function(){
                        $(`.reset-info`).fadeOut(500, function(){
                            instance.setState(function(state,props){
                                return {
                                    old_password:value,
                                    val:"",
                                    status: 'PASSIVE',
                                    curr_state: item,
                                }
                            });
                            $(`.reset-info`).fadeIn(500, function(){});

                        });

        
                    }, 2000);
                    break;
                case 4:
                    var value = instance.state.val;
                    instance.setState(function(state, props) {
                        return {
                            new_password: value,
                        };
                    }, function(){
                        if(instance.state.password == instance.state.confirm_password){
                            instance.updatePassword();
        
                        }else{
                            console.log(`xo_password_reset::ERROR: Passwords do no match`)
                        }
        
                    });

                default:
                    console.log(`Error occurred`);
            }
            
            

            
        });

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
    requestKey(){
        var instance = this;
        $.ajax({
            url: 'http://127.0.0.1:3005/request_key',
            type:"GET",
            success: function(result){
                console.log(result);
                instance.setState(function(state,props){
                    return{
                        secretKey: result,
                    }
                });
                
            },
            error: function(error){
                console.log(`xo_register::requestKey::Error ${error}`)

            }
        })

    }

    handleChange(event){
        var value;
        var curr_state = this.state.reset_state

        if((curr_state == 3 || curr_state == 4) && event.target.value != ''){
            value = this.encrypt(event.target.value);
            console.log(`${TAG}::handleChange:: Encrypted password ${value}`);
            this.setState(function(state,props){
                return{
                    val: value,
                }
            });

        }else{
            value = event.target.value;
            console.log(`${TAG}::handleChange:: Email : ${value}`);
            this.setState(function(state,props){
                return{
                    val: value,
                }
            });
        }

        


    }


    showVal(){
        console.log(`Value: ${this.state.val}`);
        var state_4_check = this.state.reset_state == 4 && this.state.curr_state.state == 4
        var state_3_check = this.state.reset_state == 3 && this.state.reset_state == 3
        if((state_3_check || state_4_check) && this.state.val != ''){
            return this.decrypt(this.state.val);
            //return this.state.val;
        }else{
            return this.state.val;
        }
    }

    updatePassword(){
        var instance  = this;
        var userData = {
            old_passowrd: instance.state.old_password,
            new_password: instance.state.new_password,
        };
        console.log(`Making Post Request with data... `);
        console.log(userData);
        $.ajax({
            url: 'http://127.0.0.1:3005/update_password',
            type:"POST",
            data: userData,
            success: function(result){
                console.log(result);
                console.log("Updating Register Info.")
                $(`.reset-info`).fadeOut(500, function(){
                    instance.setState(function(state, props) {
                        return {
                            status: 'PASSWORD_UPDATED',
                            user_message: 'Your password has been successfully updated.'
                        };
                    });
                    $(`.reset-info`).fadeIn(500, function(){});
                });
            },
            error: function(error){
                console.log(`Error ${error}`)

            }
        })
    }

    verifyCode(code, next_state){
        var instance = this;
        console.log(`${TAG}::verifyCode::Making POST request`);
        var userData = {
            actionCode: code,
        }
        $.ajax({
            url: 'http://127.0.0.1:3005/verify_password',
            type:"POST",
            data: userData,
            success: function(result){
                console.log(result);
                $(`.reset-info`).fadeOut(500, function(){
                    instance.requestKey();
                    instance.setState(function(state, props) {
                        return {
                          status: 'PASSIVE',
                          val:"",
                          curr_state: next_state,

                        };
                    });
                    $(`.reset-info`).fadeIn(500, function(){});
                });
            },
            error: function(error){
                console.log(`Error ${error}`)

            }
        });

    }

    sendEmail(){
        var instance  = this;
        var userData = {
            email: instance.state.email,
        };
        console.log(`Making Post Request with data...  `);
        console.log(userData);
        $.ajax({
            url: 'http://127.0.0.1:3005/reset_email',
            type:"POST",
            data: userData,
            success: function(result){
                console.log(result);
                $(`.reset-info`).fadeOut(500, function(){
                    instance.setState(function(state, props) {
                        return {
                          status: 'PASSIVE',
                        };
                    });
                    $(`.reset-info`).fadeIn(500, function(){});
                });
            },
            error: function(error){
                console.log(`Error ${error}`)

            }
        });
    }

    handleUrl(){
        document.addEventListener('DOMContentLoaded', () => {
            // TODO: Implement getParameterByName()
          
            // Get the action to complete.
            const actionCode = this.getParameterByName('hashCode');
            if(actionCode != ''){
                var new_state = this.state.reset_items[1];
                this.setState(function(state,props){
                    return{
                        curr_state: new_state,
                        reset_state: 2,
                    }
                })
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

    

    render(){
        const status = this.state.status;
        let content;
        if(status == 'PASSIVE'){
            content = 
            <div >
               <Form className="my-5 w-75 mx-auto ml-0">
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>{this.state.curr_state.label}</Form.Label>
                        <Form.Control id="register_box" onChange={this.handleChange} value={this.showVal()} type={this.state.curr_state.type} placeholder={this.state.curr_state.placeholder} />
                        <div id="emailHelp" class="form-text">{this.state.curr_state.message}</div>

                    </Form.Group>
                    <Form.Group className="w-100 text-center">
                        <Button className="w-25" onClick={this.handleClick} variant="outline-light" >
                            Submit
                        </Button>
                    </Form.Group>

                </Form>

            </div>
        }else if(status == 'LOADING'){
            content = 
            <>
            <div className=" text-center w-100">
                <Spinner  animation="border"/>
            </div>

            </>

        }else{
            content= 
            <>
            <div className="w-100 text-center">
                <h1 style={{fontSize: '18px'}} className="display-6">{this.state.user_message}</h1>

            </div>

            </>

        }
        return(
            <>
                <div className='reset-info'>
                    {content}
                </div>
                <div className='back-home'>
                    <hr className=" w-75 mx-auto "/>
                    <div className="text-center" >
                            <Button href='http://127.0.0.1:3005/' className="w-50" variant="outline-light" >
                                Back to Login
                            </Button>

                    </div>
                </div>
            </>
        );
    }
}


var resetForm = ReactDOM.render(<PasswordResetForm/>,document.getElementById("reset-form"));
resetForm.handleUrl();