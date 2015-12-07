/* global FHIR */
import Ember from 'ember';
import moment from 'moment';
import ENV from '../config/environment';

export default Ember.Service.extend({
  patient: {
    formatted_name: null,
    gender: null,
    birthDate: null,
    formatted_address: null,
    age_value: 0,
    age_unit: 'years',
    temp: {},
    weight: {},
    bloodpressure: {
      diastolic: {},
      systolic: {}
    },
    medications: [],
    allergies: [],
    hasPenicillinAllergy: null,
  },
  patientContext: null,
  fhirclient: null,
  fhirPatient: null,
  isAuthenticated: false,
  isLoading: true,
  fhirFailed: false,
  isPediatric: false,
  birthDateChanged: Ember.observer('patient.birthDate', function() {
    var retval = 0;
    if (!Ember.isNone(this.patient.birthDate)) {
      var bday = moment(this.patient.birthDate, ENV.APP.date_format);
      retval = moment().diff(bday, 'years');
      if (retval < 19) {
        this.set('isPediatric', true);
      }
      if (retval <= 2) {
        this.set('patient.age_value', moment().diff(bday, 'months'));
        this.set('patient.age_unit', 'months');
      }
      else {
        this.set('patient.age_value', retval);
        this.set('patient.age_unit', 'years');
      }
    }
  }),

  init() {
    // this not available in callbacks
    var self = this;
    this._super(...arguments);

    // wait up to 10 seconds for everything to work. If fails, use fake patient data
    var timeout = setTimeout(function() {
      self.set('fhirFailed', true);
      self.set('isLoading', false);
      self.loadPatient('demo');
    }, 2000);

    // this line prevents the addition of a timestamp to the fhir-client.js file
    Ember.$.ajaxSetup({cache: true});
    // calling this creates the global FHIR object
    Ember.$.getScript("https://sandbox.hspconsortium.org/dstu2/fhir-client/fhir-client.js")
    //Ember.$.getScript("/js/fhir-client.js")
    .done(function() {
      FHIR.oauth2.ready(function (fhirclient) {
        self.set('isAuthenticated', true);
        self.set('fhirclient', fhirclient);
        if(!Ember.isNone(fhirclient)) {
          console.log("fhirclient : ", fhirclient);
          if(!Ember.isNone(fhirclient.patient)) {
            console.log("fhirclient.patient : ", fhirclient.patient);
            self.set('patientContext', fhirclient.patient);
            Ember.$.when(self.patientContext.read())
            .done(function(p){
              console.log("Patient: ", p);
              self.set('fhirPatient', p);
              var name = p.name[0];
              self.patient.formatted_name = name.given.join(" ") + " " + name.family;
              if(!Ember.isNone(p.address)) {
                self.patient.formatted_address = p.address[0].line[0] + ', ' + p.address[0].city + ', ' + p.address[0].state;
              }
              self.set('patient.birthDate', p.birthDate);
              self.set('patient.gender', p.gender);
              self.readWeight();
              self.readTemp();
              self.readBP();
              self.readMedications();
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
    var self = this;
    self.getObservation('3141-9', function(r){
      self.patient.weight = r;
    });
  },
  readTemp: function() {
    var self = this;
    self.getObservation('8310-5', function(r){
      self.patient.temp = r;
    });
  },
  readBP: function() {
    var self = this;
    self.patient.bloodpressure = {};
    self.getObservation('8462-4', function(r){
      self.patient.bloodpressure.diastolic = r;
    });
    self.getObservation('8480-6', function(r){
      self.patient.bloodpressure.systolic = r;
    });
  },
  getObservation: function(code, callback, count = 1) {
    var ret = {value: 'No Observation'};

    Ember.$.when(this.patientContext.api.search({
      'type': "Observation",
      'query': {
        'code': code,
        '_sort:desc':'date'},
      'count': count}))
      .done(function(observations) {
        console.log('observations: ', observations);
        if (!Ember.isNone(observations.data.entry)) {
          observations.data.entry.forEach(function(obs) {
            if (obs.resource.hasOwnProperty('effectiveDateTime') &&
                obs.resource.hasOwnProperty('valueQuantity') &&
                obs.resource.valueQuantity.hasOwnProperty('value') &&
                obs.resource.valueQuantity.hasOwnProperty('unit')) {
              ret.value = obs.resource.valueQuantity.value;
              ret.date = obs.resource.effectiveDateTime;
              ret.unit = obs.resource.valueQuantity.unit;
            }
            else {
              console.log("fhir-client - expected properties missing for code ", code);
            }
          });
        }
        if (typeof callback === 'function') {
          callback(ret);
        }
    });
  },
  readMedications: function() {
    var self = this;
    self.getMedications('', function(r){
      self.set('patient.medications', r);
      console.log("161: ", self.patient.medications);
    });
  },
  addMedication: function(input) {
    var m = {}
    m.display = input.display;
    m.code = input.code;
    m.dosageInstruction = input.dosageInstruction;
    m.date = input.date;
    m.duration_value = input.duration_value;
    m.duration_unit = input.duration_unit;
    m.refills = input.refills;
    this.patient.medications.unshiftObject(m);
  },
  getMedications: function(code, callback, count = 5) {
    var ret = [];
    Ember.$.when(this.patientContext.api.search({
      'type': "MedicationOrder",
      // 'query': {
      //   'code': code,
      //   '_sort:desc':'date'},
      'count': count}))
      .done(function(medications) {
        console.log('medications: ', medications);
        if (!Ember.isNone(medications.data.entry)) {
          medications.data.entry.forEach(function(med) {
            if (med.resource.hasOwnProperty('medicationCodeableConcept')) {
              var m = med.resource;
              var r = {};
              r.display = m.medicationCodeableConcept.coding[0].display;
              r.code = m.medicationCodeableConcept.coding[0].code;
              r.dosageInstruction = m.dosageInstruction[0].text;
              r.date = m.dosageInstruction[0].timing.repeat.boundsPeriod.start;
              r.duration_value = m.dispenseRequest.expectedSupplyDuration.value;
              r.duration_unit = m.dispenseRequest.expectedSupplyDuration.unit;
              r.refills = m.dispenseRequest.numberOfRepeatsAllowed;
              ret.push(r);
            }
            else {
              console.log("fhir-client - expected properties missing for medication ", med);
            }
          });
        }
        if (typeof callback === 'function') {
          callback(ret);
        }
    });
  },
  getConditions: function() {
    var self = this;
    console.log("this.patientContext : ", self.patientContext);
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
      var date = moment().format(ENV.APP.date_format);
      this.set('patient.formatted_name', 'Kacey Jones');
      this.set('patient.formatted_address', '123 Place Lane, Salt Lake City, UT');
      this.set('patient.gender', 'male');
      this.set('patient.birthDate', '2008/01/01');
      this.set('patient.weight', {
        value: 18,
        date: date,
        unit: 'kg'
      });
      this.set('patient.temp', {
        value: 40,
        date: date,
        unit: 'Cel'
      });
      this.set('patient.bloodpressure', {
        systolic : {
          value: 100,
          date: date,
          unit: 'mmHg'
        },
        diastolic : {
          value: 60,
          date: date,
          unit: 'mmHg'
        }
      });
      this.set('patient.hasPenicillinAllergy', true);
    }
  }
});
