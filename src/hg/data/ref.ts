import { __ref__ } from "./type";
import { __type__, Type } from ".";
import type { str } from "./str";

export type ref = {
  __type__: __ref__;
  __uuid__: str;
}

const __table__: { [id: string]: unknown } = {};

function acquire(a: unknown, id ?: str) {
  id ??= unique();
  if (Object.hasOwn(__table__, id))
    throw new Error(`[ref] Reference with id ${id} already exists`);
  __table__[id] = a;
  return id;
}

function resolve(id: str) {
  if (!Object.hasOwn(__table__, id)) 
    throw new Error(`[ref] Reference with id ${id} does not exist`);
  return __table__[id];
}

function release(id: str) {
  if (!Object.hasOwn(__table__, id))
    throw new Error(`[ref] Reference with id ${id} does not exist`);
  delete __table__[id];
}

function unique() {
  let id = crypto.randomUUID();
  while (__table__[id] !== undefined) 
      id = crypto.randomUUID();
  return id;
}

export const ref = Object.assign(Type.new({
  __type__: __ref__,

  new(a: unknown, ..._: unknown[]): ref {
    if (_.length > 0) throw new TypeError("[ref] Expected zero or one argument(s)");
    return { __type__: __ref__, __uuid__: acquire(a) };
  },

  query (a: unknown, ..._: unknown[]): a is ref {
    if (_.length > 0) throw new TypeError("[ref?] Expected zero or one argument(s)");
    return __type__(a) === __ref__;
  },

  assert(a: unknown): ref {
    if (!ref.query(a)) throw new TypeError(`[:ref] Expected ref, got ${a}`);
    return a;
  },

}), {
  resolve(a: ref) {
    return resolve(ref.assert(a).__uuid__);
  },

  release(a: ref) {
    release(ref.assert(a).__uuid__);
  },
});
