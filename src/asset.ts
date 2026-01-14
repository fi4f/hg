import { Id } from "./id.js"

declare const __kind__: unique symbol

export type Asset =
  | { kind: "image", where: string, id ?: Id<HTMLImageElement> }
  | { kind: "audio", where: string, id ?: Id<HTMLAudioElement> }
  | { kind: "text" , where: string, id ?: Id<string> }
  | { kind: "blob" , where: string, id ?: Id<Blob  > }
  | { kind: "json" , where: string, id ?: Id<any   > }

export const Asset = {
  load(a: Asset, from: Id.Table = Id.Table.__default__) {
    switch (a.kind) {
      case "image": return Asset.loadImage(a, from);
      case "audio": return Asset.loadAudio(a, from);
      case "text":  return Asset.loadText (a, from);
      case "blob":  return Asset.loadBlob (a, from);
      case "json":  return Asset.loadJson (a, from);
    }
  },

  loadImage(a: Asset & { kind: "image" }, from: Id.Table = Id.Table.__default__) {
    return new Promise<Id<HTMLImageElement>>((res, rej) => {
      const image = new Image();
      image.onload  = () => res(Id.Table.acquire(from, image, a.id));
      image.onerror = () => rej(new Error(`[Asset.loadImage] Failed to load image from '${a.where}'.`));
      image.src     = a.where;
    })
  },

  loadAudio(a: Asset & { kind: "audio" }, from: Id.Table = Id.Table.__default__) {
    return new Promise<Id<HTMLAudioElement>>((res, rej) => {
      const audio = new Audio();
      audio.onload  = () => res(Id.Table.acquire(from, audio, a.id));
      audio.onerror = () => rej(new Error(`[Asset.loadAudio] Failed to load audio from '${a.where}'.`));
      audio.src     = a.where;
    })
  },

  async loadText(a: Asset & { kind: "text" }, from: Id.Table = Id.Table.__default__) {
    return fetch(a.where).then(res => res.text()).then(text => Id.Table.acquire(from, text, a.id));
  },

  async loadBlob(a: Asset & { kind: "blob" }, from: Id.Table = Id.Table.__default__) {
    return fetch(a.where).then(res => res.blob()).then(blob => Id.Table.acquire(from, blob, a.id));
  },

  async loadJson(a: Asset & { kind: "json" }, from: Id.Table = Id.Table.__default__) {
    return fetch(a.where).then(res => res.json()).then(json => Id.Table.acquire(from, json, a.id));
  },

  loadAll(a: Array<Asset>, from: Id.Table = Id.Table.__default__) {
    return Promise.all(a.map(a => Asset.load(a, from)));
  }
}