import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { after, test } from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const buildRoot = mkdtempSync(join(tmpdir(), "hg-data-test-"));

after(() => {
  const target = resolve(buildRoot);
  if (dirname(target) !== resolve(tmpdir()) || !basename(target).startsWith("hg-data-test-")) {
    throw new Error("Refusing to remove an unexpected test build directory");
  }
  rmSync(target, { recursive: true, force: true });
});

execFileSync(process.execPath, [
  join(projectRoot, "node_modules/typescript/bin/tsc"),
  "--ignoreConfig",
  "--target", "ES2023",
  "--module", "CommonJS",
  "--moduleResolution", "Node10",
  "--ignoreDeprecations", "6.0",
  "--strict",
  "--noUnusedLocals",
  "--noUnusedParameters",
  "--skipLibCheck",
  "--outDir", buildRoot,
  join(projectRoot, "src/hg/data/index.ts"),
], { cwd: projectRoot, stdio: "pipe" });

const require = createRequire(import.meta.url);
const data = require(join(buildRoot, "index.js"));
const { nil, num, str, bool, i32, u32, f32, list, dict } = data;
const keys = ["x", "y", "z", "w"];
const vectorTypes = [2, 3, 4].flatMap((dimension) => ["i", "u", "f"].map((kind) => {
  const name = `vec${dimension}${kind}`;
  return { name, dimension, kind, type: data[name], tag: data[`__${name}__`] };
}));

const scalarCases = [
  { name: "num", type: num, empty: 0, input: "3.5", value: 3.5 },
  { name: "str", type: str, empty: "", input: 123, value: "123" },
  { name: "bool", type: bool, empty: false, input: 1, value: true },
  { name: "i32", type: i32, empty: 0, input: "3.5", value: 3 },
  { name: "u32", type: u32, empty: 0, input: "3.5", value: 3 },
  { name: "f32", type: f32, empty: 0, input: "3.5", value: 3.5 },
];

for (const { name, type, empty, input, value } of scalarCases) {
  test(`${name} constructs defaults, converts one value, and rejects extra arguments`, () => {
    assert.equal(type.new(), empty);
    assert.equal(type.new(undefined), empty);
    assert.equal(type.new(input), value);
    assert.throws(() => type.new(input, input), TypeError);
    assert.equal(type.maybe(value), true);
    assert.equal(type.assert(value), value);
    assert.equal(type.maybe({}), false);
    assert.throws(() => type.assert({}), TypeError);
  });
}

test("nil ignores constructor arguments and recognizes only null", () => {
  assert.equal(nil.new(), null);
  assert.equal(nil.new(undefined), null);
  assert.equal(nil.new(1, "anything", {}), null);
  assert.equal(nil.maybe(null), true);
  assert.equal(nil.maybe(undefined), false);
  assert.equal(nil.assert(null), null);
  assert.throws(() => nil.assert(undefined), TypeError);
});

test("all public predicates require exactly one argument", () => {
  const types = [nil, num, str, bool, i32, u32, f32, list, dict, ...vectorTypes.map(({ type }) => type)];
  for (const type of types) {
    assert.throws(() => type.maybe(), TypeError);
    assert.throws(() => type.maybe(null, 1), TypeError);
  }
});

test("assert remains public on every data type", () => {
  const types = [nil, num, str, bool, i32, u32, f32, list, dict, ...vectorTypes.map(({ type }) => type)];
  for (const type of types) {
    assert.equal(typeof type.assert, "function");
    assert.equal("__assert__" in type, false);
  }
});

test("num preserves JavaScript numeric conversion and guards", () => {
  assert.equal(num.new(null), 0);
  assert.equal(num.new(true), 1);
  assert.equal(num.new(Infinity), Infinity);
  assert.ok(Number.isNaN(num.new("invalid")));
  assert.equal(num.maybe(NaN), true);
  assert.equal(num.maybe(Infinity), true);
  assert.equal(num.maybe("1"), false);
  assert.throws(() => num.new(Symbol("number")), TypeError);
});

test("str converts values and validates primitive strings", () => {
  assert.equal(str.new(null), "null");
  assert.equal(str.new(false), "false");
  assert.equal(str.new(Symbol("value")), "Symbol(value)");
  assert.equal(str.maybe(""), true);
  assert.equal(str.maybe(new String("value")), false);
  assert.throws(() => str.new(Object.create(null)), TypeError);
});

test("bool.new handles every JavaScript falsy value", () => {
  for (const value of [false, 0, -0, NaN, "", null, undefined]) {
    assert.equal(bool.new(value), false);
  }
  for (const value of [true, 1, -1, "false", [], {}]) {
    assert.equal(bool.new(value), true);
  }
  assert.equal(bool.maybe(false), true);
  assert.equal(bool.maybe(0), false);
});

for (const { name, type, min, max } of [
  { name: "i32", type: i32, min: -2147483648, max: 2147483647 },
  { name: "u32", type: u32, min: 0, max: 4294967295 },
]) {
  test(`${name} truncates toward zero, clamps, and rejects NaN`, () => {
    assert.equal(type.new(1.9), 1);
    assert.equal(type.new(-1.9), name === "i32" ? -1 : 0);
    assert.equal(type.new(Infinity), max);
    assert.equal(type.new(-Infinity), min);
    assert.equal(type.new(max + 100), max);
    assert.equal(type.new(min - 100), min);
    assert.equal(type.maybe(min), true);
    assert.equal(type.maybe(max), true);
    for (const invalid of [1.5, min - 1, max + 1, Infinity, NaN, "1"]) {
      assert.equal(type.maybe(invalid), false);
    }
    for (const invalid of [NaN, "invalid", Symbol("number")]) {
      assert.throws(() => type.new(invalid), TypeError);
    }
  });
}

test("f32 keeps fractions, clamps its range, and rejects NaN", () => {
  assert.equal(f32.new(1.25), 1.25);
  assert.equal(f32.new(Infinity), 3.4028235e38);
  assert.equal(f32.new(-Infinity), -3.4028235e38);
  assert.equal(f32.maybe(1.25), true);
  assert.equal(f32.maybe(3.4028235e38), true);
  for (const invalid of [Infinity, -Infinity, NaN, 1e39, -1e39, "1"]) {
    assert.equal(f32.maybe(invalid), false);
  }
  for (const invalid of [NaN, "invalid", Symbol("number")]) {
    assert.throws(() => f32.new(invalid), TypeError);
  }
});

test("scalar hooks retain Lisp strings and boolean values", () => {
  assert.equal(nil.__str__(null), "nil");
  assert.equal(nil.__bool__(null), false);
  assert.equal(num.__str__(1.25), "1.25");
  assert.equal(i32.__str__(-2), "-2i");
  assert.equal(u32.__str__(2), "2u");
  assert.equal(f32.__str__(1.25), "1.25f");
  assert.equal(bool.__str__(false), "false");
  assert.equal(bool.__bool__(false), false);
  assert.equal(bool.__bool__(true), true);
});

test("list.new collects arguments and preserves nested values", () => {
  assert.deepEqual(list.new(), []);
  assert.deepEqual(list.new(1, null, "value"), [1, null, "value"]);
  const nested = [1, 2];
  const result = list.new(nested);
  assert.deepEqual(result, [[1, 2]]);
  assert.equal(result[0], nested);
  assert.notEqual(result, nested);
  assert.equal(list.maybe(result), true);
  assert.equal(list.maybe({ 0: 1, length: 1 }), false);
  assert.equal(list.assert(result), result);
  assert.throws(() => list.assert({}), TypeError);
});

test("private list helpers preserve values, mutate, and check deletion bounds", () => {
  const value = list.new(0, false, null);
  assert.equal(list.__get__(value, 0, "fallback"), 0);
  assert.equal(list.__get__(value, 1, "fallback"), false);
  assert.equal(list.__get__(value, 2, "fallback"), "fallback");
  assert.equal(list.__get__(value, 9), null);
  list.__put__(value, "last");
  list.__put__(value, "first", 0);
  assert.deepEqual(value, ["first", false, null, "last"]);
  assert.equal(list.__len__(value), 4);
  list.__del__(value, 1);
  assert.deepEqual(value, ["first", null, "last"]);
  assert.throws(() => list.__del__(value, -1), RangeError);
  assert.throws(() => list.__del__(value, value.length), RangeError);
});

test("dict.new accepts alternating pairs, lists, dictionaries, and odd keys", () => {
  for (const value of [dict.new(), dict.new(null), dict.new(undefined)]) {
    assert.equal(Object.getPrototypeOf(value), null);
    assert.deepEqual(Object.keys(value), []);
  }
  const value = dict.new("a", 1, "b", false, "odd");
  assert.equal(Object.getPrototypeOf(value), null);
  assert.deepEqual({ ...value }, { a: 1, b: false, odd: null });
  assert.deepEqual({ ...dict.new(["x", 2, "y"]) }, { x: 2, y: null });
  assert.deepEqual({ ...dict.new("x", undefined) }, { x: null });
  assert.deepEqual({ ...dict.new("x", 1, "x", 2) }, { x: 2 });
  const original = { key: "value" };
  assert.equal(dict.new(original), original);
  assert.throws(() => dict.new("__type__", "reserved"), TypeError);
  assert.throws(() => dict.new(["__type__", "reserved"]), TypeError);
  const special = dict.new("__proto__", 1, "constructor", 2);
  assert.deepEqual({ ...special }, { ["__proto__"]: 1, constructor: 2 });
});

test("dict predicates reject arrays and any type marker", () => {
  assert.equal(dict.maybe({}), true);
  assert.equal(dict.maybe(Object.create(null)), true);
  for (const value of [null, [], 1, "value", { __type__: "unknown" }, { __type__: undefined }, Object.create({ __type__: "unknown" })]) {
    assert.equal(dict.maybe(value), false);
    assert.throws(() => dict.assert(value), TypeError);
  }
  const value = { key: 1 };
  assert.equal(dict.assert(value), value);
});

test("private dict helpers preserve falsy values and mutate keys", () => {
  const value = dict.new("zero", 0, "false", false, "nil", null);
  assert.equal(dict.__get__(value, "zero", "fallback"), 0);
  assert.equal(dict.__get__(value, "false", "fallback"), false);
  assert.equal(dict.__get__(value, "nil", "fallback"), "fallback");
  assert.equal(dict.__get__(value, "missing"), null);
  dict.__put__(value, "added", 3);
  assert.equal(dict.__len__(value), 4);
  dict.__del__(value, "zero");
  assert.equal(dict.__len__(value), 3);
  assert.equal("zero" in value, false);
});

test("bool.__coerce__ uses data values and vector components", () => {
  for (const value of [null, false, 0, "", [], {}]) {
    assert.equal(bool.__coerce__(value), false);
  }
  for (const value of [true, -1, NaN, "value", [null], { key: null }]) {
    assert.equal(bool.__coerce__(value), true);
  }
  for (const { type, dimension } of vectorTypes) {
    assert.equal(bool.__coerce__(type.new()), false);
    const values = Array(dimension).fill(0);
    values[dimension - 1] = 1;
    assert.equal(bool.__coerce__(type.new(values)), true);
  }
  assert.throws(() => bool.__coerce__(Symbol("unsupported")), TypeError);
  assert.throws(() => bool.__coerce__({ __type__: "unknown" }), TypeError);
});

for (const { name, type, tag, dimension, kind } of vectorTypes) {
  const activeKeys = keys.slice(0, dimension);
  const expected = (values) => Object.fromEntries([
    ["__type__", tag],
    ...activeKeys.map((key, i) => [key, values[i]]),
  ]);

  test(`${name} defaults, splats, normalizes lists, and exposes hooks`, () => {
    const zero = expected(Array(dimension).fill(0));
    assert.deepEqual(type.new(), zero);
    assert.deepEqual(type.new(null), zero);
    assert.deepEqual(type.new(undefined), zero);
    const splat = kind === "i" ? -2 : kind === "u" ? 0 : -2.75;
    assert.deepEqual(type.new(-2.75), expected(Array(dimension).fill(splat)));
    const normalized = {
      i: [1, -2, 2147483647, -2147483648],
      u: [1, 0, 4294967295, 0],
      f: [1.25, -2.75, 3.4028235e38, -3.4028235e38],
    };
    assert.deepEqual(type.new([1.25, -2.75, Infinity, -Infinity]), expected(normalized[kind]));
    const values = [1, 2, 3, 4].slice(0, dimension);
    const value = type.new([...values, "ignored"]);
    assert.deepEqual(value, expected(values));
    assert.equal(type.maybe(value), true);
    assert.equal(type.assert(value), value);
    assert.equal(type.__str__(value), `(${name} ${values.join(" ")})`);
    assert.equal(type.__bool__(type.new()), false);
    const last = Array(dimension).fill(0);
    last[dimension - 1] = 1;
    assert.equal(type.__bool__(type.new(last)), true);
    assert.throws(() => type.new(values.slice(0, -1)), TypeError);
    assert.throws(() => type.new(NaN), TypeError);
  });

  test(`${name} flattens mixed variadic arguments with exact component counts`, () => {
    const values = [1, 2, 3, 4].slice(0, dimension);
    assert.deepEqual(type.new(...values), expected(values));
    assert.deepEqual(type.new(1, values.slice(1)), expected(values));
    const first = data.vec2f.new([1, 2]);
    first.z = 99;
    first.w = 99;
    const remainder = dimension === 2 ? [] : values.slice(2);
    assert.deepEqual(type.new(first, remainder), expected(values));
    if (dimension === 4) {
      assert.deepEqual(type.new(first, data.vec2i.new([3, 4])), expected(values));
    }
    assert.throws(() => type.new([], 1), TypeError);
    assert.throws(() => type.new([], []), TypeError);
    assert.throws(() => type.new(...values, 5), TypeError);
    for (const invalid of [null, undefined, "2", {}, [[2]], [NaN]]) {
      assert.throws(() => type.new(1, invalid), TypeError);
    }
  });

  test(`${name} normalizes vector values for the destination scalar range`, () => {
    const source = data.vec4f.new([-2.75, 3.5, Infinity, -Infinity]);
    const values = {
      i: [-2, 3, 2147483647, -2147483648],
      u: [0, 3, 4294967295, 0],
      f: [-2.75, 3.5, 3.4028235e38, -3.4028235e38],
    };
    assert.deepEqual(type.new(source), expected(values[kind]));
  });

  test(`${name} rejects malformed payloads and invalid components`, () => {
    const value = expected(Array(dimension).fill(1));
    const missing = { ...value };
    delete missing[activeKeys[dimension - 1]];
    for (const malformed of [null, 1, "value", {}, { __type__: tag }, missing, { ...value, __type__: "wrong" }]) {
      assert.equal(type.maybe(malformed), false);
      assert.throws(() => type.assert(malformed), TypeError);
      if (malformed !== null && typeof malformed !== "number") {
        assert.throws(() => type.new(malformed), TypeError);
      }
    }
    const invalidComponents = ["1", null, undefined, {}, [], NaN, Infinity];
    if (kind !== "f") invalidComponents.push(1.5);
    if (kind === "u") invalidComponents.push(-1, 4294967296);
    if (kind === "i") invalidComponents.push(-2147483649, 2147483648);
    for (const key of activeKeys) {
      for (const invalid of invalidComponents) {
        const malformed = { ...value, [key]: invalid };
        assert.equal(type.maybe(malformed), false);
        assert.throws(() => type.assert(malformed), TypeError);
        assert.throws(() => type.new(malformed), TypeError);
      }
    }
  });
}

for (const source of vectorTypes) {
  for (const target of vectorTypes) {
    test(`${target.name} converts ${source.name} by source dimension and returns a copy`, () => {
      const original = source.type.new([1, 2, 3, 4]);
      for (let i = source.dimension; i < keys.length; i++) original[keys[i]] = 99;
      const result = target.type.new(original);
      const expected = { __type__: target.tag };
      for (let i = 0; i < target.dimension; i++) {
        expected[keys[i]] = i < source.dimension ? i + 1 : 0;
      }
      assert.deepEqual(result, expected);
      assert.equal(target.type.maybe(result), true);
      assert.notEqual(result, original);
      original.x = 17;
      assert.equal(result.x, 1);
    });
  }
}
