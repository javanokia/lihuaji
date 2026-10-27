# Codex 执行口令 — Cleveland 祥云第三批
仓库：yzou6525-ai/lihuaji。当前目录：docs/cloud-library/imports/cleveland-v1/
这不是50张已经裁好的图，而是50项提取任务，涉及26个待复核馆藏编号。先执行 git status && git pull --ff-only，检查现有 The Met、Smithsonian 导入和性能优化状态，不覆盖其他改动。

1. 阅读 CMA_50_TARGETS.json 和 README.md，在 Node 18+ 的联网工作区运行 node docs/cloud-library/imports/cleveland-v1/download_cma_images.mjs。
2. 该脚本只接受 Cleveland 官方图片地址，并以官方 API share_license_status=CC0 为硬门槛；结果保存在 sources/ 和 download_report.json。若网络失败，不得假称已拿到图片。
3. 逐一观察已下载高清原图，参照每条 projectTitle 找清晰完整的祥云；目视确定裁切区域，记录原图尺寸、归一化 cropRect、云形审美与取舍理由。禁止把整件龙袍、器物或鸟龙裁切当作独立云纹；禁止 AI 重绘、复制同一云换名凑数。
4. 对每个通过视觉验收的云纹使用 Pillow/现有图像工具生成真正不同的本地 WebP 高质量裁切图和 400-600px 缩略图，留足边缘安全区；生成带编号 contact sheet；用图像哈希及人工审美复核排重。
5. 只有具有官方CC0核验、原图、真实云纹裁切、来源信息、缩略图和不重复内容的条目才能导入当前项目已有的祥云/纹样图库。**不创建新图库页面**。保存官方 accession、馆藏原名、链接、许可检查时间和裁切参数；不允许未经3D测试就写 threeDReady:true。
6. 兼容现有列表的增量渲染、缩略图和加载优化；不修改 AR、targets.mind、Stitch Lab、56针、课程、Ricuci、学习路径。
7. 运行全站现有 npm test、build、图库/AR 回归；报告下载成功源图数、跳过数、实际合格云纹图数、可视总览、实际图库新增数、最终 Git SHA。少于50张就如实报告，不造假。保存网页和来源截图供我审美验收。
8. 只有成功核验后的成果才可入库。本轮结束后停止，不自动延伸第四个平台。

提醒：本目录只提供下载脚本与真实馆藏候选清单，未包含50张高清原图或已裁好的50张祥云。
