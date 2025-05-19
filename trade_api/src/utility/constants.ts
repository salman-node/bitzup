import { Side, OrderType  } from '@binance/connector-typescript'


export const c = {
  userIdMin: 10,
  userIdMax: 12,
  assetNameMin: 3,
  assetNameMax: 20,
  feeTypeMin: 6,
  feeTypeMax: 14,
  networkMin: 4,
  networkMax: 20,
  feeAmountMin: 1,
  feeAmountMax: 2,
  gstMin: 1,
  gstMax: 2,
  assetPairNameMin: 7,
  assetPairNameMax: 12,
  pairIdMin: 0,
  pairIdMax: 25,
  assetIdMin: 10,
  assetIdMax: 14,
  decimalPlacesMin: 1,
  decimalPlacesMax: 2,
  adminUserIdMin: 10,
  adminUserIdMax: 12,
  assetDescriptionMin: 20,
  assetDescriptionMax: 200,
  withdrawalLimitMinMin: 3,
  withdrawalLimitMinMax: 5,
  withdrawalLimitMaxMin: 3,
  withdrawalLimitMaxMax: 5,
  depositLimitMinMin: 3,
  depositLimitMinMax: 6,
  depositLimitMaxMin: 3,
  depositLimitMaxMax: 6,
  hotWalletAddressMin: 10,
  hotWalletAddressMax: 50,
  statusMin: 1,
  statusMax: 2,
  multisigWithdrawalLimitMin: 1,
  multisigWithdrawalLimitMax: 6,
  userDailyWidLimitMin: 3,
  userDailyWidLimitMax: 5,
  internalTransferFeeMin: 1,
  internalTransferFeeMax: 2,
  contractAddressBtxTestnetMin: 20,
  contractAddressBtxTestnetMax: 50,
  contractAddressBtxMainnetMin: 20,
  contractAddressBtxMainnetMax: 50,
  networkTypeMin: 4,
  networkTypeMax: 20,
  depositStatusMin: 1,
  depositStatusMax: 1,
  withdrawalStatusMin: 1,
  withdrawalStatusMax: 1,
  disclaimerMin: 50,
  disclaimerMax: 200,
  assetTypeMin: 4,
  assetTypeMax: 6,
  securityQuestionMin: 10,
  securityQuestionMax: 100,
  bankNameMin: 8,
  bankNameMax: 25,
  categoryMin: 8,
  categoryMax: 8,
  explorerLinkMin: 20,
  explorerLinkMax: 150,
  networkSymbolMin: 5,
  networkSymbolMax: 25,
  orderIdMin: 10,
  orderIdMax: 35,
};



export const getSide =(side:string)=>{
  switch (side) {
    case 'BUY':
      return Side.BUY;
    case 'SELL':
      return Side.SELL;
    default:
      throw new Error(`Unknown side: ${side}`);
  }
}

export const getOrderType=(orderType:string)=>{
  switch (orderType) {
    case 'LIMIT':
      return OrderType.LIMIT;
    case 'MARKET':
      return OrderType.MARKET;
    case 'STOP_LOSS':
      return OrderType.STOP_LOSS;
    case 'STOP_LOSS_LIMIT':
      return OrderType.STOP_LOSS_LIMIT;
    case 'TAKE_PROFIT':
      return OrderType.TAKE_PROFIT;
    case 'TAKE_PROFIT_LIMIT':
      return OrderType.TAKE_PROFIT_LIMIT;
    case 'LIMIT_MAKER':
      return OrderType.LIMIT_MAKER;
    default:
      throw new Error(`Unknown order type: ${orderType}`);
  }
}

// export {c}