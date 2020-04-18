import React from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import './custom.scss';
import App from './App';
import Words from './Words';
import * as serviceWorker from './serviceWorker';
import Game from "./Game";

const gameEventsSocket = io('http://127.0.0.1:5000');
gameEventsSocket.on('message', (message) => console.log('SocketIO Message: ' + message));

const routing = (
    <Router>
        <div>
            <Route exact path="/" component={App} />
            <Route path="/words/:player/:code/:host" render={(props) => <Words {...props} gameEventsSocket={gameEventsSocket} />} />
            <Route path="/game/:player/:code" render={(props) => <Game {...props} gameEventsSocket={gameEventsSocket} />} />
        </div>
    </Router>
)

ReactDOM.render(
    routing,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
