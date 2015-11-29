import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({
  actions: {
    fire_cds() {
      var diagnosis = Ember.$('#condition_diagnosis').val();
      if (!Ember.isEmpty(diagnosis)) {
        if (ENV.APP.aom_cds.indexOf(diagnosis) > -1) {
          console.log("need to fire AOM CDS");
          Ember.$('#AOMModal').modal('show');
        }
        else if (ENV.APP.strep_cds.indexOf(diagnosis) > -1) {
          console.log("need to fire Strep CDS");
        }
        else {
          console.log("unknown SNOMED-CT code.");
        }
      }
    }
  }
});
