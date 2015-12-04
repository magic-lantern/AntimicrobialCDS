import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('aom-penicillin', 'Integration | Component | aom penicillin', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{aom-penicillin}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#aom-penicillin}}
      template block text
    {{/aom-penicillin}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
