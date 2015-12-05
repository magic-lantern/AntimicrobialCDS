import Ember from 'ember';
import moment from 'moment';
import ENV from '../config/environment';

export default Ember.Component.extend({
  total_steps: 5,
  med_form: null,
  medication: Ember.computed('fc.patient.hasPenicillinAllergy', function() {
     if (!Ember.isNone(this.fc.patient.hasPenicillinAllergy) && this.fc.patient.hasPenicillinAllergy) {
       return `strep-non-penicillin`;
     }
     else {
       return `strep-penicillin`;
     }
  }),
  exceedTempThreshold : Ember.computed('fc.patient.temp.value', function() {
    return (this.fc.patient.temp.value > ENV.APP.strep_temp_threshold);
  }),
  missingWeight: Ember.computed('this.fc.patient.weight.value', function() {
     if (Ember.isNone(this.fc.patient.weight.value) || (this.fc.patient.weight.value == 'No Observation')) {
       return true;
     }
     return false;
  }),
  uncheck_steps(current_step) {
    //step 5 is medication, don't want to change that
    for (var step_num = current_step + 1; step_num < this.total_steps; step_num++) {
      Ember.$('#strep_step' + step_num).find(":checked").attr('checked', false);
    }
  },
  toggle_next_steps(current_step, hide_next=false) {
    if(hide_next){
      Ember.$('#strep_step' + (current_step + 1)).addClass('hidden');
    }
    else {
      Ember.$('#strep_step' + (current_step + 1)).removeClass('hidden');
    }
    for (var step_num = current_step + 2; step_num <= this.total_steps; step_num++) {
      Ember.$('#strep_step' + step_num).addClass('hidden');
    }
  },
  actions: {
    step1_next() {
      this.toggle_next_steps(1);
      Ember.$('#strep_criteria_not_met').addClass('hidden');
      Ember.$('#strep_review').addClass('hidden');
      Ember.$('#strep_override').addClass('hidden');
      this.uncheck_steps(1);
    },
    step1_done() {
      this.toggle_next_steps(1, true);
      Ember.$('#strep_criteria_not_met').removeClass('hidden');
      Ember.$('#strep_review').removeClass('hidden');
      Ember.$('#strep_override').addClass('hidden');
      this.uncheck_steps(1);
    },
    step2_next() {
      Ember.$('#strep_step3').addClass('hidden');
      Ember.$('#strep_step4').removeClass('hidden');
      Ember.$('#strep_step5').addClass('hidden');
      Ember.$('#strep_criteria_not_met').addClass('hidden');
      Ember.$('#strep_review').addClass('hidden');
      Ember.$('#strep_override').addClass('hidden');
      this.uncheck_steps(2);
    },
    step2_done() {
      Ember.$('#strep_step3').removeClass('hidden');
      Ember.$('#strep_step4').addClass('hidden');
      Ember.$('#strep_step5').addClass('hidden');
      Ember.$('#strep_criteria_not_met').addClass('hidden');
      Ember.$('#strep_review').removeClass('hidden');
      Ember.$('#strep_override').addClass('hidden');
      this.uncheck_steps(2);
    },
    step3_next() {
      console.log('called step3');
      Ember.$('#strep_step4').removeClass('hidden');
      Ember.$('#strep_step5').addClass('hidden');
      Ember.$('#strep_criteria_not_met').addClass('hidden');
      Ember.$('#strep_review').addClass('hidden');
      Ember.$('#strep_override').addClass('hidden');
      this.uncheck_steps(3);
    },
    step3_done() {
      Ember.$('#strep_step4').addClass('hidden');
      Ember.$('#strep_step5').addClass('hidden');
      Ember.$('#strep_criteria_not_met').removeClass('hidden');
      Ember.$('#strep_review').removeClass('hidden');
      Ember.$('#strep_override').addClass('hidden');
      this.uncheck_steps(3);
    },
    step4(med_form) {
      this.set('med_form', med_form);
      Ember.$('#strep_step5').removeClass('hidden');
      Ember.$('#strep_criteria_not_met').addClass('hidden');
      Ember.$('#strep_override').addClass('hidden');
      this.uncheck_steps(4);
    },
    step5(med) {
      Ember.$('#strep_review').removeClass('hidden');
      Ember.$('#strep_override').addClass('hidden');
    },
    override() {
      Ember.$('#strep_override').removeClass('hidden');
    },
    forceallergy() {
      if (Ember.$('#strep_forceallergy').is(':checked')) {
        this.set('fc.patient.hasPenicillinAllergy', true);
      }
      else {
        this.set('fc.patient.hasPenicillinAllergy', false);
      }
    },
    saveweight() {
      this.set('fc.patient.weight.value', parseInt(Ember.$('#strep_weight').val()));
      this.set('fc.patient.weight.unit', 'kg');
      this.set('fc.patient.weight.date', moment().format(ENV.APP.date_format));
    }
  }
});
