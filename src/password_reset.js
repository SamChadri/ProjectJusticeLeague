import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import ReactDOMServer from 'react-dom/server';
import { Container } from 'react-bootstrap';
import { Col, Row, Form, Spinner } from "react-bootstrap";



class PasswordResetForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            'reset_state': 1,
            'reset_items':[
                {'state': 1, 'type':'text','label':'Email Address', 'placeholder':'name@example.com','message':"We'll send a recovery email to this address."},
                {'state': 2, 'type':'password', 'label': 'Old Password', 'placeholder':'', 'message':"Enter in your old password"},
                {'state': 3, 'type':'password', 'label': 'New Password', 'placeholder':'', 'message': "Enter in your new password"},

            ],
            'curr_state': {'state': 1, 'type':'text','label':'Email Address', 'placeholder':'name@example.com','message':"We'll send a recovery email to this address."},
            'email': null,
            'old_password': null,
            'new_password':null,
            'val': "",
            'status':'PASSIVE',
            'user_message': null,

        }

        this.handleClick = this.handleClick.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.getParameterByName = this.getParameterByName.bind(this);
        this.handleUrl = this.handleUrl.bind(this);
        this.sendEmail = this.sendEmail.bind(this);
    }

    handleClick(){
        var instance = this;
        const reset_state = this.state.reset_state;
        console.log(`Register state: ${reset_state}`);
        if(reset_state == 3){
            var value = instance.state.val;
            instance.setState(function(state, props) {
                return {
                    status: 'LOADING',
                    new_password: value,
                };
            }, function(){
                if(instance.state.password == instance.state.confirm_password){
                    instance.updatePassword();

                }else{
                    console.log(`xo_password_reset::ERROR: Passwords do no match`)
                }

            });

            
        }else{
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

                    default:
                        console.log(`Error occurred`);
                }
                
                

                
            });

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
                instance.requestEmail();
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
                          status: 'RESET_SENT',
                          user_message: 'Check your email, your password reset token has been sent'
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
                        <Form.Control id="register_box" onChange={e => this.setState({val: e.target.value})} value={this.state.val} type={this.state.curr_state.type} placeholder={this.state.curr_state.placeholder} />
                        <div id="emailHelp" class="form-text">{this.state.curr_state.message}</div>

                    </Form.Group>
                    <Form.Group className="w-100 text-center">
                        <Button className="w-25" onClick={this.handleClick} variant="outline-light" >
                            Submit
                        </Button>
                    </Form.Group>

                </Form>
                <hr className=" w-75 mx-auto "/>
                <div className="text-center" >
                        <Button className="w-50" onClick={this.handleClick} variant="outline-light" >
                            Back to Login
                        </Button>

                </div>
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
                {content}
            </>
        );
    }
}


var resetForm = ReactDOM.render(<PasswordResetForm/>,document.getElementById("reset-form"));
resetForm.handleUrl();