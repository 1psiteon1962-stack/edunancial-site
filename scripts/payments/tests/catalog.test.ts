import assert from "node:assert/strict";
import test from "node:test";

import {
  getCatalogItem,
  getActiveCatalogItems,
  resolveCatalogItem,
  paymentCatalog,
} from "../../../src/lib/payments/catalog.ts";

test("paymentCatalog contains at least one active membership item", () => {
  const memberships = paymentCatalog.filter(
    (item) => item.type === "membership_monthly" && item.active
  );
  assert.ok(memberships.length >= 1);
});

test("getCatalogItem returns the item for a known ID", () => {
  const item = getCatalogItem("membership-basic-monthly");
  assert.ok(item);
  assert.equal(item.id, "membership-basic-monthly");
  assert.equal(item.membershipPlanId, "basic");
  assert.equal(item.isRecurring, true);
  assert.equal(item.recurringInterval, "monthly");
  assert.equal(item.currency, "USD");
  assert.ok(item.price > 0);
});

test("getCatalogItem returns undefined for unknown IDs", () => {
  assert.equal(getCatalogItem("does-not-exist"), undefined);
});

test("getActiveCatalogItems returns only active items", () => {
  const active = getActiveCatalogItems();
  assert.ok(active.every((item) => item.active));
});

test("getActiveCatalogItems filters by type", () => {
  const monthly = getActiveCatalogItems("membership_monthly");
  assert.ok(monthly.every((item) => item.type === "membership_monthly"));
});

test("resolveCatalogItem resolves direct catalog IDs", () => {
  const item = resolveCatalogItem("membership-basic-monthly");
  assert.ok(item);
  assert.equal(item.id, "membership-basic-monthly");
});

test("resolveCatalogItem resolves legacy membership plan IDs", () => {
  const basic = resolveCatalogItem("basic");
  assert.ok(basic);
  assert.equal(basic.membershipPlanId, "basic");
  assert.equal(basic.type, "membership_monthly");
  assert.equal(basic.active, true);
});

test("resolveCatalogItem resolves premium legacy plan ID", () => {
  const premium = resolveCatalogItem("premium");
  assert.ok(premium);
  assert.equal(premium.membershipPlanId, "premium");
});

test("resolveCatalogItem resolves enterprise legacy plan ID", () => {
  const enterprise = resolveCatalogItem("enterprise");
  assert.ok(enterprise);
  assert.equal(enterprise.membershipPlanId, "enterprise");
});

test("resolveCatalogItem returns undefined for unknown IDs", () => {
  assert.equal(resolveCatalogItem("ghost-plan"), undefined);
});

test("all active membership items have price > 0", () => {
  const memberships = getActiveCatalogItems("membership_monthly");
  assert.ok(memberships.every((item) => item.price > 0));
});

test("all catalog items have required fields set", () => {
  for (const item of paymentCatalog) {
    assert.ok(item.id.length > 0, `${item.id} missing id`);
    assert.ok(item.name.length > 0, `${item.id} missing name`);
    assert.ok(item.type.length > 0, `${item.id} missing type`);
    assert.ok(item.currency.length > 0, `${item.id} missing currency`);
    assert.ok(item.price >= 0, `${item.id} price must be >= 0`);
  }
});
