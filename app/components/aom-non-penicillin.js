import Ember from 'ember';

export default Ember.Component.extend({
  cefdinir_dose: 0,
  cefuroxime_dose: 0,
  cefpodoxime_dose: 0,
  duration: null,
  form: null,
  unit: Ember.computed('form', function() {
     if (this.form === 'liquid') {
       return 'mL';
     }
     else {
       return 'mg';
     }
  }),
  init() {
    this._super(...arguments);
    this.calculate_dose();
    console.log('unit: ', this.unit);
  },
  calculate_dose() {
    var dose = 0;
    // Cefdinir calculation
    if (this.fc.patient.weight.unit === 'kg') {
      dose = (this.fc.patient.weight.value * 14)/2;
      if (dose > 300) {
        this.set('cefdinir_dose', 300);
      }
      else {
        this.set('cefdinir_dose', dose);
      }
    }

    // Cefuroxime calculation
    if (this.fc.patient.weight.unit === 'kg') {
      dose = (this.fc.patient.weight.value * 30)/2;
      if (dose > 500) {
        this.set('cefuroxime_dose', 500);
      }
      else {
        this.set('cefuroxime_dose', dose);
      }
    }

    // Cefpodoxime calculation
    if (this.fc.patient.weight.unit === 'kg') {
      dose = (this.fc.patient.weight.value * 10)/2;
      if (dose > 200) {
        this.set('cefpodoxime_dose', 200);
      }
      else {
        this.set('cefpodoxime_dose', dose);
      }
    }

    // duration
    if (this.fc.patient.age_value < 2){
      this.set('duration', '10 days');
    } else if (this.fc.patient.age_value >= 2 && this.fc.patient.age_value <= 5){
      this.set('duration', '7 days');
    } else {
      this.set('duration', '5 - 7 days');
    }
  },
});
