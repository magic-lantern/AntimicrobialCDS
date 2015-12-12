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
          Ember.$('#aom-education').removeClass('hidden');
          Ember.$('#strep-education').addClass('hidden');
        }
        else if (ENV.APP.strep_cds.indexOf(diagnosis) > -1) {
          console.log("need to fire Strep CDS");
          Ember.$('#StrepModal').modal('show');
          Ember.$('#strep-education').removeClass('hidden');
          Ember.$('#aom-education').addClass('hidden');
        }
        else {
          console.log("unknown SNOMED-CT code.");
        }
        Ember.$('#general-education').removeClass('hidden');
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
