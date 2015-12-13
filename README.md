# AntimicrobialCDS
Antimicrobial Clinical Decision Support Prototype

The overprescribing of antibiotics is a broad collection of issues that cannot
be solved easily at once. In order to quickly provide a measurable solution to
the problem we propose to create a limited scope Clinical Decision Support
system (CDSS) to make antibiotic recommendations for pediatric patients for
acute otitis media (AOM) and streptococcal pharyngitis.

This prototype system provides antibiotic recommendations for pediatric
populations. The recommendation will include which antibiotic(s)
to prescribe, dosage, and length of treatment based on patient specific
values.

Technologies employed:
* [EmberJS](http://emberjs.com/)
* [Bootstrap](http://getbootstrap.com/)
* [Font Awesome](https://fortawesome.github.io/Font-Awesome/)
* [FHIR](https://www.hl7.org/fhir/)
* [SMART on FHIR](http://smarthealthit.org/)

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

## Running / Development

* `ember server`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

TBD

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)


## License
For code written by [magic-lantern](https://github.com/magic-lantern), see the [LICENSE](LICENSE) file for license rights and limitations (Apache License, Version 2.0).
Code from other parties may have different licensing terms.
