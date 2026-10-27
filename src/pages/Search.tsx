import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PageTitle } from '../components/PageTitle';
import { PatternCard } from '../components/PatternCard';
import { ProductCard } from '../components/ProductCard';
import { Icon } from '../components/Icon';
import { safeLink } from '../utils/download';
import type { Pattern, Product, SuxiuKnowledgeItem, PracticeKnowledge } from '../types';

interface SearchProps {
  query?: string;
}

export const Search: React.FC<SearchProps> = ({ query = '' }) => {
  const { patterns, products, ensurePatternsLoaded, ensureProductsLoaded } = useApp();
  const [matchedPatterns, setMatchedPatterns] = useState<Pattern[]>([]);
  const [matchedProducts, setMatchedProducts] = useState<Product[]>([]);
  const [officialKnowledge, setOfficialKnowledge] = useState<SuxiuKnowledgeItem[]>([]);
  const [suxiuData, setSuxiuData] = useState<any>(null);
  const [matchedPractice, setMatchedPractice] = useState<PracticeKnowledge[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [mediaVideos, setMediaVideos] = useState<any[]>([]);
  const [digitalTools, setDigitalTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    ensurePatternsLoaded();
    ensureProductsLoaded();
  }, [ensurePatternsLoaded, ensureProductsLoaded]);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setMatchedPatterns([]);
      setMatchedProducts([]);
      setOfficialKnowledge([]);
      setMatchedPractice([]);
      setCourses([]);
      setMediaVideos([]);
      setDigitalTools([]);
      return;
    }

    setLoading(true);

    Promise.all([
      ensurePatternsLoaded(),
      ensureProductsLoaded(),
      import('../assets-proxy/suxiu-store.js'),
      import('../assets-proxy/knowledge-store.js'),
      import('../assets-proxy/stitch-video-store.js'),
      import('../assets-proxy/digital-tools-store.js'),
      import('../assets-proxy/stitch-lab.js'),
    ])
      .then(async ([pList, prodList, suxiuStore, knowledgeModule, videoModule, toolsModule, labModule]) => {
        labModule.ensureStitchStyles?.();
        toolsModule.ensureDigitalToolsStyles?.();

        const pMatches = pList
          .filter((p) =>
            [
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
              .toLowerCase()
              .includes(q)
          )
          .sort(
            (a, b) =>
              Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
              (b.sortWeight || 0) - (a.sortWeight || 0)
          );

        const prodMatches = prodList.filter((p) =>
          (p.title + p.category).toLowerCase().includes(q)
        );

        const kMatches = knowledgeModule.knowledge.filter((k: any) =>
          (k.title + (k.tags || '') + k.body).toLowerCase().includes(q)
        );

        const sData = await suxiuStore.loadSuxiuKnowledge();
        const sResults = await suxiuStore.searchSuxiuKnowledge(q);
        const vResults = await videoModule.stitchVideoStore.search(q);
        const tResults = await toolsModule.digitalToolStore.search(q);

        setSuxiuData(sData);
        setMatchedPatterns(pMatches);
        setMatchedProducts(prodMatches);
        setMatchedPractice(kMatches);
        setOfficialKnowledge(sResults);
        setCourses(vResults.filter((r: any) => r.sourceType === 'official-course'));
        setMediaVideos(vResults.filter((r: any) => r.sourceType !== 'official-course'));
        setDigitalTools(tResults);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query, ensurePatternsLoaded, ensureProductsLoaded]);

  const q = query.trim().toLowerCase();
  const learningTerms = ['学习路径', '套针学习', '滚针学习', '今日学一针'];
  const hasLearningQuery = learningTerms.some((term) => q.includes(term));
  const learningTargets = q.includes('滚针') ? ['gun'] : q.includes('套针') ? ['tao'] : ['tao', 'gun'];

  const hasAnyResults =
    hasLearningQuery ||
    matchedPatterns.length > 0 ||
    matchedProducts.length > 0 ||
    matchedPractice.length > 0 ||
    officialKnowledge.length > 0 ||
    courses.length > 0 ||
    mediaVideos.length > 0 ||
    digitalTools.length > 0;

  return (
    <>
      <PageTitle
        title="寻一份灵感"
        sub={
          query
            ? `关于“${query}”的绣品、针法与纹样。`
            : '搜索绣品、针法、灵感，从一个词开始。'
        }
      />

      {!query && (
        <div className="row">
          <a className="btn" href={`#search/${encodeURIComponent('花')}`}>
            花卉纹样
          </a>
          <a className="btn" href={`#search/${encodeURIComponent('套针')}`}>
            套针练习
          </a>
          <a className="btn" href={`#search/${encodeURIComponent('眼罩')}`}>
            苏绣眼罩
          </a>
        </div>
      )}

      {loading && <p className="status">正在搜索相关内容…</p>}

      {hasLearningQuery && (
        <section className="search-section">
          <h2>今日学一针 · 学习路径</h2>
          <div className="grid">
            {learningTargets.map((pathId) => (
              <article key={pathId} className="card learning-search-result">
                <p className="small">针法学习导览</p>
                <h3>{pathId === 'tao' ? '套针' : '滚针'} · 从真实教学到数字拆针</h3>
                <p>官方课程、知识档案、数字针迹、作品观察与机器刺绣拓展。</p>
                <a className="btn" href={`#ar/learn-${pathId}`}>
                  进入{pathId === 'tao' ? '套针' : '滚针'}学习路径 →
                </a>
              </article>
            ))}
          </div>
        </section>
      )}

      {officialKnowledge.length > 0 && suxiuData && (
        <section className="search-section">
          <h2>苏绣知识 · {officialKnowledge.length}条</h2>
          <div className="grid search-knowledge">
            {officialKnowledge.slice(0, 3).map((k) => (
              <article className="card" key={k.id}>
                <h3>{k.title}</h3>
                <p>{k.summary}</p>
                <p className="small">
                  官方来源核验 ·{' '}
                  <a href={`#guide/${encodeURIComponent(k.id)}`}>查看详情</a>
                </p>
              </article>
            ))}
          </div>
          <a className="text-link" href={`#guide/${encodeURIComponent(query)}`}>
            查看全部知识 <Icon name="arrow" />
          </a>
        </section>
      )}

      {matchedPatterns.length > 0 && (
        <section className="search-section">
          <h2>灵感图录 · {matchedPatterns.length}份</h2>
          <div className="grid four">
            {matchedPatterns.slice(0, 4).map((p) => (
              <PatternCard key={p.id} pattern={p} />
            ))}
          </div>
          <a className="text-link" href={`#library/${encodeURIComponent(query)}`}>
            查看全部纹样 <Icon name="arrow" />
          </a>
        </section>
      )}

      {matchedProducts.length > 0 && (
        <section className="search-section">
          <h2>梨花绣馆 · {matchedProducts.length}件</h2>
          <div className="grid four">
            {matchedProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <a className="text-link" href={`#gallery/${encodeURIComponent(query)}`}>
            查看全部文创 <Icon name="arrow" />
          </a>
        </section>
      )}

      {matchedPractice.length > 0 && (
        <section className="search-section">
          <h2>针法与知识</h2>
          <div className="grid search-knowledge">
            {matchedPractice.slice(0, 3).map((k, i) => (
              <article className="card" key={i}>
                <h3>{k.title}</h3>
                <p>{k.body}</p>
                <a className="text-link" href="#ar">
                  进入基础课堂 <Icon name="arrow" />
                </a>
              </article>
            ))}
          </div>
        </section>
      )}

      {courses.length > 0 && (
        <section className="search-section">
          <h2>官方课程 · {courses.length}门</h2>
          <div className="grid">
            {courses.map((c, i) => (
              <article className="card" key={i}>
                <h3>{c.title}</h3>
                <p>{c.organization}</p>
                <a className="btn" href="#ar/mooc-suxiu">
                  进入课程导览
                </a>
              </article>
            ))}
          </div>
        </section>
      )}

      {mediaVideos.length > 0 && (
        <section className="search-section">
          <h2>官方影像与资料 · {mediaVideos.length}条</h2>
          <div className="grid two">
            {mediaVideos.map((v, i) => (
              <article className="card" key={i}>
                <h3>{v.title}</h3>
                <p className="small">{v.organization || v.publisher}</p>
                <a className="btn" href={safeLink(v.url)} target="_blank" rel="noopener noreferrer">
                  观看官方原片
                </a>
              </article>
            ))}
          </div>
        </section>
      )}

      {digitalTools.length > 0 && (
        <section className="search-section">
          <h2>数字刺绣工具 · {digitalTools.length}项</h2>
          <div className="grid">
            {digitalTools.map((t, i) => (
              <article className="card" key={i}>
                <h3>{t.name}</h3>
                <p>{t.summary}</p>
                <a className="btn" href="#ar">
                  前往数字工具
                </a>
              </article>
            ))}
          </div>
        </section>
      )}

      {query && !loading && !hasAnyResults && (
        <div className="empty">
          <p>暂未找到相关内容，试试“花”“套针”或“眼罩”。</p>
          <a className="btn" href="#library">
            浏览全部纹样
          </a>
        </div>
      )}
    </>
  );
};
