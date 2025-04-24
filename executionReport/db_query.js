const connection = require('./db_connection');

// ... (rest of the code remains the same)

const Create_Universal_Data = async function (database_table_name, obJdata) {
  const abkey = Object.keys(obJdata);
  const abvalue = Object.values(obJdata);
  const sql = `INSERT INTO ${database_table_name} (${abkey.join(",")}) VALUES (${abvalue.map(() => "?").join(",")})`;

  return new Promise((resolve, reject) => {
    connection.query(sql, abvalue, (err, result) => {
      if (err) {
        console.error("Error in Create_Universal_Data:", err);
        return reject(err);
      }
      resolve(result);
    });
  });
};


const raw_query = async function (query, values) {
  try {
    return await new Promise((resolve, reject) => {
      connection.connect((err) => {
        if (err) throw err;
        connection.query(query, values, (err, result) => {
          if (err) throw err;
          resolve(result);
        });
      });
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const updateOrInsertBalances = async function ({
  userId,
  currencyId,
  mainBalanceChange = 0,
  currentBalanceChange = 0,
  lockedBalanceChange = 0,
}) {
  return await new Promise((resolve, reject) => {
    const updateSql = `
      UPDATE balances 
      SET main_balance = main_balance + ?, 
          current_balance = current_balance + ?, 
          locked_balance = locked_balance + ? 
      WHERE user_id = ? AND currency_id = ?`;

    const updateValues = [
      mainBalanceChange,
      currentBalanceChange,
      lockedBalanceChange,
      userId,
      currencyId,
    ];

    connection.query(updateSql, updateValues, (err, result) => {
      if (err) return reject(err);

      if (result.affectedRows > 0) {
        // Rows were updated
        resolve(result);
      } else {
        // No rows updated, insert a new row
        const insertSql = `
          INSERT INTO balances 
          (user_id, currency_id, main_balance, current_balance, locked_balance) 
          VALUES (?, ?, ?, ?, ?)`;

        const insertValues = [
          userId,
          currencyId,
          mainBalanceChange,
          currentBalanceChange,
          lockedBalanceChange,
        ];

        connection.query(insertSql, insertValues, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      }
    });
  });
};

const updateBalances = async function(baseData, quoteData) {
  try {
    await new Promise((resolve, reject) => {
      connection.beginTransaction((err) => {
        if (err) {
          return reject(err);
        }

        // Update or insert for the first object (base asset)
        connection.query(
          `UPDATE balances 
           SET main_balance = main_balance + ?, 
               current_balance = current_balance + ?, 
               locked_balance = locked_balance + ? 
           WHERE user_id = ? AND currency_id = ?`,
          [baseData.mainBalanceChange, baseData.currentBalanceChange, baseData.lockedBalanceChange, baseData.userId, baseData.currencyId],
          (err, updateResult1) => {
            if (err) {
              return connection.rollback(() => reject(err));
            }

            if (updateResult1.affectedRows === 0) {
              console.log("No rows updated for base asset, inserting new row.");
              // Insert if no rows were updated
               connection.query(
                `INSERT INTO balances 
                 (user_id, currency_id, main_balance, current_balance) 
                 VALUES (?, ?, ?, ?)`,
                [baseData.userId, baseData.currencyId, baseData.mainBalanceChange, baseData.currentBalanceChange],
                (err) => {
                  if (err) {
                    return connection.rollback(() => reject(err));
                  }
                   
                  // Update or insert for the second object (quote asset)
                  connection.query(
                    `UPDATE balances 
                     SET main_balance = main_balance + ?, 
                         current_balance = current_balance + ?, 
                         locked_balance = locked_balance + ? 
                     WHERE user_id = ? AND currency_id = ?`,
                    [quoteData.mainBalanceChange, quoteData.currentBalanceChange, quoteData.lockedBalanceChange, quoteData.userId, quoteData.currencyId],
                    (err, updateResult2) => {
                      if (err) {
                        return connection.rollback(() => reject(err));
                      }

                      if (updateResult2.affectedRows === 0) {
                        console.log("No rows updated for quote asset, inserting new row.2");
                        // Insert if no rows were updated
                        connection.query(
                          `INSERT INTO balances 
                           (user_id, currency_id, main_balance, current_balance) 
                           VALUES (?, ?, ?, ?)`,
                          [quoteData.userId, quoteData.currencyId, quoteData.mainBalanceChange, quoteData.currentBalanceChange],
                          (err) => {
                            if (err) {
                              return connection.rollback(() => reject(err));
                            }

                            // Commit the transaction
                            connection.commit((err) => {
                              if (err) {
                                return connection.rollback(() => reject(err));
                              }
                              return resolve(); // Resolve the promise after commit
                            });
                          }
                        );
                      } else {
                        // Commit the transaction if no insert needed for quote asset
                        connection.commit((err) => {
                          if (err) {
                            return connection.rollback(() => reject(err));
                          }
                         return  resolve(); // Resolve the promise after commit
                        });
                      }
                    }
                  );
                }
              );
            } else {
              // Proceed to quote asset update if no insert needed for base asset
              connection.query(
                `UPDATE balances 
                 SET main_balance = main_balance + ?, 
                     current_balance = current_balance + ?, 
                     locked_balance = locked_balance + ? 
                 WHERE user_id = ? AND currency_id = ?`,
                [quoteData.mainBalanceChange, quoteData.currentBalanceChange, quoteData.lockedBalanceChange, quoteData.userId, quoteData.currencyId],
                (err, updateResult2) => {
                  if (err) {
                    return connection.rollback(() => reject(err));
                  }

                  if (updateResult2.affectedRows === 0) {
                    console.log("No rows updated for quote asset, inserting new row.3");
                    // Insert if no rows were updated
                    connection.query(
                      `INSERT INTO balances 
                       (user_id, currency_id, main_balance, current_balance) 
                       VALUES (?, ?, ?, ?)`,
                      [quoteData.userId, quoteData.currencyId, quoteData.mainBalanceChange, quoteData.currentBalanceChange],
                      (err) => {
                        if (err) {
                          return connection.rollback(() => reject(err));
                        }

                        // Commit the transaction
                        connection.commit((err) => {
                          if (err) {
                            return connection.rollback(() => reject(err));
                          }
                          return resolve(); // Resolve the promise after commit
                        });
                      }
                    );
                  } else {
                    // Commit the transaction if no insert needed for quote asset
                    connection.commit((err) => {
                      if (err) {
                        return connection.rollback(() => reject(err));
                      }
                      console.log("Transaction committed successfully.1");
                      return  resolve(); // Resolve the promise after commit
                    });
                  }
                }
              );
            }
          }
        );
      });
    });
  } catch (err) {
    console.error("Transaction failed in updateBalances:", err);
    throw err; // Propagate the error
  }
};

// ... (rest of the code remains the same)

 const Get_All_Universal_Data = async function (
  data,
  database_table_name
) {
  return await new Promise((resolve, reject) => {
    const sql = `SELECT ${data} FROM ${database_table_name};`;
    connection.query(sql, (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });
};

// ... (rest of the code remains the same)

 const Get_Where_Universal_Data = async function (
  data,
  database_table_name,
  filterquery
) {
  return await new Promise((resolve, reject) => {
    const abkey = Object.keys(filterquery);
    const abvalue = Object.values(filterquery);
    const abkeydata = abkey.join("=? and ") + "=?";

    const sql = `SELECT ${data} FROM ${database_table_name} WHERE ${abkeydata}`;
    connection.query(sql, abvalue, (err, result) => {
      if (err) throw err;
      resolve(result);
    });
  });
};

// ... (rest of the code remains the same)

const Update_Universal_Data = async function (
  database_table_name,
  updatedata,
  filterquery
) {
  return await new Promise((resolve, reject) => {
    const abkey = Object.keys(updatedata);
    const abvalue = Object.values(updatedata);
    const abkeydata = abkey.join("= ? , ") + "= ? ";

    const filterkey = Object.keys(filterquery);
    const filtervalue = Object.values(filterquery);
    const filterkeydata = filterkey.join("= ? AND ") + " = ?";

    const result = Object.entries(filterquery);
    const rdata = result.join(" and ");
    const sdata = rdata.split(",");
    const equaldata = sdata.join(" = ");
    const values = [...abvalue, ...filtervalue];

    connection.connect((err) => {
      if (err) throw err;
      const sql = `UPDATE ${database_table_name} SET ${abkeydata} WHERE ${filterkeydata}`;
      connection.query(sql, values, (err, result) => {
        if (err) throw err;
        console.log(result.affectedRows + " record(s) updated");
        resolve(result);
      });
    });
  });
};

module.exports = {updateBalances,updateOrInsertBalances, Create_Universal_Data , Update_Universal_Data , Get_All_Universal_Data , Get_Where_Universal_Data, raw_query };