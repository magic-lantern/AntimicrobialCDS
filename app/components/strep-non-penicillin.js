import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Component.extend({
  cephalexin_dose: 0,
  cephalexin_duration_value: null,
  cephalexin_frequency: null,
  azithromycin_dose: 0,
  azithromycin_duration_value: null,
  azithromycin_frequency: null,
  clindamycin_dose: 0,
  clindamycin_duration_value: null,
  clindamycin_frequency: null,
  duration_unit: 'days',
  form: null,
  unit: 'mg',
  medication_callback: null,
  weightChanged: Ember.observer('this.fc.patient.weight.value', function() {
    this.calculate_dose();
  }),
  init() {
    this._super(...arguments);
    this.calculate_dose();
  },
  calculate_dose() {
    var dose = 0;
    // Cephalexin calculation
    if (this.fc.patient.weight.unit === 'kg') {
      dose = (this.fc.patient.weight.value * 20)/2;
      if (dose > 500) {
        this.set('cephalexin_dose', 500);
      }
      else {
        this.set('cephalexin_dose', (125.0 * Math.round(dose/125.0)));
      }
    }
    this.set('cephalexin_duration_value', '10');
    this.set('cephalexin_frequency', 'b.i.d.');

    // Azithromycin calculation
    if (this.fc.patient.weight.unit === 'kg') {
      dose = (this.fc.patient.weight.value * 12);
      if (dose > 500) {
        this.set('azithromycin_dose', 500);
      }
      else {
        this.set('azithromycin_dose', (125.0 * Math.round(dose/125.0)));
      }
    }
    this.set('azithromycin_duration_value', '5');
    this.set('azithromycin_frequency', 'once daily');

    // Clindamycin calculation
    if (this.fc.patient.weight.unit === 'kg') {
      dose = (this.fc.patient.weight.value * 7);
      if ((dose * 3) > 900) {
        this.set('clindamycin_dose', 300);
      }
      else {
        this.set('clindamycin_dose', (50.0 * Math.round(dose/50.0)));
      }
    }
    this.set('clindamycin_frequency', '3 times daily');
    this.set('clindamycin_duration_value', '10');
  },
  actions: {
    step5(med){
      if (!Ember.isNone(med)) {
        var display = med[0].toUpperCase() + med.slice(1) + ' ' + this.get(med + '_dose') + this.get('unit');
        this.get('medication_callback')({
          display: display,
          code: 'code',
          dosageInstruction: this.get(med + '_frequency'),
          date: moment().format(ENV.APP.date_format),
          duration_value: this.get(med + '_duration_value'),
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
