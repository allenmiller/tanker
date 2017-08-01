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

let data = tanker.getLevels(yesterday, now);
data.then((levels) => {
    let arr = Array.from(levels.Items);
    console.log(arr);
    RenderApp(arr);
});

function RenderApp(points) {

  console.log(points);
  ReactDOM.render(

        <LineChart width={400} height={400} data={points}>
          <XAxis dataKey="timestamp"/>
          <YAxis/>
          <Legend/>

          <Line dataKey="level" />
        </LineChart>,

      document.getElementById('root')
  )
}

export default App;
