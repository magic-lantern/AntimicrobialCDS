import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Component.extend({
  dose: 0,
  duration_unit: null,
  duration_value: null,
  form: null,
  medication_callback: null,
  unit: 'mg',
  type: Ember.computed('form', function() {
     if (this.form === 'liquid') {
       return ' Suspension';
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
    if (this.fc.patient.weight.unit === 'kg') {
      var dose = (this.fc.patient.weight.value * 85)/2;
      if (dose > 2000) {
        this.set('dose', 2000);
      }
      else {
        this.set('dose', (125.0 * Math.round(dose/125.0)));
      }
    }
    if (this.fc.patient.age_value < 2){
      this.set('duration_value', '10');
      this.set('duration_unit', 'days');
    } else if (this.fc.patient.age_value >= 2 && this.fc.patient.age_value <= 5){
      this.set('duration_value', '7');
      this.set('duration_unit', 'days');
    } else {
      this.set('duration_value', '5 - 7');
      this.set('duration_unit', 'days');
    }

    // since AOM with no allergy has default medication, send back automatically.
    this.get('medication_callback')({
      display: 'Amoxicillin ' + this.get('dose') + this.get('unit'),
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
      console.log("46 - aom-penicillin step5 action. med: ", med);
      if (!Ember.isNone(med)) {
        this.get('medication_callback')({
          display: med[0].toUpperCase() + med.slice(1) + ' ' + this.get('dose') + this.get('unit'),
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
