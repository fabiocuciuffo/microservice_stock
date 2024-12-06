var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var fetch_exports = {};
__export(fetch_exports, {
  default: () => fetch_default
});
module.exports = __toCommonJS(fetch_exports);
class FetchApi {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
  async fetchEndpoint(endpoint, options) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Error fetching ${url}: ${response.statusText}`);
    }
    return response.json();
  }
}
var fetch_default = FetchApi;
