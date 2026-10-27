import React, { useState, useEffect, useCallback } from 'react';
import { PageTitle } from '../components/PageTitle';
import { safeLink } from '../utils/download';
import { Icon } from '../components/Icon';
import type { SuxiuData, SuxiuKnowledgeItem, PracticeKnowledge } from '../types';

interface GuideProps {
  initialQuery?: string;
}

export const Guide: React.FC<GuideProps> = ({ initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [suxiuData, setSuxiuData] = useState<SuxiuData | null>(null);
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [scopes, setScopes] = useState<Record<string, string>>({});
  const [practiceKnowledge, setPracticeKnowledge] = useState<PracticeKnowledge[]>([]);
  const [retrieveFn, setRetrieveFn] = useState<((q: string) => PracticeKnowledge[]) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      import('../assets-proxy/suxiu-store.js'),
      import('../assets-proxy/knowledge-store.js'),
    ])
      .then(([suxiuModule, knowledgeModule]) => {
        setCategories(suxiuModule.categories);
        setScopes(suxiuModule.scopes);
        setPracticeKnowledge(knowledgeModule.knowledge);
        setRetrieveFn(() => knowledgeModule.retrieve);
        return suxiuModule.loadSuxiuKnowledge();
      })
      .then((data) => {
        setSuxiuData(data);
      })
      .catch((err) => {
        console.error(err);
        setError('官方知识暂未载入；仍可查看原练习说明。');
      })
      .finally(() => setLoading(false));
  }, []);

  const [displayedOfficial, setDisplayedOfficial] = useState<SuxiuKnowledgeItem[]>([]);

  const runSearch = useCallback(
    async (q: string, data: SuxiuData | null) => {
      if (!data) return;
      const trimmed = q.trim();
      if (!trimmed) {
        setDisplayedOfficial(data.knowledge);
        return;
      }
      const exact = data.knowledge.find((k) => k.id === trimmed);
      if (exact) {
        setDisplayedOfficial([exact]);
        return;
      }
      try {
        const suxiuModule = await import('../assets-proxy/suxiu-store.js');
        const results = await suxiuModule.searchSuxiuKnowledge(trimmed);
        setDisplayedOfficial(results);
      } catch {
        setDisplayedOfficial([]);
      }
    },
    []
  );

  useEffect(() => {
    runSearch(query, suxiuData);
  }, [query, suxiuData, runSearch]);

  const displayedPractice = query.trim() && retrieveFn ? retrieveFn(query.trim()) : practiceKnowledge;

  const sourceMap = suxiuData ? new Map(suxiuData.sources.map((s) => [s.id, s])) : new Map();
  const knowledgeMap = suxiuData ? new Map(suxiuData.knowledge.map((k) => [k.id, k])) : new Map();

  return (
    <>
      <PageTitle
        title="苏绣知识手册"
        sub="把针法、材料与练习心得，收进随时可翻阅的小册。这里提供静态知识检索。"
      />

      <label>
        查找知识
        <input
          id="knowledge-search"
          placeholder="针法、配色、底布…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      {error && <p role="status">{error}</p>}
      {loading && <p className="status">正在加载知识数据…</p>}

      <div id="knowledge-list" className="grid">
        {displayedOfficial.map((k) => {
          const links = (ids: string[]) =>
            ids
              .map((id) => sourceMap.get(id))
              .filter(Boolean)
              .map((s, idx) => (
                <span key={idx}>
                  <a href={safeLink(s.url)} target="_blank" rel="noopener noreferrer">
                    查看官方来源：{s.organization} · {s.title}
                  </a>
                  <br />
                </span>
              ));

          const relationList = [
            ...k.relations.map((r) => ({
              id: r.target,
              label:
                ({ subtypeOf: '属于', relatedTo: '相关', partOf: '所属', stepOf: '所属流程' } as Record<string, string>)[r.type] || '相关',
            })),
            ...(suxiuData?.knowledge
              .filter((x) => x.relations.some((r) => r.target === k.id && r.type === 'subtypeOf'))
              .map((x) => ({ id: x.id, label: '分型' })) || []),
          ];

          return (
            <article className="card" key={k.id} data-suxiu={k.id}>
              <h2>{k.title}</h2>
              <p>{k.summary}</p>
              <p className="small">
                官方来源核验 · {categories[k.category] || k.category} · {scopes[k.scope] || k.scope}
              </p>
              <p className="small">{links(k.sourceIds)}</p>
              <details>
                <summary>事实与关联资料</summary>
                {k.facts.map((f, i) => (
                  <div key={i}>
                    <p>{f.text}</p>
                    <p className="small">{links(f.sourceIds)}</p>
                  </div>
                ))}
                {k.orderedSteps && (
                  <ol>
                    {k.orderedSteps.map((id) => (
                      <li key={id}>
                        <a href={`#guide/${encodeURIComponent(id)}`}>
                          {knowledgeMap.get(id)?.title || id}
                        </a>
                      </li>
                    ))}
                  </ol>
                )}
                {relationList.map((r, i) => (
                  <p className="small" key={i}>
                    {r.label}：
                    <a href={`#guide/${encodeURIComponent(r.id)}`}>
                      {knowledgeMap.get(r.id)?.title || r.id}
                    </a>
                  </p>
                ))}
                {k.limitations && <p>{k.limitations}</p>}
                <p className="small">
                  核验日期：{k.review.accessedDate}。{k.review.note}
                </p>
              </details>
            </article>
          );
        })}

        {displayedPractice.map((k, i) => (
          <article className="card" key={i} data-practice="true">
            <h2>{k.title}</h2>
            <p>{k.body}</p>
            <p className="small">
              {k.source}
              {k.url ? ' · 原项目概述，非本次核验条目' : ' · 项目自编内容，非官方教程'}
            </p>
          </article>
        ))}
      </div>

      {!loading && displayedOfficial.length === 0 && displayedPractice.length === 0 && (
        <p className="empty">暂未找到这条知识，试试针法、配色或底布。</p>
      )}
    </>
  );
};
