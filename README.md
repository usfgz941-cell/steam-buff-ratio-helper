# Steam 挂刀比例助手（BUFF → Steam）

用于 CS2 挂刀工作的 Tampermonkey 用户脚本：导入 **BUFF 历史购买记录**，在 Steam 出售窗口里实时显示这件饰品的 **实际挂刀比例**，并结合当前卖盘与近期成交给出 **快速 / 均衡 / 耐心** 三档挂价建议。

> 核心原则：`0.70` 是底线，不是目标价。脚本优先读取 Steam 出售框真实的 **“您收款”**，而不是用“买家支付”直接估算比例。

## 🚀 安装最新版

1. Edge / Chrome 安装 Tampermonkey。
2. 打开下面的脚本地址，Tampermonkey 会进入安装页面：

**[安装 steam_buff_ratio_helper.user.js](https://raw.githubusercontent.com/usfgz941-cell/steam-buff-ratio-helper/main/steam_buff_ratio_helper.user.js)**

3. 安装后刷新 Steam 库存页。
4. 右下角出现 **“挂刀助手”** 即表示脚本已加载。

详细步骤见 [`docs/INSTALL.md`](docs/INSTALL.md)。

## ✅ 第一次使用

1. 在 BUFF 导出购买记录 CSV。
2. Steam 库存页 → **挂刀助手** → **导入 / 更新 CSV**。
3. 打开一件饰品的“物品上架出售”窗口。
4. 脚本自动匹配历史成本；同名多笔默认 FIFO，也可以手动切换。
5. 在 **“买家支付”** 输入价格。
6. Steam 计算 **“您收款”** 后，脚本实时显示：
   - BUFF 实际买入成本；
   - Steam 实际到账；
   - 实际挂刀比例；
   - `0.70` 底线价；
   - 当前卖盘；
   - 快速 / 均衡 / 耐心建议价。

首次建议用低价饰品按 [`docs/TEST_CHECKLIST.md`](docs/TEST_CHECKLIST.md) 跑一遍完整验收。

## 🧮 比例口径

```text
实际比例 = BUFF 实际买入成本（CNY × CNY→UAH 汇率） / Steam 实际到账 UAH
```

例如：

```text
BUFF 成本：¥4.96
汇率：¥1 = ₴6.65
Steam 您收款：₴51
实际比例 ≈ 4.96 × 6.65 / 51 ≈ 0.647
```

为什么不用“买家支付”？因为 Steam 的手续费、最低手续费以及 UAH 价格步长 / 取整最终都会反映在 **“您收款”** 中。直接读取这个数字更可靠。

> 注意：比例的结果还取决于 CNY→UAH 的估值口径。NBU 中间价只是一种参考；真实决策应优先使用用户实际获得 UAH Steam 余额的成本汇率。

## 🎯 推荐挂价

| 模式 | 目标 | 当前逻辑 |
| --- | --- | --- |
| 快速 | 优先成交 | 跟随当前最低卖价，但不突破比例底线 |
| 均衡 | 少让价、不过度排队 | 识别低价孤单、密集卖盘、前方队列，并参考近期成交量 |
| 耐心 | 更优比例 | 接受更长队列，并参考近 7 日成交中位价 |

如果比例底线对应的最低售价**明显高于当前正常市场**，v0.1.2 不再强行生成三档相同推荐价，而会直接提示：**当前市场不满足比例底线，建议暂不上架 / 等待市场变化**。

推荐价是启发式建议，不保证成交时间。算法说明见 [`docs/ALGORITHM.md`](docs/ALGORITHM.md)。

后续算法最重要的问题不是“指标更多”，而是估计：**多让一个价格档位，实际能换来多少成交速度。**

## 📦 数据与匹配

- CSV 再次导入会自动合并、去重。
- 同名饰品有多笔历史成本时，默认优先使用最早未售记录（FIFO）。
- 可以手动切换成本记录，并将记录标记为“已售”。
- BUFF 的旧 `assetid` 不被当作永久身份标识；交易后 Steam 的 asset id 可能变化。
- FIFO 是默认的会计成本分配，不应被误解为已经精确识别到某一件物理饰品。
- v0.1.2 起，成本匹配与本地 assignment 会按当前 SteamID 隔离，降低多账户串成本风险。
- 成本匹配和数据模型见 [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md)。

## 🔐 安全边界

- 不读取或上传 Steam 密码、Cookie、API Key。
- 不自动勾选 Steam 协议。
- 不自动确认上架，也不代替手机确认。
- BUFF CSV 与已售状态保存在浏览器本地。
- 默认仅额外请求 NBU 官方汇率接口；也可改为手动汇率。
- **不要把个人 BUFF CSV 提交到这个公开仓库。**

详见 [`SECURITY.md`](SECURITY.md)。

## 🧭 项目状态

当前安装器版本：**v0.1.2**  
当前核心功能版本：**v0.1.2**

v0.1.2 已完成：

- [x] BUFF CSV 导入 / 更新 / 去重
- [x] Steam 出售窗口自动匹配历史成本
- [x] 按 Steam “您收款”实时计算比例
- [x] `0.70` 可配置底线
- [x] Steam 当前卖盘读取
- [x] 近 7 日成交参考
- [x] 快速 / 均衡 / 耐心三档建议
- [x] “底线远高于市场”时停止伪推荐并提示等待
- [x] FIFO、手动成本切换、已售标记
- [x] 按当前 SteamID 隔离 BUFF 成本匹配 / assignment
- [x] CNY→UAH 自动 / 手动汇率
- [x] 手续费预估优先调用 Steam 自身费率函数
- [x] 已校验源码缓存、网络失败重试、SHA-256 完整性校验

已完成工程补强：

- [x] payload SHA-256 与语法自动检查脚本
- [x] GitHub Actions 持续验证
- [x] 公开发行包隐私扫描
- [x] 外部方案调研与缺口审计

下一阶段：

- [ ] 在真实乌克兰区出售窗口完成更多兼容性验证
- [ ] 将运行时远程 payload 过渡为单文件、可审计构建产物
- [ ] 推荐价 V2：估计前方队列与预计等待时间，而不是只看价格档位
- [ ] 增加中英文饰品别名映射
- [ ] 增加一键诊断信息导出

## 🔎 外部调研与查漏补缺

本轮对照了 Steam 社区市场前端实现和成熟社区脚本，重点结论见：

- [`docs/RESEARCH_AUDIT_2026-08.md`](docs/RESEARCH_AUDIT_2026-08.md) — 官方实现、社区方案与 P0/P1 缺口
- [`scripts/verify-dist.mjs`](scripts/verify-dist.mjs) — 发行包完整性、语法和隐私检查
- [`.github/workflows/verify.yml`](.github/workflows/verify.yml) — 每次提交自动验证

## 📚 文档

- [`docs/INSTALL.md`](docs/INSTALL.md) — 安装与第一次使用
- [`docs/TEST_CHECKLIST.md`](docs/TEST_CHECKLIST.md) — 每个版本的实机验收清单
- [`docs/ALGORITHM.md`](docs/ALGORITHM.md) — 比例与推荐价算法
- [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) — BUFF CSV、成本匹配与 FIFO
- [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md) — 常见问题与排查
- [`docs/MAINTENANCE.md`](docs/MAINTENANCE.md) — GitHub / Notion 的维护分工
- [`SECURITY.md`](SECURITY.md) — 数据安全与隐私边界
- [`CHANGELOG.md`](CHANGELOG.md) — 版本记录

## 🗂️ 维护约定

- **GitHub 是代码与版本的唯一权威来源**：脚本、安装链接、算法文档、版本记录都以这里为准。
- **Notion 是个人使用手册与决策记录**：保存实际测试结果、参数偏好、问题记录和后续迭代结论。
- 修改代码/算法时，先更新 GitHub；实际使用验证后，再把结论同步到 Notion。
- 具体同步规则见 [`docs/MAINTENANCE.md`](docs/MAINTENANCE.md)。

## License

MIT
