export type Asset =
  | { kind: "image", path: string, id ?: string | undefined }
  | { kind: "audio", path: string, id ?: string | undefined }
  | { kind: "text" , path: string, id ?: string | undefined }
  | { kind: "blob" , path: string, id ?: string | undefined }
  | { kind: "json" , path: string, id ?: string | undefined }

export const Asset = {
  new(kind: Asset["kind"], path: string, id ?: string) {
    return { kind, path, id } satisfies Asset
  },

  load(a: Asset) {
    switch (a.kind) {
      case "image": return Asset.loadImage(a);
      case "audio": return Asset.loadAudio(a);
      case "text":  return Asset.loadText (a);
      case "blob":  return Asset.loadBlob (a);
      case "json":  return Asset.loadJson (a);
    }
  },

  loadImage(a: Asset & { kind: "image" }) {
    return new Promise<HTMLImageElement>((res, rej) => {
      const image = new Image();
      image.onload  = () => res(image);
      image.onerror = () => rej(     );
      image.src     = a.path;
    })
  },

  loadAudio(a: Asset & { kind: "audio" }) {
    return new Promise<HTMLAudioElement>((res, rej) => {
      const audio = new Audio();
      audio.onload  = () => res(audio);
      audio.onerror = () => rej(     );
      audio.src     = a.path;
    })
  },

  async loadText(a: Asset & { kind: "text" }) {
    return fetch(a.path).then(res => res.text());
  },

  async loadBlob(a: Asset & { kind: "blob" }) {
    return fetch(a.path).then(res => res.blob());
  },

  async loadJson(a: Asset & { kind: "json" }) {
    return fetch(a.path).then(res => res.json());
  },

  loadAll(a: Array<Asset>) {
    return Promise.all(a.map(a => Asset.load(a)));
  }
}