import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { PageTitle } from '../components/PageTitle';
import { ProductCard } from '../components/ProductCard';
import { resolveAsset } from '../utils/download';

interface GalleryProps {
  initialQuery?: string;
}

export const Gallery: React.FC<GalleryProps> = ({ initialQuery = '' }) => {
  const { products, ensureProductsLoaded } = useApp();
  const [q, setQ] = useState(initialQuery);
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState(12);
  const [loading, setLoading] = useState(products.length === 0);
  const paginationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureProductsLoaded().finally(() => setLoading(false));
  }, [ensureProductsLoaded]);

  useEffect(() => {
    if (initialQuery) {
      setQ(initialQuery);
      setLimit(12);
    }
  }, [initialQuery]);

  const groups = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.preview_group || p.category))).filter(Boolean);
  }, [products]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return products.filter((p) => {
      const matchCat = !category || (p.preview_group || p.category) === category;
      const matchQuery = !query || (p.title + p.category).toLowerCase().includes(query);
      return matchCat && matchQuery;
    });
  }, [products, category, q]);

  const shownCount = Math.min(limit, filtered.length);
  const visibleItems = useMemo(() => filtered.slice(0, shownCount), [filtered, shownCount]);

  useEffect(() => {
    const target = paginationRef.current;
    if (!target || filtered.length <= shownCount) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setLimit((prev) => prev + 12);
        }
      },
      { rootMargin: '240px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [filtered.length, shownCount]);

  return (
    <>
      <PageTitle
        title="梨花绣馆"
        sub="让工艺走进日常。75件文创资料，2418种规格，慢慢看见一针一线的心意。"
      />

      <div className="gallery-heading">
        <img src={resolveAsset('assets/ivory/garden.webp')} alt="梨花园林概念场景" loading="lazy" decoding="async" />
        <p>
          从眼罩、丝巾到身边的小物，探索传统手艺的当代表达。
          <br />
          <span className="small">图册仅作文化展示与搭配体验，不提供交易。</span>
        </p>
      </div>

      <label>
        查找文创
        <input
          id="product-search"
          value={q}
          placeholder="眼罩、丝巾、手链、团扇…"
          onChange={(e) => {
            setQ(e.target.value);
            setLimit(12);
          }}
        />
      </label>

      <div id="product-categories" className="catalog-tabs" aria-label="文创分类">
        {['', ...groups].map((cat) => (
          <button
            key={cat}
            data-category={cat}
            aria-pressed={category === cat}
            onClick={() => {
              setCategory(cat);
              setLimit(12);
            }}
          >
            {cat || '全部'}
          </button>
        ))}
      </div>

      <p id="product-count" role="status">
        {loading
          ? '正在载入文创图册…'
          : `共${filtered.length}件文创资料 · 已显示${shownCount}件`}
      </p>

      <div id="products" className="grid four">
        {visibleItems.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {visibleItems.length === 0 && !loading && (
        <p className="empty">暂未找到这件文创。换个名称，或看看其他分类。</p>
      )}

      {filtered.length > shownCount && (
        <div id="product-pagination" className="row" ref={paginationRef}>
          <button id="product-more" onClick={() => setLimit((prev) => prev + 12)}>
            继续加载
          </button>
        </div>
      )}
    </>
  );
};
