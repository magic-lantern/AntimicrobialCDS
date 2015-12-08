import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Component.extend({
  penicillin_dose: 0,
  penicillin_unit: 'mg',
  penicillin_duration: '10 days',
  benzathine_dose: 0,
  benzathine_unit: 'IU IM',
  benzathine_duration_value: 'x 1',
  benzathine_duration_unit: 'dose',
  suspension_dose: 0,
  suspension_unit: 'mg',
  form: null,
  medication_callback: null,
  needsLiquid: Ember.computed('form', function() {
     if (this.form === 'liquid') {
       this.get('medication_callback')({
         display: 'Amoxicillin suspension ' + this.get('suspension_dose') + this.get('suspension_unit'),
         code: 'code',
         dosageInstruction: '1 daily',
         date: moment().format(ENV.APP.date_format),
         duration_value: '10',
         duration_unit: 'days',
         refills: 1,
       });
       return true;
     }
     else {
       return false;
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
      if (this.fc.patient.weight.value < 27) {
        this.set('penicillin_dose', 250);
        this.set('benzathine_dose', '600,000');
      }
      else {
        this.set('penicillin_dose', 500);
        this.set('benzathine_dose', '1,200,000');
      }
      var dose = this.fc.patient.weight.value * 50;
      console.log('this.fc.patient.weight.value :', this.fc.patient.weight.value);
      console.log('dose :', dose);
      if (dose > 1000) {
        this.set('suspension_dose', 1000);
      }
      else {
        this.set('suspension_dose', this.set('dose', (125.0 * Math.round(dose/125.0))));
      }
    }
  },
  actions: {
    step5(med){
      console.log("60 - strep-penicillin step5 action. med: ", med);
      if (!Ember.isNone(med)) {
        if(med === 'Amoxicillin suspension'){
          this.get('medication_callback')({
            display: med + ' ' + this.get('suspension_dose') + this.get('suspension_unit'),
            code: 'code',
            dosageInstruction: '1 daily',
            date: moment().format(ENV.APP.date_format),
            duration_value: '10',
            duration_unit: 'days',
            refills: 1,
          });
        }
        else if (med === 'Penicillin VK') {
          this.get('medication_callback')({
            display: med + ' ' + this.get('penicillin_dose') + this.get('penicillin_unit'),
            code: 'code',
            dosageInstruction: 'b.i.d',
            date: moment().format(ENV.APP.date_format),
            duration_value: '10',
            duration_unit: 'days',
            refills: 1,
          });
        }
        else if (med === 'Benzathine penicillin') {
          this.get('medication_callback')({
            display: med + ' ' + this.get('benzathine_dose') + this.get('benzathine_unit'),
            code: 'code',
            dosageInstruction: '1 dose',
            date: moment().format(ENV.APP.date_format),
            duration_value: this.get('benzathine_duration_value'),
            duration_unit: this.get('benzathine_duration_unit'),
            refills: 1,
          });
        }
      }
      else {
        this.get('medication_callback')({});
      }
    }
  }
});
