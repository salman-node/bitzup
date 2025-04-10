const express = require('express');
const app = express();
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const rateLimit = require('express-rate-limit');
const cors = require('cors');



app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200,
}));


const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 50*2, // limit each IP to 100 requests per windowMs
  handler: (req, res, next) => {
    res.status(429).send('You have exceeded the rate limit!');
  },
  message: 'You have exceeded the rate limit!',
  headers: {
    'Retry-After': 60, // 1 minute
  },
});

// Apply the rate limiter to all routes
app.use(limiter);

// Create an Express route to retrieve market data
app.get('/marketData',limiter, async (req, res) => {
  try {
    // Query the database to retrieve 
    const result = await prisma.$queryRaw`
  SELECT 
    cp.pair_id,
    cp.base_asset_id,
    cp.quantity_decimal,
    cp.price_decimal,
    cp.quote_asset_id,
    cp.pair_symbol,
    cp.current_price,
    cp.popular,
    cp.change_in_price,
    c1.symbol AS base_asset_symbol,
    c2.symbol AS quote_asset_symbol
  FROM 
    crypto_pair cp
  INNER JOIN 
    currencies c1 ON cp.base_asset_id = c1.currency_id
  INNER JOIN 
    currencies c2 ON cp.quote_asset_id = c2.currency_id 
  WHERE 
    cp.status = 'ZERO' AND cp.pair_symbol NOT LIKE '%INR%'
`;

    const updatedPrice = result.map((currency) => ({ ...currency, favourite: 0 }))

    return res.send(updatedPrice);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
});

app.get('/topGainers',limiter,async (req, res) => {
  console.log('topGainers')
  try {
    // Query the database to retrieve 
    const topGainers = await prisma.$queryRaw`
    SELECT 
      cp.pair_id,
      cp.base_asset_id,
      cp.quantity_decimal,
      cp.price_decimal,
      cp.quote_asset_id,
      cp.pair_symbol,
      cp.current_price,
      cp.popular,
      cp.change_in_price,
      c1.symbol AS base_asset_symbol,
      c2.symbol AS quote_asset_symbol
    FROM 
      crypto_pair cp
    INNER JOIN 
      currencies c1 ON cp.base_asset_id = c1.currency_id
    INNER JOIN 
      currencies c2 ON cp.quote_asset_id = c2.currency_id
    WHERE 
      cp.status = 'ZERO' AND cp.pair_symbol NOT LIKE '%INR%'
    ORDER BY 
      cp.change_in_price DESC
    LIMIT 10
  `;

    return res.send(topGainers);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
});

app.get('/topLosers',limiter,async (req, res) => {
  try {
    // Query the database to retrieve 
    const topLosers = await prisma.$queryRaw`
  SELECT 
    cp.pair_id,
    cp.base_asset_id,
    cp.quantity_decimal,
    cp.price_decimal,
    cp.quote_asset_id,
    cp.pair_symbol,
    cp.current_price,
    cp.popular,
    cp.change_in_price,
    c1.symbol AS base_asset_symbol,
    c2.symbol AS quote_asset_symbol
  FROM 
    crypto_pair cp
  INNER JOIN 
    currencies c1 ON cp.base_asset_id = c1.currency_id
  INNER JOIN 
    currencies c2 ON cp.quote_asset_id = c2.currency_id
  WHERE 
    cp.status = 'ZERO' AND cp.pair_symbol NOT LIKE '%INR%'
  ORDER BY 
    cp.change_in_price ASC
  LIMIT 10
`;

    return res.send(topLosers);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
});

app.get('/hotCurrencies',limiter,async (req, res) => {
  try {
    //Query the database to retrieve 
    const topLosers = await prisma.$queryRaw`
    SELECT 
      cp.pair_id,
      cp.base_asset_id,
      cp.quantity_decimal,
      cp.price_decimal,
      cp.quote_asset_id,
      cp.pair_symbol,
      cp.current_price,
      cp.popular,
      cp.change_in_price,
      c1.symbol AS base_asset_symbol,
      c2.symbol AS quote_asset_symbol
    FROM 
      crypto_pair cp
    INNER JOIN 
      currencies c1 ON cp.base_asset_id = c1.currency_id
    INNER JOIN 
      currencies c2 ON cp.quote_asset_id = c2.currency_id
    WHERE 
      cp.status = 'ZERO' AND cp.popular = 1 AND cp.pair_symbol NOT LIKE '%INR%'
  `;

    return res.send(topLosers);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
});



// Start the Express server
const port = 4005;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});