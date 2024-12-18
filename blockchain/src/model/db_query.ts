import connection from '../config/db_connections';


export const Create_Universal_Data = async function (
    database_table_name: string,
    obJdata: object
  ): Promise<any> {
    const abkey = Object.keys(obJdata);
    const abvalue = Object.values(obJdata);
    const sql = `INSERT INTO ${database_table_name} (${abkey}) VALUES (${abvalue.map(() => '?').join(',')})`;
  
    try {
      const result = await connection.query(sql, abvalue);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

 export const get_pair_data = async function (
   pair_id: string,
   user_id: string
 ): Promise<any> {
   const sql = `SELECT 
  cp.pair_id,
  cp.quantity_decimal AS qty_decimal,
  cp.price_decimal AS price_decimal,
  b1.current_balance AS base_asset_balance,
  b2.current_balance AS quote_asset_balance
FROM 
  crypto_pair cp
  LEFT JOIN balances b1 ON cp.base_asset_id COLLATE utf8mb4_general_ci = b1.currency_id COLLATE utf8mb4_general_ci AND b1.user_id = ?
  LEFT JOIN balances b2 ON cp.quote_asset_id COLLATE utf8mb4_general_ci = b2.currency_id COLLATE utf8mb4_general_ci AND b2.user_id = ?
WHERE 
  cp.pair_id = ?;`;
   try {
     const result = await connection.promise().query(sql, [user_id,user_id,pair_id]);
     return result[0];
   } catch (err) {
    console.log(err);
     throw err;
   }
 }