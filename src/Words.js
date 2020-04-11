import React from 'react';
import './App.css';

class Words extends React.Component {

    constructor(props) {
        super(props);
        this.state = {words: ['', '', '', '', ''], name: this.props.match.params.player, code: this.props.match.params.code, host: this.props.match.params.host};

        this.submitWords = this.submitWords.bind(this);
        this.startGame = this.startGame.bind(this);
        this.nextPath = this.nextPath.bind(this);
        this.handleWordChange = this.handleWordChange.bind(this);
    }

    handleWordChange(index, event) {
        var words = this.state.words.slice();
        words[index] = event.target.value;
        this.setState({words: words})
    }

    submitWords() {

    }

    nextPath(path) {
        this.props.history.push(path);
    }

    startGame() {
        this.nextPath('/game')
    }


    render() {

        console.log(this.props.match.params);

        let buttons;
        if (this.props.match.params.host == "true") {
            buttons = <div className="box">
                        <button onClick={this.submitWords}>Submit</button>
                        <button onClick={this.startGame} style={{marginLeft: 50}} >Start</button>
                    </div>
        } else {
            buttons = <button>Submit</button>
        }


        let inputs = this.state.words.map((word, index) => {
            return (
                <div key={index}>
                <input type="text"
                       value={word}
                       style={{marginBottom: 20}}
                       onChange={this.handleWordChange.bind(this,index)}
                />
                </div>
            );
        });


        return (
            <div className="App">
                <header className="App-header">
                    <h1>{this.state.name}, add your words to the hat:</h1>
                    <br/>
                    {inputs}
                    {buttons}
                    <br/>
                    <h3>Game code: {this.state.code}</h3>
                </header>
            </div>
        )
    }

}

export default Words;
