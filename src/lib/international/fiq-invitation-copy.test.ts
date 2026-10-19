import test from "node:test";
import assert from "node:assert/strict";
import { getFiqInvitationCopy } from "./fiq-invitation-copy";

test("Caribbean Spanish visitors see the FIQ invitation in Spanish", () => {
  const copy = getFiqInvitationCopy("es-Caribbean");
  assert.match(copy.title, /FIQ gratuito/u);
  assert.notEqual(copy.accept, getFiqInvitationCopy("en-US").accept);
});
test("French Canadian visitors see French", () => {
  assert.match(getFiqInvitationCopy("fr-CA").title, /FIQ gratuit/u);
});
test("Unknown languages fall back to English", () => {
  assert.equal(getFiqInvitationCopy("xx").title, "Want to take the free Edunancial FIQ?");
});
