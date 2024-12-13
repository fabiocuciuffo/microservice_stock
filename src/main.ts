import express from 'express';
import FetchApi from './utils/fetch';

const STOCK = [
  {
    productId: '63f8be39e00cccf1085b6134',
    quantity: 10
  },
  {
    productId: '65e088ddd48b38df965a0e8f',
    quantity: 5

  },
  {
    productId: '65e08df2d48b38df965a0eaa',
    quantity: 3
  }
]

const RESERVED_STOCK = [];
const SUPPLY_NEEDED = []

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.get('/api/ping', (req, res) => {
  res.send({ message: 'pong' });
})

app.post('/api/stock/:productId/movement', async (req, res) => {
  const catalogueApi = new FetchApi('http://microservices.tp.rjqu8633.odns.fr/api');
  const pId = req.params.productId;
  console.log(pId);
  let isProductExist;
  try {
    isProductExist = await catalogueApi.fetchEndpoint(`/products/${pId}`) ? true : false;
  } catch (error) {
    isProductExist = false;
  }

  if(!isProductExist){
    res.statusCode = 404;
    res.send({message: 'Product not found'});
    return;
  }
  const body = req.body;
  const quantity = body.quantity;
  const status = body.status;
  console.log(body, quantity, status);

  switch (status) {
    case "Supply":
      console.log('Supply');
      console.log(req);
      const productExistsInStock = STOCK.find((p) => p.productId === pId);
      if (!productExistsInStock) {
        STOCK.push({
          productId: pId,
          quantity: quantity
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
      console.log('Reserve');
      let finded = false;
      STOCK.map((product) => {
        if(product.productId === pId && product.quantity > 0){
          const isPossible = product.quantity >= quantity;
          if(!isPossible){
            res.statusCode = 400;
            res.send();
          }
          finded = true;
          product.quantity -= quantity;
          if(product.quantity === 0){
            fetch('https://microservice-appro.vercel.app/api/supply-needed', {body: pId, method: 'POST'
            });
          }
          const exist = RESERVED_STOCK.findIndex((p) => p.productId === pId);
          if(exist !== -1){
            RESERVED_STOCK.map((p) => {
              if(p.productId === pId){
                p.quantity += quantity;
              }
            })
          } else {
            RESERVED_STOCK.push(
              {
                productId: pId,
                quantity: quantity
              }
            )
          }
        }
      })
      if(!finded){
        res.statusCode = 400;
        res.send();
      }
      break;
    case "Removal":
      RESERVED_STOCK.map((p) => {
        if (p.productId === pId) {
          const isPossible = p.quantity >= quantity;
          if(!isPossible){
            res.statusCode = 400;
            res.send();
          }
          p.quantity -= quantity;
          if (p.quantity <= 0) {
            const index = RESERVED_STOCK.findIndex((item) => item.productId === pId);
            RESERVED_STOCK.splice(index, 1);
          }
        }
      });
      break;
  
    default:
      break;
  }

  console.log(STOCK);
  console.log(RESERVED_STOCK);
  res.statusCode = 204;
  res.send();
})

app.get('/api/stock', (req, res) => {
  const stockNotNull = STOCK.filter(item => item.quantity > 0)
  try {
    return res.status(200).json(stockNotNull)
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur lors de la récupération des données du stock',
      error: error.message,
    })
  }
})

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});