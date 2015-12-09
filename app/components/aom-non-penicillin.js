import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Component.extend({
  cefdinir_dose: 0,
  cefuroxime_dose: 0,
  cefpodoxime_dose: 0,
  duration_unit: null,
  duration_value: null,
  form: null,
  medication_callback: null,
  unit: 'mg',
  type: Ember.computed('form', function() {
     if (this.form === 'liquid') {
       return ' Suspension';
     }
     else {
       return '';
     }
  }),
  weightChanged: Ember.observer('this.fc.patient.weight.value', function() {
    this.calculate_dose();
  }),
  init() {
    this._super(...arguments);
    this.calculate_dose();
  },
  calculate_dose() {
    var dose = 0;
    // Cefdinir calculation
    if (this.fc.patient.weight.unit === 'kg') {
      dose = (this.fc.patient.weight.value * 14)/2;
      if (dose >= 300) {
        this.set('cefdinir_dose', 300);
      }
      else {
        this.set('cefdinir_dose', (150.0 * Math.round(dose/150.0)));
      }
    }

    // Cefuroxime calculation
    if (this.fc.patient.weight.unit === 'kg') {
      dose = (this.fc.patient.weight.value * 30)/2;
      if (dose >= 500) {
        this.set('cefuroxime_dose', 500);
      }
      else {
        this.set('cefuroxime_dose', (125.0 * Math.round(dose/125.0)));
      }
    }

    // Cefpodoxime calculation
    if (this.fc.patient.weight.unit === 'kg') {
      dose = (this.fc.patient.weight.value * 10)/2;
      if (dose >= 200) {
        this.set('cefpodoxime_dose', 200);
      }
      else {
        this.set('cefpodoxime_dose', (50.0 * Math.round(dose/50.0)));
      }
    }

    // duration
    if (this.fc.patient.age_value < 2){
      this.set('duration_value', '10');
    } else if (this.fc.patient.age_value >= 2 && this.fc.patient.age_value <= 5){
      this.set('duration_value', '7');
    } else {
      this.set('duration_value', '5 - 7');
    }
    this.set('duration_unit', 'days');

    this.get('medication_callback')({
      display: 'Cefdinir ' + this.get('cefdinir_dose') + this.get('unit'),
      code: 'code',
      dosageInstruction: 'b.i.d',
      date: moment().format(ENV.APP.date_format),
      duration_value: this.get('duration_value'),
      duration_unit: this.get('duration_unit'),
      refills: 1,
    });
  },
  actions: {
    step5(med){
      var display;
      if (!Ember.isNone(med)) {
        if (med === 'cefdinir') {
          display = 'Cefdinir ' + this.get('cefdinir_dose') + this.get('unit');
        }
        else if (med === 'cefuroxime') {
          display = 'Cefuroxime ' + this.get('cefuroxime_dose') + this.get('unit');
        }
        else if (med === 'cefpodoxime') {
          display = 'Cefpodoxime ' + this.get('cefuroxime_dose') + this.get('unit');
        }
        this.get('medication_callback')({
          display: display,
          code: 'code',
          dosageInstruction: 'b.i.d',
          date: moment().format(ENV.APP.date_format),
          duration_value: this.get('duration_value'),
          duration_unit: this.get('duration_unit'),
          refills: 1,
        });
      }
      else {
        this.get('medication_callback')({});
      }
    }
  }
});
