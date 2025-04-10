// import express from 'express';
// import cors from 'cors';
// import * as dotenv from 'dotenv';
// import config from './config/defaults';

// // import {depositRouter} from './routes/deposit.router';
// import { fetchRouter } from './routes/get.routes';
// // import { orderRouter } from './routes/order.routes';
// // import path from 'path';

// const app = express();
// dotenv.config();
// const PORT = config.port || process.env.PORT;

// app.set('trust proxy', true);
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('src/public'))

// // app.use('/deposit', depositRouter);
// app.use('/fetch',fetchRouter);
// // app.use('/order', orderRouter);

// app.listen(PORT, () => {
//   console.log(`⚙️ BitzUp: server is running on port ${config.BASE_URL}`);
// });