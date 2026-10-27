import React, { useState } from 'react';
import type { Pattern } from '../types';
import { safeLink, resolveAsset } from '../utils/download';
import { useApp } from '../context/AppContext';

export const PatternDetailModal: React.FC<{ pattern: Pattern; onClose: () => void }> = ({
  pattern: p,
  onClose,
}) => {
  return (
    <div>
      <h2>{p.title}</h2>
      <img className="image-fit" src={resolveAsset(p.image)} alt={p.title} />
      <p>{p.description || ''}</p>
      <p>
        {p.region} · {p.source || ''} · {p.license || ''}
      </p>
      <p>作者：{p.author || '请查看原始出处'}</p>
      <div className="row">
        <a className="btn" href={safeLink(p.sourceUrl)} target="_blank" rel="noopener noreferrer">
          原始出处
        </a>
        <a className="btn" href={safeLink(p.licenseUrl)} target="_blank" rel="noopener noreferrer">
          使用许可
        </a>
        <a
          className="btn primary"
          href={`#create/${encodeURIComponent(p.id)}`}
          onClick={onClose}
        >
          以此纹样练习转稿
        </a>
      </div>
      <p className="small">本站展示图片来自馆方开放资源；使用与改编请遵守原始许可。</p>

      {p.batch && (
        <details className="pattern-source-details">
          <summary>纹样资料与取样建议</summary>
          <p>原作名称：{p.originalTitle}</p>
          <p>年代：{p.date || '馆方未注明'} · 馆藏编号：{p.accession}</p>
          <p>文化归属：{(p.culture || []).join('；')}</p>
          <p>材料与技法（馆方原文）：{p.technique}</p>
          <p>题材：{(p.tags || []).join('、')}</p>
          <p>{p.curationNote}</p>
          <p>{p.labelNote}</p>
          <p>图片处理：{p.changes} · 来源核对：{p.rightsVerifiedAt}</p>
          {p.sourcePlatform === 'The Met' && (
            <>
              <p>来源平台：{p.sourcePlatform} · 来源级别：{p.license} · 质量标记：精选 · 二维转三维：适配参考</p>
              <p>馆藏对象 ID：{p.museumObjectId} · 对象名称：{p.museumObjectTitle}</p>
              <p>
                馆方记录：
                <a href={safeLink(p.sourceUrl)} target="_blank" rel="noopener noreferrer">
                  查看 The Met 藏品页
                </a>{' '}
                ·{' '}
                <a href={safeLink(p.sourceApiUrl)} target="_blank" rel="noopener noreferrer">
                  查看开放 API 记录
                </a>
              </p>
              <p>本条为从馆藏图像中筛选的祥云母版方向；展示整件馆藏图，未单独裁切云纹。</p>
            </>
          )}
        </details>
      )}
    </div>
  );
};

export const PatternCard: React.FC<{ pattern: Pattern }> = ({ pattern: p }) => {
  const { openModal, closeModal } = useApp();
  const [loaded, setLoaded] = useState(false);

  const handleClick = () => {
    openModal(<PatternDetailModal pattern={p} onClose={closeModal} />);
  };

  return (
    <button className="card card-image" data-pattern={p.id} onClick={handleClick}>
      <div className="pattern-img-wrap">
        {!loaded && <div className="img-skeleton shimmer" />}
        <img
          src={resolveAsset(p.thumbnail)}
          alt={p.title}
          width="320"
          height="320"
          loading="lazy"
          decoding="async"
          className={loaded ? 'loaded' : 'loading'}
          onLoad={() => setLoaded(true)}
        />
      </div>
      <div className="card-body">
        <h3>{p.title}</h3>
        <p className="sub">
          {p.region} ·{' '}
          {p.sourcePlatform === 'The Met'
            ? 'The Met · 精选馆藏参考'
            : p.collection === 'basic'
            ? '简易'
            : '复杂参考'}
        </p>
      </div>
    </button>
  );
};
