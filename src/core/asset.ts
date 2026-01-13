import { Id } from "./id.js"

declare const __kind__: unique symbol

export type Asset =
  | { kind: "image", path: string, id: string | undefined }
  | { kind: "audio", path: string, id: string | undefined }
  | { kind: "text" , path: string, id: string | undefined }
  | { kind: "blob" , path: string, id: string | undefined }
  | { kind: "json" , path: string, id: string | undefined }

export const Asset = {
  load(a: Asset, use ?: Id.Table) {
    switch (a.kind) {
      case "image": return Asset.loadImage(a, use);
      case "audio": return Asset.loadAudio(a, use);
      case "text":  return Asset.loadText (a, use);
      case "blob":  return Asset.loadBlob (a, use);
      case "json":  return Asset.loadJson (a, use);
    }
  },

  loadImage(a: Asset & { kind: "image" }, use ?: Id.Table) {
    return new Promise<Id<HTMLImageElement>>((res, rej) => {
      const image = new Image();
      image.onload  = () => res(Id.acquire(image, a.id, use));
      image.onerror = () => rej(                              );
      image.src     = a.path;
    })
  },

  loadAudio(a: Asset & { kind: "audio" }, use ?: Id.Table) {
    return new Promise<Id<HTMLAudioElement>>((res, rej) => {
      const audio = new Audio();
      audio.onload  = () => res(Id.acquire(audio, a.id, use));
      audio.onerror = () => rej(                              );
      audio.src     = a.path;
    })
  },

  async loadText(a: Asset & { kind: "text" }, use ?: Id.Table) {
    return fetch(a.path).then(res => res.text()).then(text => Id.acquire(text, a.id, use));
  },

  async loadBlob(a: Asset & { kind: "blob" }, use ?: Id.Table) {
    return fetch(a.path).then(res => res.blob()).then(blob => Id.acquire(blob, a.id, use));
  },

  async loadJson(a: Asset & { kind: "json" }, use ?: Id.Table) {
    return fetch(a.path).then(res => res.json()).then(json => Id.acquire(json, a.id, use));
  },

  loadAll(a: Array<Asset>, use ?: Id.Table) {
    return Promise.all(a.map(a => Asset.load(a, use)));
  }
}