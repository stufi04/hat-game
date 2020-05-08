import React from 'react';
import './App.css';

class Words extends React.Component {

    constructor(props) {
        super(props);
        console.log('In Words')
        this.state = {
            words: ['', '', '', '', ''],
            submitEnabled: false,
            name: this.props.match.params.player,
            code: this.props.match.params.code,
            host: this.props.match.params.host,
            socket: this.props.gameEventsSocket,
            log: []
        };

        this.submitWords = this.submitWords.bind(this);
        this.startGame = this.startGame.bind(this);
        this.nextPath = this.nextPath.bind(this);
        this.handleWordChange = this.handleWordChange.bind(this);
        this.connectToGameRoom = this.connectToGameRoom.bind(this);
        this.setUpGameListeners = this.setUpGameListeners.bind(this);
        this.updateLog = this.updateLog.bind(this);

    }

    componentDidMount() {
        console.log(this.state)
        console.log(this.props)
        this.connectToGameRoom();
        this.setUpGameListeners();
    }

    handleWordChange(index, event) {
        var words = this.state.words.slice();
        words[index] = event.target.value;
        let emptyWords = words.every(w => w != '')
        this.setState({ words: words, submitEnabled: emptyWords });
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
            body: JSON.stringify({'words': this.state.words, 'player': this.state.name})
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

        console.log('joining game room');

        this.state.socket.emit('join_game', {
            player_name: this.state.name,
            game_code: this.state.code
        });

    }

    setUpGameListeners() {

        this.state.socket.on('game_started', this.onGameStarted.bind(this));

        this.state.socket.on('player_joined', this.updateLog)

        this.state.socket.on('words_submitted', this.updateLog)

    }

    updateLog(json) {

        console.log(json)

        let curEvent = json['event']
        let player = json['player']

        console.log(curEvent, player)

        if (curEvent == 'joined') {
            this.setState({log: this.state.log.push(player + ' just joined the game')})
        } else if (curEvent == 'submit') {
            this.setState({log: this.state.log.push(player + ' just submitted their words')})
        }


    }

    onGameStarted(json) {
        console.log('Game started event received:');
        console.log(json);

        if (json.code === this.state.code) { // safeguard
            this.nextPath(`/game/${this.state.name}/${this.state.code}`);
        } else { // this must never happen as we use flask-socketio rooms and connect to a game room per game
            console.error(`Unexpected game_started event received - current code=${this.state.code}, received code=${json.code}`);
        }
    }

    render() {

        console.log(this.state.log)

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
