import React from 'react';
import './App.css';
import Modal from 'react-bootstrap/Modal'

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = { name: '', code: '', popup: false}

        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleCodeChange = this.handleCodeChange.bind(this)
        this.startGame = this.startGame.bind(this)
        this.joinGame = this.joinGame.bind(this)
        this.nextPath = this.nextPath.bind(this)
        this.toggleModal = this.toggleModal.bind(this)
    }

    handleNameChange(event) {
        this.setState({ name: event.target.value })
    }

    handleCodeChange(event) {
        this.setState({ code: event.target.value })
    }

    toggleModal() {
        this.setState({ popup: !this.state.popup })
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
                <div className="outer-container">
                    <div className="upper-div">
                        <div className="upper-row">
                            <button className="dummy">Rules</button>
                            <label className="title">Words in a Hat</label>
                            <button className="rules" onClick={this.toggleModal}>Rules</button>
                        </div>
                    </div>
                    <div className="main">
                        <p> Enter your name to play with friends: </p>
                        <input type="text" value={this.state.value} onChange={this.handleNameChange}></input>
                        <br />
                        <br />
                        <button disabled={this.state.name == ''} onClick={this.startGame}>New game</button>
                        <p>or</p>
                        <button disabled={this.state.name == '' || this.state.code == ''} onClick={this.joinGame}>Join game</button>
                        <br />
                        <div className="box">
                            <label>code:  </label>
                            <input type="text" value={this.state.code} onChange={this.handleCodeChange}></input>
                        </div>
                    </div>
                </div>

                <Modal dialogClassName="my-modal" tyle={{width:1000}} show={this.state.popup} onHide={this.toggleModal} aria-labelledby='ModalHeader'>
                    <Modal.Header closeButton>
                        <Modal.Title id='ModalHeader'>Rules</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>In short, this is a version of charades where you explain words to each other in teams of 2</p>
                        <p>Join a game with some friends, you need an even number of people in total (6 or 8 is optimal)</p>
                        <p>You need to be speaking over camera (Zoom is great for it - the functionality to pin someone's video on big screen can be useful in round 3)</p>
                        <p>Every player adds their own 5 words to the "hat", keep those secret! Normally, these should be nouns. After everyone is ready host can start the game.</p>
                        <p>The game randomly distributes teams of 2 and at each turn signals who will be explaining to their teammate.</p>
                        <p>Each turn is 45s long. The player tries to explain as many words as possible to their teammate. To this end, you should click 'next word' when your teammate has guessed the current word. Be warned, there is no skip, if you get blocked you wait till the timer runs down.</p>
                        <p>Each guessed word brings you 1 point. When all words are guessed, round ends and next one starts. Game is played in 3 rounds. Team with most points wins in the end.</p>
                        <p>After every round the words in the hat are shuffled and you play again with those same words. However, each round has different rules:</p>
                        <li>Round 1: player uses any word-based explanation they want (full sentences, songs etc)</li>
                        <li>Round 2: player can only use one single word (try to make connections with what you already know from first round)</li>
                        <li>Round 3: player cannot speak, they explain only by using gestures</li>
                        <br/>
                        <p>Using words with the same stem is forbidden, i.e. you can't explain firefighter by saying fire. Neither in round 1, nor 2.</p>
                        <p>If you can't explain the word (for example, if you don't know what it means) you can try to explain a word that sounds in a similar way, or even explain what letters are contained in the word. These strategies are ONLY allowed in an indirect way. You cannot say first letter is B. But you can say first letter is the same as the letter for the color of the sky. All in all, be sensible and be fair -  everyone  wants to win, but also everyone wants to have fun without fighting.</p>
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>

            </div>
        )
    }

}

export default App;
