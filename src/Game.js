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
            turn: ''
        }

        this.connectToGameRoom = this.connectToGameRoom.bind(this);
        this.nextTurn = this.nextTurn.bind(this);
        this.updateLeaderboard = this.updateLeaderboard.bind(this);
        this.whoseTurnIsIt = this.whoseTurnIsIt.bind(this);
    }

    componentDidMount() {
        console.log(this.state)
        console.log(this.props)

        this.connectToGameRoom();
        this.nextTurn();

    }

    connectToGameRoom() {

        let socket = this.props.gameEventsSocket;

    }

    nextTurn() {

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
            this.updateLeaderboard(json['teams'], json['scores']);
            this.whoseTurnIsIt(json['current_player'], json['players'])
        })
    }

    updateLeaderboard(teams, scores) {

        let num_teams = teams.length
        var leaderboard = []
        for (var i=0; i<num_teams; i++) {
            leaderboard.push(teams[i] + ': ' + scores[i+1])
        }
        this.setState({ leaderboard: leaderboard });

    }

    whoseTurnIsIt(curIdx, players) {
        this.setState({ turn: players[curIdx] });
    }
    

    render() {

        let playButton;
        if (this.state.turn == this.state.player) {
            playButton = <div><button>Play</button></div>
        } else {
            playButton = <div></div>
        }

        return (
            <div className="App">
                <div className="main-container">
                    <div className="main">
                        <h3>{this.state.turn}'s turn</h3>
                        <br />
                        {playButton}
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

}

export default Game;
