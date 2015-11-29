/* global FHIR */
import Ember from 'ember';

export default Ember.Service.extend({
  patient: null,
  patientContext: null,
  fhirclient: null,
  isAuthenticated: false,
  isLoading: true,

  init() {
    // this not available in callbacks
    var self = this;
    this._super(...arguments);
    // this line prevents the addition of a timestamp to the fhir-client.js file
    Ember.$.ajaxSetup({cache: true});
    // calling this creates the global FHIR object
    Ember.$.getScript("https://sandbox.hspconsortium.org/dstu2/fhir-client/fhir-client.js")
    .done(function() {
      FHIR.oauth2.ready(function (fhirclient) {
        self.set('isAuthenticated', true);
        self.set('fhirclient', fhirclient);
        self.set('patientContext', fhirclient.context.patient);
        self.patientContext.read()
        .then(function(p){
          self.set('patient', p);
          console.log("Patient: ", p);
          var name = p.name[0];
          self.patient.formatted_name = name.given.join(" ") + " " + name.family;
          self.patient.formatted_address = p.address[0].line[0] + ', ' + p.address[0].city;
          self.readWeight();
          self.readTemp();
          self.set('isLoading', false);
        });
      });
      console.log("service - FHIR script loaded successfully.");
    })
    .fail(function() {
      console.log("service - FHIR script FAILED to load.");
    });
  },
  readWeight: function() {
    var self = this;
    self.patient.weight = {};
    this.patientContext.Observation
      .where
      .code("3141-9")
      ._count(1)  // how many results to return - default is 10
      ._sortDesc("date")  // start with newest result
      .search()
      .then(function(observations) {
        console.log("observations : ", observations);
        observations.forEach(function(obs) {
          console.log("Observation : ", obs);
          if (obs.hasOwnProperty("effectiveDateTime") && obs.hasOwnProperty("valueQuantity") &&
              obs.valueQuantity.hasOwnProperty("value") && obs.valueQuantity.hasOwnProperty("unit")) {
            self.patient.weight.value = obs.valueQuantity.value;
            self.patient.weight.date = obs.effectiveDateTime;
            self.patient.weight.unit = obs.valueQuantity.unit;
          }
        });
    });
  },
  readTemp: function() {
    var self = this;
    self.patient.temp = {};
    this.patientContext.Observation
      .where
      .code("8310-5")
      ._count(1)  // how many results to return - default is 10
      ._sortDesc("date")  // start with newest result
      .search()
      .then(function(observations) {
        console.log("observations : ", observations);
        observations.forEach(function(obs) {
          console.log("Observation : ", obs);
          if (obs.hasOwnProperty("effectiveDateTime") && obs.hasOwnProperty("valueQuantity") &&
              obs.valueQuantity.hasOwnProperty("value") && obs.valueQuantity.hasOwnProperty("unit")) {
            self.patient.temp.value = obs.valueQuantity.value;
            self.patient.temp.date = obs.effectiveDateTime;
            self.patient.temp.unit = obs.valueQuantity.unit;
          }
        });
    });
  },
});
