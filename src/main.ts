import express from 'express';
import bodyParser from 'body-parser';

const data = [
  {
    productId: "1",
    quantity: 50,
  },
  {
    productId: "2",
    quantity: 10,
  },
  {
    productId: "3",
    quantity: 20,
  }
]

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
app.use(bodyParser);

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.get('/api/ping', (req, res) => {
  res.send({ message: 'pong' });
})

app.post('/api/stock/:productId/movement', (req, res) => {
  const pId = req.params.productId;
  const body = req.body;
  console.log(body);
  res.statusCode = 204;
})


app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
