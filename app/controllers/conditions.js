import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({
  medication: {},
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
          Ember.$('#StrepModal').modal('show');
        }
        else {
          console.log("unknown SNOMED-CT code.");
        }
      }
    },
    medication_callback: function(med) {
      console.log('medication : ', med);
      this.set('medication', med);
    },
    clearall: function() {
      this.set('medication', {});
      Ember.$('#condition_form').trigger('reset');
    },
    save: function() {
      if(!Ember.isNone(this.medication)){
        this.fc.addMedication(this.medication);
      }
      this.send('clearall');
    }
  }
});
