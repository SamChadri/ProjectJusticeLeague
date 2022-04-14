import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import ReactDOMServer from 'react-dom/server';
import { Container } from 'react-bootstrap';
import { Col, Row, Form, Spinner } from "react-bootstrap";
import * as CryptoJS from 'crypto-js'
import { getAuth, isSignInWithEmailLink, signInWithEmailLink, applyActionCode } from "firebase/auth";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";

const TAG= "xo_login"


class LoginForm extends React.Component{
    constructor(props){
        super(props);
        const iv = CryptoJS.lib.WordArray.random(16).toString();
        console.log(`IV: `);
        console.log(iv)

        this.state = {
            'id': '1',
            'email': null,
            'password': null,
            'user_message': '',
            'pass_val':'',
            'val': '',
            'secretKey': '',
            'iv': '4855d45a4d3e04f9448def4b88e24cc3',
        }

        this.encrypt = this.encrypt.bind(this);
        this.decrypt = this.decrypt.bind(this);
        this.login = this.login.bind(this);
        this.showVal = this.showVal.bind(this);
        this.handleChange = this.handleChange.bind(this);



    }

    login(){
        var instance = this;
        var emailVal = this.state.val;
        var passwordVal = this.state.pass_val;
        instance.setState(function(state,props){
            return{
                email: emailVal,
                password: passwordVal,
            }
        },function(){
            var userData = {
                email:instance.state.email,
                password: instance.state.password,
            }
            $.ajax({
                url: 'http://127.0.0.1:3005/login',
                type: "POST",
                data: userData,
                success: function(result){
                    console.log(`${TAG}::long:: Login Successfull.`);
                    if(result == "Success"){
                        window.location.href='http://127.0.0.1:3005/home'
                    }else{
                        instance.setState(function(state,props){
                            return{
                                user_message: result,
                            }
                        })                    
                    }
                    
                },
                error: function(error){
                    console.log(`xo_login::login::Error ${error}`);
                    instance.setState(function(state,props){
                        return{
                            user_message: error,
                        }
                    })
                }
            })
        })

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
                console.log(`xo_login::requestKey::Error ${error}`)

            }
        })

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
    handleChange(event){
        var value;

        if(event.target.name == 'password' && event.target.value != ''){
            value = this.encrypt(event.target.value);
            console.log(`${TAG}::handleChange:: Encrypted password ${value}`);
            this.setState(function(state,props){
                return{
                    pass_val: value,
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

        return this.decrypt(this.state.pass_val);
            //return this.state.val;

    }

    render(){
        return(
            <>
                <p className="text-center" style={{color:'red'}}>{this.state.user_message}</p>
                <Form className=" my-5 w-75 mx-auto ml-0">
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="exampleInputEmail1" className="form-label">Email address</Form.Label>
                        <Form.Control name="email" type="email" value={this.state.val} onChange={this.handleChange} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </Form.Group>
                    <Form.Group class="mb-3">
                        <Form.Label htmlFor="exampleInputPassword1" className="form-label">Password</Form.Label>
                        <Form.Control name="password" type="password"  value={this.showVal()} onChange={this.handleChange} className="form-control" id="exampleInputPassword1"/>
                    </Form.Group>
                    <Form.Group class="mb-3  form-check">
                        <Form.Control type="checkbox" className="form-check-input" id="exampleCheck1"/>
                        <Form.Label className="form-check-label" htmlFor="exampleCheck1">Remember Me</Form.Label>
                        <a href="http://127.0.0.1:3005/password_reset" className="forgot-password">Forgot Password</a>

                    </Form.Group>

                    <div className="w-100 text-center">
                        <Button onClick={this.login} type="button" variant="outline-light"  className="btn">Submit</Button>

                    </div>

                </Form>
                <hr className=" w-75 mx-auto "/>
                <div className="text-center" >
                    <h4>Don't have an account?</h4>
                    <Button variant="outline-light" href="http://127.0.0.1:3005/register" type="submit" className="btn w-50">SIGN UP FOR XO</Button>

                </div>
            </>
        )
    }
}

var loginContainer = ReactDOM.render(
    <LoginForm/>,
    document.getElementById('login-info')
  );

  loginContainer.requestKey();

