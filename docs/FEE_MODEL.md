# Steam 手续费与价格取整模型

## 为什么不能统一写成“买家支付 ÷ 1.15”

Steam 社区市场前端不是简单把买家总价除以 `1 + 5% + 10%`。它还会使用当前钱包货币的：

- `wallet_market_minimum`：市场最小金额；
- `wallet_currency_increment`：允许的价格步长；
- `wallet_fee_percent`：Steam 手续费比例；
- `wallet_publisher_fee_percent_default`：游戏发行商手续费比例。

每一笔费用都要先按当前货币规则归一化。低价和整数货币下，最低手续费与取整会使多个“买家支付”价格映射到同一个“您收款”。

Steam 前端参考实现：

- `ToValidMarketPrice`
- `CalculateFee`
- `GetTotalWithFees`
- `GetItemPriceFromTotal`

来源：

- https://github.com/SteamTracking/SteamTracking/blob/master/steamcommunity.com/public/javascript/economy_common.js

## 本项目的优先级

### 1. 第一优先：读取 Steam 页面真实“您收款”

用户正在输入价格时，Steam 自己已经根据当前账户、当前币种和当前物品计算出最终到账。这个数字是实际出售决策的最高优先级来源。

### 2. 第二优先：使用当前页面的钱包元数据预估

当“您收款”尚未刷新或 DOM 读取失败时，脚本可以读取 `unsafeWindow.g_rgWalletInfo`，按 Steam 同源算法预估。

### 3. 禁止作为最终值：固定 15% 近似

固定 `总价 / 1.15` 只允许用于粗略展示，不能用于底线判断、自动推荐或标记“安全”。

## 推荐实现接口

```js
function getWalletFeeModel(walletInfo) {
  return {
    minimum: Number(walletInfo.wallet_market_minimum ?? 1),
    increment: Number(walletInfo.wallet_currency_increment ?? 1),
    steamFee: Number(walletInfo.wallet_fee_percent ?? 0.05),
    publisherFee: Number(walletInfo.wallet_publisher_fee_percent_default ?? 0.10),
  };
}
```

候选价应以钱包最小单位的整数表示，避免浮点误差。

## 必测边界

- UAH 买家支付 `₴54–₴60` 的连续映射；
- 最低手续费区间；
- 两个或更多总价映射到同一卖家到账；
- 价格步长大于 1 的货币；
- Steam 页面实际值与本地预估值不一致时，必须以页面值为准并记录诊断信息。
