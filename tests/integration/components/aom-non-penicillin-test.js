import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('aom-non-penicillin', 'Integration | Component | aom non penicillin', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{aom-non-penicillin}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#aom-non-penicillin}}
      template block text
    {{/aom-non-penicillin}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
