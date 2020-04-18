import React from 'react';
import Words from "./Words";

class Timer extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            time: 45,
        }
        this.tick = this.tick.bind(this)
    }

    componentDidMount() {
        this.timer = setInterval(this.tick(), 1000);
    }

    tick() {
        this.setState({time: this.state.time - 1})
        if (this.state.time == 0) {
            this.props.stopTimer();
        }
    }

    render() {
        return(
            <div>
                <h3>{this.state.time}s</h3>
            </div>
        )
    }
}

export default Timer;