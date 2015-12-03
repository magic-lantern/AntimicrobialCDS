import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    showinstructions: function() {
      Ember.$('#instructions').toggleClass('hidden');
    },
    override: function() {
      this.set('fc.isAuthenticated', true);
    }
  }
});
