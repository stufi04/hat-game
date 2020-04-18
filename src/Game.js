import React from 'react';
import './App.css';

class Game extends React.Component {

    constructor(props) {
        super(props);
        console.log('In Game')
        console.log(props)
        this.state = {
            code: this.props.match.params.code,
            player: this.props.match.params.player,
            leaderboard: [],
            turn: '',
            turnInProgress: false,
            word: '',
            socket: this.props.gameEventsSocket,
        }

        this.setUpGameListeners = this._setUpGameListeners.bind(this);
        this.nextTurn = this._nextTurn.bind(this);
        this.onUpdateLeaderboard = this._onUpdateLeaderboard.bind(this);
        this.whoseTurnIsIt = this._whoseTurnIsIt.bind(this);
        this.onPlay = this._onPlay.bind(this);
        this.peekFirstWord = this._peekFirstWord.bind(this);
        this.onNextWord = this._onNextWord.bind(this);
        this.isMyTurn = this._isMyTurn.bind(this);
    }

    componentDidMount() {
        console.log(this.state)
        console.log(this.props)

        this.setUpGameListeners();
        this.nextTurn();

    }

    render() {

        let playButton;
        let wordDisplay;
        let wordGuessedButton;
        if (this.isMyTurn()) {
            playButton = <div><button disabled={this.state.turnInProgress} onClick={this.onPlay}>Play</button></div>;
            wordDisplay = <span>{this.state.word}</span>;
            wordGuessedButton = <div><button disabled={!this.state.turnInProgress} onClick={this.onNextWord}>Next Word</button></div>
        } else {
            playButton = <div></div>;
            wordDisplay = <span></span>;
            wordGuessedButton = <div></div>;
        }

        return (
            <div className="App">
                <div className="main-container">
                    <div className="main">
                        <h3>{this.state.turn}'s turn</h3>
                        <br />
                        {wordDisplay}
                        <br />
                        {playButton}
                        <br />
                        {wordGuessedButton}
                        <br />
                        <h3>45s</h3>
                    </div>
                    <div className="leaderboard">
                        <h1>Leaderboard</h1>
                        <ol>
                            {this.state.leaderboard.map((team) => <li key={team}>{team}</li>)}
                        </ol>
                    </div>
                </div>
            </div>
        )
    }

    _setUpGameListeners() {
        this.state.socket.on('update_leaderboard', this.onUpdateLeaderboard);
    }

    _nextTurn() {

        var code = this.state.code
        var queryString = '/' + code + '/start-turn'

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
            this.onUpdateLeaderboard(json)
            this.whoseTurnIsIt(json['current_player'], json['players'])
        })

    }

    _onUpdateLeaderboard(json) {
        const teams = json['teams']
        const scores = json['scores']
        let num_teams = teams.length
        var leaderboard = []
        for (var i = 0; i < num_teams; i++) {
            leaderboard.push(teams[i] + ': ' + scores[i + 1])
        }
        this.setState({ leaderboard: leaderboard });
    }

    _whoseTurnIsIt(curIdx, players) {
        this.setState({ turn: players[curIdx] });
    }

    _isMyTurn() {
        return this.state.turn === this.state.player;
    }

    _onPlay() {
        // TODO start timer 
        this.peekFirstWord();
        this.setState({ turnInProgress: true });
        // TODO set turnInProgress to false when timer ends
        // TODO notify others that round has started and show timers on their end
    }

    _peekFirstWord() {

        if (this.isMyTurn()) { // safeguard, should not really happen

            var queryString = `/${this.state.code}/next-word`;

            fetch(queryString, {
                method: "GET",
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json",
                }
            }).then(response => {
                return response.json();
            }).then(json => {
                this.setState({ word: json['next_word'] });
            });

        }

    }

    _onNextWord() {

        if (this.isMyTurn()) { // safeguard, should not really happen

            var queryString = `/${this.state.code}/mark-word-as-guessed`;

            fetch(queryString, {
                method: "POST",
                cache: "no-cache",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ word: this.state.word })
            }).then(response => {
                return response.json();
            }).then(json => {
                this.setState({ word: json['next_word'] });
            });

        }

    }

}

export default Game;
