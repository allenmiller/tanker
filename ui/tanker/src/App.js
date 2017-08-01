import React from 'react';
import ReactDOM from 'react-dom';
import { LineChart, Line, XAxis, YAxis, Legend } from 'recharts';
import './App.css';
import tanker from './services/TankerService';

class App extends React.Component {
  render() {

    return (
        <div>
        {this.props.children}
  </div>
  );
  }
}

let d =  new Date();
let now = d.getTime();
let yesterday = now - 24 * 60 * 1000;
let levels;

let data = tanker.getLevels(yesterday, now);
data.then((levels) => {
    console.log(levels.Items);
    let arr = Array.from(levels.Items);
    console.log(arr);
    RenderApp(arr);
});

function RenderApp(points) {

  ReactDOM.render(
      <div className="AJM"> Hello
        <LineChart width={400} height={400} data={points}>
          <XAxis dataKey="timestamp"/>
          <YAxis/>
          <Legend/>
          <Line type="monotone" dataKey="level" stroke="#8884d8" />
        </LineChart>
      </div>,
      document.getElementById('root')
  )
}

export default App;
