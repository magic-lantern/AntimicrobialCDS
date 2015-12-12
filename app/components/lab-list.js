import Ember from 'ember';

export default Ember.Component.extend({
  highlight_color: null,
  labs: null,
  index: 0,
  shouldShow: false,
  init() {
    this._super(...arguments);
    if(!Ember.isEmpty(this.labs) && !Ember.isEmpty(this.labs[this.index])){
      for (let i in this.labs[this.index]) {
        this.set(i, this.labs[this.index][i]);
      }
      this.set('display', this.display.capitalize());
      this.set('shouldShow', true);
    }
  },
});
