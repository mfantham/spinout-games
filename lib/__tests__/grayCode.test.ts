import { strict as assert } from "node:assert";
import {
  canMove,
  isSolved,
  nextHintMove,
  solutionLength,
} from "../grayCode.ts";

function legalMoves(state: boolean[]): number[] {
  return Array.from({ length: state.length }, (_, index) => index + 1).filter(
    (dial) => canMove(state, dial),
  );
}

Deno.test("matches representative movement examples", () => {
  assert.deepStrictEqual(
    legalMoves([false, false, false, false, false, false, false]),
    [1],
  );
  assert.deepStrictEqual(
    legalMoves([true, false, false, false, false, false, false]),
    [1, 2],
  );
  assert.deepStrictEqual(
    legalMoves([false, true, false, false, false, false, false]),
    [1, 3],
  );
  assert.deepStrictEqual(
    legalMoves([true, true, false, false, false, false, false]),
    [1, 2],
  );
  assert.deepStrictEqual(
    legalMoves([false, false, false, false, false, true, false]),
    [1, 7],
  );
});

Deno.test("always allows dial 1", () => {
  assert.strictEqual(
    canMove([false, false, false, false, false, false, false], 1),
    true,
  );
  assert.strictEqual(
    canMove([true, false, true, false, true, false, true], 1),
    true,
  );
  assert.strictEqual(
    canMove([true, true, true, true, true, true, true], 1),
    true,
  );
});

Deno.test("returns dial 1 as the first hint from the starting state", () => {
  assert.strictEqual(
    nextHintMove([false, false, false, false, false, false, false]),
    1,
  );
});

Deno.test("reports solved and unsolved states correctly", () => {
  assert.strictEqual(
    isSolved([false, false, false, false, false, false, false]),
    false,
  );
  assert.strictEqual(
    isSolved([true, true, true, true, true, true, true]),
    true,
  );
});

Deno.test("computes the known solution length for seven dials", () => {
  assert.strictEqual(solutionLength(7), 85);
});

