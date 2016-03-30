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
    height: {},
    bloodpressure: {
      diastolic: {},
      systolic: {}
    },
    medications: [],
    allergies: [],
    conditions: [],
    labs: [],
    encounters: [],
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
    }, 5000);

    // this line prevents the addition of a timestamp to the fhir-client.js file
    Ember.$.ajaxSetup({cache: true});
    // calling this creates the global FHIR object
    // it appears that hspc is no longer hosting this file
    //   Ember.$.getScript("https://sandbox.hspconsortium.org/dstu2/fhir-client/fhir-client.js")
    Ember.$.getScript("/js/fhir-client.js")
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
              self.readHeight();
              self.readWeight();
              self.readTemp();
              self.readBP();
              self.readMedications();
              self.readAllergies();
              self.readConditions();
              self.readLabs();
              self.readEncounters();
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
  readHeight: function() {
    var self = this;
    self.getObservation('8302-2', function(r){
      self.patient.height = r;
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
  readLabs: function() {
    var self = this;
    self.getObservations(function(r){
      self.set('patient.labs', r);
      console.log('labs: ', self.get('patient.labs'));
      console.log('labs count', self.get('patient.labs').length);
    });
  },
  getObservations: function(callback, count = 20) {
    var ret = [];
    Ember.$.when(this.patientContext.api.search({
      'type': "Observation",
      'query': {
        '_sort:desc':'date'
      },
      'count': count}))
      .done(function(observations) {
        console.log('170 observations: ', observations);
        if (!Ember.isNone(observations.data.entry)) {
          observations.data.entry.forEach(function(obs) {
            var o = obs.resource;
            // since the search doesn't seem to filter out values, filter client side
            if(ENV.APP.lab_exclusions.indexOf(o.code.coding[0].code) < 0) {
              if (o.hasOwnProperty('effectiveDateTime')) {
                var r = {};
                r.date = o.effectiveDateTime;
                r.code = o.code.coding[0].code;
                r.display = o.code.coding[0].display;
                if (o.hasOwnProperty('valueQuantity') &&
                    o.valueQuantity.hasOwnProperty('value') &&
                    o.valueQuantity.hasOwnProperty('unit')) {
                  r.value = o.valueQuantity.value;
                  r.unit = o.valueQuantity.unit;
                }
                else if (o.hasOwnProperty('valueString')){
                  r.value = o.valueString;
                }
                ret.push(r);
              }
              else {
                console.log("fhir-client - expected properties missing for observation ", obs);
              }
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
    });
  },
  readAllergies: function() {
    var self = this;
    self.getAllergies('', function(r){
      self.set('patient.allergies', r);
    });
  },
  readConditions: function() {
    var self = this;
    self.getConditions('', function(r){
      self.set('patient.conditions', r);
    });
  },
  readEncounters: function() {
    var self = this;
    self.getEncounters(function(r){
      self.set('patient.encounters', r);
    });
  },
  addMedication: function(input) {
    var m = {};
    m.display = input.display;
    m.code = input.code;
    m.dosageInstruction = input.dosageInstruction;
    m.date = input.date;
    m.duration_value = input.duration_value;
    m.duration_unit = input.duration_unit;
    m.refills = input.refills;
    this.patient.medications.unshiftObject(m);
  },
  getMedications: function(code, callback, count = 20) {
    var ret = [];
    var search = {};
    if (!Ember.isEmpty(code)) {
      search = {
        'type': "MedicationOrder",
        'query': {
          'code': code,
           '_sort:desc':'_id'},
        // this field isn't populated at least for some patients in HSPC DSTU2 Sandbox
        // however, datewritten should be the way to sort medications (rather than id)
        //'_sort:desc':'datewritten',
        'count': count
      };
    }
    else {
      search = {
        'type': "MedicationOrder",
        'query': {
           '_sort:desc':'_id'},
        // this field isn't populated at least for some patients in HSPC DSTU2 Sandbox
        // however, datewritten should be the way to sort medications (rather than id)
        //'_sort:desc':'datewritten',
        'count': count
      };
    }
    Ember.$.when(this.patientContext.api.search(search))
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
              if (!Ember.isNone(m.dosageInstruction[0].timing)) {
                r.date = m.dosageInstruction[0].timing.repeat.boundsPeriod.start;
              }
              if (!Ember.isNone(m.dispenseRequest)) {
                r.duration_value = m.dispenseRequest.expectedSupplyDuration.value;
                r.duration_unit = m.dispenseRequest.expectedSupplyDuration.unit;
                r.refills = m.dispenseRequest.numberOfRepeatsAllowed;
              }
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
  getConditions: function(code, callback, count = 20) {
    var ret = [];
    Ember.$.when(this.patientContext.api.search({
      'type': "Condition",
      'query': {
      //   'code': code,
         '_sort:desc':'onset'},
      'count': count}))
      .done(function(conditions) {
        console.log('conditions: ', conditions);
        if (!Ember.isNone(conditions.data.entry)) {
          conditions.data.entry.forEach(function(condition) {
            var c = condition.resource;
            var r = {};
            r.code = c.code.coding[0].code;
            r.text = c.code.text;
            r.date = c.onsetDateTime;
            ret.push(r);
          });
        }
        if (typeof callback === 'function') {
          callback(ret);
        }
    });
  },
  getAllergies: function(code, callback, count = 20) {
    var ret = [];
    Ember.$.when(this.patientContext.api.search({
      'type': "AllergyIntolerance",
      'query': {
      //   'code': code,
        '_sort:desc':'date'},
      'count': count}))
      .done(function(allergies) {
        console.log('allergies: ', allergies);
        if (!Ember.isNone(allergies.data.entry)) {
          allergies.data.entry.forEach(function(allergy) {
            var a = allergy.resource;
            var r = {};
            r.severity = a.reaction[0].severity;
            r.manifestation = a.reaction[0].manifestation[0].text;
            r.category = a.category;
            r.date = a.recordedDate;
            r.substance = a.substance.text;
            r.text = a.text.div;
            ret.push(r);
          });
        }
        if (typeof callback === 'function') {
          callback(ret);
        }
    });
  },
  getEncounters: function(callback, count = 20) {
    var ret = [];
    Ember.$.when(this.patientContext.api.search({
      'type': "Encounter",
      'query': {
        '_sort:desc':'date'},
      'count': count}))
      .done(function(encounters) {
        console.log('encounters: ', encounters);
        if (!Ember.isNone(encounters.data.entry)) {
          encounters.data.entry.forEach(function(encounter) {
            var e = encounter.resource;
            var r = {};
            r.class = e.class;
            r.text = e.text.div.replace('<div xmlns="http://www.w3.org/1999/xhtml">', '')
              .replace('</div>', '')
              .replace(e.period.start + ': ', '');
            r.start = e.period.start;
            r.end = e.period.end;
            ret.push(r);
          });
        }
        if (typeof callback === 'function') {
          callback(ret);
        }
    });
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
      this.set('patient.height', {
        value: 128,
        date: date,
        unit: 'cm'
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
      this.set('patient.conditions', [{
        code: '426656000',
        text: 'Severe persistent asthma',
        date: '2010/01/01',
      }]);
      this.set('patient.allergies', [{
        severity: 'severe',
        manifestation: 'anaphylaxis',
        category: 'medication',
        date: '2010/01/01',
        substance: 'Penicillin',
        text: 'Severe Penicillin Allergy',
      }]);
      this.set('patient.hasPenicillinAllergy', true);
    }
  }
});
