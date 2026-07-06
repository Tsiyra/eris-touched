import { APP_VERSION } from "./version.js";

export function logModuleLoad() {
  console.info(`Eris-Touched module entry loaded (${APP_VERSION}).`);
}
