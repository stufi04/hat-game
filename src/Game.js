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
            turnFinished: false,
            word: '',
            playAlarm: false,
            socket: this.props.gameEventsSocket,
            round: 1,
            gameOver: false,
            players: [],
            guessedWord: null,
            animationDone: false
        }

        this.playButton = React.createRef();
        this.nextButton = React.createRef();

        this.setUpGameListeners = this.setUpGameListeners.bind(this);
        this.onUpdateLeaderboard = this.onUpdateLeaderboard.bind(this);
        this.whoseTurnIsIt = this.whoseTurnIsIt.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.notifyPlayClicked = this.notifyPlayClicked.bind(this);
        this.peekFirstWord = this.peekFirstWord.bind(this);
        this.onNextWord = this.onNextWord.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
        this.isMyTurn = this.isMyTurn.bind(this);
        this.playStarted = this.playStarted.bind(this);
        this.nextRound = this.nextRound.bind(this);
    }

    componentDidMount() {
        console.log(this.state)
        console.log(this.props)

        this.setUpGameListeners();

        var queryString = `/${this.state.code}/load-first-turn`;

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
            this.setState({players:  json['players']})
            this.onUpdateLeaderboard(json)
            this.whoseTurnIsIt(json)
            console.log(this.state)
        })

    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (this.isMyTurn()) {
            if (this.state.turnInProgress) {
                this.nextButton.current.focus()
            } else {
                this.playButton.current.focus()
            }
        }

    }

    setUpGameListeners() {

        console.log('Setting up game listeners')
        console.log(this.state)

        this.state.socket.on('update_leaderboard', this.onUpdateLeaderboard);

        this.state.socket.on('play', this.playStarted)

        this.state.socket.on('turn_loaded', this.whoseTurnIsIt)


    }

    playStarted() {

        console.log('Play started')

        this.setState({turnInProgress: true, playAlarm: false})

        console.log(this.state)
    }

    onUpdateLeaderboard(json) {

        console.log('Updating leaderboard')

        const teams = json['teams'];
        const scores = json['scores'];
        const word = json['word'];

        let scores_array = Object.keys(scores).map(function(key) {
            return [key, scores[key]];
        });

        scores_array.sort(function(first, second) {
            return second[1] - first[1];
        });

        console.log(teams)
        console.log(scores_array)


        let num_teams = teams.length
        var leaderboard = []
        for (var i = 0; i < num_teams; i++) {
            leaderboard.push(teams[parseInt(scores_array[i][0]-1)] + ': ' + scores_array[i][1])
        }
        this.setState({ leaderboard: leaderboard, guessedWord: word });


        let cmpnt = this;

        setTimeout(function () {
            cmpnt.setState({ guessedWord: '' });
        }, 2500);

        console.log(this.state)
    }

    whoseTurnIsIt(json) {

        console.log('Checking whose turn it is')

        let curIdx = json['current_player']
        let players = json['players']
        let round = json['round']
        if (round <= 3) {
            this.setState({turnInProgress: false, turnFinished: false, turn: players[curIdx], round: round});
        } else {
            this.setState({turnInProgress: false, turn: players[curIdx], gameOver: true});
        }
        console.log(this.state)
    }

    isMyTurn() {
        return this.state.turn === this.state.player;
    }

    onPlay() {

        console.log('Play clicked')

        this.peekFirstWord();
        this.notifyPlayClicked()

        console.log(this.state)
    }

    stopTimer() {

        console.log('Stopping timer')

        this.setState({ turnInProgress: false, turnFinished: true, playAlarm: true });

        var queryString = `/${this.state.code}/end-turn`;

        fetch(queryString, {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            }
        }).then(response => {
            return response.json();
        }).then(json => {
            console.log(this.state)
        });

    }

    notifyPlayClicked() {

        console.log('Notifying everyone that play is clicked')

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
            console.log(this.state)
        })

    }

    peekFirstWord() {

        console.log('Peeking first word')

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
                console.log(this.state)
            });

        }

    }

    onNextWord() {

        console.log('Next word clicked')

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
                this.setState({word: json['next_word']});
                if (this.state.word == 'NO MORE WORDS') {
                    this.nextRound();
                }
                console.log(this.state)
            });

        }

    }

    nextRound() {

        console.log('Prepare next round')

        var queryString = `/${this.state.code}/next-round`;

        fetch(queryString, {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            }
        }).then(response => {
            return response.json();
        }).then(json => {
            console.log(this.state)
        });


    }

    render() {

        let playButton;
        let wordDisplay;
        let wordGuessedButton;
        if (this.isMyTurn()) {
            playButton = <div><button autoFocus ref={this.playButton} hidden={this.state.turnInProgress || this.state.turnFinished} onClick={this.onPlay} style={{marginTop: 40}}>Play</button></div>;
            wordDisplay = <h1 style={{marginTop: 40}} hidden={!this.state.turnInProgress}>{this.state.word}</h1>;
            wordGuessedButton = <div><button autoFocus ref={this.nextButton} hidden={!this.state.turnInProgress} onClick={this.onNextWord} style={{marginTop: 40}}>Next Word</button></div>
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
        if (this.state.turnInProgress) {
            timer = <Timer stopTimer={this.stopTimer}/>
        }

        let message = <h5>Click when you are ready to begin your turn</h5>
        if (!this.isMyTurn()) {
            message = <h5>Waiting for {this.state.turn} to begin his/her turn...</h5>
        }

        let guessedWord = null
        if (!this.isMyTurn() && this.state.guessedWord != '' && this.state.guessedWord != null) {
            guessedWord = <div className="guessed-word">
                <h3>{this.state.turn} guessed the word</h3>
                <h1>{this.state.guessedWord}</h1>
            </div>
        }

        return (
            <div className="App">
                <div className="outer-container">
                    <div className="upper-div">
                        <h1 hidden={!this.state.gameOver} style={{marginTop: 75}}>Game over</h1>
                        <h1 hidden={this.state.gameOver} style={{marginTop: 75}}>Round {this.state.round}</h1>
                        <div hidden={this.state.gameOver} className="turns-labels">
                            {this.state.players.map((player) => <label key={player} style={{marginLeft: 10}} className={this.state.turn == player ? 'indicator' : null}>{player}</label>)}
                        </div>
                    </div>
                    <div className="main-container">
                        <div className="main" hidden={this.state.gameOver} >
                            {!this.state.turnInProgress ? message : null}
                            {wordDisplay}
                            {playButton}
                            {wordGuessedButton}
                            {guessedWord}
                            {timer}
                            {alert}
                        </div>
                        <div className="side">
                            <h1>Leaderboard</h1>
                            <ol>
                                {this.state.leaderboard.map((team) => <li key={team}>{team}</li>)}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        )

    }

}

export default Game;
