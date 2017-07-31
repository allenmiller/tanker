import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import tanker from './services/TankerService';

class App extends Component {

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Tanker</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
            State is {this.state}
        </p>
      </div>
    );
  }
}

let d =  new Date();
let now = d.getTime();
let yesterday = now - 24 * 60 * 1000;

let data = tanker.getLevels(yesterday, now);
data.then((levels) => {
    console.log(levels);
});
console.log(data);



export default App;
