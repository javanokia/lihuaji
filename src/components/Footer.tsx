import React from 'react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { site } = useApp();

  return (
    <footer>
      <div className="footer-brand">
        梨花季·译绣 <span className="seal">绣</span>
        <span className="english">TRADITION MEETS THE FUTURE</span>
      </div>
      <div className="footer-links">
        <a href="#about">功能与隐私</a>
        <a href="#collaborate">协作修改</a>
        <a href="#guide">苏绣知识</a>
      </div>
      <p id="mode-banner">
        {site?.notice || '文化互动展示 · 照片在本机处理'}
      </p>
    </footer>
  );
};
