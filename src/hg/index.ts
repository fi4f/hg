import * as data from "./data";
import { App } from "./app";
import { Events } from "./core/events";


export * from "./data";
export * from "./app";
export * from "./core/events";

export const hg = { ...data, App, Events };
