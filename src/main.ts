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

  switch (status) {
    case "Supply":
      console.log('Supply');
      break;
    case "Reserve":
      console.log('Reserve');
      break;
    case "Removal":
      console.log('Removal');
      break;
  
    default:
      break;
  }
  console.log(body);
  res.statusCode = 204;
  res.send();
})


app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});