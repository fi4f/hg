export type Asset<T extends Asset.Kind> = { kind: T, path: string, id ?: string | undefined }

export namespace Asset {
  export type IMAGE = typeof IMAGE;
  export type AUDIO = typeof AUDIO;
  export type TEXT  = typeof TEXT ;
  export type BLOB  = typeof BLOB ;
  export type JSON  = typeof JSON ;

  export type Kind =
    | Asset.IMAGE
    | Asset.AUDIO
    | Asset.TEXT
    | Asset.BLOB
    | Asset.JSON

  export type Image  = Asset<IMAGE>
  export type Audio  = Asset<AUDIO>
  export type Text   = Asset<TEXT >
  export type Blob   = Asset<BLOB >
  export type Json   = Asset<JSON >
  export type Bundle = Array<Asset<any>>
}

const IMAGE = "image" as const;
const AUDIO = "audio" as const;
const TEXT  = "text"  as const;
const BLOB  = "blob"  as const;
const JSON  = "json"  as const;

export const Asset = {
  IMAGE, AUDIO, TEXT, BLOB, JSON,

  new<T extends Asset.Kind>(kind: T, path: string, id ?: string) {
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
  
  Bundle(...a: Array<Asset<any>>) {
    return a satisfies Asset.Bundle
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
  },

  loadAll(a: Array<Asset<any>>) {
    return Promise.all(a.map(a => Asset.load(a)));
  }
}