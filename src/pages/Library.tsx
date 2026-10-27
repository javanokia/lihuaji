import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { PageTitle } from '../components/PageTitle';
import { PatternCard } from '../components/PatternCard';
import type { Pattern } from '../types';

interface LibraryProps {
  initialQuery?: string;
}

const QUICK_CHIPS = [
  { id: 'all', label: '全部' },
  { id: 'flower', label: '🌸 花鸟草木', keyword: '花' },
  { id: 'cloud', label: '☁️ 祥云瑞气', keyword: '云' },
  { id: 'met', label: '🏛️ The Met 精选', metOnly: true },
  { id: 'geometry', label: '🏺 几何团花', keyword: '几何' },
  { id: 'basic', label: '📜 简易取样', kindVal: 'basic' },
  { id: 'archive', label: '🖼️ 复杂参考', kindVal: 'archive' },
];

export const Library: React.FC<LibraryProps> = ({ initialQuery = '' }) => {
  const { patterns, ensurePatternsLoaded } = useApp();
  const [q, setQ] = useState(initialQuery);
  const [kind, setKind] = useState('');
  const [region, setRegion] = useState('');
  const [activeChip, setActiveChip] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(patterns.length === 0);
  const paginationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensurePatternsLoaded().finally(() => setLoading(false));
  }, [ensurePatternsLoaded]);

  useEffect(() => {
    if (initialQuery) {
      setQ(initialQuery);
      setPage(1);
      setActiveChip('all');
    }
  }, [initialQuery]);

  const basicCount = useMemo(
    () => patterns.filter((p) => p.collection === 'basic').length,
    [patterns]
  );
  const archiveCount = useMemo(
    () => patterns.filter((p) => p.collection === 'archive').length,
    [patterns]
  );
  const regions = useMemo(
    () => Array.from(new Set(patterns.map((x) => x.region))).filter(Boolean),
    [patterns]
  );

  const handleChipClick = (chip: (typeof QUICK_CHIPS)[0]) => {
    setActiveChip(chip.id);
    setPage(1);

    if (chip.id === 'all') {
      setQ('');
      setKind('');
    } else if (chip.metOnly) {
      setQ('The Met');
      setKind('');
    } else if (chip.kindVal) {
      setKind(chip.kindVal);
      setQ('');
    } else if (chip.keyword) {
      setQ(chip.keyword);
      setKind('');
    }
  };

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return patterns
      .filter((p) => {
        if (kind && p.collection !== kind) return false;
        if (region && p.region !== region) return false;
        if (!query) return true;
        const searchCorpus = [
          p.title,
          p.originalTitle,
          p.region,
          p.description,
          p.source,
          p.sourcePlatform,
          p.museumObjectId,
          p.museumObjectTitle,
          p.accession,
          p.date,
          p.technique,
          p.batch,
          p.searchTerms,
          JSON.stringify(p.tags || []),
        ]
          .join(' ')
          .toLowerCase();
        return searchCorpus.includes(query);
      })
      .sort((a, b) => {
        const featDiff = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
        if (featDiff !== 0) return featDiff;
        return (b.sortWeight || 0) - (a.sortWeight || 0);
      });
  }, [patterns, q, kind, region]);

  const pageSize = 24;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleCount = Math.min(filtered.length, page * pageSize);
  const visibleItems = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount]
  );

  // IntersectionObserver for infinite scrolling
  useEffect(() => {
    const target = paginationRef.current;
    if (!target || page >= totalPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setPage((prev) => Math.min(totalPages, prev + 1));
        }
      },
      { rootMargin: '240px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [page, totalPages]);

  const handlePrev = () => {
    setPage((prev) => Math.max(1, prev - 1));
    document.getElementById('pattern-count')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNext = () => {
    setPage((prev) => Math.min(totalPages, prev + 1));
    document.getElementById('pattern-count')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <PageTitle
        title="灵感图录 · 祥云纹样库"
        sub={`${patterns.length}份传统纹样，${basicCount}份简易练习与${archiveCount}份复杂参考。沿着花鸟、人物与几何，走近九个文化地区。`}
      />

      {/* Quick Filter Chips */}
      <div className="quick-chips" role="tablist" aria-label="快捷题材分类">
        {QUICK_CHIPS.map((chip) => (
          <button
            key={chip.id}
            type="button"
            className={`quick-chip ${activeChip === chip.id ? 'active' : ''}`}
            onClick={() => handleChipClick(chip)}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <div className="filter-bar">
        <label>
          搜索题材或名称
          <input
            id="pattern-search"
            placeholder="花鸟、人物、几何、团花…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActiveChip('all');
              setPage(1);
            }}
          />
        </label>
        <label>
          纹样类型
          <select
            id="pattern-kind"
            value={kind}
            onChange={(e) => {
              setKind(e.target.value);
              setActiveChip('all');
              setPage(1);
            }}
          >
            <option value="">全部</option>
            <option value="basic">简易{basicCount}份</option>
            <option value="archive">复杂{archiveCount}份</option>
          </select>
        </label>
        <label>
          文化地区
          <select
            id="pattern-region"
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              setPage(1);
            }}
          >
            <option value="">全部地区</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p id="pattern-count" role="status">
        {loading
          ? '正在载入纹样库…'
          : `找到${filtered.length}份 · 已显示${visibleCount}份 · 第${page}/${totalPages}页`}
      </p>

      {/* Shimmer Skeleton during initial loading */}
      {loading ? (
        <div className="grid four">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card skeleton-card">
              <div className="skeleton-image shimmer" />
              <div className="skeleton-text shimmer" />
              <div className="skeleton-text short shimmer" />
            </div>
          ))}
        </div>
      ) : (
        <div id="patterns" className="grid four">
          {visibleItems.map((p) => (
            <PatternCard key={p.id} pattern={p} />
          ))}
        </div>
      )}

      {visibleItems.length === 0 && !loading && (
        <p className="empty">没有匹配结果，请换个关键词。</p>
      )}

      <div id="pagination" className="row" ref={paginationRef}>
        <button id="prev" disabled={page <= 1} onClick={handlePrev}>
          上一页
        </button>
        <button id="next" disabled={page >= totalPages} onClick={handleNext}>
          继续加载
        </button>
      </div>
    </>
  );
};
