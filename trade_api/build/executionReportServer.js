"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var connector_typescript_1 = require("@binance/connector-typescript");
var ws_1 = require("ws");
var prisma_client_1 = require("./config/prisma_client");
var apiKey = 'QT7VwThPfnLXhmYeiA0fTgP01Czi4cGTs5iwLVs6cl4UbVCTfKULSwSdkfNtz6om';
var apiSecret = 'u3I0eAL1JYKg8qA1giUWNeIajBJYcr2hK29Bz3N26ubF0bUcqixUHS22R2XkpszW';
var client = new connector_typescript_1.Spot(apiKey, apiSecret, {
    baseURL: 'https://testnet.binance.vision',
    timeout: 1000
});
// Create WebSocket server
var wss = new ws_1.WebSocket.Server({ port: 9001 });
var frontendClients = [];
// Listen for frontend connections
wss.on('connection', function (ws) {
    console.log('Frontend client connected');
    frontendClients.push(ws);
    ws.on('close', function () {
        console.log('Frontend client disconnected');
        frontendClients = frontendClients.filter(function (client) { return client !== ws; });
    });
});
var callbacks = {
    open: function () { return console.log('Connected with Binance WebSocket server'); },
    close: function () { return console.log('Disconnected with Binance WebSocket server'); },
    message: function (executionReport) { return __awaiter(void 0, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            data = JSON.parse(executionReport);
            console.log(data);
            // Send execution report to all connected frontend clients
            frontendClients.forEach(function (client) { return __awaiter(void 0, void 0, void 0, function () {
                var report, report, updateData, report, updateData, report;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (data.X === 'NEW') {
                                report = {
                                    status: '1',
                                    message: "New ".concat(data.o, " Order Placed , Order Type: ").concat(data.o, ", Order Price: ").concat(data.p, ", Order Quantity: ").concat(data.q, ", Order Id: ").concat(data.c),
                                    data: JSON.stringify(data)
                                };
                                client.send(JSON.stringify(report));
                                console.log("New ".concat(data.o, " Order Placed , Order Type: ").concat(data.o, ", Order Price: ").concat(data.p, ", Order Quantity: ").concat(data.q, ", Order Id: ").concat(data.c));
                            }
                            if (!(data.X === 'PARTIALLY_FILLED')) return [3 /*break*/, 2];
                            report = {
                                status: '2',
                                message: "Order Partially Filled at ".concat(data.l, ", Order Id: ").concat(data.c, " , Filled Quantity: ").concat(data.z),
                                data: JSON.stringify(data)
                            };
                            client.send(JSON.stringify(report));
                            console.log("Order Partially Filled at ".concat(data.l, ", Order Id: ").concat(data.c, " , Filled Quantity: ").concat(data.z));
                            return [4 /*yield*/, prisma_client_1.prisma.buy_sell_pro_limit_open.update({
                                    where: {
                                        order_id: data.c
                                    },
                                    data: {
                                        status: data.x,
                                        base_quantity: data.q,
                                        quote_quantity: data.Q,
                                        order_price: data.p,
                                        executed_base_quantity: data.z,
                                        executed_quote_quantity: data.Z,
                                        stop_limit_price: data.P,
                                        oco_stop_limit_price: 0,
                                        final_amount: data.Z,
                                        order_id: data.c,
                                        api_order_id: data.C,
                                        order_type: data.o,
                                        buy_sell_fees: data.N,
                                        api_id: data.i,
                                        response: JSON.stringify(data),
                                        date_time: data.T,
                                        response_time: data.E
                                    }
                                })];
                        case 1:
                            updateData = _a.sent();
                            _a.label = 2;
                        case 2:
                            if (!(data.X === 'FILLED')) return [3 /*break*/, 4];
                            console.log("Order Executed at ".concat(data.l, ", Order Id: ").concat(data.c, " , Filled Quantity: ").concat(data.z));
                            report = {
                                status: '3',
                                message: "Order Executed at ".concat(data.l, ", Order Id: ").concat(data.c, " , Filled Quantity: ").concat(data.z),
                                data: JSON.stringify(data)
                            };
                            client.send(JSON.stringify(report));
                            return [4 /*yield*/, prisma_client_1.prisma.buy_sell_pro_limit_open.update({
                                    where: {
                                        order_id: data.c
                                    },
                                    data: {
                                        status: data.x,
                                        base_quantity: data.q,
                                        quote_quantity: data.Q,
                                        order_price: data.p,
                                        executed_base_quantity: data.z,
                                        executed_quote_quantity: data.Z,
                                        stop_limit_price: data.P,
                                        oco_stop_limit_price: 0,
                                        final_amount: data.Z,
                                        order_id: data.c,
                                        api_order_id: data.C,
                                        order_type: data.o,
                                        buy_sell_fees: data.N,
                                        api_id: data.i,
                                        response: JSON.stringify(data),
                                        date_time: data.T,
                                        response_time: data.E
                                    }
                                })];
                        case 3:
                            updateData = _a.sent();
                            _a.label = 4;
                        case 4:
                            if (data.X === 'CANCELED') {
                                report = {
                                    status: '4',
                                    message: "Cancelled ".concat(data.o, " Order Placed, Order Id: ").concat(data.c),
                                    data: JSON.stringify(data)
                                };
                                client.send(JSON.stringify(report));
                                console.log("Cancelled ".concat(data.o, " Order, Order Id: ").concat(data.c));
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    }); }
};
var connectExecutionReport = function () { return __awaiter(void 0, void 0, void 0, function () {
    var websocketStreamClient, ListenKey, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, new connector_typescript_1.WebsocketStream({ callbacks: callbacks, wsURL: 'wss://testnet.binance.vision' })];
            case 1:
                websocketStreamClient = _a.sent();
                return [4 /*yield*/, client.createListenKey()];
            case 2:
                ListenKey = _a.sent();
                websocketStreamClient.userData(ListenKey.listenKey);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error(error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
connectExecutionReport();
//# sourceMappingURL=executionReportServer.js.map