import Ember from 'ember';

export function round(params/*, hash*/) {
  var val = params[0];
  var decimals = params[1] || 2;
  if (typeof val !== 'undefined') {
    var retStr = parseFloat(val).toFixed(2);
    return new Ember.Handlebars.SafeString(retStr);
  }
  else {
      return val;
  }
}

export default Ember.Helper.helper(round);
