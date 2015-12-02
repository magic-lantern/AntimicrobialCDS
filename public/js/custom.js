var patient;

FHIR.oauth2.ready(function (fhirClient) {
  patient = fhirClient.context.patient;
  patient.read()
    .then(function(p){
      console.log("Patient : ", p);
      var name = p.name[0];
      var formatted = name.given.join(" ") + " " + name.family;
      $("#patientName").text(formatted);
  });

/*
// return the first 100 observations
patient.Observation
  .where
  ._count(100)
  .search()
  .then(function(observations)
  */
  /*
  //return the first 100 LOINC 8302-2
  patient.Observation
    .where
    .code("8302-2")
    ._count(100)  // how many results to return - default is 10
    .search()
    */
  patient.Observation
    .where
    .code("8302-2")
    .date('>2001')  //show results from newer than 2001
    ._count(1)  // how many results to return - default is 10
    //._sortDesc("_id")//.effectiveDateTime") // start with newest results instead of oldest
    //._sortDesc("_lastUpdated")
    //._sortDesc("_tag")
    //._sortDesc("_profile")
    //._sortDesc("_security")
    //._sortDesc("_text")
    //._sortDesc("_content")
    //._sortDesc("_list")
    ._sortDesc("date")  // start with newest result
    //._sortDesc("_id") // so far _id seems to be the only sort parameter that I can find that works
    .search()
    .then(function(observations) {
      console.log("observations : ", observations);
      observations.forEach(function(obs) {
        console.log("Observation : ", obs);
        if (obs.hasOwnProperty("effectiveDateTime") && obs.hasOwnProperty("valueQuantity") &&
            obs.valueQuantity.hasOwnProperty("value") && obs.valueQuantity.hasOwnProperty("unit")) {
          var row = $("<tr><td>" + obs.effectiveDateTime + "</td>" + "<td>" + obs.valueQuantity.value + obs.valueQuantity.unit + "</td></tr>");
          $("#observation_list").append(row);
        }
      });
  });

  console.log("Patient observation search result : ", patient.Observation.where.search());

  patient.MedicationStatement.where.search().then(function(m1){
    console.log("m1 : ", m1);
  });
  /*
  patient.MedicationOrder.where.search().then(function(m2){
    console.log("m2 : ", m2);
  });
  */
  patient.MedicationDispense.where.search().then(function(m3){
    console.log("m3 : ", m3);
  });
  /*
  patient.Medication.where.search().then(function(m4){
    console.log("m4 : ", m4);
  });
  */
  patient.MedicationAdministration.where.search().then(function(m5){
    console.log("m5 : ", m5);
  });

  patient.AllergyIntolerance.where.search().then(function(a){
    console.log("Allergy : ", a);
  });
});
