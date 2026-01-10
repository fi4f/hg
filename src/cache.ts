import { Asset } from "./asset.js"

export type Cache = {
  images: { [id: string]: HTMLImageElement }
  audios: { [id: string]: HTMLAudioElement }
  texts:  { [id: string]: string           }
  blobs:  { [id: string]: Blob             }
  jsons:  { [id: string]: any              }
}

export const Cache = {
  new() {
    return {
      images: {},
      audios: {},
      texts:  {},
      blobs:  {},
      jsons:  {},
    } satisfies Cache
  },

  getImage(cache: Cache, id: string) {
    if (!(id in cache.images))
      throw `[Cache.getImage]: Image with id '${id}' does not exist`;
    return cache.images[id]!;
  },

  getAudio(cache: Cache, id: string) {
    if (!(id in cache.audios))
      throw `[Cache.getAudio]: Audio with id '${id}' does not exist`;
    return cache.audios[id]!;
  },

  getText(cache: Cache, id: string) {
    if (!(id in cache.texts))
      throw `[Cache.getText]: Text with id '${id}' does not exist`;
    return cache.texts[id]!;
  },

  getBlob(cache: Cache, id: string) {
    if (!(id in cache.blobs))
      throw `[Cache.getBlob]: Blob with id '${id}' does not exist`;
    return cache.blobs[id]!;
  },

  getJson(cache: Cache, id: string) {
    if(!(id in cache.jsons))
      throw `[Cache.getJson]: Json with id '${id}' does not exist`;
    return cache.jsons[id]!;
  },

  putImage(cache: Cache, id: string, image: HTMLImageElement) {
    if (id in cache.images)
      console.warn(`[Cache.putImage]: Image with id '${id}' already exists`);
    return cache.images[id] = image;
  },

  putAudio(cache: Cache, id: string, audio: HTMLAudioElement) {
    if (id in cache.audios)
      console.warn(`[Cache.putAudio]: Audio with id '${id}' already exists`);
    return cache.audios[id] = audio;
  },

  putText(cache: Cache, id: string, text: string) {
    if (id in cache.texts)
      console.warn(`[Cache.putText]: Text with id '${id}' already exists`);
    return cache.texts[id] = text;
  },

  putBlob(cache: Cache, id: string, blob: Blob) {
    if (id in cache.blobs)
      console.warn(`[Cache.putBlob]: Blob with id '${id}' already exists`);
    return cache.blobs[id] = blob;
  },

  putJson(cache: Cache, id: string, json: any) {
    if (id in cache.jsons)
      console.warn(`[Cache.putJson]: Json with id '${id}' already exists`);
    return cache.jsons[id] = json;
  },

  freeImage(cache: Cache, id: string) {
    delete cache.images[id];
  },

  freeAudio(cache: Cache, id: string) {
    delete cache.audios[id];
  },

  freeText(cache: Cache, id: string) {
    delete cache.texts[id];
  },

  freeBlob(cache: Cache, id: string) {
    delete cache.blobs[id];
  },

  freeJson(cache: Cache, id: string) {
    delete cache.jsons[id];
  },

  freeAll(cache: Cache) {
    cache.images = {};
    cache.audios = {};
    cache.texts  = {};
    cache.blobs  = {};
    cache.jsons  = {};
  },

  load(cache: Cache, a: Asset) {
    switch (a.kind) {
      case "image": return Cache.loadImage(cache, a);
      case "audio": return Cache.loadAudio(cache, a);
      case "text" : return Cache.loadText (cache, a);
      case "blob" : return Cache.loadBlob (cache, a);
      case "json" : return Cache.loadJson (cache, a);
    }
  },

  async loadImage(cache: Cache, a: Asset & { kind: "image" }) {
    const id = a.id ?? uniqueId(cache.images);
    Cache.putImage(cache, id, await Asset.loadImage(a));
    return id;
  },

  async loadAudio(cache: Cache, a: Asset & { kind: "audio" }) {
    const id = a.id ?? uniqueId(cache.audios);
    Cache.putAudio(cache, id, await Asset.loadAudio(a));
    return id;
  },

  async loadText(cache: Cache, a: Asset & { kind: "text" }) {
    const id = a.id ?? uniqueId(cache.texts );
    Cache.putText(cache, id, await Asset.loadText(a));
    return id;
  },

  async loadBlob(cache: Cache, a: Asset & { kind: "blob" }) {
    const id = a.id ?? uniqueId(cache.blobs );
    Cache.putBlob(cache, id, await Asset.loadBlob(a));
    return id;
  },

  async loadJson(cache: Cache, a: Asset & { kind: "json" }) {
    const id = a.id ?? uniqueId(cache.jsons );
    Cache.putJson(cache, id, await Asset.loadJson(a));
    return id;
  },

  async loadAll(cache: Cache, a: Array<Asset>) {
    return Promise.all(a.map(a => Cache.load(cache, a)));
  }
}

function uniqueId(ids: {[id: string]: any}) {
  let id = crypto.randomUUID();
  while (id in ids)
      id = crypto.randomUUID();
  return id;
}

