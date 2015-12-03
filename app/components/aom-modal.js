import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Component.extend({
  exceedTempThreshold : Ember.computed('fc.patient.temp.value', function() {
    return (this.fc.patient.temp.value > ENV.APP.aom_temp_threshold);
  }),

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
    },
    step1_done(idenable, iddisable) {
      Ember.$('#' + idenable).addClass('selectedimage');
      Ember.$('#' + iddisable).removeClass('selectedimage');
      Ember.$('#' + 'step2').addClass('hidden');
      Ember.$('#' + 'step3').addClass('hidden');
      Ember.$('#' + 'criteria_not_met').removeClass('hidden');
      Ember.$('#' + 'review').removeClass('hidden');
      Ember.$('#' + 'override').addClass('hidden');
    },
    step1_reset() {
      //$("input:checkbox").prop('checked', $(this).prop("checked"));
    },
    step2_next() {
      console.log('called step2');
      Ember.$('#' + 'step3').removeClass('hidden');
      Ember.$('#' + 'step4').addClass('hidden');
      Ember.$('#' + 'step5').addClass('hidden');
      Ember.$('#' + 'criteria_not_met').addClass('hidden');
      Ember.$('#' + 'review').addClass('hidden');
      Ember.$('#' + 'override').addClass('hidden');
    },
    step2_done() {
      console.log('called step2');
      Ember.$('#' + 'step3').addClass('hidden');
      Ember.$('#' + 'step4').addClass('hidden');
      Ember.$('#' + 'step5').addClass('hidden');
      Ember.$('#' + 'criteria_not_met').removeClass('hidden');
      Ember.$('#' + 'review').removeClass('hidden');
      Ember.$('#' + 'override').addClass('hidden');
    },
    step3_next() {
      console.log('called step3');
      Ember.$('#' + 'step4').removeClass('hidden');
      Ember.$('#' + 'step5').addClass('hidden');
      Ember.$('#' + 'criteria_not_met').addClass('hidden');
      Ember.$('#' + 'review').addClass('hidden');
      Ember.$('#' + 'override').addClass('hidden');
    },
    step3_done() {
      console.log('called step3');
      Ember.$('#' + 'step4').addClass('hidden');
      Ember.$('#' + 'step5').addClass('hidden');
      Ember.$('#' + 'criteria_not_met').removeClass('hidden');
      Ember.$('#' + 'review').removeClass('hidden');
      Ember.$('#' + 'override').addClass('hidden');
    },
    step4(med_form) {
      console.log("selected: ", med_form);
      Ember.$('#' + 'step5').removeClass('hidden');
      Ember.$('#' + 'criteria_not_met').addClass('hidden');
      Ember.$('#' + 'override').addClass('hidden');
    },
    step5(med) {
      console.log("selected medication : ", med);
      Ember.$('#' + 'review').removeClass('hidden');
      Ember.$('#' + 'override').addClass('hidden');
    },
    override() {
      Ember.$('#' + 'override').removeClass('hidden');
    }
  }
});
