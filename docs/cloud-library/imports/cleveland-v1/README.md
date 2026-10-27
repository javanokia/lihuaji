# Cleveland 祥云素材 · GitHub 交付
仓库路径：`docs/cloud-library/imports/cleveland-v1/`

内容：
- `CMA_50_TARGETS.json`：50个拟裁切位置/命名，来自26个馆藏编号；尚未目视核验
- `download_cma_images.mjs`：通过馆方 Open Access API 验证 CC0，下载官方原图
- `CODEX_执行口令.md`：可直接交给 Codex 的操作和合规验收标准

使用：
```bash
node docs/cloud-library/imports/cleveland-v1/download_cma_images.mjs
```

**重要**：源图片不包含在仓库里，只有下载候选和工具。运行后生成 `sources/` 和 `download_report.json`；需要真实查看照片、裁切、去重后才能合并现有图库。官方图片可能存在无法访问或未获 CC0 的情况，应跳过。

馆方 API: https://openaccess-api.clevelandart.org/
