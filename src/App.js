import React from 'react';
import './App.css';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = { name: '', code: '' }

        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleCodeChange = this.handleCodeChange.bind(this)
        this.startGame = this.startGame.bind(this)
        this.joinGame = this.joinGame.bind(this)
        this.nextPath = this.nextPath.bind(this)
    }

    handleNameChange(event) {
        this.setState({ name: event.target.value })
    }

    handleCodeChange(event) {
        this.setState({ code: event.target.value })
    }

    startGame() {

        console.log('Starting new game')

        var name = this.state.name

        fetch("new-game", {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(name)
        }
        ).then(response => {
            return response.json()
        }).then(code => {
            console.log(code)
            this.nextPath('/words/' + name + '/' + code + '/' + 'true')
        })

    }

    joinGame() {

        console.log('Joining a game')

        var name = this.state.name
        var code = this.state.code

        fetch("join-game", {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "name": name, "code": code })
        }
        ).then(response => {
            return response.json()
        }).then(json => {
            console.log(json)
            console.log(json['joined game'])
            if (json['joined game']) {
                this.nextPath('/words/' + name + '/' + code + '/' + 'false')
            }
        })

    }

    nextPath(path) {
        this.props.history.push(path);
    }


    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1> HAT </h1>
                    <br />
                    <p> Enter your name to play with friends: </p>
                    <input type="text" value={this.state.value} onChange={this.handleNameChange}></input>
                    <br />
                    <br />
                    <button onClick={this.startGame}>New game</button>
                    <p>or</p>
                    <button onClick={this.joinGame}>Join game</button>
                    <br />
                    <div className="box">
                        <label>code: </label>
                        <input type="text" value={this.state.code} onChange={this.handleCodeChange}></input>
                    </div>
                </header>
            </div>
        )
    }

}

export default App;
