import React from 'react';
import type { Product } from '../types';
import { assetPath } from '../utils/download';

export const ProductCard: React.FC<{ product: Product }> = ({ product: p }) => {
  const imgSrc = assetPath(p.thumbnail_path || p.image_path);

  return (
    <a className="card card-image link" href={`#product/${encodeURIComponent(p.id)}`}>
      <img src={imgSrc} alt={p.title} width="320" height="320" loading="lazy" decoding="async" />
      <div className="card-body">
        <h3>{p.title}</h3>
        <p className="sub">
          {p.category} · {p.variants.length}种规格参考
        </p>
      </div>
    </a>
  );
};
