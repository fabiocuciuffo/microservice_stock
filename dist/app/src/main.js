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
const SUPPLY_NEEDED = [];
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
      const productExistsInStock = STOCK.find((p) => p.productId === pId);
      if (!productExistsInStock) {
        STOCK.push({
          productId: pId,
          quantity
        });
      } else {
        STOCK.map((p) => {
          if (p.productId === pId) {
            p.quantity += quantity;
          }
        });
      }
      break;
    case "Reserve":
      console.log("Reserve");
      let finded = false;
      STOCK.map((product) => {
        if (product.productId === pId && product.quantity > 0) {
          const isPossible = product.quantity >= quantity;
          if (!isPossible) {
            res.statusCode = 400;
            res.send();
          }
          finded = true;
          product.quantity -= quantity;
          const exist = RESERVED_STOCK.findIndex((p) => p.productId === pId);
          if (exist !== -1) {
            RESERVED_STOCK.map((p) => {
              if (p.productId === pId) {
                p.quantity += quantity;
              }
            });
          } else {
            RESERVED_STOCK.push(
              {
                productId: pId,
                quantity
              }
            );
          }
        }
      });
      await supplyNeeded();
      if (!finded) {
        res.statusCode = 400;
        res.send();
      }
      break;
    case "Removal":
      STOCK.map((p) => {
        if (p.productId === pId) {
          const isPossible = p.quantity >= quantity;
          if (!isPossible) {
            res.statusCode = 400;
            res.send();
          }
          p.quantity -= quantity;
          if (p.quantity <= 0) {
            const index = STOCK.findIndex((item) => item.productId === pId);
            STOCK.splice(index, 1);
          }
        }
      });
      await supplyNeeded();
      break;
    default:
      break;
  }
  console.log(STOCK);
  console.log(RESERVED_STOCK);
  res.statusCode = 204;
  res.send();
});
app.get("/api/stock", (req, res) => {
  const stockNotNull = STOCK.filter((item) => item.quantity > 0);
  try {
    return res.status(200).json(stockNotNull);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la r\xE9cup\xE9ration des donn\xE9es du stock",
      error: error.message
    });
  }
});
async function supplyNeeded() {
  STOCK.forEach((product) => {
    if (product.quantity <= 0 && !SUPPLY_NEEDED.find((e) => e.productId === product.productId)) {
      SUPPLY_NEEDED.push(product.productId);
    }
  });
  if (SUPPLY_NEEDED.length > 0) {
    try {
      await fetch("http://localhost:3000/api/supply-needed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(SUPPLY_NEEDED)
      });
    } catch (error) {
      console.error("Erreur lors de la notification", error.message);
    }
  }
}
app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
