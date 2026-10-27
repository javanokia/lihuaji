# 03 苏绣数字针迹交互教学软件 — 申报前审计

> 状态：仅供内部核验，不是拟直接上传的法定申请表、源程序鉴别材料或可签章用户手册。基线源码：`6b010f61aa116395c1e0356949f1f5f251b77c3f`（2026-10-18）；如 main 更新，重新核验。
> 已知存在 Codex 等 AI 辅助编写代码的实际开发记录；不能声明“未使用 AI 编写代码／文档／申请材料”。任何正式申请均需本人核对现行签章页并由办理机构明确合法受理路径。

## 真实功能界限
- 入口：`https://yzou6525-ai.github.io/lihuaji/#ar` 的“数字针迹实验室”区域，不代表 AR 与针迹实验室是一项不可分割的程序。
- 读取自定义针迹 JSON 数据，进行顺序校验、速度控制、播放暂停、前后针跳转、时间拖动、针落点显示、缩放和平移。
- 当前样例包含直线针、套针、滚针，以及项目自编的梨花瓣56针散套数字显影（28/14/14分组、11秒视觉时间线）。**不是工艺专家批准的固定针数和实物绣制过程**。

## 核心文件
- `assets/stitch-lab.js`。
- `assets/stitch/StitchPlayer.js`、`StitchRenderer.js`、`StitchSurface.js`、`SantaoTimeline.js`、`SantaoVisual.js`、`SantaoExperience.js`。
- `content/stitch-demos/demo-straight-basic.json`、`demo-tao-basic.json`、`demo-gun-basic.json`、`demo-santao-pear-petal.json`。
- 测试：`scripts/stitch.test.cjs`、`scripts/stitch-acceptance.cjs`、`scripts/santao-cinematic.test.cjs`、`scripts/santao-cinematic-acceptance.cjs`。
- 第三方依赖：`assets/vendor/three` 由 Three.js MIT 提供，其源代码不属于申请人。自研为状态管理、针迹播放器控制和展示封装等部分。

## 实际操作与截图清单
1. 打开 `#ar` 找到针迹实验室，截图实验室界面和项目示意免责声明。
2. 选“直线针”运行上一针/下一针/暂停/进度拖动/显示落点；记下实际观察到的针数。
3. 切换套针与滚针，保存关键播放状态截图与失败案例。
4. 选择散套针梨花瓣，观察 0、28、42、56 针的显示变化与分组；固定视图截图。
5. 启动11秒数字显影，实测暂停、继续、seek、返回普通播放；保存操作截图。
6. 在开发环境执行 `npm test` 与 `node scripts/stitch-acceptance.cjs`（浏览器依赖存在时），记录真实退出码、日期和环境，不把模拟触控测试写成真机。

## 独立性重点
- 当前位于综合 `#ar` 页面；提取登记范围时确认针迹实验室能独立运行，且没有无授权包含 AR 或其他外部功能。
- 不用官方 MOOC 视频或 Ricuci iframe 充实“自主开发核心源代码”。
- 真实版权人、完成/发表时间、版本与 AI 使用范围待人工确认。

## 验收门槛
[ ] 播放状态与 JSON 可核实  [ ] UI真实截图  [ ] 测试结果可复现  [ ] Three.js 许可清楚  [ ] 未宣称专家教学成果  [ ] 独立软件依赖清楚  [ ] 已处理签章障碍
