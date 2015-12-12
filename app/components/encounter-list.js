import Ember from 'ember';

export default Ember.Component.extend({
  encounters: null,
  index: 0,
  shouldShow: false,
  init() {
    this._super(...arguments);
    if(!Ember.isEmpty(this.encounters) && !Ember.isEmpty(this.encounters[this.index])){
      for (let i in this.encounters[this.index]) {
        this.set(i, this.encounters[this.index][i]);
      }
      this.set('shouldShow', true);
    }
  },
});
