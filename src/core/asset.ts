export const IMAGE = "image" as const;
export const AUDIO = "audio" as const;
export const TEXT  = "text"  as const;
export const BLOB  = "blob"  as const;
export const JSON  = "json"  as const;

export type IMAGE = typeof IMAGE;
export type AUDIO = typeof AUDIO;
export type TEXT  = typeof TEXT ;
export type BLOB  = typeof BLOB ;
export type JSON  = typeof JSON ;

export type Kind = IMAGE | AUDIO | TEXT | BLOB | JSON;

export type Asset<T extends Kind> = { kind: T, path: string, id ?: string | undefined }

export namespace Asset {
  export type Image = Asset<IMAGE>
  export type Audio = Asset<AUDIO>
  export type Text  = Asset<TEXT >
  export type Blob  = Asset<BLOB >
  export type Json  = Asset<JSON >
}

export type Bundle = Array<Asset<any>>

export type Cache = {
  images: { [id: string]: HTMLImageElement }
  audios: { [id: string]: HTMLAudioElement }
  texts:  { [id: string]: string           }
  blobs:  { [id: string]: globalThis.Blob  }
  jsons:  { [id: string]: any              }
}

let CACHE: Cache;

export const Asset = {
  getCache() {
    return CACHE ??= Cache.new()
  },

  new<T extends Kind>(kind: T, path: string, id ?: string) {
    return { kind, path, id } satisfies Asset<T>
  },

  Image(path: string, id ?: string) {
    return Asset.new(IMAGE, path, id) satisfies Asset.Image
  },

  Audio(path: string, id ?: string) {
    return Asset.new(AUDIO, path, id) satisfies Asset.Audio
  },

  Text(path: string, id ?: string) {
    return Asset.new(TEXT, path, id) satisfies Asset.Text
  },

  Blob(path: string, id ?: string) {
    return Asset.new(BLOB, path, id) satisfies Asset.Blob
  },

  Json(path: string, id ?: string) {
    return Asset.new(JSON, path, id) satisfies Asset.Json
  },

  load(a: Asset<any>) {
    switch (a.kind) {
      case IMAGE: return Asset.loadImage(a);
      case AUDIO: return Asset.loadAudio(a);
      case TEXT:  return Asset.loadText (a);
      case BLOB:  return Asset.loadBlob (a);
      case JSON:  return Asset.loadJson (a);
      default: throw `[Asset.load]: Unknown kind of asset '${a.kind}'`;
    }
  },

  loadImage(a: Asset.Image) {
    return new Promise<HTMLImageElement>((res, rej) => {
      const image = new Image();
      image.onload  = () => res(image);
      image.onerror = () => rej(     );
      image.src     = a.path;
    })
  },

  loadAudio(a: Asset.Audio) {
    return new Promise<HTMLAudioElement>((res, rej) => {
      const audio = new Audio();
      audio.onload  = () => res(audio);
      audio.onerror = () => rej(     );
      audio.src     = a.path;
    })
  },

  async loadText(a: Asset.Text) {
    return fetch(a.path).then(res => res.text())
  },

  async loadBlob(a: Asset.Blob) {
    return fetch(a.path).then(res => res.blob())
  },

  async loadJson(a: Asset.Json) {
    return fetch(a.path).then(res => res.json())
  }
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
    return cache.images[id];
  },

  getAudio(cache: Cache, id: string) {
    if (!(id in cache.audios))
      throw `[Cache.getAudio]: Audio with id '${id}' does not exist`;
    return cache.audios[id];
  },

  getText(cache: Cache, id: string) {
    if (!(id in cache.texts))
      throw `[Cache.getText]: Text with id '${id}' does not exist`;
    return cache.texts[id];
  },

  getBlob(cache: Cache, id: string) {
    if (!(id in cache.blobs))
      throw `[Cache.getBlob]: Blob with id '${id}' does not exist`;
    return cache.blobs[id];
  },

  getJson(cache: Cache, id: string) {
    if(!(id in cache.jsons))
      throw `[Cache.getJson]: Json with id '${id}' does not exist`;
    return cache.jsons[id];
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

  load(cache: Cache, a: Asset<any>) {
    switch (a.kind) {
      case IMAGE: return Cache.loadImage(cache, a);
      case AUDIO: return Cache.loadAudio(cache, a);
      case TEXT:  return Cache.loadText (cache, a);
      case BLOB:  return Cache.loadBlob (cache, a);
      case JSON:  return Cache.loadJson (cache, a);
      default: throw `[Cache.load]: Unknown kind of asset '${a.kind}'`;
    }
  },

  async loadImage(cache: Cache, a: Asset.Image) {
    const id = a.id ?? uniqueId(cache.images);
    Cache.putImage(cache, id, await Asset.loadImage(a));
    return id;
  },

  async loadAudio(cache: Cache, a: Asset.Audio) {
    const id = a.id ?? uniqueId(cache.audios);
    Cache.putAudio(cache, id, await Asset.loadAudio(a));
    return id;
  },

  async loadText(cache: Cache, a: Asset.Text) {
    const id = a.id ?? uniqueId(cache.texts );
    Cache.putText(cache, id, await Asset.loadText(a));
    return id;
  },

  async loadBlob(cache: Cache, a: Asset.Blob) {
    const id = a.id ?? uniqueId(cache.blobs );
    Cache.putBlob(cache, id, await Asset.loadBlob(a));
    return id;
  },

  async loadJson(cache: Cache, a: Asset.Json) {
    const id = a.id ?? uniqueId(cache.jsons );
    Cache.putJson(cache, id, await Asset.loadJson(a));
    return id;
  },

  async loadAll(cache: Cache, a: Array<Asset<any>>) {
    return Promise.all(a.map(a => Cache.load(cache, a)));
  }
}

function uniqueId(ids: {[id: string]: any}) {
  let id = crypto.randomUUID();
  while (id in ids)
      id = crypto.randomUUID();
  return id;
}