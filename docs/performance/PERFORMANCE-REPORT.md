# 《梨花季》V10 性能优化实测报告

**验收日期：** 2026-10-18  
**发布地址：** https://yzou6525-ai.github.io/lihuaji/  
**版本：** `df35a27`（V10 路由与目录加载优化）

## 结果

新版已发布到 GitHub Pages。桌面端按相同验收脚本测试 8 个主要路由，请求数合计从 332 降至 253（减少 23.8%）；各响应的 `Content-Length` 合计从 10,549,971 降至 7,812,463 字节（减少 25.9%）。移动端覆盖的 5 个路由中，请求数从 200 降至 157（减少 21.5%），响应内容长度合计减少 23.0%。

| 页面 | 桌面请求数：前 → 后 | 页面响应内容长度：前 → 后 | 目录加载结果 |
|---|---:|---:|---|
| 首页 | 30 → 17 | 1,283,974 → 1,086,405 字节 | 只加载站点基础数据 |
| 纹样库 | 50 → 39 | 2,942,649 → 844,504 字节 | 只加载纹样目录；首屏 24 张，滚动后 48 张 |
| 商品列表 | 59 → 39 | 1,003,082 → 840,319 字节 | 只加载商品目录；首屏 12 件，滚动后 24 件 |
| 商品详情 | 27 → 15 | 1,070,378 → 729,291 字节 | 不加载纹样目录 |
| 祥云搜索 | 34 → 27 | 1,104,207 → 865,727 字节 | 搜索页面按需加载纹样和商品数据 |
| 纹样详情 | 52 → 43 | 1,257,228 → 1,657,521 字节 | 只加载纹样目录；打开详情后读取大图，因此本路由测得传输量上升 |
| AR | 37 → 35 | 760,587 → 765,505 字节 | 只加载站点基础数据；AR 模块在进入该功能后加载 |
| 学习路径 | 43 → 38 | 1,127,866 → 1,023,191 字节 | 只加载站点基础数据 |

纹样详情的测量包括打开第一张纹样的大图；该大图保留了详情查看质量，所以这一路由的内容长度增加。AR 页面路由本身请求数减少，但总字节基本持平，主要资源来自 AR 展示所需文件。其余主要路由都减少了页面响应量。公网 LCP、页面稳定时间会受网络和 GitHub CDN 波动影响，本报告不把单次计时变化作为稳定提速承诺。

## 功能与兼容验收

- 首页不预载纹样与商品目录。
- 纹样库和商品长列表保持原有界面，改为分批追加；没有替换已有卡片。
- 商品卡片使用本地 WebP 缩略图；进入详情仍可查看原图。75 件商品数据保留。
- 祥云纹样库保留 1,088 条记录；本轮仅为馆藏图片补充缩略图数据与文件。
- 8 个桌面路由以及 5 个移动端路由均返回 HTTP 200；没有 JavaScript 错误或横向溢出。
- 学习路径中的外部课程框架在导航切换时会取消未完成的请求（浏览器记录 `ERR_ABORTED`）；这是已知的框架导航行为，不影响页面本身加载。
- 页面结构、导航和视觉设计未作重做；本轮聚焦于按需加载、图片缩略图和长列表渲染。

## 验证记录

- `scripts/build.mjs`：通过，验证 1,088 条纹样、75 件商品及静态站点构建。
- 自动测试：59 项通过，0 项失败。
- 本地浏览器流程：AR、散套针动画、数字工具、学习路径、纹样库、馆藏云纹、刺绣工艺参考稿、故事转纹样等既有验收通过。
- 公开网址：使用 Edge 浏览器在桌面及 390×844 移动视口实测；完整数据见 [`after-metrics.json`](after-metrics.json)。

运行测试：

```powershell
node scripts/build.mjs
node --test scripts/ar-state.test.cjs scripts/story.test.cjs scripts/library.test.cjs scripts/met-clouds.test.cjs scripts/suxiu.test.cjs scripts/stitch.test.cjs scripts/stitch-course.test.cjs scripts/digital-tools.test.cjs scripts/learning-paths.test.cjs scripts/santao-cinematic.test.cjs scripts/ar-santao.test.cjs
```

## 截图

- [首页桌面](validation/after-home.png) · [首页手机](validation/after-home-mobile.png)
- [纹样库桌面](validation/after-library.png) · [纹样库手机](validation/after-library-mobile.png)
- [商品列表桌面](validation/after-gallery.png) · [商品列表手机](validation/after-gallery-mobile.png)
- [祥云搜索](validation/after-search-cloud.png) · [AR 页面](validation/after-ar.png) · [学习路径](validation/after-learning-path.png)

## 测量口径

数据来自同一 Playwright 验收脚本在上一公开版和本次公开版的两次采样。请求数按浏览器请求 URL 去重；“页面响应内容长度”是本次导航中带 `Content-Length` 响应头的长度之和，不等同于不同网络环境下的实际线路流量。首屏卡片数、滚动追加数、目录请求范围、浏览器错误和页面溢出由脚本直接检查。公网耗时会受缓存、CDN 和网络状态影响，应以请求范围与页面负载数据作为主要对比。
