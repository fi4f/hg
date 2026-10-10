import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { after, test } from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const buildRoot = mkdtempSync(join(tmpdir(), "hg-vector-test-"));

after(() => {
  const target = resolve(buildRoot);
  if (dirname(target) !== resolve(tmpdir()) || !basename(target).startsWith("hg-vector-test-")) {
    throw new Error("Refusing to remove an unexpected test build directory");
  }
  rmSync(target, { recursive: true, force: true });
});

execFileSync(process.execPath, [
  join(projectRoot, "node_modules/typescript/bin/tsc"),
  "--ignoreConfig", "--strict", "--noUnusedLocals", "--noUnusedParameters",
  "--target", "ES2023", "--module", "CommonJS",
  "--moduleResolution", "Node10", "--ignoreDeprecations", "6.0",
  "--outDir", buildRoot, join(projectRoot, "src/hg/data/index.ts"),
], { cwd: projectRoot, stdio: "pipe" });

const require = createRequire(import.meta.url);
const data = require(join(buildRoot, "index.js"));
const axes = ["x", "y", "z", "w"];
const vectors = [2, 3, 4].flatMap((dimension) => ["f", "i", "u"].map((kind) => {
  const name = `vec${dimension}${kind}`;
  return { name, dimension, kind, type: data[name], tag: data[`__${name}__`] };
}));

test("the type registry classifies primitives and registers every vector", () => {
  assert.equal(data.__type__(null), "__nil__");
  assert.equal(data.__type__(true), "__bool__");
  assert.equal(data.__type__(1), "__num__");
  assert.equal(data.__type__("value"), "__str__");
  assert.equal(data.__type__([]), "__list__");
  assert.equal(data.__type__({}), "__dict__");
  for (const { type, tag } of vectors) {
    assert.equal(data.Type.which(tag), type);
    assert.equal(data.__type__(type.new()), tag);
  }
});

test("numeric constructors, queries, and assertions reject non-finite numbers", () => {
  for (const type of [data.num, data.i32, data.u32, data.f32]) {
    for (const input of [NaN, Infinity, -Infinity]) {
      assert.throws(() => type.new(input), {
        name: "TypeError", message: /^\[num\] Expected finite number/,
      });
      assert.equal(type.query(input), false);
      assert.throws(() => type.assert(input), TypeError);
    }
    for (const input of ["Infinity", "+Infinity", "-Infinity", "1e999"]) {
      assert.throws(() => type.new(input), TypeError);
    }
    for (const input of ["NaN", "invalid"]) {
      assert.throws(() => type.new(input), SyntaxError);
    }
  }
  for (const input of [0, -0, 1.25, -1e100, 1e100]) {
    assert.equal(data.num.query(input), true);
    assert.equal(data.num.assert(input), input);
  }
  for (const input of ["1", null, undefined, {}, true]) {
    assert.equal(data.num.query(input), false);
  }
});

test("num validates the result of source conversion hooks", () => {
  const original = data.Type.__table__[data.__dict__];
  try {
    for (const value of [NaN, Infinity, -Infinity]) {
      data.Type.__table__[data.__dict__] = { ...original, __num__: () => value };
      assert.throws(() => data.num.new({}), {
        name: "TypeError", message: /^\[num\] Expected finite number/,
      });
    }
  } finally {
    data.Type.__table__[data.__dict__] = original;
  }
});

test("numeric JSON serialization rejects non-finite results introduced after construction", () => {
  for (const value of [0, 1.25, -1e100, 1e100]) {
    assert.equal(JSON.parse(data.num.__json__(value)), value);
  }
  for (const value of [1 / 0, -1 / 0, 0 / 0]) {
    assert.throws(() => data.num.__json__(value), TypeError);
  }
});

test("number parsing accepts native decimal, exponent, hexadecimal, octal, and binary forms", () => {
  const cases = [
    ["12", 12], [" -1.75 ", -1.75], ["+2.5", 2.5], [".5", 0.5], ["2.", 2],
    ["1e3", 1000], ["-2.5e-2", -0.025], ["0xff", 255], ["0XFF", 255],
    ["0o77", 63], ["0O77", 63], ["0b101", 5], ["0B101", 5],
  ];
  for (const [input, expected] of cases) {
    assert.equal(data.str.__num__(input), expected, input);
    assert.equal(data.num.new(input), expected, input);
  }
});

test("colon suffixes dispatch decimal and base-prefixed literals to scalar constructors", () => {
  const cases = [
    ["1.75:i", 1], ["-1.75:i", -1], ["-1.75:u", 0], ["1.75:f", 1.75],
    ["1e3:i", 1000], ["2147483648:i", 2147483647],
    ["-2147483649:i", -2147483648], ["4294967296:u", 4294967295],
    ["1e100:f", 3.4028235e38], ["-1e100:f", -3.4028235e38],
    [" 12:i ", 12],
  ];
  for (const body of ["0xff", "0XFF", "0o77", "0O77", "0b101", "0B101"]) {
    for (const suffix of ["i", "f", "u"]) cases.push([`${body}:${suffix}`, Number(body)]);
  }
  cases.push(["0xffffffff:i", 2147483647], ["0x100000000:u", 4294967295]);
  for (const [input, expected] of cases) {
    assert.equal(data.str.__num__(input), expected, input);
    assert.equal(data.num.new(input), expected, input);
  }
  assert.equal(data.i32.new("1.75:f"), 1);
  assert.equal(data.u32.new("-1.75:f"), 0);
  assert.equal(data.f32.new("1.75:i"), 1);
  assert.equal(Object.is(data.num.new("-0"), -0), true);
  assert.equal(Object.is(data.num.new("-0:f"), -0), true);
  assert.equal(Object.is(data.f32.new("-0"), -0), true);
});

test("number parsing rejects invalid bodies and malformed suffixes", () => {
  for (const input of [
    "", " ", ":", ":i", ":f", ":u", "10i", "10f", "10u", "0xffu",
    "12:q", "12:I", "12:i:i", "12:f:u", "12::i", "1_000", "12abc", "0x", "0b2", "0o8",
  ]) {
    assert.throws(() => data.str.__num__(input), SyntaxError, input);
    assert.throws(() => data.num.new(input), SyntaxError, input);
  }
  for (const suffix of ["", ":i", ":f", ":u"]) {
    assert.throws(() => data.num.new(`NaN${suffix}`), SyntaxError);
    for (const body of ["Infinity", "+Infinity", "-Infinity", "1e999"]) {
      assert.throws(() => data.num.new(`${body}${suffix}`), TypeError);
    }
  }
});

test("f32 and integer constructors still clamp and truncate finite values", () => {
  assert.equal(data.f32.new("1.25"), 1.25);
  assert.equal(data.f32.new(0), 0);
  assert.equal(data.f32.new(1e100), 3.4028235e38);
  assert.equal(data.f32.new(-1e100), -3.4028235e38);
  assert.equal(data.i32.new(1.75), 1);
  assert.equal(data.i32.new(-1.75), -1);
  assert.equal(data.i32.new(1e100), 2147483647);
  assert.equal(data.i32.new(-1e100), -2147483648);
  assert.equal(data.u32.new(1.75), 1);
  assert.equal(data.u32.new(-1.75), 0);
  assert.equal(data.u32.new(1e100), 4294967295);
});

test("all vectors reject non-finite scalar, list, and vector components", () => {
  for (const { type } of vectors) {
    for (const value of [NaN, Infinity, -Infinity]) {
      assert.throws(() => type.new(value), TypeError);
      assert.throws(() => type.new([[value]]), TypeError);
      assert.throws(() => type.new({ __type__: data.__vec2i__, x: value, y: 1 }), TypeError);
    }
  }
});

for (const { name, dimension, kind, type, tag } of vectors) {
  const expected = (values) => Object.fromEntries([
    ["__type__", tag], ...axes.slice(0, dimension).map((axis, i) => [axis, values[i] ?? 0]),
  ]);

  test(`${name} matches vec2f construction, padding, trimming, and recursive lists`, () => {
    assert.deepEqual(type.new(), expected([]));
    assert.deepEqual(type.new(5), expected([5]));
    assert.deepEqual(type.new(1, 2, 3, 4, 5), expected([1, 2, 3, 4]));
    assert.deepEqual(type.new([1, [2, [3]], 4]), expected([1, 2, 3, 4]));
    assert.deepEqual(type.new([], [1], [[2, 3]], 4), expected([1, 2, 3, 4]));
    assert.deepEqual(type.new(data.vec2f.new(1, 2), [3, 4]), expected([1, 2, 3, 4]));
    assert.throws(() => type.new("unsupported"), TypeError);
    assert.throws(() => type.new([true]), TypeError);
    assert.throws(() => type.new({ __type__: "__vec2f__", x: {}, y: 2 }), TypeError);
  });

  test(`${name} converts components and exposes public query/assert`, () => {
    const values = { f: [-1.75, 2.75, 3, 4], i: [-1, 2, 3, 4], u: [0, 2, 3, 4] };
    const value = type.new(-1.75, 2.75, 3, 4);
    assert.deepEqual(value, expected(values[kind]));
    assert.equal(type.query(value), true);
    assert.equal(type.query(data.vec2f.new()), name === "vec2f");
    assert.equal(type.query(null), false);
    assert.equal(type.assert(value), value);
    assert.throws(() => type.assert(null), TypeError);
    assert.throws(() => type.query(value, 1), TypeError);
    assert.equal(Object.keys(value).length, dimension + 1);
  });
}

test("flattening uses the supplied constructor throughout nested lists and vectors", () => {
  const { __flat__ } = require(join(buildRoot, "vec.js"));
  for (const dimension of [2, 3, 4]) {
    for (const kind of ["f", "i", "u"]) {
      const input = { __type__: data[`__vec${dimension}${kind}__`] };
      const raw = ["-1.75", "2.75", -1e100, 1e100];
      const values = {
        f: [-1.75, 2.75, -3.4028235e38, 3.4028235e38],
        i: [-1, 2, -2147483648, 2147483647],
        u: [0, 2, 0, 4294967295],
      };
      for (let i = 0; i < dimension; i++) input[axes[i]] = raw[i];
      for (const destination of ["f", "i", "u"]) {
        assert.deepEqual(__flat__([[input]], data[`${destination}32`].new, "test"), values[destination].slice(0, dimension));
      }
    }
  }

  assert.deepEqual(data.vec2f.new({ __type__: data.__vec2u__, x: -10, y: 1e100 }), {
    __type__: data.__vec2f__, x: -10, y: 3.4028235e38,
  });
  assert.deepEqual(data.vec2u.new({ __type__: data.__vec2i__, x: 1e100, y: -10 }), {
    __type__: data.__vec2u__, x: 4294967295, y: 0,
  });
});

for (const source of vectors) {
  for (const target of vectors) {
    test(`${target.name} copies ${source.name} with dimension conversion`, () => {
      const original = source.type.new(1, 2, 3, 4);
      const result = target.type.new(original);
      const expected = { __type__: target.tag };
      for (let i = 0; i < target.dimension; i++) expected[axes[i]] = i < source.dimension ? i + 1 : 0;
      assert.deepEqual(result, expected);
      assert.notEqual(result, original);
      original.x = 99;
      assert.equal(result.x, 1);
    });
  }
}
