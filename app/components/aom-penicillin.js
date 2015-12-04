import Ember from 'ember';

export default Ember.Component.extend({
  min_dose: 0,
  max_dose: 0,
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
    if (this.fc.patient.weight.unit === 'kg') {
      var min_dose = (this.fc.patient.weight.value * 80)/2;
      if (min_dose > 2000) {
        this.set('min_dose', 2000);
        this.set('max_dose', 2000);
      }
      else {
        this.set('min_dose', min_dose);
        this.set('max_dose', (this.fc.patient.weight.value * 90)/2);
      }
    }
    if (this.fc.patient.age_value < 2){
      this.set('duration', '10 days');
    } else if (this.fc.patient.age_value >= 2 && this.fc.patient.age_value <= 5){
      this.set('duration', '7 days');
    } else {
      this.set('duration', '5 - 7 days');
    }
  },
});
