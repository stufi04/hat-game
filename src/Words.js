import React from 'react';
import io from 'socket.io-client';
import './App.css';

class Words extends React.Component {

    constructor(props) {
        super(props);
        console.log('In Words')
        this.state = {
            words: ['', '', '', '', ''],
            submitEnabled: true,
            name: this.props.match.params.player,
            code: this.props.match.params.code,
            host: this.props.match.params.host,
        };

        this.submitWords = this.submitWords.bind(this);
        this.startGame = this.startGame.bind(this);
        this.nextPath = this.nextPath.bind(this);
        this.handleWordChange = this.handleWordChange.bind(this);
        this.connectToGameRoom = this.connectToGameRoom.bind(this);

    }

    componentDidMount() {
        console.log(this.state)
        console.log(this.props)
        this.connectToGameRoom();
    }

    handleWordChange(index, event) {
        var words = this.state.words.slice();
        words[index] = event.target.value;
        this.setState({ words: words });
    }

    submitWords() {

        var code = this.state.code
        var queryString = '/' + code + '/words'

        fetch(queryString, {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state.words)
        }
        ).then(response => {
            return response.json()
        }).then(json => {
            console.log(json)
            if (json['result'] === 'success') {
                this.setState({ submitEnabled: false })
            }
        })
    }

    nextPath(path) {
        console.log(path)
        this.props.history.push(path);
    }

    startGame() {

        var code = this.state.code
        var queryString = '/' + code + '/start-game'

        fetch(queryString, {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            }
        }
        ).then(response => {
            return response.json()
        }).then(json => {
            console.log(json)
        })
    }

    connectToGameRoom() {

        let socket = this.props.gameEventsSocket;

        console.log(socket)

        socket = io.connect('http://127.0.0.1:5000');

        socket.on('connect', () =>
            socket.emit('join_game', {
                player_name: this.state.name,
                game_code: this.state.code
            })
        );


        socket.on('message', (message) => console.log('SocketIO Message: ' + message));

        socket.on('game_started', (json) => {

            console.log('Game started event received:');
            console.log(json);

            if (json.code === this.state.code) { // safeguard
                this.nextPath(`/game/${this.state.name}/${this.state.code}`);
            } else { // this must never happen as we use flask-socketio rooms and connect to a game room per game
                console.error(`Unexpected game_started event received - current code=${this.state.code}, received code=${json.code}`);
            }

        });

    }

    render() {

        let buttons;
        if (this.props.match.params.host == "true") {
            buttons = <div className="box">
                <button onClick={this.submitWords} disabled={!this.state.submitEnabled}>Submit</button>
                <button onClick={this.startGame} style={{ marginLeft: 50 }} >Start</button>
            </div>
        } else {
            buttons = <button onClick={this.submitWords} disabled={!this.state.submitEnabled}>Submit</button>
        }


        let inputs = this.state.words.map((word, index) => {
            return (
                <div key={index}>
                    <input type="text"
                        value={word}
                        style={{ marginBottom: 20 }}
                        onChange={this.handleWordChange.bind(this, index)}
                    />
                </div>
            );
        });


        return (
            <div className="App">
                <header className="App-header">
                    <h1>{this.state.name}, add your words to the hat:</h1>
                    <br />
                    {inputs}
                    {buttons}
                    <br />
                    <h3>Game code: {this.state.code}</h3>
                </header>
            </div>
        )
    }

}

export default Words;
