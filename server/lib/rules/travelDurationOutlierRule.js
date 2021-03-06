import bodybuilder from 'bodybuilder';
import _ from 'lodash';

import { Rule } from '../rule';

export class TravelDurationOutlierRule extends Rule {
  constructor(params) {
    super(params);
    this.params.threshold = this.params.threshold || 600;
    this.params.level = 'WARNING';

    let apparatus = bodybuilder()
      .filter('range', 'apparatus.extended_data.travel_duration', { gte: this.params.threshold})
      .build();
    apparatus.path = 'apparatus';

    this.query = bodybuilder()
      .filter('term', 'description.suppressed', false)
      .filter('nested', apparatus)
      .size(1000);
  }

  analyze() {
    let analysis = [];
    this.results.hits.hits.forEach(hit => {
      let units = [];
      let incidentNumber = _.get(hit, '_source.description.incident_number');
      hit._source.apparatus.forEach(u => {
        let travel_duration = _.get(u, 'extended_data.travel_duration');
        if(travel_duration > this.params.threshold) units.push(`${u.unit_id}:<strong>${(travel_duration / 60).toFixed(2)} m</strong>`);
      });

      if (units.length >= 1) {
        analysis.push({
          rule: this.constructor.name,
          level: this.params.level,
          description: `Unit travel > ${(this.params.threshold / 60).toFixed(0)} min`,
          details: `Incident: <a target="_blank" href="https://statengine.io/incidents/${incidentNumber}">${incidentNumber}</a> <br> Units: ${units.join(',')}`,
          default_visibility: true
        });
      }
    });

    return analysis;
  }
}

export default { TravelDurationOutlierRule };
