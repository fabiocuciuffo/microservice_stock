import express from 'express';
import FetchApi from './utils/fetch';

const data = [
  {
    _id: '63f8be39e00cccf1085b6134',
    ean: '57890',
    name: 'Papaye',
    categories: [ 'game' ],
    description: 'À récolter avec une fou-fourche',
    __v: 0,
    price: 15
  },
  {
    _id: '65e088ddd48b38df965a0e8f',
    ean: 'string',
    name: 'string',
    categories: [ 'string' ],
    description: 'string',
    price: 0,
    __v: 0
  },
  {
    _id: '65e08df2d48b38df965a0eaa',
    ean: 'string',
    name: 'string',
    categories: [ 'string' ],
    description: 'string',
    price: 0,
    __v: 0
  }
]

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.get('/api/ping', (req, res) => {
  res.send({ message: 'pong' });
})

app.post('/api/stock/:productId/movement', async (req, res) => {
  const catalogueApi = new FetchApi('http://microservices.tp.rjqu8633.odns.fr/api');
  const pId = req.params.productId;
  const body = req.body;
  console.log(body);
  console.log(await catalogueApi.fetchEndpoint(`/products/${pId}`));
  res.statusCode = 204;
  res.send();
})


app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});