import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('strep-non-penicillin', 'Integration | Component | strep non penicillin', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{strep-non-penicillin}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#strep-non-penicillin}}
      template block text
    {{/strep-non-penicillin}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
