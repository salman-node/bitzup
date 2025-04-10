import { Decimal } from '@prisma/client/runtime/library';

export interface IUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  country_code?: string;
  password: string;
  token?: string | null;
  token_string?: string | null;
  otp_verify?: string;
  otp?: string;
  authenticator_code?: string;
  fcm_token?: string;
  source: string;
  device_id?: string | null;
}

export interface IUserPartial {
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  password?: string;
  token?: string | null;
  token_string?: string | null;
  secret_key?: string | null;
  isAuth: string;
  device_id?: string | null;
}

export interface ICryptocurrency {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
  coin_decimal: number;
  price_decimal: number;
  qty_decimal: number;
}

export interface IGainer {
  symbol: string;
  priceChange: number;
  priceChangePercent: number;
}

export interface I24hVol {
  symbol: string;
  volume: number;
}

export interface IFavoriteCurrency {
  id: number;
  currency: string;
  base: string;
  email: string;
  user_id: number;
}

export interface IRequestAddFav {
  currency: string;
  type: string;
  base: string;
  email: string;
}

export interface IClientInfo {
  ip: string;
  network?: string;
  version?: string;
  city?: string;
  region?: string;
  region_code?: string;
  country_name?: string;
  postal?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  utc_offset?: string;
  country_calling_code?: string;
  org?: string;
  os_name: string;
  os_version?: string;
  client_type: string;
  client_name: string;
  client_family?: string;
  device_type: string;
}

export interface ISocketCryptoCurrency {
  id: number;
  coin: string;
  decimal: number;
  coin_decimal: number;
  qty_decimal: number;
  price_decimal: number;
  symbol: string;
  icon: string;
  status: string;
  pro_api_id: number;
  trade_status: number;
  limit_order: number;
  pro_trade: number;
  usdtprice: Decimal;
  change_in_price: number;
  chain: string;
  column_name: string;
  table_column: string;
  popular: number;
  hot: number;
  withdrawl_fees: Decimal;
  withdraw: string;
  deposit: string;
  ext_withdraw: string;
  bnbchain: string;
}

export interface IAllCryptoCurrency {
  id: number;
  coin: string;
  symbol: string;
  icon: string;
  usdtprice: Decimal;
  change_in_price: number;
}

export interface ISocketPartialCurrency {
  coin: string;
  symbol: string;
  decimal: number;
  pro_api_id: number;
  usdtprice: Decimal;
  change_in_price: number;
  hot: number;
  status: string;
}

export interface ISocketCurrencyDataHolder {
  data: ISocketPartialCurrency[];
}

export interface ISocketCurrencyData {
  hotCurrencies: ISocketCurrencyDataHolder;
  activeCurrencies: ISocketCurrencyDataHolder;
  gainers: ISocketCurrencyDataHolder;
  losers: ISocketCurrencyDataHolder;
}

export interface ICurrencyWithBalance {
  id: number;
  coin: string;
  symbol: string;
  icon: string;
  status: string;
  deposit: string;
  withdraw: string;
  usdtprice: number;
  balances: { balance: number }[];
}

export interface ICoinAddressData {
  coin_id: number;
  chain_name: string;
}

export interface IBuySellOrder {
  coin_base: string;
  type: string;
  order_price: string;
  pair_symbol: string,
  base_quantity: string;
  order_id: string;
  executed_quantity: string;
  order_type: string;
  date_time: any;
  cancelled_date_time: any;
  status: string;
}

export interface IGetBuySellOrder {
  coin_base: string;
  type: string;
  usdt_price: string;
  quantity: string;
  amount: string;
  executed_quantity: string;
  status: string;
  order_type: string;
  date_time: any;
  order_id: string;
}

export interface IWalletHistory {
  id: number;
  user_id: number;
  coin_id: number;
  type: string;
  remaining_balance: Decimal;
  balance: Decimal;
  remark: string;
  order_id: number;
  date_time: any;
}

export interface IBalAndCoinDetails {
  balance: number;
  coin_decimal: number;
}

export interface IBalance {
  balance: number;
}

export interface IBuySellBal {
  usdt_id: number;
  usdt_balance: Decimal;
  coin_id: number;
  coin_balance: Decimal;
  qty_decimal: number;
  price_decimal: number;
}

export interface ICoinAddress {
  Address: string;
  memo: string;
  coin_name: string;
  symbol: string;
  wallet: string;
  min_dep: number;
}

export interface IChainIDData {
  chainId: number;
  coin_name: string;
  min_dep: number;
  symbol: string;
}

export interface IWithdrawlHistChaiID {
  withdrawl_fees: number;
  chain_name: string;
  symbol: string;
  min_with: number;
  netw_fee: number;
  evm_compatible: string;
}

export interface IFunds {
  symbol: string;
  coin: string;
  icon: string;
  balance: number;
  withdrawl_fees: number;
  usdtprice: number;
  avg_cost: number;
  [key: string]: any;
}

export interface IFundsMap {
  bal: number;
  withdrawl_fees: number;
  usdtprice: number;
  coin_name: string;
  icon: string;
  avg_cost: number;
  id: number;
  coin_symbol: string;
}

export interface ICancelOrders {
  id: number;
  coin_base: string;
  type: string;
  usdt_price: string;
  quantity: string;
  amount: string;
  status: string;
  order_type: string;
  date_time: string;
  order_id: string;
  filled: string;
}

export interface IWalletFunds {
  type: string;
  balance: string;
}

export interface IWalletAllCurrFunds {
  symbol: string;
  balance: number;
  coin_id: number;
  qty_decimal: number;
  price_decimal: number;
  usdtprice: number;
}

export interface IBtcPrice {
  symbol: string;
  price: string;
}

export interface ITradeData {
  date_time: string;
  quantity: string;
  usdt_price: string;
}

export interface ITradeHistory {
  symbol: string;
  fees: string;
  coin_base: string;
  type: string;
  date_time: string;
  usdt_price: string;
  quantity: string;
}

export interface BalanceEntry {
  type: string;
  balance: string;
  coin_id?: number;
}

export interface ICoinId {
  currency_id: string;
  coin_decimal: number;
  qty_decimal: number;
  price_decimal: number;
  usdtprice: number;
}

export interface IBalData {
  balances: number;
}

export interface IExecutedQuantity {
  executed_quantity: number;
}

export interface IBuySellOpenData {
  id: number;
  coin_id: number;
  user_id: string;
  coin_base: string;
  amount: number;
  quantity: number;
  executed_quantity: number;
  buy_sell_fees: number;
  tds: number;
  fees: number;
  final_amount: number;
  api: number;
  usdt_price: number;
  type: string;
  status: string;
  stop_limit_price: number;
  oco_stop_limit_price: number;
  order_id: string;
  api_order_id: string;
  order_type: string;
  api_status: string;
  api_id: number;
  response: string;
  date_time: number;
  cancelled_date_time: number;
  response_time: string;
  profit: number;
  device: string;
  balances: number;
}

export interface IWithdrawlRecentHist {
  coin: string;
  symbol: string;
  id: number;
  date: Date;
  memo: string;
  address: string;
  destination_tag: string;
  amount: number;
  final_amount: string;
  fiat_amount: string;
  fees: number;
  status: string;
  transaction_id: string;
}
