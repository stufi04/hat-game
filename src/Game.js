import React from 'react';
import './App.css';

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            code: this.props.match.params.code,
            player: this.props.match.params.player,
            time: '',
            leaderboard: '',
            gameEventsSocket: null // TODO Words.js must pass this here somehow
        }
    }

    render() {
        return (
            <div className="App">
                <div className="main-container">
                    <div className="main">
                        <h1>Game: {this.state.code}, Player: {this.state.player} </h1>
                        <h3>Georgi's turn</h3>
                        <br />
                        <h1 style={{ marginTop: 100, marginBottom: 100 }}>динозавър</h1>
                        <br />
                        <h3>45s</h3>
                    </div>
                    <div className="leaderboard">
                        <h1>Leaderboard</h1>
                    </div>
                </div>
            </div>
        )
    }

}

export default Game;
