import { Asset } from "./asset.js";
import { Cache } from "./cache.js";

const CACHE = Cache.new();

export function load(a: Asset) {
  return Cache.load(CACHE, a);
}

export function loadImage(a: Asset & { kind: "image" }) {
  return Cache.loadImage(CACHE, a);
}

export function loadAudio(a: Asset & { kind: "audio" }) {
  return Cache.loadAudio(CACHE, a);
}

export function loadText(a: Asset & { kind: "text" }) {
  return Cache.loadText(CACHE, a);
}

export function loadBlob(a: Asset & { kind: "blob" }) {
  return Cache.loadBlob(CACHE, a);
}

export function loadJson(a: Asset & { kind: "json" }) {
  return Cache.loadJson(CACHE, a);
}

export function loadAll(a: Array<Asset>) {
  return Cache.loadAll(CACHE, a);
}

export function getImage(id: string) {
  return Cache.getImage(CACHE, id);
}

export function getAudio(id: string) {
  return Cache.getAudio(CACHE, id);
}

export function getText(id: string) {
  return Cache.getText(CACHE, id);
}

export function getBlob(id: string) {
  return Cache.getBlob(CACHE, id);
}

export function getJson(id: string) {
  return Cache.getJson(CACHE, id);
}