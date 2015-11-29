import Ember from 'ember';
import ENV from '../config/environment';

export default Ember.Controller.extend({
  isEditing: false,
  //fhir-client: Ember.inject.service(),
  actions: {
    fire_cds() {
      console.log("FHIR this: ", this.get('FHIR'));
      console.log("FHIR this client: ", this.get('fc').patient);
      console.log("this.fhirclient : ", this.fc.patient);
      console.log("FHIR global: ", FHIR);
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
