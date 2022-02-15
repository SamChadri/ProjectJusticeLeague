import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Button from 'react-bootstrap/Button';
import ReactDOMServer from 'react-dom/server';
import { Container } from 'react-bootstrap';
import { Col, Row, Form, Spinner } from "react-bootstrap";


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
            'curr_state': {'state': 1, 'type':'text','label':'Email Address', 'placeholder':'name@example.com'},
            'loading': false
        }

        this.handleClick = this.handleClick.bind(this);
    }


    handleClick(){
        var instance = this;
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

    render(){
        const loading = this.state.loading;
        let content;
        if(loading){
            content = 
            <Spinner animation="border" />

        }else{
            content = 
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>{this.state.curr_state.label}</Form.Label>
                    <Form.Control type={this.state.curr_state.type} placeholder={this.state.curr_state.placeholder} />
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