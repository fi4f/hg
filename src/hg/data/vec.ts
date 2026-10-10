import { __type__, __num__, __list__, __vec2f__, __vec3f__, __vec4f__, __vec2i__, __vec3i__, __vec4i__, __vec2u__, __vec3u__, __vec4u__ } from "./type";
import { list } from "./list";
import type { num } from "./num";

export function __flat__(a: unknown[], n: (a: unknown) => num, name: string): list {
  const _ = list.new();
  for (const v of a) {
    switch (__type__(v)) {
      case __num__: _.push(n(v)); break;
      case __vec2f__:
      case __vec2i__:
      case __vec2u__: {
        const p = v as { x: unknown; y: unknown };
        _.push(n(p.x), n(p.y));
        break;
      }
      case __vec3f__:
      case __vec3i__:
      case __vec3u__: {
        const p = v as { x: unknown; y: unknown; z: unknown };
        _.push(n(p.x), n(p.y), n(p.z));
        break;
      }
      case __vec4f__:
      case __vec4i__:
      case __vec4u__: {
        const p = v as { x: unknown; y: unknown; z: unknown; w: unknown };
        _.push(n(p.x), n(p.y), n(p.z), n(p.w));
        break;
      }
      case __list__: _.push(...__flat__(v as list, n, name)); break;
      default: throw new TypeError(`[${name}] Cannot coerce value to vector`);
    }
  }
  return _;
}
