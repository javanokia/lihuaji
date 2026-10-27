# 04 传统纹样 AR 识别与分层展示软件 — 申报前审计

> 状态：仅供内部核验，不是拟直接上传的法定申请表、源程序鉴别材料或可签章用户手册。基线源码：`6b010f61aa116395c1e0356949f1f5f251b77c3f`（2026-10-18）；如 main 更新，重新核验。
> 已知存在 Codex 等 AI 辅助编写代码的实际开发记录；不能声明“未使用 AI 编写代码／文档／申请材料”。任何正式申请均需本人核对现行签章页并由办理机构明确合法受理路径。

## 真实功能界限
- 入口：`https://yzou6525-ai.github.io/lihuaji/#ar`。AR 嵌入页面：`assets/ar-experience.html`。
- 基于预设 MindAR 识别卡进行图像特征匹配及跟踪，叠加原项目生成的 2.5D 图层构图，并提供“赏纹/解绣/看针”、展开收拢、拖动旋转、图层拾取、工艺说明和识别丢失恢复。
- 故事模块生成的特定 SVG 可按语义拆成五层，进入现有 AR；使用**固定梨花识别卡定位**。没有“任意上传 2D 图片自动生成真实三维网格”能力。
- 公开验证记录主要是桌面浏览器、合成媒体流和预设示例匹配，不能写成 iPhone/Android 实体相机全通过。

## 核心文件
- `assets/ar-experience.js`、`assets/ar-experience.html`、`assets/ar-experience.css`。
- `assets/ar/LayeredPattern.js`、`TrackingState.js`、`Tween.js`、`CraftOverlay.js`、`SantaoARAdapter.js`；若针迹实验室单独登记，散套针播放器部分只能明确归属与实际引用，不应重复扩充两套原创主体。
- `assets/ar/svg-layers.js`：允许元素安全校验、5层位图渲染，属于 SVG 特定条件的分层处理，并非任意图像理解或3D重建。
- `assets/ar-assets/targets.json`、`assets/ar-assets/targets.mind`、`assets/ar-assets/layers/pear-blossom/`：运行资源，不是全部由用户独创的程序。
- 第三方：MindAR 与 Three.js 在 `assets/vendor/`，必须明确依赖、版权和许可证。
- 测试：`scripts/ar-state.test.cjs`、`scripts/ar-acceptance.cjs`、`scripts/ar-site-regression.cjs`、`scripts/ar-santao-acceptance.cjs`。

## 实际操作与截图清单
1. 打开 `#ar`，记录网页地址和加载后 3D 预览。
2. 依次操作“赏纹/解绣/看针”，展示展开、点选、收拢；截图不同状态。
3. 用“示例图片验证识别”取得识别状态记录；说明它不是实体摄像头。
4. 用第二屏或打印卡在**实体手机**上经用户本人授权使用摄像头，记录设备型号、系统、浏览器、灯光、识别成功/失败与恢复；没测就标未测。
5. 从故事模块生成 SVG，进入“我的绣境”，核验五层、相对坐标与固定识别卡；保存实际截图。
6. 在开发环境执行 `npm test`、`node scripts/ar-acceptance.cjs`、`node scripts/ar-site-regression.cjs`；依赖缺失则如实报告。

## 独立性重点
- 核心新增创作为图层渲染/动画/互动状态等，不是声称独立开发 MindAR / Three.js。
- 不能用生成图像原始素材或第三方 MIT 库凑“原创代码”页。
- 真实版权人、完成/发表日期、版本、AI 辅助范围待人工确认。

## 验收门槛
[ ] 图像识别路径核实  [ ] 层级交互截图  [ ] 第三方许可清楚  [ ] 真机结果如实登记  [ ] 独立性和共享代码已复核  [ ] 已处理签章障碍
