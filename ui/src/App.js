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
      console.log(levels);
      let levelsArr = Array.from(levels.Items);
      let graphData = {
        name: "tanker",
        columns: ["time", "distance"],
        points: []
      };
      console.log(levelsArr);
      levelsArr.forEach((p) => {
        let point;
        if (p.level) {
          point = [p.timestamp, p.level];
        } else {
          point = [p.timestamp, -p.distance_cm];
        }
        graphData.points.push(point);
      });
      console.log(graphData);
      const timeSeries = new TimeSeries(graphData);
      console.log(timeSeries.count());
      const timeRange = timeSeries.timerange();
      this.setState({
        timeSeries: timeSeries,
        timeRange: timeRange
      });
    });
  }

  handleTrackerChanged = (t) => {
    if (t && this.state.timeSeries) {
      console.log(t);
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
              Tank data for {this.state.timeRange
                ? this.state.timeRange.begin().toString() : "unknown"}
              {" to "}
              {this.state.timeRange
                  ? this.state.timeRange.end().toString() : "unknown"}.
            </p>
            <p>
              {this.state.tracker ? new Date(this.state.tracker).toString()
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
                              value={34}
                              label="alarm"
                          />
                          <Baseline
                              axis="distanceAxis"
                              value={50}
                              label="alert"
                          />
                          <Baseline
                              axis="distanceAxis"
                              value={83}
                              label="normal low"
                          />
                          <Baseline
                              axis="distanceAxis"
                              value={146}
                              label="bottom"
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
                            min={-150}
                            //                            max={this.state.timeSeries.max("level")}/>
                            max={0}/>
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
