import Ember from 'ember';

export default Ember.Component.extend({
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
