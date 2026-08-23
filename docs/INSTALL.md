# 安装与使用

## 1. 安装 Tampermonkey

在 Edge / Chrome 中安装 Tampermonkey。

## 2. 安装脚本

打开：

https://raw.githubusercontent.com/usfgz941-cell/steam-buff-ratio-helper/main/steam_buff_ratio_helper.user.js

Tampermonkey 应识别为用户脚本，确认安装即可。

## 3. 导入 BUFF 记录

1. 打开 Steam 库存页面并刷新。
2. 点击右下角 **挂刀助手**。
3. 点击 **导入 / 更新 CSV**。
4. 选择 BUFF 导出的购买记录 CSV。
5. 后续有新购买记录时，重新导出完整 CSV 再导入即可；脚本会合并去重。

> 不要把自己的 BUFF CSV 上传到这个公开 GitHub 仓库。

## 4. 实时比例

打开 Steam 的“物品上架出售”窗口后：

- 脚本会匹配该饰品的 BUFF 实际买入成本；
- 你在 **买家支付** 输入价格；
- Steam 自动计算 **您收款**；
- 脚本用 Steam 的实际到账计算比例。

公式：

```text
实际比例 = BUFF 实际买入成本（折合 UAH） / Steam 实际到账 UAH
```

比例越低越好。默认 `0.70` 是最低可接受底线，不是推荐目标。

## 5. 推荐挂价

当前提供三档：

- **快速**：偏成交速度；
- **均衡**：在排队数量和比例之间平衡；
- **耐心**：更倾向较高售价 / 更低比例。

点击推荐价格只会填入“买家支付”，不会自动勾选协议或确认出售。

## 6. 数据安全

- BUFF CSV 和已售状态保存在 Steam 域名的浏览器本地存储中。
- 脚本不读取 Steam 密码、Cookie、API Key。
- 不自动出售，不代替手机确认。
- 汇率默认从乌克兰国家银行 NBU 获取，也可改为手动汇率。

## 7. 出现问题

把以下内容发给 ChatGPT 即可继续排查：

- Steam 出售窗口完整截图；
- 挂刀助手面板截图；
- 浏览器开发者工具 Console 中 `[挂刀助手]` 开头的错误。
