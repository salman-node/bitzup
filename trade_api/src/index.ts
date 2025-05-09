import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/router';
import config from './config/defaults';

const app = express();
dotenv.config();

app.set('trust proxy', true);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/user', router);

const port = config.port

app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});