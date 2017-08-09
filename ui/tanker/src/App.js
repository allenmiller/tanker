import {React, Component} from 'react';
import './App.css';
import tanker from './services/TankerService';
import {TimeSeries} from 'pondjs';
import { Charts, ChartContainer, ChartRow, YAxis, LineChart, Resizable } from "react-timeseries-charts";

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
    RenderApp(arr);
});

function RenderApp(points) {

  let data = {};
  data.name = "tanker";
  data.columns = ["time", "level"];
  data.points=[];
  points.forEach((p) => {
    let point = [p.timestamp, p.level];
    data.points.push(point);
  });
//  data.points = points.map((p) => {
//    return [p.timestamp, p.level];
//  });


  console.log(data);
  console.log(data.points);

  let mySeries = new TimeSeries(data);
  console.log(mySeries);
  console.log(mySeries.toJSON());

  console.log(mySeries.at(0).get("level"));
  let tr = mySeries.timerange();
  let self={};
  self.series = mySeries;

  render(
      <Resizable>
      <ChartContainer timeRange={tr} height={500}>
        <ChartRow>
          <YAxis id="level" min={0} max={10000}/>
          <Charts>
            <LineChart axis="level"  series={mySeries}/>
          </Charts>
        </ChartRow>
      </ChartContainer>
      </Resizable>,

  document.getElementById('root')
  )
}
