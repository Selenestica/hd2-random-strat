const test = require("node:test");
const assert = require("node:assert/strict");
const {
  buildTurnQueue,
  sampleConstrainedStratagems,
  sampleUnique,
} = require("../js/partyrandomizer/engine.js");

const constantRng = () => 0.25;

test("equipment categories rotate their first picker", () => {
  const turns = buildTurnQueue(["a", "b", "c", "d"], {
    primary: true,
    secondary: true,
    armor: true,
    throwable: true,
    booster: true,
    stratagem: false,
  });
  const starters = ["primary", "secondary", "armor", "throwable", "booster"].map(
    (category) => turns.find((turn) => turn.category === category).playerId,
  );
  assert.deepEqual(starters, ["a", "b", "c", "d", "a"]);
});

test("disabled equipment categories do not consume a rotation", () => {
  const turns = buildTurnQueue(["a", "b", "c"], {
    primary: true,
    secondary: false,
    armor: true,
    throwable: false,
    booster: true,
    stratagem: false,
  });
  const starters = ["primary", "armor", "booster"].map(
    (category) => turns.find((turn) => turn.category === category).playerId,
  );
  assert.deepEqual(starters, ["a", "b", "c"]);
});

test("stratagem draft has four snake rounds with equal position totals", () => {
  const turns = buildTurnQueue(["a", "b", "c", "d"], {
    primary: false,
    secondary: false,
    armor: false,
    throwable: false,
    booster: false,
    stratagem: true,
  });
  assert.equal(turns.length, 16);
  assert.deepEqual(
    turns.filter((turn) => turn.round === 0).map((turn) => turn.playerId),
    ["a", "b", "c", "d"],
  );
  assert.deepEqual(
    turns.filter((turn) => turn.round === 1).map((turn) => turn.playerId),
    ["d", "c", "b", "a"],
  );
  const positionTotals = Object.fromEntries(["a", "b", "c", "d"].map((id) => [id, 0]));
  turns.forEach((turn) => {
    positionTotals[turn.playerId] += turn.pickIndex + 1;
  });
  assert.deepEqual(positionTotals, { a: 10, b: 10, c: 10, d: 10 });
});

test("snake order remains balanced for every supported party size", () => {
  for (let partySize = 1; partySize <= 4; partySize += 1) {
    const players = Array.from({ length: partySize }, (_, index) => `p${index}`);
    const turns = buildTurnQueue(players, {
      primary: false,
      secondary: false,
      armor: false,
      throwable: false,
      booster: false,
      stratagem: true,
    });
    const positionTotals = Object.fromEntries(players.map((id) => [id, 0]));
    turns.forEach((turn) => {
      positionTotals[turn.playerId] += turn.pickIndex + 1;
    });
    assert.equal(turns.length, partySize * 4);
    assert.deepEqual(new Set(Object.values(positionTotals)).size, 1);
    players.forEach((playerId) => {
      assert.equal(turns.filter((turn) => turn.playerId === playerId).length, 4);
    });
  }
});

test("stratagem rotation follows the final enabled equipment category", () => {
  const turns = buildTurnQueue(["a", "b", "c", "d"], {
    primary: true,
    secondary: false,
    armor: true,
    throwable: false,
    booster: false,
    stratagem: true,
  });
  const firstStratagemTurn = turns.find((turn) => turn.category === "stratagem");
  assert.equal(firstStratagemTurn.playerId, "c");
});

test("an all-Free Choice draft has no turns", () => {
  assert.deepEqual(
    buildTurnQueue(["a", "b"], {
      primary: false,
      secondary: false,
      armor: false,
      throwable: false,
      booster: false,
      stratagem: false,
    }),
    [],
  );
});

test("unique sampling rejects an undersized source", () => {
  assert.equal(sampleUnique([1, 2], 3, constantRng), null);
  assert.equal(new Set(sampleUnique([1, 2, 3], 3, constantRng)).size, 3);
});

test("support and backpack constraints scale to the party size", () => {
  const candidates = [];
  for (let index = 0; index < 8; index += 1) {
    candidates.push({ id: `support-${index}`, tags: ["Weapons"] });
    candidates.push({ id: `backpack-${index}`, tags: ["Backpacks"] });
    candidates.push({ id: `other-${index}`, tags: [] });
  }
  const selected = sampleConstrainedStratagems(
    candidates,
    10,
    2,
    {
      oneSupport: true,
      alwaysSupport: true,
      oneBackpack: true,
      alwaysBackpack: true,
    },
    constantRng,
  );
  assert.ok(selected);
  assert.equal(
    selected.filter((item) => item.tags.includes("Weapons")).length,
    2,
  );
  assert.equal(
    selected.filter((item) => item.tags.includes("Backpacks")).length,
    2,
  );
});

test("overlapping tags can satisfy both exact constraints", () => {
  const candidates = [
    { id: "both-a", tags: ["Weapons", "Backpacks"] },
    { id: "both-b", tags: ["Weapons", "Backpacks"] },
    ...Array.from({ length: 8 }, (_, index) => ({ id: `other-${index}`, tags: [] })),
  ];
  const selected = sampleConstrainedStratagems(
    candidates,
    10,
    2,
    {
      oneSupport: true,
      alwaysSupport: true,
      oneBackpack: true,
      alwaysBackpack: true,
    },
    constantRng,
  );
  assert.ok(selected);
  assert.equal(selected.filter((item) => item.tags.includes("Weapons")).length, 2);
  assert.equal(selected.filter((item) => item.tags.includes("Backpacks")).length, 2);
});

test("impossible quantity constraints return null", () => {
  const candidates = Array.from({ length: 10 }, (_, index) => ({
    id: `other-${index}`,
    tags: [],
  }));
  assert.equal(
    sampleConstrainedStratagems(
      candidates,
      6,
      1,
      {
        oneSupport: false,
        alwaysSupport: true,
        oneBackpack: false,
        alwaysBackpack: false,
      },
      constantRng,
    ),
    null,
  );
});
