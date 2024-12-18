import express, { Express } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import config from './config/defaults';

import {userRouter} from './routes/onboarding.routes';
import { currecyRouter } from './routes/currency.routes';
import { userWalletRouter } from './routes/user.wallet.routes';
// import path from 'path';

const app: Express = express();
dotenv.config();
const PORT = config.port || process.env.PORT;

app.set('trust proxy', true);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('src/public'))

app.use('/user', userRouter);
app.use('/currency', currecyRouter);
app.use('/wallet', userWalletRouter);

app.listen(PORT, () => {
  console.log(`⚙️ BitzUp: server is running on port ${config.BASE_URL}`);
});