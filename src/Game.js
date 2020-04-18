import React from 'react';
import soundfile from './assets/the_alarm.mp3'
import Timer from "./Timer";
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
            playAlarm: false,
            showTimer: false,
            socket: this.props.gameEventsSocket,
        }

        this.setUpGameListeners = this.setUpGameListeners.bind(this);
        this.nextTurn = this.nextTurn.bind(this);
        this.onUpdateLeaderboard = this.onUpdateLeaderboard.bind(this);
        this.whoseTurnIsIt = this.whoseTurnIsIt.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.notifyPlayClicked = this.notifyPlayClicked.bind(this);
        this.peekFirstWord = this.peekFirstWord.bind(this);
        this.onNextWord = this.onNextWord.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
        this.isMyTurn = this.isMyTurn.bind(this);
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
            playButton = <div><button hidden={this.state.turnInProgress} onClick={this.onPlay}>Play</button></div>;
            wordDisplay = <span>{this.state.word}</span>;
            wordGuessedButton = <div><button hidden={!this.state.turnInProgress} onClick={this.onNextWord}>Next Word</button></div>
        } else {
            playButton = <div></div>;
            wordDisplay = <span></span>;
            wordGuessedButton = <div></div>;
        }

        let alert = null;
        let myRef = React.createRef();
        if (this.state.playAlarm) {
           alert = <audio ref={myRef} src={soundfile} autoPlay/>
        }

        let timer = null;
        if (this.state.showTimer) {
            timer = <Timer stopTimer={this.stopTimer}/>
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
                        {timer}
                        {alert}
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

    setUpGameListeners() {
        this.state.socket.on('update_leaderboard', this.onUpdateLeaderboard);

        this.state.socket.on('play', this.setState({showTimer: true, playAlarm: false}))
    }

    nextTurn() {

        var code = this.state.code
        var queryString = '/' + code + '/load-turn'

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

    onUpdateLeaderboard(json) {
        const teams = json['teams']
        const scores = json['scores']
        let num_teams = teams.length
        var leaderboard = []
        for (var i = 0; i < num_teams; i++) {
            leaderboard.push(teams[i] + ': ' + scores[i + 1])
        }
        this.setState({ leaderboard: leaderboard });
    }

    whoseTurnIsIt(curIdx, players) {
        this.setState({ turn: players[curIdx] });
    }

    isMyTurn() {
        return this.state.turn === this.state.player;
    }

    onPlay() {
        this.peekFirstWord();
        this.setState({ turnInProgress: true });
        this.notifyPlayClicked()
    }

    stopTimer() {
        this.setState({ turnInProgress: false, playAlarm: true, showTimer: false });
        // TODO: if i'm the one whose turn it is , ask server to load next round (i.e. call prepare_next_player_turn in Python)
        // the if is important - we can't make this http request from every player or the turn will be updated many times instead of one
        // this can return the new state of the game
        // BUT.. this new state needs to reach all players, not just the one whose turn it is
        // so rather in the server prepare_next_player_turn will need to emit the state to everyone via the socket
        // once state is emitted, on client side we can do the things i currently do in nextTurn()
        // so we need to think if this can all be the same method, or current nextTurn() will be just firstTurn() instead
    }

    notifyPlayClicked() {

        var code = this.state.code
        var queryString = '/' + code + '/play'

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

    peekFirstWord() {

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

    onNextWord() {

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
