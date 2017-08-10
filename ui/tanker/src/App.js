import React, {Component} from 'react';
import './App.css';
import tanker from './services/TankerService';
import {TimeSeries} from 'pondjs';
import {
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
    let yesterday = now - 1 * msPerDay;

    let data = tanker.getLevels(yesterday, now);
    data.then((levels) => {
      console.log(levels);
      let levelsArr = Array.from(levels.Items);
      let graphData = {
        name: "tanker",
        columns: ["time", "level"],
        points: []
      };
      console.log(levelsArr);
      levelsArr.forEach((p) => {
        let point = [p.timestamp, p.level];
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
      const eventLevel = event.get("level");
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
              {this.state.tracker ? new Date(this.state.tracker).toString() : " "}
              {this.state.tracker ? this.state.trackerValue : " "}
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
                      <ChartRow height="150">
                        <YAxis
                            id="levelAxis"
                            min={0.0}
                            max={this.state.timeSeries.max("level")}/>
                        <Charts>
                          <LineChart
                              axis="levelAxis"
                              series={this.state.timeSeries}
                              columns={["level"]}
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
