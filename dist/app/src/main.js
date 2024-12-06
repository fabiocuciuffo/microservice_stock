var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_express = __toESM(require("express"));
var import_fetch = __toESM(require("./utils/fetch"));
const STOCK = [
  {
    productId: "63f8be39e00cccf1085b6134",
    quantity: 10
  },
  {
    productId: "65e088ddd48b38df965a0e8f",
    quantity: 5
  },
  {
    productId: "65e08df2d48b38df965a0eaa",
    quantity: 3
  }
];
const RESERVED_STOCK = [];
const host = process.env.HOST ?? "localhost";
const port = process.env.PORT ? Number(process.env.PORT) : 3e3;
const app = (0, import_express.default)();
app.use(import_express.default.json());
app.get("/", (req, res) => {
  res.send({ message: "Hello API" });
});
app.get("/api/ping", (req, res) => {
  res.send({ message: "pong" });
});
app.post("/api/stock/:productId/movement", async (req, res) => {
  const catalogueApi = new import_fetch.default("http://microservices.tp.rjqu8633.odns.fr/api");
  const pId = req.params.productId;
  let isProductExist;
  try {
    isProductExist = await catalogueApi.fetchEndpoint(`/products/${pId}`) ? true : false;
  } catch (error) {
    isProductExist = false;
  }
  if (!isProductExist) {
    res.statusCode = 404;
    res.send({ message: "Product not found" });
    return;
  }
  const body = req.body;
  const quantity = body.quantity;
  const status = body.status;
  switch (status) {
    case "Supply":
      console.log("Supply");
      break;
    case "Reserve":
      console.log("Reserve");
      break;
    case "Removal":
      console.log("Removal");
      break;
    default:
      break;
  }
  console.log(body);
  res.statusCode = 204;
  res.send();
});
app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
