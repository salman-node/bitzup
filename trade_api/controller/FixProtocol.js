const net = require('net');

const fixEngineHost = '127.0.0.1'; // Replace with the actual FIX engine IP
const fixEnginePort = 9876; // Replace with the actual FIX engine port

const socket = new net.Socket();
socket.connect(fixEnginePort, fixEngineHost, () => {
  console.log('Connected to FIX engine.');

  // Prepare and send a FIX message
  const fixMessage = '35=D|55=XYZ|54=1|38=100|40=1|59=0|'; // Replace with your actual FIX message

  socket.write(fixMessage + '\x01', 'ascii', () => {
    console.log('FIX message sent.');
  });
});

socket.on('data', (data) => {
  const receivedMessages = data.toString('ascii').split('\x01');
  
  for (const message of receivedMessages) {
    if (message.length > 0) {
      console.log('Received message:', message);

      // Parse and process the received message here
    }
  }
});

socket.on('end', () => {
  console.log('Disconnected from FIX engine.');
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});


// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

const net = require('net');
const { createMessage } = require('node-fix-protocol');




module.exports.Quick_BUY = async (req, res) => {
  try {
    const { user_id, pair_id, quote_value_qty, ip, coordinate } = req.body;

    // Sanitise All Input fields
    if (!user_id) {
      return res.status(process.env.HTTP_BAD_REQ).send({
        status_code: 400,
        status: false,
        msg: "user-id Required..!!",
      });
    }
    if (!quote_value_qty) {
      return res.status(process.env.HTTP_BAD_REQ).send({
        status_code: 400,
        status: false,
        msg: "Quote asset Required..!!",
      });
    }
    if (!pair_id) {
      return res.status(process.env.HTTP_BAD_REQ).send({
        status_code: 400,
        status: false,
        msg: "pair-id Required..!!",
      });
    }
    if (quote_value_qty < 50) {
      return res.status(process.env.HTTP_BAD_REQ).send({
        status_code: 400,
        status: false,
        msg: "Please enter amount greater then 50",
      });
    }

    const pair_data = await db.Get_Where_Universal_Data(
      "base_asset_id,quote_asset_id,pair_symbol_btx,status",
      "tbl_resigtered_asset_fiat_pair_master",
      { pair_id: pair_id }
    );
    if (!pair_data || !pair_data.length) {
      return res.status(process.env.HTTP_BAD_REQ).send({
        status_code: 400,
        status: false,
        msg: "Pair not registered.",
      });
    }

    const status = pair_data[0].status;
    if (status != 0) {
      return res.status(process.env.HTTP_BAD_REQ).send({
        status_code: 400,
        status: false,
        msg: "Currently pair not available.",
      });
    }
    // BTC-INR
    const base_asset_id = pair_data[0].base_asset_id;
    const quote_asset_id = pair_data[0].quote_asset_id;
    const pair_symbol = pair_data[0].pair_symbol_btx;

    const user_balance_data = await db.Get_Where_Universal_Data(
      "current_balance_btx",
      "tbl_user_fiat_wallet_master",
      { cuser_id_btx: user_id, fiat_asset_id_btx: quote_asset_id }
    );

    if (!user_balance_data || !user_balance_data.length) {
      return res.status(process.env.HTTP_BAD_REQ).send({
        status_code: 400,
        status: false,
        msg: "User Data not found.",
      });
    }

    const user_balance = user_balance_data[0].current_balance_btx;

    if (Number(quote_value_qty) > Number(user_balance)) {
      return res.status(process.env.HTTP_BAD_REQ).send({
        status_code: 400,
        status: false,
        msg: "Insufficient user fiat balance.",
      });
    }

    const pair_rate_data = await db.Get_Where_Universal_Data(
      "current_price",
      "tbl_all_assets_portfolio_data",
      { pair_id: pair_id }
    );

    if (!pair_rate_data || !pair_rate_data.length) {
      return res.status(process.env.HTTP_BAD_REQ).send({
        status_code: 400,
        status: false,
        msg: "Current market rate not fetched for base asset.",
        data: [],
      });
    }

    const pair_rate = pair_rate_data[0].current_price;

    const base_asset_volume = quote_value_qty / pair_rate;

    // Generating Unique Order_id for each order..
    const order_id = GenerateID.GenerateID(20, uuid.v1(), "PO").toUpperCase();

    // DataBase call to Start mysql transaction to get user data and update balance of User.
    const DataUpdated = await db.Create_Update_quick_Buy_order_data(
      pair_id,
      pair_symbol,
      quote_value_qty,
      base_asset_volume,
      user_id,
      quote_asset_id,
      order_id,
      base_asset_id,
      "BUY",
      "Market order",
      pair_rate,
      Date.now()
    );
    if (DataUpdated == "err") {
      return res.status(process.env.HTTP_BAD_REQ).send({
        status_code: 400,
        status: false,
        msg: "Warning: Database not updated.",
      });
    }

    // Prepare and send a FIX message
    const fixMessage = createMessage('D', {
      // Construct your FIX message fields based on the order data
      11: order_id,
      55: pair_symbol,
      // Add more fields as necessary
    });

    const fixEngineHost = '127.0.0.1'; // Replace with the actual FIX engine IP
    const fixEnginePort = 9876; // Replace with the actual FIX engine port

    const socket = new net.Socket();
    socket.connect(fixEnginePort, fixEngineHost, () => {
      console.log('Connected to FIX engine.');

      socket.write(fixMessage.toString(), 'ascii', () => {
        console.log('FIX message sent.');
      });
    });

    socket.on('data', (data) => {
      const receivedMessages = data.toString('ascii').split('\x01');

      for (const message of receivedMessages) {
        if (message.length > 0) {
          console.log('Received message:', message);

          // Parse and process the received message here
        }
      }
    });

    socket.on('end', () => {
      console.log('Disconnected from FIX engine.');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // After sending the FIX message, continue with your existing code...

    return res.status(process.env.HTTP_DATA_CREATED).send({
      status_code: 201,
      status: true,
      Data: [Data],
      msg: 'Quick Buy Order Placed Successfully..!!',
    });

  } catch (err) {
    return res.status(process.env.HTTP_SERVER_ERROR).send({
      status_code: 500,
      status: false,
      msg: err.message,
    });
  }
};

