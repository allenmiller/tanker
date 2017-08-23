import React, {Component} from 'react';
import './App.css';
import tanker from './services/TankerService';
import {TimeSeries} from 'pondjs';
import {
  Baseline,
  Charts,
  ChartContainer,
  ChartRow,
  EventMarker,
  YAxis,
  LineChart,
  Resizable
} from "react-timeseries-charts";

// Define tank levels in cm below ground level

const topOfTank = 62;
const alarmDistance = 90;
const alertDistance = 106;
const normalHigh = 121;
const normalLow = 139;
const bottomOfTank = 202;

const galPerCm = 8.2;

class App extends Component {

  constructor(props) {
    super(props);
    let now = new Date();
    this.state = {time: now.getTime()};
  }

  componentDidMount() {

    let msPerDay = 86400000;
    let d = new Date();
    let now = d.getTime();
    let yesterday = now - msPerDay;

    let data = tanker.getLevels(yesterday, now);
    data.then((levels) => {
      let levelsArr = Array.from(levels.Items);
      let graphData = {
        name: "tanker",
        columns: ["time", "distance"],
        points: []
      };
      levelsArr.forEach((p) => {
        let point;
        point = [p.timestamp, -p.distance_cm];
        graphData.points.push(point);
      });
      let lastDistance = graphData.points[graphData.points.length - 1][1];
      console.log(lastDistance);

      let alarmCapacity = 0;
      if (Math.abs(lastDistance) > alarmDistance) {
        alarmCapacity = (Math.abs(lastDistance) - alarmDistance) * galPerCm;
      }
      let alertCapacity = 0;
      if(Math.abs(lastDistance) > alertDistance) {
        alertCapacity = (Math.abs(lastDistance) - alertDistance) * galPerCm;
      }
      const timeSeries = new TimeSeries(graphData);
      const timeRange = timeSeries.timerange();
      this.setState({
        alarmCapacity: Math.round(alarmCapacity),
        alertCapacity: Math.round(alertCapacity),
        timeSeries: timeSeries,
        timeRange: timeRange
      });
    });
  }

  handleTrackerChanged = (t) => {
    if (t && this.state.timeSeries) {
      const event = this.state.timeSeries.atTime(t);
      const eventLevel = event.get("distance");
      let d = new Date();
      let currTime = d.getTime();
      this.setState({
        tracker: event.begin().getTime(),
        trackerValue: eventLevel,
        trackerEvent: event,
        time: currTime
      });
    } else {
      this.setState({tracker: null, trackerValue: null, trackerEvent: null})
    }
  };

  render() {

    return (
        <div className="App">
          <div className="App-intro">
            <p>
              {this.state.timeRange
                ? this.state.timeRange.begin().toLocaleString() : " waiting... "}
              {" to "}
              {this.state.timeRange
                  ? this.state.timeRange.end().toLocaleString() : " waiting... "}.
            </p>
            <p>
              {this.state.alertCapacity} gal until alert,&nbsp;
              {this.state.alarmCapacity} gal until alarm.
            </p>
            <p>
              {this.state.tracker ? new Date(this.state.tracker).toLocaleString()
                  : ""}
              &nbsp;
              {this.state.tracker ? this.state.trackerValue : ""}
            </p>
          </div>
          <div>
            {
              this.state.timeRange
                  ? <Resizable>
                    <ChartContainer
                        timeRange={this.state.timeRange}
                        onTrackerChanged={this.handleTrackerChanged}
                    >
                      <ChartRow height="400">
                        <YAxis
                            id="distanceAxis"
                            label="distance from sensor (cm)"
                            min={0.0}
//                            max={this.state.timeSeries.max("level")}/>
                            max={150}/>
                        <Charts>
                          <LineChart
                              axis="distanceAxis"
                              series={this.state.timeSeries}
                              columns={["distance"]}
                          />
                          <Baseline
                              axis="distanceAxis"
                              value={0}
                              label="sensor"
                          />
                          <Baseline
                              axis="distanceAxis"
                              value={-topOfTank}
                              label="top of tank"
                          />
                          <Baseline
                              axis="distanceAxis"
                              value={-alarmDistance}
                              label="alarm"
                          />
                          <Baseline
                              axis="distanceAxis"
                              value={-alertDistance}
                              label="alert"
                          />
                          <Baseline
                              axis="distanceAxis"
                              value={-normalHigh}
                              label="normal high"
                          />
                          <Baseline
                              axis="distanceAxis"
                              value={-normalLow}
                              label="normal low"
                          />
                          <Baseline
                              axis="distanceAxis"
                              value={-bottomOfTank}
                              label="bottom of tank"
                          />
                          <EventMarker>
                            type="flag"
                            axis="levelAxis"
                            event={this.state.trackerEvent}
                            column="level"
                            info="test info"
                            infowidth={100}
                            markerRadius={2}
                            markerStyle={{fill: "black"}}
                          </EventMarker>
                        </Charts>
                        <YAxis
                            id="distanceAxis"
                            label="distance from sensor (cm)"
                            min={-bottomOfTank}
                            //                            max={this.state.timeSeries.max("level")}/>
                            max={10}/>
                      </ChartRow>
                    </ChartContainer>
                  </Resizable>
                  : <div>
                    No data
                  </div>
            }
          </div>
        </div>
    );
  }
}

export default App;
