'use strict';

/* eslint no-sync: 0 */

import angular from 'angular';
import _ from 'lodash';
import percentile from 'percentile';

export class BarGaugeComponent {
  value;
  maxLabel;
  minLabel;
  data;
  needleContainerStyle = {
    left: 0,
  };
  needleTextStyle = {
    transform: undefined,
  };
  initialized = false;

  constructor($element, $timeout) {
    'ngInject';

    this.element = $element;
    this.needleTextElement = angular.element(this.element[0].querySelector('.needle-text'));
    this.$timeout = $timeout;
  }

  $onInit() {
    this.updateGauge();

    this.initialized = true;
  }

  $onChanges() {
    if(!this.initialized) {
      return;
    }

    this.updateGauge();
  }

  updateGauge() {
    this.metricTitle = this.metricTitle || 'Count';
    this.isDuration = (this.isDuration != null) ? this.isDuration : false;
    const value = this.value || 0;

    const min = _.min(this.data);
    const max = _.max(this.data);

    this.totalPercentiles = [20, 40, 60, 80, 90].map(percent => percentile(percent, this.data));

    const ranges = _.reduce(this.totalPercentiles, (acc, p, i) => {
      let res = [];
      if(min === max) {
        res = [min, max];
      } else if(i === 0) {
        res = [min, p];
      } else if(i === this.totalPercentiles.length - 1) {
        res = [this.totalPercentiles[i - 1] + 1, max];
      } else {
        res = [this.totalPercentiles[i - 1] + 1, p];
      }
      acc.push(res);
      return acc;
    }, []);

    this.lowValue = ranges[0][1];
    this.midRange = [ranges[1][0], ranges[3][1]];
    this.highValue = ranges[4][0];

    // Figure out which category this value falls in.
    const quartile = _.findIndex(ranges, range => value >= range[0] && value <= range[1]);
    this.category = quartile === 0 ? this.minLabel : quartile === 4 ? this.maxLabel : 'Typical';

    // Position the needle in the middle of the current quartile bar.
    let needleLeftPercent = quartile * 20 + 10;
    this.needleContainerStyle.left = `${needleLeftPercent}%`;

    // On render...
    this.$timeout(() => {
      // Keep the needle text within the element bounds.
      const elementBounds = this.element[0].getBoundingClientRect();
      const needleTextElementBounds = this.needleTextElement[0].getBoundingClientRect();
      const needleTextHalfWidth = needleTextElementBounds.width / 2;
      const needleContainerX = elementBounds.width * (needleLeftPercent / 100);
      const needleTextMinX = needleContainerX - needleTextHalfWidth;
      const needleTextMaxX = needleContainerX + needleTextHalfWidth;

      const offset = 0;
      if(needleTextMinX < 0) {
        this.needleTextStyle.transform = `translateX(${-needleTextMinX - offset}px)`;
      } else if(needleTextMaxX > elementBounds.width) {
        this.needleTextStyle.transform = `translateX(${-(needleTextMaxX - elementBounds.width) + offset}px)`;
      } else {
        this.needleTextStyle.transform = 'translateX(0)';
      }
    });
  }
}

export default angular.module('directives.barGauge', [])
  .component('barGauge', {
    template: require('./bar-gauge.html'),
    controller: BarGaugeComponent,
    controllerAs: 'vm',
    bindings: {
      value: '<',
      maxLabel: '@',
      minLabel: '@',
      data: '<',
      isDuration: '<'
    },
  })
  .name;
