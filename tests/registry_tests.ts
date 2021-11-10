// [VexFlow](https://vexflow.com) - Copyright (c) Mohit Muthanna 2010.
// MIT License
//
// Registry Tests

import { VexFlowTests } from './vexflow_test_helpers';

import { EasyScore, Element, Factory, Registry, StaveNote } from '../src/';

const RegistryTests = {
  Start(): void {
    QUnit.module('Registry');
    test('Register and Clear', registerAndClear);
    test('Default Registry', defaultRegistry);
    test('Multiple Classes', classes);
  },
};

function registerAndClear(): void {
  const registry = new Registry();
  const score = new EasyScore({ factory: Factory.newFromElementId(null) });

  registry.register(score.notes('C4')[0], 'foobar');

  const foobar = registry.getElementById('foobar') as Element;
  ok(foobar);
  equal(foobar.getAttribute('id'), 'foobar');

  registry.clear();
  notOk(registry.getElementById('foobar'));

  // eslint-disable-next-line
  // @ts-ignore: intentional type mismatch to trigger an error.
  throws(() => registry.register(score.notes('C4')));

  registry.clear();
  ok(registry.register(score.notes('C4[id="boobar"]')[0]).getElementById('boobar'));
}

function defaultRegistry(): void {
  const registry = new Registry();
  const score = new EasyScore({ factory: Factory.newFromElementId(null) });

  Registry.enableDefaultRegistry(registry);
  score.notes('C4[id="foobar"]');
  const note = registry.getElementById('foobar') as Element;
  ok(note);

  note.setAttribute('id', 'boobar');
  ok(registry.getElementById('boobar'));
  notOk(registry.getElementById('foobar'));

  registry.clear();
  equal(registry.getElementsByType(StaveNote.CATEGORY).length, 0);

  score.notes('C5');
  const elements = registry.getElementsByType(StaveNote.CATEGORY);
  equal(elements.length, 1);
}

function classes(): void {
  const registry = new Registry();
  const score = new EasyScore({ factory: Factory.newFromElementId(null) });

  Registry.enableDefaultRegistry(registry);
  score.notes('C4[id="foobar"]');
  const note = registry.getElementById('foobar') as Element;

  note.addClass('foo');
  ok(note.hasClass('foo'));
  notOk(note.hasClass('boo'));
  equal(registry.getElementsByClass('foo').length, 1);
  equal(registry.getElementsByClass('boo').length, 0);

  note.addClass('boo');
  ok(note.hasClass('foo'));
  ok(note.hasClass('boo'));
  equal(registry.getElementsByClass('foo').length, 1);
  equal(registry.getElementsByClass('boo').length, 1);

  note.removeClass('boo');
  note.removeClass('foo');
  notOk(note.hasClass('foo'));
  notOk(note.hasClass('boo'));
  equal(registry.getElementsByClass('foo').length, 0);
  equal(registry.getElementsByClass('boo').length, 0);
}

VexFlowTests.register(RegistryTests);
export { RegistryTests };
