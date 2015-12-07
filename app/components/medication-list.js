import Ember from 'ember';

export default Ember.Component.extend({
  highlight_color: null,
  meds: null,
  index: 0,
  display: null,
  shouldShow: false,
  init() {
    this._super(...arguments);
    if(!Ember.isEmpty(this.meds) && !Ember.isEmpty(this.meds[this.index])){
      this.set('display', this.meds[this.index].display);
      this.set('shouldShow', true);
    }
  },
});
