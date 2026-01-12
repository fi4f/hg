import { Id, type __kind__ } from "./id.js"

export type Asset =
  | { kind: "image", path: string, id: string | undefined }
  | { kind: "audio", path: string, id: string | undefined }
  | { kind: "text" , path: string, id: string | undefined }
  | { kind: "blob" , path: string, id: string | undefined }
  | { kind: "json" , path: string, id: string | undefined }

export const Asset = {
  load(a: Asset, where ?: Id.Table) {
    switch (a.kind) {
      case "image": return Asset.loadImage(a, where);
      case "audio": return Asset.loadAudio(a, where);
      case "text":  return Asset.loadText (a, where);
      case "blob":  return Asset.loadBlob (a, where);
      case "json":  return Asset.loadJson (a, where);
    }
  },

  loadImage(a: Asset & { kind: "image" }, where ?: Id.Table) {
    return new Promise<Id<HTMLImageElement>>((res, rej) => {
      const image = new Image();
      image.onload  = () => res(Id.acquire(image, a.id, where));
      image.onerror = () => rej(                              );
      image.src     = a.path;
    })
  },

  loadAudio(a: Asset & { kind: "audio" }, where ?: Id.Table) {
    return new Promise<Id<HTMLAudioElement>>((res, rej) => {
      const audio = new Audio();
      audio.onload  = () => res(Id.acquire(audio, a.id, where));
      audio.onerror = () => rej(                              );
      audio.src     = a.path;
    })
  },

  async loadText(a: Asset & { kind: "text" }, where ?: Id.Table) {
    return fetch(a.path).then(res => res.text()).then(text => Id.acquire(text, a.id, where));
  },

  async loadBlob(a: Asset & { kind: "blob" }, where ?: Id.Table) {
    return fetch(a.path).then(res => res.blob()).then(blob => Id.acquire(blob, a.id, where));
  },

  async loadJson(a: Asset & { kind: "json" }, where ?: Id.Table) {
    return fetch(a.path).then(res => res.json()).then(json => Id.acquire(json, a.id, where));
  },

  loadAll(a: Array<Asset>, where ?: Id.Table) {
    return Promise.all(a.map(a => Asset.load(a, where)));
  }
}