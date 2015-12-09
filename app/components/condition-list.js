import Ember from 'ember';

export default Ember.Component.extend({
  highlight_color: null,
  conditions: null,
  index: 0,
  shouldShow: false,
  init() {
    this._super(...arguments);
    if(!Ember.isEmpty(this.conditions) && !Ember.isEmpty(this.conditions[this.index])){
      for (let i in this.conditions[this.index]) {
        this.set(i, this.conditions[this.index][i]);
      }
      this.set('shouldShow', true);
    }
  },
});
