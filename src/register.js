
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import ReactDOMServer from 'react-dom/server';
import { Container } from 'react-bootstrap';
import { Col, Row, Form, Spinner } from "react-bootstrap";
//import { XO_Auth } from '../backend/xo_auth';
//import { XO_Database } from '../backend/xo_database';





let num_states = 5;
//FOR THE LIFE OF ME, TELL THEM NIGGAS TO STOP FUCKING WIT THE INTERNET. RETROACTIVELY and PROACTIVELY.
class RegisterForms extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            'id': 1,
            'register_state': 1,
            'register_items':[
                {'state': 1, 'type':'text','label':'Email Address', 'placeholder':'name@example.com'},
                {'state': 2, 'type':'text', 'label': 'Display Name','placeholder':'John Doe'},
                {'state': 3, 'type':'number', 'label': 'Age', 'placeholder':'21'},
                {'state': 4, 'type':'password', 'label': 'Password', 'placeholder':''},

            ],
            'email':null,
            'displayName': null,
            'age': null,
            'password': null,
            'curr_state': {'state': 1, 'type':'text','label':'Email Address', 'placeholder':'name@example.com'},
            'loading': false,
            'submit': false,
            'val': ""
        }
        this.handleClick = this.handleClick.bind(this);
    }


    handleClick(){
        var instance = this;
        const register_state = this.state.register_state;
        console.log(`Register state: ${register_state}`);
        if(register_state == 4){
            var value = instance.state.val;
            instance.setState(function(state, props) {
                return {
                  loading: true,
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
                        console.log("Updating Register Info.")
                        $(`.register-info`).fadeOut(500, function(){
                            instance.setState(function(state, props) {
                                return {
                                  loading: false,
                                  submit: true,
                                };
                            });
                            $(`.register-info`).fadeIn(500, function(){});
                        });
                    },
                    error: function(error){
                        console.log(`Error ${error}`)
    
                    }
                })

            });

            
        }else{
            var new_state = this.state.register_state + 1;
            this.setState(function(state,props){
                return{
                    register_state: new_state
                }
            })
            $(`.register-info`).fadeOut(500,function(){
                var item = instance.state.register_items[instance.state.register_state -1];
                instance.setState(function(state, props) {
                    return {
                      loading: true,
                      curr_state: item,
                    };
                });
                $(`.register-info`).fadeIn(500, function(){});
                var value = instance.state.val;
                switch(register_state){
                    case 1:
                        instance.setState(function(state,props){
                            return {
                                email:value,
                                val:"",
                            }
                        });
                        break;
                    case 2:
                        instance.setState(function(state,props){
                            return {
                                displayName:value,
                                val:"",
                            }
                        });
                        break;
                    case 3:
                        instance.setState(function(state,props){
                            return {
                                age:value,
                                val:"",
                            }
                        });
                        break;
                    default:
                        console.log(`Error occurred`);
                }
                
                
                window.setTimeout(function(){
                    $(`.register-info`).fadeOut(500, function(){
                        instance.setState(function(state, props) {
                            return {
                              loading: false,
                            };
                        });
                        $(`.register-info`).fadeIn(500, function(){});
    
                    });
                }, 2000)
                
            });

        }



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
                <h1>Completed</h1>
            </>
        }else{
            content = 
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>{this.state.curr_state.label}</Form.Label>
                    <Form.Control id="register_box" onChange={e => this.setState({val: e.target.value})} value={this.state.val} type={this.state.curr_state.type} placeholder={this.state.curr_state.placeholder} />
                </Form.Group>
                <Button onClick={this.handleClick} variant="outline-light" >
                    Submit
                </Button>
            </Form>

        }
        return(
            <div className="register-info">
                {content}
            </div>

        );
    }
}
ReactDOM.render(
    <RegisterForms/>,
    document.getElementById('form-info')
  );
