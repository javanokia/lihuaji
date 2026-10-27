import React from 'react';
import { useApp } from '../context/AppContext';
import { PageTitle } from '../components/PageTitle';

export const Collaborate: React.FC = () => {
  const { site } = useApp();
  const repoUrl = site?.repository || 'https://github.com';

  return (
    <>
      <PageTitle
        title="一起修改梨花季"
        sub="通过公开GitHub仓库协作，提交到main分支后自动更新网站。"
      />

      <article className="card docs-text">
        <h2>给朋友开放修改权限</h2>
        <p>
          仓库所有者打开下方“管理合作者”，选择 Add people，输入朋友的GitHub用户名，发送邀请。朋友接受后即可编辑仓库文件。
        </p>
        <div className="row">
          <a className="btn primary" href={repoUrl} target="_blank" rel="noopener noreferrer">
            打开公开仓库
          </a>
          <a
            className="btn"
            href={`${repoUrl}/settings/access`}
            target="_blank"
            rel="noopener noreferrer"
          >
            管理合作者（仅所有者）
          </a>
        </div>

        <h2>从哪里改内容</h2>
        <ul>
          <li>content/site.json：网站标题、介绍和提示。</li>
          <li>content/patterns.json：纹样标题、地区、来源和许可。</li>
          <li>content/products.json：文创图册与款式介绍。</li>
          <li>src/、style.css、pages.css：页面布局、交互与样式。</li>
        </ul>
        <a
          className="btn"
          href={`${repoUrl}/edit/main/content/site.json`}
          target="_blank"
          rel="noopener noreferrer"
        >
          编辑首页文字
        </a>

        <h2>怎样重新发布</h2>
        <p>
          编辑后点击 Commit changes，提交到 main；如果创建了分支，则由所有者合并 Pull Request 到 main。仓库会自动运行 Publish GitHub Pages。等待 Actions 显示绿色成功，再刷新网站。也可在 Actions → Publish GitHub Pages → Run workflow 手动重新发布。
        </p>
        <a
          className="btn"
          href={`${repoUrl}/actions`}
          target="_blank"
          rel="noopener noreferrer"
        >
          查看发布进度
        </a>
        <p>
          不需要服务器、信用卡或自购域名。公开仓库里的文件所有人都能看，请勿上传密码、客户照片或订单。
        </p>
      </article>
    </>
  );
};
