import Ember from 'ember';
import FhirClientInitializer from '../../../initializers/fhir-client';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | fhir client', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  FhirClientInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
