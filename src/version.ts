export type Version = {
  readonly moniker: string;
  readonly major  : number;
  readonly minor  : number;
  readonly patch  : number;
}

export const Version = {
  new(o ?: {
    moniker ?: string,
    major   ?: number,
    minor   ?: number,
    patch   ?: number,
  }) {
    return {
      moniker: o?.moniker ?? "hg",
      major  : o?.major   ?? 0,
      minor  : o?.minor   ?? 0,
      patch  : o?.patch   ?? 0,
    } satisfies Version;
  },

  toString(a: Version) {
    return `${a.moniker} ${a.major}.${a.minor}.${a.patch}`;
  }
}