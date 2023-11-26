import express from 'express';
import cors from 'cors';
import router from './routes/ServiceRouter.js';
const app = express();

//**************middlewares start
app.use(express.json());
app.use(cors());

app.use('/services', router);
//***********middlewares end

const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
  res.send(`<h2>INFRA/h2>`);
});

app.listen(PORT, () => {
  console.log(`server started successfully on PORT:${PORT}`);
});

//main starting
