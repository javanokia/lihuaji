import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'lihuaji-assets-export');

console.log('Packaging standalone assets repository into: ' + outDir);

if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

// Copy assets, content, contracts
fs.cpSync(path.join(root, 'assets'), path.join(outDir, 'assets'), { recursive: true });
fs.cpSync(path.join(root, 'content'), path.join(outDir, 'content'), { recursive: true });
fs.cpSync(path.join(root, 'contracts'), path.join(outDir, 'contracts'), { recursive: true });

// Create .nojekyll
fs.writeFileSync(path.join(outDir, '.nojekyll'), '', 'utf8');

// Create README.md for the assets repository
const readmeContent = `# 梨花季·译绣 · 独立数据与素材仓库 (Lihuaji Assets)

此仓库为《梨花季·译绣》的独立媒体与数据资产仓库（方案 B 解耦架构）。
网站主程序仓库只需上传轻量 Web 编译文件（< 1MB），所有大体积纹样图像与文化数据直接引用此仓库。

## 启用步骤

1. 在 GitHub 创建新公开仓库，命名为 \`lihuaji-assets\`。
2. 将此目录中的全部内容推送到该仓库的 \`main\` 分支。
3. 打开仓库 **Settings** → **Pages**，在 **Build and deployment** 下选择 **Deploy from a branch**，分支选择 \`main\` / \`/ (root)\`，点击 **Save**。
4. 获取该资产仓的 Pages 访问地址（例如 \`https://<username>.github.io/lihuaji-assets\`）。
5. 回到主网站代码仓库，在 GitHub Actions Secrets 或环境变量中配置：
   \`\`\`
   VITE_ASSETS_BASE_URL=https://<username>.github.io/lihuaji-assets
   VITE_DATA_BASE_URL=https://<username>.github.io/lihuaji-assets
   \`\`\`
6. 后续主网站代码每次修改部署，仅需推送几百 KB 编译包，无需再上传任何图片！
`;

fs.writeFileSync(path.join(outDir, 'README.md'), readmeContent, 'utf8');

console.log('Standalone assets repository ready in: ' + outDir);
console.log('You can initialize a git repo inside it and push to https://github.com/<username>/lihuaji-assets');
