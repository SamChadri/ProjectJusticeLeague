

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
    <TodoApp />,
    document.getElementById('root')
);