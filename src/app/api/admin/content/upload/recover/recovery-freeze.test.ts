import { RECOVERY_PUBLICATION_ENABLED } from "./route";

describe("curriculum recovery consolidation freeze", () => {
  it("keeps recovery publication disabled until canonical consolidation is complete", () => {
    expect(RECOVERY_PUBLICATION_ENABLED).toBe(false);
  });
});
