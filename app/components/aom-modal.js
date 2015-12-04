import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Component.extend({
  total_steps: 5,
  min_dose: 0,
  max_dose: 0,
  duration: null,
  med_form: null,
  medication: Ember.computed('this.fc.patient.hasPenicillinAllergy', function() {
     if (!Ember.isNone(this.fc.patient.hasPenicillinAllergy) && this.fc.patient.hasPenicillinAllergy) {
       return `aom-non-penicillin`;
     }
     else {
       return `aom-penicillin`;
     }
  }),
  exceedTempThreshold : Ember.computed('fc.patient.temp.value', function() {
    return (this.fc.patient.temp.value > ENV.APP.aom_temp_threshold);
  }),
  uncheck_steps(current_step) {
    for (var step_num = current_step + 1; step_num < this.total_steps; step_num++) {
      Ember.$('#step' + step_num).find(":checked").attr('checked', false);
    }
  },
  actions: {
    step1_next(idenable, iddisable) {
      Ember.$('#' + idenable).addClass('selectedimage');
      Ember.$('#' + iddisable).removeClass('selectedimage');
      Ember.$('#' + 'step2').removeClass('hidden');
      Ember.$('#' + 'step3').addClass('hidden');
      Ember.$('#' + 'step4').addClass('hidden');
      Ember.$('#' + 'step5').addClass('hidden');
      Ember.$('#' + 'criteria_not_met').addClass('hidden');
      Ember.$('#' + 'review').addClass('hidden');
      Ember.$('#' + 'override').addClass('hidden');
      this.uncheck_steps(1);
    },
    step1_done(idenable, iddisable) {
      Ember.$('#' + idenable).addClass('selectedimage');
      Ember.$('#' + iddisable).removeClass('selectedimage');
      Ember.$('#' + 'step2').addClass('hidden');
      Ember.$('#' + 'step3').addClass('hidden');
      Ember.$('#' + 'criteria_not_met').removeClass('hidden');
      Ember.$('#' + 'review').removeClass('hidden');
      Ember.$('#' + 'override').addClass('hidden');
      this.calculate_dose();
      this.uncheck_steps(1);
    },
    step2_next() {
      console.log('called step2');
      Ember.$('#' + 'step3').removeClass('hidden');
      Ember.$('#' + 'step4').addClass('hidden');
      Ember.$('#' + 'step5').addClass('hidden');
      Ember.$('#' + 'criteria_not_met').addClass('hidden');
      Ember.$('#' + 'review').addClass('hidden');
      Ember.$('#' + 'override').addClass('hidden');
      this.uncheck_steps(2);
    },
    step2_done() {
      console.log('called step2');
      Ember.$('#' + 'step3').addClass('hidden');
      Ember.$('#' + 'step4').addClass('hidden');
      Ember.$('#' + 'step5').addClass('hidden');
      Ember.$('#' + 'criteria_not_met').removeClass('hidden');
      Ember.$('#' + 'review').removeClass('hidden');
      Ember.$('#' + 'override').addClass('hidden');
      this.uncheck_steps(2);
    },
    step3_next() {
      console.log('called step3');
      Ember.$('#' + 'step4').removeClass('hidden');
      Ember.$('#' + 'step5').addClass('hidden');
      Ember.$('#' + 'criteria_not_met').addClass('hidden');
      Ember.$('#' + 'review').addClass('hidden');
      Ember.$('#' + 'override').addClass('hidden');
      this.uncheck_steps(3);
    },
    step3_done() {
      console.log('called step3');
      Ember.$('#' + 'step4').addClass('hidden');
      Ember.$('#' + 'step5').addClass('hidden');
      Ember.$('#' + 'criteria_not_met').removeClass('hidden');
      Ember.$('#' + 'review').removeClass('hidden');
      Ember.$('#' + 'override').addClass('hidden');
      this.uncheck_steps(3);
    },
    step4(med_form) {
      console.log("selected: ", med_form);
      this.set('med_form', med_form);
      Ember.$('#' + 'step5').removeClass('hidden');
      Ember.$('#' + 'criteria_not_met').addClass('hidden');
      Ember.$('#' + 'override').addClass('hidden');
      this.uncheck_steps(4);
    },
    step5(med) {
      console.log("selected medication : ", med);
      Ember.$('#' + 'review').removeClass('hidden');
      Ember.$('#' + 'override').addClass('hidden');
    },
    override() {
      Ember.$('#' + 'override').removeClass('hidden');
    },
    forceallergy() {
      if (Ember.$('#forceallergy').is(':checked')) {
        this.set('fc.patient.hasPenicillinAllergy', true);
      }
      else {
        this.set('fc.patient.hasPenicillinAllergy', false);
      }
    }
  }
});
