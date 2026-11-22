import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const route = readFileSync(new URL('../app/api/checkout/route.ts', import.meta.url), 'utf8');
const lock = JSON.parse(readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8'));

test('checkout limits request bytes before parsing and payments', () => {
  assert.match(route, /MAX_CHECKOUT_BODY_BYTES = 16 \* 1024/);
  assert.match(route, /size > MAX_CHECKOUT_BODY_BYTES/);
  assert.match(route, /status: 413/);
  assert.ok(route.indexOf('size > MAX_CHECKOUT_BODY_BYTES') < route.indexOf('getStripe()'));
});

test('checkout limits line count to catalog size without changing quantity rules', () => {
  assert.match(route, /\.max\(PRODUCT_SLUGS\.length\)/);
  assert.match(route, /quantity: z\.number\(\)\.int\(\)\.min\(1\)\.max\(99\)/);
});

test('targeted dependency patches are locked', () => {
  assert.equal(lock.packages['node_modules/protobufjs'].version, '7.6.6');
  assert.equal(lock.packages['node_modules/@grpc/grpc-js'].version, '1.14.7');
  assert.equal(lock.packages['node_modules/source-map-js'].version, '1.2.4');
});
