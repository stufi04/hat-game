import React from 'react';
import './App.css';

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {player: '', time: '', leaderboard: ''}
    }


    render() {

        return (
            <div className="App">
                <div className="main-container">
                    <div className="main">
                        <h3>Georgi's turn</h3>
                        <br/>
                        <h1 style={{marginTop: 100, marginBottom: 100}}>динозавър</h1>
                        <br/>
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
