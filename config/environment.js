/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'antimicrobial-cds',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      date_format: 'YYYY/MM/DD',
      // snomed-ct codes used to fire the Acute Otitis Media and related cases CDS logic
      aom_cds: ['3110003','65363002'],
      // snomed-ct codes used to fire the Streptococcal Pharyngitis and related cases CDS logic
      strep_cds: ['43878008','1532007'],
      // Observations that should not appear in lab section.
      // 55284-4 - Combined Bloodpressure (systolic and diastolic)
      // 8480-6 - Systolic Bloodpressure
      // 8462-4 - Diastolic Bloodpressure
      // 3141-9 - Weight
      // 8310-5 - Temperature
      lab_exclusions: ['55284-4', '8480-6', '8462-4', '3141-9', '8310-5'],
      aom_temp_threshold: 39,
      strep_temp_threshold: 38,
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
