# Changelog

## Unreleased

### Documentation / maintenance

- 重写 README，补充安装入口、首次使用、比例口径、项目状态与文档导航。
- 完善安装文档，加入首次实测检查清单和更新流程。
- 新增 `docs/ALGORITHM.md`：解释比例底线与快速 / 均衡 / 耐心推荐逻辑。
- 新增 `docs/DATA_MODEL.md`：解释 BUFF 历史成本、FIFO、asset id 与手动覆盖。
- 新增 `docs/TROUBLESHOOTING.md`：集中记录常见故障与反馈格式。
- 新增 `SECURITY.md`：明确本地数据、网络请求和账户凭据边界。
- 新增 `.gitignore`，降低误提交个人 BUFF CSV / 本地交易数据的风险。
- 明确维护规则：GitHub 是代码与版本权威来源，Notion 是个人使用手册与实际验证记录。

## v0.1.0 — 2026-08-24

- 首版。
- 支持导入 / 更新 BUFF 购买记录 CSV。
- Steam 出售窗口自动匹配实际买入成本。
- 根据 Steam “您收款”实时计算实际挂刀比例。
- 默认 `0.70` 比例底线，可调整。
- 加入快速 / 均衡 / 耐心三档推荐挂价。
- 加入 FIFO 成本匹配、手动切换成本和已售标记。
- 使用 NBU CNY→UAH 汇率并支持手动汇率。
- 安装脚本加入 GitHub 自动更新地址与完整性校验。
