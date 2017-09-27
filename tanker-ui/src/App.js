import React, {Component} from 'react';
import './App.css';
import tanker from './services/TankerService';
import {TimeSeries, TimeRange} from 'pondjs';
import {
  Baseline,
  Charts,
  ChartContainer,
  ChartRow,
  EventMarker,
  YAxis,
  LineChart,
  Resizable,
  ScatterChart,
  ValueList,
  styler
} from "react-timeseries-charts";

// Define tank levels in cm below ground level

//const groundLevel = 0;
const topOfTank = 62;
const alarmLevel = 90;
const alertLevel = 110;
const normalHigh = 125;
const normalLow = 150;
const bottomOfTank = 202;

const topOfGraph = 55;
const bottomOfGraph = 160;

const galPerCm = 8.2;
const msPerDay = 86400000;
const SEPTIC_PUMP = "SEPTIC-PUMP";
const SANDFILTER_PUMP = "SANDFILTER-PUMP";

class App extends Component {

  constructor(props) {
    super(props);
    let now = new Date();
    this.state = {
      time: now.getTime(),
    };
  }

  componentDidMount() {

    let d = new Date();
    let now = d.getTime();
    let yesterday = now - msPerDay;
    let lastWeek = now - 7 * msPerDay;

    let loadDataTimeRange = new TimeRange(lastWeek, now);
    let displayTimeRange = new TimeRange(yesterday, now);
    this.loadData(loadDataTimeRange);
    this.loadPumpStateData(loadDataTimeRange, SEPTIC_PUMP);
    this.loadPumpStateData(loadDataTimeRange, SANDFILTER_PUMP);
    this.setDisplayTimeRange(displayTimeRange);
  }

  loadData = (timeRange) => {
    let data = tanker.getLevels(
      timeRange.begin().getTime(),
      timeRange.end().getTime()
    );
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
      const levelTimeSeries = new TimeSeries(graphData);
      this.setState({levelTimeSeries: levelTimeSeries});
      this.calculateCapacities(lastDistance);
    });
  };

  calculateCapacities = (lastDistance) => {
    let alarmCapacity = 0;
    if (Math.abs(lastDistance) > alarmLevel) {
      alarmCapacity = (Math.abs(lastDistance) - alarmLevel) * galPerCm;
    }
    let alertCapacity = 0;
    if (Math.abs(lastDistance) > alertLevel) {
      alertCapacity = (Math.abs(lastDistance) - alertLevel) * galPerCm;
    }
    this.setState({
      alarmCapacity: Math.round(alarmCapacity),
      alertCapacity: Math.round(alertCapacity),
    });
  };

  loadPumpStateData = (timeRange, pumpName) => {
    let data = tanker.getPumpState(
      timeRange.begin().getTime(),
      timeRange.end().getTime(),
      pumpName
    );
    if (!data) {
      return;  // TODO: what is the right thing here?
    }
    data.then((pumpStates) => {
      let stateArr = Array.from(pumpStates.Items);
      let graphData = {
        name: pumpName,
        columns: ["time", "pumpState"],
        points: []
      };
      stateArr.forEach((p) => {
        let point = [p.timestamp, p.pumpState];
        graphData.points.push(point);
      });
      let ts = new TimeSeries(graphData);
      switch (pumpName) {
        case SEPTIC_PUMP:
          this.setState({septicPumpStateTimeSeries: ts});
          break;
        case SANDFILTER_PUMP:
          this.setState({sandFilterPumpStateTimeSeries: ts});
          break;
        default:
          console.log("Invalid pump name " + pumpName);
      }
    });
  };

  setDisplayTimeRange = (timeRange) => {

    this.setState({
      timeRange: timeRange
    });
  };

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
    if (t && this.state.levelTimeSeries) {
      const event = this.state.levelTimeSeries.atTime(t);
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
      this.calculateCapacities(eventLevel);
    } else {
      this.setState({tracker: null, trackerValue: null, trackerEvent: null})
    }
  };

  handleTimeRangeChanged = (newTimerange) => {
    this.setDisplayTimeRange(newTimerange);
  };

  render() {
    const styles = styler([
      {key: "pumpState", color: "#46baa8"}
    ]);

    return (
      <div className="App">
        <div className="App-intro">
          <p>
            {this.state.timeRange
              ? this.state.timeRange.humanize() : " waiting... "}
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
                  enablePanZoom={true}
                  minDuration={60000}
                  maxTime={new Date()}
                  timeRange={this.state.timeRange}
                  onTrackerChanged={this.handleTrackerChanged}
                  onTimeRangeChanged={this.handleTimeRangeChanged}
                >
                  <ChartRow height="350">
                    <YAxis
                      id="distanceAxis"
                      label="distance below ground (cm)"
                      max={-topOfGraph}
                      min={-bottomOfGraph}
                    />
                    <Charts>
                      {this.state.levelTimeSeries ?
                        (<LineChart
                          axis="distanceAxis"
                          series={this.state.levelTimeSeries}
                          columns={["distance"]}
                        />) : (<ValueList values={[]}></ValueList>)}
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
                        info={this.state.trackerValue ? this.state.trackerValue.toString() : ""}
                        infoStyle={{
                          fill: this.state.trackerColor,
                          opacity: 0.5,
                          stroke: "#000",
                          strokeWidth: 1,
                          pointerEvents: "none"
                        }}
                        markerRadius={4}
                        // markerStyle={{fill: "black"}}
                      />
                    </Charts>
                    <YAxis
                      id="distanceAxis"
                      label="distance below ground (cm)"
                      max={-topOfGraph}
                      min={-bottomOfGraph}
                    />
                  </ChartRow>
                  <ChartRow height="20">
                    <YAxis
                      id="pumpStateAxis"
                      max={1}
                      min={1}
                    />

                    <Charts>
                      {this.state.septicPumpStateTimeSeries
                        ? (
                          <ScatterChart
                            axis="pumpStateAxis"
                            series={this.state.septicPumpStateTimeSeries}
                            columns={["pumpState"]}
                          />) : (<ValueList values={[]}/>)}
                    </Charts>
                  </ChartRow>
                  <ChartRow height="20">
                    <YAxis
                      id="pumpStateAxis"
                      max={1}
                      min={1}
                    />

                    <Charts>
                      {this.state.sandFilterPumpStateTimeSeries
                        ? (
                          <ScatterChart
                            axis="pumpStateAxis"
                            series={this.state.sandFilterPumpStateTimeSeries}
                            columns={["pumpState"]}
                            style={styles}
                          />) : (<ValueList values={[]}/>)}
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
