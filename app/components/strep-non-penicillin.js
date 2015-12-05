import Ember from 'ember';

export default Ember.Component.extend({
  cephalexin_dose: 0,
  cephalexin_duration: null,
  cephalexin_frequency: null,
  azithromycin_dose: 0,
  azithromycin_duration: null,
  azithromycin_frequency: null,
  clindamycin_dose: 0,
  clindamycin_duration: null,
  clindamycin_frequency: null,
  form: null,
  unit: 'mg',
  weightChanged: Ember.observer('this.fc.patient.weight.value', function() {
    this.calculate_dose();
    console.log('17 called recalculate dose')
  }),
  init() {
    this._super(...arguments);
    this.calculate_dose();
    console.log('unit: ', this.unit);
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
        this.set('cephalexin_dose', dose);
      }
    }
    this.set('cephalexin_duration', '10 days');
    this.set('cephalexin_frequency', 'b.i.d.');

    // Azithromycin calculation
    if (this.fc.patient.weight.unit === 'kg') {
      dose = (this.fc.patient.weight.value * 12);
      if (dose > 500) {
        this.set('azithromycin_dose', 500);
      }
      else {
        this.set('azithromycin_dose', dose);
      }
    }
    this.set('azithromycin_duration', '5 days');
    this.set('azithromycin_frequency', 'once daily');

    // Clindamycin calculation
    if (this.fc.patient.weight.unit === 'kg') {
      dose = (this.fc.patient.weight.value * 7)/3;
      if (dose > 300) {
        this.set('clindamycin_dose', 300);
      }
      else {
        this.set('clindamycin_dose', dose);
      }
    }
    this.set('clindamycin_frequency', '3 times daily');
    this.set('clindamycin_duration', '10 days');
  },
});
