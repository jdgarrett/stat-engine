'use strict';

let _;
let PlotlyBasic;

export default class IncidentUnitTravelDurationGraphComponent {
  constructor($window) {
    'ngInject';

    this.$window = $window;
    this.id = 'incident-unit-travel-duration-graph';
  }

  async loadModules() {
    PlotlyBasic = await import(/* webpackChunkName: "plotly-basic" */ 'plotly.js/dist/plotly-basic.js');
    _ = await import(/* webpackChunkName: "lodash" */ 'lodash');
  }

  async $onInit() {
    await this.loadModules();

    const units = [];

    const expectedTrace = {
      y: [],
      x: [],
      orientation: 'h',
      name: 'Expected',
      type: 'bar',
      marker: {
        color: '#3eceb0',
        line: {
          color: '#25a88e',
        }
      },
    };

    const actualTrace = {
      y: [],
      x: [],
      orientation: 'h',
      name: 'Actual',
      type: 'bar',
      marker: {
        color: '#44a0c1',
        line: {
          color: '#005364',
        }
      },
    };

    _.forEach(this.incident.apparatus, u => {
      let unitId = u.unit_id;
      units.push(unitId);

      const actualDuration = _.get(u, 'extended_data.travel_duration');
      if(actualDuration) {
        actualTrace.y.push(unitId);
        actualTrace.x.push(actualDuration);
      }

      const expectedDuration = _.get(this.travelMatrix[unitId], 'duration');
      if(expectedDuration) {
        expectedTrace.y.push(unitId);
        expectedTrace.x.push(expectedDuration);
      }
    });

    let shapes = [];
    let annotations = [];

    const data = [];

    if(this.travelMatrix) data.push(expectedTrace);
    data.push(actualTrace);

    var layout = {
      height: 320,
      shapes,
      annotations,
      margin: {
        l: 52,
        r: 1,
        b: 30,
        t: 0,
      },
      yaxis: {
        zerolinecolor: '#d7dee3',
        linecolor: '#d7dee3',
        type: 'category',
      },
      xaxis: {
        // zerolinecolor: '#d7dee3',
        title: 'Seconds',
        linecolor: '#d7dee3',
      },
      legend: {
        orientation: 'h',
        xanchor: 'center',
        yanchor: 'bottom',
        x: 0.5,
        y: 1.05,
      },
    };
    PlotlyBasic.newPlot(this.id, data, layout, {
      displayModeBar: false,
      responsive: true,
    });
  }
}
