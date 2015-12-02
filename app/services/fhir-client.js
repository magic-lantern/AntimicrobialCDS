/* global FHIR */
import Ember from 'ember';
var myglobal;
export default Ember.Service.extend({
  patient: {
    formatted_name: null,
    gender: null,
    birthDate: null,
    formatted_address: null,
    temp: {},
    weight: {},
    bloodpressure: {
      diastolic: {},
      systolic: {}
    }
  },
  patientContext: null,
  fhirclient: null,
  isAuthenticated: false,
  isLoading: true,
  fhirFailed: false,

  init() {
    // this not available in callbacks
    var self = this;
    this._super(...arguments);

    // wait up to 10 seconds for everything to work. If fails, use fake patient data
    var timeout = setTimeout(function() {
      self.set('fhirFailed', true);
      self.set('isLoading', false);
      self.loadPatient('demo');
    }, 5000);

    // this line prevents the addition of a timestamp to the fhir-client.js file
    Ember.$.ajaxSetup({cache: true});
    // calling this creates the global FHIR object
    Ember.$.getScript("https://sandbox.hspconsortium.org/dstu2/fhir-client/fhir-client.js")
    .done(function() {
      FHIR.oauth2.ready(function (fhirclient) {
        self.set('isAuthenticated', true);
        self.set('fhirclient', fhirclient);
        if(!Ember.isEmpty(fhirclient)) {
          console.log("fhirclient : ", fhirclient);
          if(!Ember.isEmpty(fhirclient.context)) {
            console.log("fhirclient.context : ", fhirclient.context);
            console.log("fhirclient.context.patient : ", fhirclient.context.patient);
            self.set('patientContext', fhirclient.context.patient);
            self.patientContext.read()
            .then(function(p){
              self.set('patient', p);
              console.log("Patient: ", p);
              var name = p.name[0];
              self.patient.formatted_name = name.given.join(" ") + " " + name.family;
              self.patient.formatted_address = p.address[0].line[0] + ', ' + p.address[0].city + ', ' + p.address[0].state;
              self.readWeight();
              self.readTemp();
              self.readBP();
              //self.getMedications();
              //self.getConditions();
              clearTimeout(timeout);
              self.set('isLoading', false);
            });
          }
        }
      });
      console.log("service - FHIR script loaded successfully.");
    })
    .fail(function() {
      console.log("service - FHIR script FAILED to load.");
    });
  },
  readWeight: function() {
    this.patient.weight = this.getObservation('3141-9');
  },
  readTemp: function() {
    this.patient.temp = this.getObservation('8310-5');
  },
  readBP: function() {
    this.patient.bloodpressure = {diastolic: '', systolic: ''};
    this.patient.bloodpressure.diastolic = this.getObservation('8462-4');
    this.patient.bloodpressure.systolic = this.getObservation('8480-6');
  },
  getObservation: function(code, count = 1) {
    var self = this;
    var ret = {value: 'No Observation'};
    this.patientContext.Observation
      .where
      .code(code)
      ._count(count)  // how many results to return - default is 10
      ._sortDesc("date")  // start with newest result
      .search()
      .then(function(observations) {
        console.log("All Observations : ", observations);
        observations.forEach(function(obs) {
          console.log("Observation : ", obs);
          if (obs.hasOwnProperty("effectiveDateTime") && obs.hasOwnProperty("valueQuantity") &&
              obs.valueQuantity.hasOwnProperty("value") && obs.valueQuantity.hasOwnProperty("unit")) {
            ret.value = obs.valueQuantity.value;
            ret.date = obs.effectiveDateTime;
            ret.unit = obs.valueQuantity.unit;
          }
          else {
            console.log("fhir-client - expected properties missing for code ", code);
          }
          return ret;
        });
    });
    return ret;
  },
  getMedications: function() {
    var self = this;
    // not currently working
    /*
    console.log("this.patientContext : ", self.patientContext);

    setTimeout(function() {
      console.log("this.patientContext : ", self.patientContext);
      self.patientContext.Medication
        .where
        ._sortDesc("date")  // start with newest result
        .search()
        .then(function(meds){
          console.log("Medications : ", meds);
      });
    }, 3000);
    */
  },
  getConditions: function() {
    var self = this;
    console.log("this.patientContext : ", self.patientContext);
    console.log("myglobal : ", myglobal);
    setTimeout(function() {
      console.log("this.patientContext : ", self.patientContext);
      self.patientContext.Condition
        .where
        .code('102594003')
        .search()
        .then(function(conds){
          console.log("Conditions: ", conds);
      });
    }, 3000);
  },
  loadPatient: function(patient) {
    if(patient === 'demo') {
      this.set('patient.formatted_name', 'Kacey Jones');
      this.patient.formatted_address = '123 Place Lane, Salt Lake City, UT';
      this.patient.gender = 'male';
      this.patient.weight = {
        value: 18,
        date: '',
        unit: 'kg'
      };
      this.patient.temp = {
        value: 40,
        date: '',
        unit: 'Cel'
      };
      this.patient.bloodpressure = {
        systolic : {
          value: 100,
          date: '',
          unit: 'mmHg'
        },
        diastolic : {
          value: 60,
          date: '',
          unit: 'mmHg'
        }
      };
    }
  }
});
