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

const groundLevel = 0;
const topOfTank = 62;
const alarmLevel = 90;
const alertLevel = 106;
const normalHigh = 121;
const normalLow = 139;
const bottomOfGraph = 150;
const bottomOfTank = 202;

const galPerCm = 8.2;
const msPerDay = 86400000;

class App extends Component {

  constructor(props) {
    super(props);
    let now = new Date();
    this.state = {time: now.getTime()};
  }

  componentDidMount() {

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
      if (Math.abs(lastDistance) > alarmLevel) {
        alarmCapacity = (Math.abs(lastDistance) - alarmLevel) * galPerCm;
      }
      let alertCapacity = 0;
      if(Math.abs(lastDistance) > alertLevel) {
        alertCapacity = (Math.abs(lastDistance) - alertLevel) * galPerCm;
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

  calculateTrackerColor = (eventLevel) => {
    eventLevel = Math.abs(eventLevel);
    if (eventLevel > normalLow) {
      return "yellow";
    }
    if (eventLevel <= normalLow && eventLevel > alertLevel) {
      return "white";
    }
    if (eventLevel <= alertLevel && eventLevel > alarmLevel) {
      return "yellow";
    }
    if (eventLevel <= alarmLevel) {
      return "red";
    }
    return "white";
  };

  handleTrackerChanged = (t) => {
    if (t && this.state.timeSeries) {
      const event = this.state.timeSeries.atTime(t);
      const eventLevel = event.get("distance");
      let d = new Date();
      let currTime = d.getTime();

      let trackerColor = this.calculateTrackerColor(eventLevel);

      this.setState({
        tracker: event.begin().getTime(),
        trackerColor: trackerColor,
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
                            label="distance below ground (cm)"
                            max={groundLevel+10}
                            min={-bottomOfGraph}
                        />
                        <Charts>
                          <LineChart
                              axis="distanceAxis"
                              series={this.state.timeSeries}
                              columns={["distance"]}
                          />
                          <Baseline
                              axis="distanceAxis"
                              value={0}
                              label="ground level"
                          />
                          <Baseline
                              axis="distanceAxis"
                              value={-topOfTank}
                              label="top of tank"
                          />
                          <Baseline
                              axis="distanceAxis"
                              value={-alarmLevel}
                              label="alarm"
                          />
                          <Baseline
                              axis="distanceAxis"
                              value={-alertLevel}
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
                          <EventMarker
                            style={{stroke: "black"}}
                            type="flag"
                            axis="distanceAxis"
                            event={this.state.trackerEvent}
                            column="distance"
                            info={this.state.trackerValue? this.state.trackerValue.toString(): ""}
                            infoStyle = {{fill: this.state.trackerColor, opacity: 0.5, stroke: "#000", strokeWidth: 1,  pointerEvents: "none" }}
                            markerRadius={4}
                           // markerStyle={{fill: "black"}}
                          />
                        </Charts>
                        <YAxis
                            id="distanceAxis"
                            label="distance below ground (cm)"
                            max={groundLevel+10}
                            min={-bottomOfGraph}
                        />
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
