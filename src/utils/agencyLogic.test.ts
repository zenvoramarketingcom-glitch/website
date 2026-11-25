import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeScrollServiceState,
  estimateTargetReach,
  filterBusinessNiches,
  searchCatalog,
  validateInquiryForm,
} from './agencyLogic';

test('searchCatalog finds dental sample and dental business niche', () => {
  const results = searchCatalog('dental');
  assert.ok(results.length >= 2);
  assert.ok(results.some((r) => r.type === 'sample' && r.title.includes('Orora')));
  assert.ok(results.some((r) => r.type === 'industry' && r.title.includes('Dental')));
});

test('filterBusinessNiches filters by category and query', () => {
  const healthcare = filterBusinessNiches('', 'Healthcare');
  assert.equal(healthcare.length, 1);
  assert.equal(healthcare[0].id, 'dental-clinic');

  const solar = filterBusinessNiches('rooftop', 'All');
  assert.equal(solar.length, 1);
  assert.equal(solar[0].id, 'solar-energy');
});

test('computeScrollServiceState transitions active card cleanly across scroll 0..1', () => {
  const atStart = computeScrollServiceState(0, 4);
  assert.equal(atStart.activeIndex, 0);
  assert.equal(atStart.cards[0].opacity, 1);
  assert.equal(atStart.cards[1].opacity, 0.05);

  const atMid = computeScrollServiceState(0.34, 4);
  assert.equal(atMid.activeIndex, 1);
  assert.ok(atMid.cards[1].opacity > atMid.cards[0].opacity);

  const atEnd = computeScrollServiceState(1, 4);
  assert.equal(atEnd.activeIndex, 3);
  assert.equal(atEnd.cards[3].opacity, 1);
});

test('estimateTargetReach computes radius and Pan-India reach accurately', () => {
  const local = estimateTargetReach(25, 'radius', 10000);
  assert.ok(local.areaLabel.includes('25 km'));
  assert.ok(local.estimatedAudience.includes('M+'));

  const panIndia = estimateTargetReach(25, 'pan-india', 10000);
  assert.equal(panIndia.areaLabel, 'Pan-India Coverage');
});

test('validateInquiryForm rejects invalid contact and accepts valid phone or email', () => {
  const bad = validateInquiryForm({
    name: 'A',
    contact: '123',
    businessType: '',
    serviceName: 'Meta Ads',
    urgency: 'urgent',
    areaSummary: 'Delhi NCR',
  });
  assert.equal(bad.valid, false);
  assert.ok(bad.errors.name);
  assert.ok(bad.errors.contact);
  assert.ok(bad.errors.businessType);

  const good = validateInquiryForm({
    name: 'Rohan Sharma',
    contact: '+91 9876543210',
    businessType: 'Clothing Shop',
    serviceName: 'Meta Ads',
    urgency: 'urgent',
    areaSummary: 'Mumbai · 25 km radius',
  });
  assert.equal(good.valid, true);
  assert.deepEqual(good.errors, {});
});
