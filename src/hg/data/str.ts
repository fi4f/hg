export type str = string

export const str = {
  // (str a)
  new(a: unknown = ""): str {
    try {
      return typeof a === "string"
        ?        a  as str
        : String(a) as str;
    } catch (e) {
      throw new TypeError(`[str.new] Cannot coerce ${a} to str`);
    }
  },

  // (str? a)
  maybe(a: unknown): a is str {
    return typeof a === "string";
  },

  // a:str
  assert(a: unknown): str {
    if (!str.maybe(a)) throw new TypeError(`[str.assert] Expected str, got ${a}`);
    return a;
  }
}