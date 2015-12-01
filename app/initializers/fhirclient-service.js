export function initialize(application) {
  application.inject('route', 'fc', 'service:fhir-client');
  application.inject('controller', 'fc', 'service:fhir-client');
  application.inject('component', 'fc', 'service:fhir-client');
}

export default {
  name: 'fhirclient-service',
  initialize: initialize
};
