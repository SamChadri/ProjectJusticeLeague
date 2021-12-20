import './bc_style.css'
var Alert = ReactBootstrap.Alert;
var Button = ReactBootstrap.Button;



class WelcomeMessage extends React.Component{
    render(){
        return (
            <div>
                <h1>Welcome to the Club </h1>
            </div>
        );
    }
}

class ItemList extends React.Component{
    render(){
        return (
            <ul>
                {this.props.items.map(item => (
                    <li key={item.id}>{item.text}</li>
                ))}
            </ul>
        );
    }

}


class VidContainer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            items:[
                {'id': 1, 'video_code': '1ZHTurVaGus'},
                {'id': 2, 'video_code': '5ngeO703yA4'},
                {}
            ]
        }
    }


    handleClick(){

    }

    render(){

        return(
            
            <Button id="bf-1" style={{borderRadius: '50%'}} variant="outline-primary"  type="button" className="test">
                Success
            </Button>

        );

    }
}



class TodoApp extends React.Component{
    constructor(props){
        super(props);
        this.state = {items:[], text: '', placeholder: 'Another One'};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e){
        this.setState({text: e.target.value})

    }
    handleSubmit(e){
        e.preventDefault();
        if (this.state.text.length == 0 ){
            return;
        }
        const newItem = {
            text: this.state.text,
            id: Date.now()
        };
        this.setState(state => ({
            items: state.items.concat(newItem),
            text: ''
        }));
    }

    render(){
        return (
            <div>
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <div>
                            <label htmlFor="new-todo">
                                Dive In
                            </label> 
                        </div>
                        <div>
                            <input 
                            id="new-todo"
                            onChange={this.handleChange}
                            value={this.state.text}
                            placeholder={this.state.placeholder}
                            />
                        </div>
                        <button>
                            Submit
                        </button>
                    </form> 
                </div>
                <ItemList items={this.state.items}/>
            </div>
        );
    }
}






ReactDOM.render(
    <VidContainer/>,
    document.getElementById('root')
);