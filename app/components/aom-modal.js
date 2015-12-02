import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Component.extend({
  exceedTempThreshold : Ember.computed('fc.patient.temp.value', function() {
    return (this.fc.patient.temp.value > ENV.APP.aom_temp_threshold);
  }),

  actions: {
    step1(idenable, iddisable) {
      Ember.$('#' + idenable).addClass('selectedimage');
      Ember.$('#' + iddisable).removeClass('selectedimage');
      Ember.$('#' + 'step2').removeClass('hidden');
      Ember.$('#' + 'step3').addClass('hidden');
    },
    step2() {
      console.log('called step2');
      Ember.$('#' + 'step3').removeClass('hidden');
    },
    step3() {
      console.log('called step3');
      Ember.$('#' + 'step4').removeClass('hidden');
    }
  }
});
