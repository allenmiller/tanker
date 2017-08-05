import React from 'react';
import ReactDOM from 'react-dom';
import { LineChart, Line, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts';
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

let msPerDay = 86400000;
let d =  new Date();
let now = d.getTime();
let yesterday = now - msPerDay;

let data = tanker.getLevels(yesterday, now);
data.then((levels) => {
    let arr = Array.from(levels.Items);
    console.log(arr);
    RenderApp(arr);
});

function RenderApp(points) {

  console.log(points);
  ReactDOM.render(
      <ResponsiveContainer minHeight={400} maxHeight={800}>
        <LineChart data={points}>
          <XAxis dataKey="timestamp"/>
          <YAxis/>
          <Legend/>

          <Line dataKey="level" />
        </LineChart>
      </ResponsiveContainer>,

      document.getElementById('root')
  )
}

export default App;
