import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PageTitle } from '../components/PageTitle';
import { assetPath } from '../utils/download';

interface ProductDetailProps {
  id: string;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ id }) => {
  const { products, ensureProductsLoaded } = useApp();
  const [selectedSku, setSelectedSku] = useState('');
  const [loading, setLoading] = useState(products.length === 0);

  useEffect(() => {
    ensureProductsLoaded().finally(() => setLoading(false));
  }, [ensureProductsLoaded]);

  const p = products.find((x) => x.id === id);

  useEffect(() => {
    if (p && p.variants.length > 0 && !selectedSku) {
      setSelectedSku(p.variants[0].id);
    }
  }, [p, selectedSku]);

  if (loading) {
    return <p className="status">正在载入文创资料…</p>;
  }

  if (!p) {
    return (
      <div className="card">
        <h2>文创条目不存在</h2>
        <a className="btn primary" href="#gallery">
          返回绣馆
        </a>
      </div>
    );
  }

  const currentVariant = p.variants.find((v) => v.id === selectedSku) || p.variants[0];

  return (
    <>
      <PageTitle
        title={p.title}
        sub="文创资料展示，不提供购买、库存承诺或真实订单。"
      />

      <div className="split">
        <img className="image-fit" src={assetPath(p.image_path)} alt={p.title} loading="lazy" decoding="async" />
        <div className="card">
          <p>{p.description || ''}</p>
          <label>
            选择款式
            <select
              id="sku"
              value={selectedSku}
              onChange={(e) => setSelectedSku(e.target.value)}
            >
              {p.variants.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <p id="sku-note" className="variant-note">
            {currentVariant?.note}
          </p>
          <a
            id="product-tryon"
            className="btn primary"
            href={`#face/${encodeURIComponent(p.id)}~${encodeURIComponent(currentVariant?.id || '')}`}
          >
            查看此款搭配
          </a>
        </div>
      </div>
    </>
  );
};
