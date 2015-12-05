import Ember from 'ember';

export default Ember.Component.extend({
  penicillin_dose: 0,
  penicillin_unit: null,
  penicillin_duration: null,
  benzathine_dose: 0,
  benzathine_unit: null,
  benzathine_duration: null,
  suspension_dose: 0,
  form: null,
  unit: 'mg',
  needsLiquid: Ember.computed('form', function() {
     if (this.form === 'liquid') {
       return true;
     }
     else {
       return false;
     }
  }),
  weightChanged: Ember.observer('this.fc.patient.weight.value', function() {
    this.calculate_dose();
    console.log('23 called recalculate dose')
  }),
  init() {
    this._super(...arguments);
    this.calculate_dose();
  },
  calculate_dose() {
    if (this.fc.patient.weight.unit === 'kg') {
      if (this.fc.patient.weight.value < 27) {
        this.set('penicillin_dose', 250);
        this.set('penicillin_unit', 'mg');
        this.set('penicillin_duration', '10 days');
        this.set('benzathine_dose', '600,000');
        this.set('benzathine_unit', 'IU IM');
        this.set('benzathine_duration', 'x 1 dose');
      }
      else {
        this.set('penicillin_dose', 500);
        this.set('penicillin_unit', 'mg');
        this.set('penicillin_duration', '10 days');
        this.set('benzathine_dose', '1,200,000');
        this.set('benzathine_unit', 'IU IM');
        this.set('benzathine_duration', 'x 1 dose');
      }
      var dose = this.fc.patient.weight.value * 50
      console.log('this.fc.patient.weight.value :', this.fc.patient.weight.value);
      console.log('dose :', dose);
      if (dose > 1000) {
        this.set('suspension_dose', 1000);
      }
      else {
        this.set('suspension_dose', dose);
      }
    }
  },
});
