import React from 'react';
import './App.css';

class Words extends React.Component {

    constructor(props) {
        super(props);
        this.state = {words: [], name: this.props.match.params.player, code: this.props.match.params.code, host: this.props.match.params.host}

    }



    render() {

        console.log(this.props.match.params)

        let buttons
        if (this.props.match.params.host == "true") {
            buttons = <div className="box">
                        <button>Submit</button>
                        <button style={{marginLeft: 50}} >Start</button>
                    </div>
        } else {
            buttons = <button>Submit</button>
        }

        return (
            <div className="App">
                <header className="App-header">
                    <h1>{this.state.name}, add your words to the hat:</h1>
                    <br/>
                    <input type='text'></input>
                    <br/>
                    <input type='text'></input>
                    <br/>
                    <input type='text'></input>
                    <br/>
                    <input type='text'></input>
                    <br/>
                    <input type='text'></input>
                    <br/>
                    {buttons}
                    <br/>
                    <h3>Game code: {this.state.code}</h3>
                </header>
            </div>
        )
    }

}

export default Words;
