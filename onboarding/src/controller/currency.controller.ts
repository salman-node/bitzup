import { Request, Response } from "express";
import axios from "axios";
import {  ISocketCryptoCurrency } from "../types/models.types";
import { prisma } from "../config/prisma.client";
import { Prisma } from "@prisma/client";

/*----- Get All Popular Cryptocurrencies -----*/
// export const getPopularCurrencies = async (_req: Request, res: Response) => {
//   try {
//     const response = await axios.get(
//       'https://api.binance.com/api/v3/ticker/24hr',
//     );

//     // Filter and map the response to extract relevant data
//     const popularCryptocurrencies: ICryptocurrency[] = response.data
//       .filter((item: any) => item.symbol.endsWith('USDT'))
//       .map((item: any) => {
//         return { ...item, symbol: item.symbol.replace('USDT', '') };
//       }).slice(0, 10);

//     // favorite currency array
//     const result = (await prisma.favoritecurrency.findMany({})).map(
//       item => item.pair_id,
//     );

//     // checking favorite currency
//     const hotCurrencyList = popularCryptocurrencies.map(item => {
//       if (result.includes(item.symbol)) {
//         return { ...item, favorite: true };
//       }
//       return { ...item, favorite: false };
//     });

//     // send fetched data to user
//     res.status(200).json({
//       status: '1',
//       message: 'successfully fetched all Crypto currencies',
//       data: hotCurrencyList,
//     });
//   } catch (err) {
//     res.status(500).json({ status: '0', message: (err as Error).message });
//   }
// };

// /*----- Get Gainer Cryptocurrency List  -----*/
// export const getGainerCurrencies = async (_req: Request, res: Response) => {
//   try {
//     const response = await axios.get(
//       'https://api.binance.com/api/v3/ticker/24hr',
//     );

//     // Filter and map the response to extract relevant data
//     const gainers: IGainer[] = response.data
//       .filter((symbol: IGainer) => symbol.symbol.endsWith('USDT'))
//       .map((symbol: IGainer) => ({
//         symbol: symbol.symbol.replace('USDT', ''),
//         priceChange: symbol.priceChange,
//         priceChangePercent: symbol.priceChangePercent,
//       }))
//       .filter((symbol: IGainer) => symbol.priceChange > 0)
//       .sort((a: IGainer, b: IGainer) => b.priceChange - a.priceChange)
//       .slice(0, 10);

//     // favorite currency array
//     const result = (await prisma.favoritecurrency.findMany({})).map(
//       item => item.currency,
//     );

//     // checking favorite currency
//     const gainersList = gainers.map(item => {
//       if (result.includes(item.symbol)) {
//         return { ...item, favorite: true };
//       }
//       return { ...item, favorite: false };
//     });

//     // send fetched data to user
//     res.status(200).json({
//       status: '1',
//       message: 'successfully fetched all gainers currencies',
//       data: gainersList,
//     });
//   } catch (err) {
//     res.status(500).json({ status: '0', message: (err as Error).message });
//   }
// };

// /*----- Get Looser Cryptocurrency List  -----*/
// export const getLooserCurrencies = async (_req: Request, res: Response) => {
//   try {
//     const response = await axios.get(
//       'https://api.binance.com/api/v3/ticker/24hr',
//     );

//     // Filter and map the response to extract relevant data
//     const loosers: IGainer[] = response.data
//       .filter((symbol: IGainer) => symbol.symbol.endsWith('USDT'))
//       .map((symbol: IGainer) => ({
//         symbol: symbol.symbol.replace('USDT', ''),
//         priceChange: symbol.priceChange,
//         priceChangePercent: symbol.priceChangePercent,
//       }))
//       .filter((symbol: IGainer) => symbol.priceChange < 0)
//       .sort((a: IGainer, b: IGainer) => a.priceChange - b.priceChange)
//       .slice(0, 10);

//     // favorite currency array
//     const result = (await prisma.favoritecurrency.findMany({})).map(
//       item => item.currency,
//     );

//     // checking favorite currency
//     const loosersList = loosers.map(item => {
//       if (result.includes(item.symbol)) {
//         return { ...item, favorite: true };
//       }
//       return { ...item, favorite: false };
//     });

//     // send fetched data to user
//     res.status(200).json({
//       status: '1',
//       message: 'successfully fetched all looser currencies',
//       data: loosersList,
//     });
//   } catch (err) {
//     res.status(500).json({ status: '0', message: (err as Error).message });
//   }
// };

/*----- Get 24h Vol List  -----*/
// export const get24hVolList = async (_req: Request, res: Response) => {
//   try {
//     const response = await axios.get(
//       'https://api.binance.com/api/v3/ticker/24hr',
//     );

//     // Filter and map the response to extract relevant data
//     const volumeList: I24hVol[] = response.data
//       .filter((symbol: I24hVol) => symbol.symbol.endsWith('USDT'))
//       .map((symbol: I24hVol) => ({
//         symbol: symbol.symbol.replace('USDT', ''),
//         volume: symbol.volume,
//       }))
//       .slice(0, 10);

//     // favorite currency array
//     const result = (await prisma.favoritecurrency.findMany({})).map(
//       item => item.currency,
//     );

//     // checking favorite currency
//     const volumeList24hr = volumeList.map(item => {
//       if (result.includes(item.symbol)) {
//         return { ...item, favorite: true };
//       }
//       return { ...item, favorite: false };
//     });

//     // send fetched data to user
//     res.status(200).json({
//       status: '1',
//       message: 'successfully fetched 24h Vol List',
//       data: volumeList24hr,
//     });
//   } catch (err) {
//     res.status(500).json({ status: '0', message: (err as Error).message });
//   }
// };

// /* Get All Currencies*/
// export const getAllCurrencies = async (_req: Request, res: Response) => {
//   try {
//     const allCurrencies: IAllCryptoCurrency[] =
//       await prisma.currencies.findMany();

//       const filteredCurrencies = allCurrencies.map(currency => ({
//         symbol: currency.symbol,
//         coin: currency.coin,
//         change_in_price: currency.change_in_price,
//         usdtprice: currency.usdtprice,
//         favourite: false,
//       }));

//     // send fetched data to user
//     res.status(200).json({
//       status: '1',
//       message: 'successfully fetched All Currencies List',
//       data: filteredCurrencies,
//     });
//   } catch (err) {
//     res.status(500).json({ status: '0', message: (err as Error).message });
//   }
// };

/*----- Add Favorites Cryptocurrency -----*/
export const addFavorite = async (req: Request, res: Response) => {
  try {
    const { user_id: userId }: { user_id: string } = req.body.user;
    const { pair_id, type } = req.body;

    console.log("currency", pair_id);
    console.log("type", type);

    if (!userId) {
      return res.status(400).send({
        status: "3",
        message: "You are not authorized or user not present",
      });
    }

    // field validation
    if (!pair_id || !type) {
      // throw new Error('Please provide all the fields');
      return res.status(400).json({
        status: "3",
        message: "Please provide all the fields",
      });
    }

    // check user
    const user = await prisma.user.count({
      where: { user_id: userId },
    });

    // user not present
    if (user == 0) {
      // throw new Error('User not found');
      return res.status(400).json({
        status: "3",
        message: "no data found",
      });
    }

    // check Currency
    const exists = await prisma.favoritecurrency.count({
      where: {
        user_id: userId,
        pair_id: pair_id,
      },
    });

    if (type === "false") {
      // Currency not present
      if (exists == 0) {
        // throw new Error('Currency not present in favorite list');
        return res.status(400).json({
          status: "3",
          message: "Currency not present in favorite list",
        });
      }

      await prisma.favoritecurrency.deleteMany({
        where: { pair_id: pair_id },
      });

      return res.status(200).json({
        status: "1",
        message: "removed from favorite list",
        fav: 0,
      });
    }

    // Currency present
    if (exists > 0) {
      // throw new Error('Currency already present in favorite list');
      return res.status(400).json({
        status: "3",
        message: "Currency already present in favorite list",
      });
    }

    await prisma.favoritecurrency.create({
      data: {
        pair_id: pair_id,
        user_id: userId,
      },
    });
    // send fetched data to user
    return res.status(200).json({
      status: "1",
      message: "added to favourite list",
      fav: 1,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "4", message: (err as Error).message });
  }
};

export const getFavorites = async (req: Request, res: Response) => {
  try {
    const { user_id }: { user_id: string } = req.body.user;

    if (!user_id) {
      return res.status(400).send({
        status: "3",
        message: "You are not authorized or user not present",
      });
    }
    console.log("before query");
    const result: Array<any> = await prisma.$queryRaw`
    SELECT
      fc.id,
      fc.pair_id,
      fc.user_id,
      c.quantity_decimal AS qty_decimal,
      c.price_decimal,
      c.pair_symbol as symbol
    FROM
      favoritecurrency fc
    LEFT JOIN
      crypto_pair c ON fc.pair_id = c.pair_id
    WHERE
      fc.user_id = ${user_id}`;

    // Currency not present
    if (!result.length) {
      console.log("Currency not present in favorite list");
      return res.status(200).json({
        status: "0",
        message: "No Data Found.",
        data: [],
      });
    }
// 
    // console.log("after query", result);
    // Function to fetch data with retry mechanism
    async function fetchDataWithRetry() {
      const maxRetries = 5;
      let retries = 0;

      while (retries < maxRetries) {
        try {
          // Fetch data from Binance API
          const response = await axios.get(
            "https://api.binance.com/api/v3/ticker/24hr",
            {
              timeout: 10000, // 10 seconds
            }
          );

          // Filter and map the response to extract relevant data
          const currencies = response.data.filter((item: any) =>
            item.symbol.endsWith("USDT")
          );

          const favCurrencyList = (result as any[])
            .map((item) => {
              const matchingCurrency = currencies.find(
                (currency: any) => currency.symbol === item.symbol
              );
              // console.log(matchingCurrency);
              if (matchingCurrency) {
                return {
                  ...matchingCurrency,
                  pair_id: item.pair_id,
                  quantity_decimal: item.quantity_decimal,
                  price_decimal: item.price_decimal,
                  pair_symbol: item.symbol,

                };
              }
              return null;
            })
            .filter((item)=> item !== null);

          res.status(200).json({
            status: "1",
            message: "Successfully fetched all favorite currency",
            data: favCurrencyList,
          });

          return; // Exit the function after successful response
        } catch (error) {
          console.error("Error fetching data:", (error as Error).message);
          retries++;
          // Wait for a short period before retrying
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }

      console.error("Maximum retries reached. Unable to fetch data.");
      res.status(200).json({
        status: "0",
        message: "Unable to fetch data from Binance API",
      });
    }

    // Call the function to fetch data with retry
    await fetchDataWithRetry();
  } catch (err) {
    console.error("Error in getFavorites:", err);
    res.status(500).json({ status: "0", message: "Internal server error" });
  }
};

/*----- Check Favorites Cryptocurrency -----*/
export const checkFavorite = async (req: Request, res: Response) => {
  try {
    const { user_id: userId }: { user_id: string } = req.body.user;
    const { pair_id } = req.body;
    console.log("currency_id", pair_id);
    if (!pair_id) {
      // throw new Error('Please select currency to check favourite or not');
      return res.status(400).json({
        status: "3",
        message: "Please select currency to check favourite or not",
      });
    }

    if (!userId) {
      return res.status(400).send({
        status: "3",
        message: "You are not authorized or user not present",
      });
    }

    // field validation
    if (!pair_id) {
      // throw new Error('Please provide all the fields');
      return res.status(400).json({
        status: "3",
        message: "Please provide all the fields",
      });
    }

    // check user
    const user = await prisma.user.count({
      where: { user_id: userId },
    });

    // user not present
    if (user == 0) {
      // throw new Error('User not found');
      return res.status(400).json({
        status: "3",
        message: "User not found",
      });
    }

    // check Currency
    const exists = await prisma.favoritecurrency.count({
      where: {
        user_id: userId,
        pair_id: pair_id,
      },
    });

    let favCurr;

    if (exists > 0) {
      favCurr = true;
    } else {
      favCurr = false;
    }

    // send fetched data to user
    res.status(200).json({
      status: "1",
      favCurrency: favCurr,
    });
  } catch (err) {
    console.error("Error in checkFavorite:", err);
    res.status(500).json({ status: "4", message: (err as Error).message });
  }
};

/*----- Get validate Cryptocurrency list -----*/
export const getCurrencyList = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;

    // Validate page
    // if (!page || typeof page !== 'string' || isNaN(Number(page))) {
    //   throw new Error('Invalid page number');
    // }
    const pageNumber = Number(page);

    const limitNumber = Number(limit);

    // Validate search
    if (search && typeof search !== "string") {
      // throw new Error('Invalid search query');
      return res.status(400).json({
        status: "3",
        message: "Invalid search query",
      });
    }
    const searchQuery = search ? search.toString() : "";

    // Validate pagination parameters
    if (pageNumber < 1 || limitNumber < 1) {
      // throw new Error('Page and limit must be positive integers');
      return res.status(400).json({
        status: "3",
        message: "Page and limit must be positive integers",
      });
    }

    const skip: number = (pageNumber - 1) * limitNumber;

    const whereCondition: Prisma.currenciesWhereInput = {
      OR: [
        { symbol: { contains: searchQuery } },
        { coin: { contains: searchQuery } },
      ],
    };

    if (searchQuery.trim() === "") {
      delete whereCondition.OR;
    }

    const filteredCurrencies: ISocketCryptoCurrency[] =
      await prisma.currencies.findMany({
        take: limitNumber,
        skip,
        where: whereCondition,
      });

    const totalCount: number = await prisma.currencies.count({
      where: whereCondition,
    });

    res.status(200).json({
      status: "1",
      data: filteredCurrencies,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalCount,
      },
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ status: "0", message: err.message });
  }
};
export const getValidateCurrencies = async (_req: Request, res: Response) => {
  try {
    console.log('getValidateCurrencies')
    // get All Currencies list
    const allCurrencies:any = await prisma.$queryRaw`
    SELECT
      cp.pair_id,
      cp.pair_symbol,
      cp.change_in_price,
      c1.usdtprice,
      cp.current_price,
      cp.quantity_decimal,
      cp.price_decimal,
      c1.symbol AS base_asset_symbol,
      c2.symbol AS quote_asset_symbol
    FROM
      crypto_pair cp
    INNER JOIN
      currencies c1 ON cp.base_asset_id = c1.currency_id
    INNER JOIN
      currencies c2 ON cp.quote_asset_id = c2.currency_id
  `;

    // Filter the currencies array based on the fav currency
    const filteredCurrencies = allCurrencies.map((currency:any) => ({
      pair_id: currency.pair_id,
      pair_symbol: currency.pair_symbol,
      change_in_price: currency.change_in_price,
      usdtprice: currency.usdtprice,
      current_price: currency.current_price,
      quantity_decimal: currency.quantity_decimal,
      price_decimal: currency.price_decimal,
      base_asset_symbol: currency.base_asset_symbol,
      quote_asset_symbol: currency.quote_asset_symbol,
    }));

    // send fetched data to user
    res.status(200).json({
      status: "1",
      data: filteredCurrencies,
    });
  } catch (err: any) {
    console.log(err);
    console.log('err',err)
    res.status(500).json({ status: "0", message: err.message });
  }
};
