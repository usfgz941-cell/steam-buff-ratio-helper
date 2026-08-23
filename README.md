# Steam 挂刀比例助手（BUFF → Steam）

一个用于 CS2 挂刀工作的 Tampermonkey 用户脚本：导入 BUFF 购买记录，在 Steam 出售窗口实时显示实际挂刀比例，并给出快速 / 均衡 / 耐心三档挂价建议。

## 安装最新版

**Tampermonkey 安装地址：**

https://raw.githubusercontent.com/usfgz941-cell/steam-buff-ratio-helper/main/steam_buff_ratio_helper.user.js

安装 Tampermonkey 后打开上面的 `.user.js` 地址，确认安装即可。

## 当前版本

`v0.1.0`

### 已实现

- 导入 BUFF 导出的购买记录 CSV；再次导入自动合并、去重。
- Steam 出售窗口自动匹配历史实际买入成本。
- 输入“买家支付”时，优先读取 Steam 实际“您收款”，实时计算挂刀比例。
- 默认比例底线 `0.70`，可修改。
- 读取当前卖盘，并给出快速 / 均衡 / 耐心三档建议价。
- 同名多笔成本默认 FIFO，可手动切换并标记已售。
- BUFF 记录和状态保存在浏览器本地。
- 不自动确认出售，不读取 Steam 密码、Cookie 或 API Key。

## 比例口径

```text
实际比例 = BUFF 实际买入成本（折合 UAH） / Steam 实际到账 UAH
```

重点：分母使用 Steam 出售窗口的 **“您收款”**，不是“买家支付”。这样可以直接包含 Steam 手续费和 UAH 整数取整。

## 推荐价

- **快速**：优先成交，接近当前最低卖价。
- **均衡**：结合低价孤单、密集卖盘、前方排队数量，尽量少让价。
- **耐心**：允许更长队列，并参考近期成交数据。

推荐价是启发式建议，不保证成交；`0.70` 是底线，而不是目标价。

## 使用

1. 安装 Tampermonkey。
2. 安装 `steam_buff_ratio_helper.user.js`。
3. 刷新 Steam 库存页面。
4. 点击右下角“挂刀助手”。
5. 导入 BUFF 导出的购买记录 CSV。
6. 打开某件饰品的 Steam 出售窗口。
7. 在“买家支付”输入价格，查看实时比例和建议。

详细说明见 [`docs/INSTALL.md`](docs/INSTALL.md)。

## 数据安全

请不要把自己的 BUFF CSV、Steam Cookie、API Key 或其他账户凭据提交到公开仓库。脚本本身不包含个人交易记录。

## License

MIT
