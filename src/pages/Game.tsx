import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { PageTitle } from '../components/PageTitle';
import type { Pattern } from '../types';

function shuffle<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const Game: React.FC = () => {
  const { patterns, ensurePatternsLoaded, progress, updateBestScore } = useApp();
  const [deck, setDeck] = useState<Pattern[]>([]);
  const [opened, setOpened] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [completedScore, setCompletedScore] = useState<number | null>(null);

  const initGame = useCallback((pList: Pattern[]) => {
    if (pList.length === 0) return;
    const basicChoices = shuffle(pList.filter((p) => p.collection === 'basic' && !p.featured)).slice(0, 3);
    const archiveChoices = shuffle(pList.filter((p) => p.collection === 'archive' && !p.featured)).slice(0, 3);
    const choices = [...basicChoices, ...archiveChoices];
    const generatedDeck = shuffle([...choices, ...choices]);

    setDeck(generatedDeck);
    setOpened([]);
    setMatched(new Set());
    setMoves(0);
    setIsLocked(false);
    setCompletedScore(null);
  }, []);

  useEffect(() => {
    ensurePatternsLoaded().then((pList) => {
      initGame(pList);
    });
  }, [ensurePatternsLoaded, initGame]);

  const handleCardClick = (index: number) => {
    if (isLocked || matched.has(index) || opened.includes(index)) return;

    const nextOpened = [...opened, index];
    setOpened(nextOpened);

    if (nextOpened.length === 2) {
      const nextMoves = moves + 1;
      setMoves(nextMoves);
      const [first, second] = nextOpened;

      if (deck[first].id === deck[second].id) {
        const nextMatched = new Set(matched);
        nextMatched.add(first);
        nextMatched.add(second);
        setMatched(nextMatched);
        setOpened([]);

        if (nextMatched.size === 12) {
          const score = Math.max(10, 100 - (nextMoves - 6) * 4);
          setCompletedScore(score);
          updateBestScore(score);
        }
      } else {
        setIsLocked(true);
        setTimeout(() => {
          setOpened([]);
          setIsLocked(false);
        }, 1100);
      }
    }
  };

  return (
    <>
      <PageTitle
        title="祥云配对挑战"
        sub="在翻转之间，记住一片花叶、一枚团花。六对纹样来自灵感图录，成绩留在本机。"
      />

      <p id="game-status" role="status">
        {completedScore !== null
          ? `挑战完成，${completedScore}分！本浏览器最高分${progress.best}。`
          : `已配对${matched.size / 2}/6 · 翻牌${moves}次`}
      </p>

      <div className="game-board">
        {deck.map((p, i) => {
          const isOpen = matched.has(i) || opened.includes(i);
          const isMatched = matched.has(i);

          return (
            <button
              key={i}
              className={`game-card ${isOpen ? 'open' : ''} ${isMatched ? 'matched' : ''}`}
              data-card={i}
              disabled={isMatched}
              aria-label={isOpen ? p.title : `第${i + 1}张，未翻开`}
              onClick={() => handleCardClick(i)}
            >
              {isOpen ? (
                <>
                  <img src={p.thumbnail} alt={p.title} />
                  <span>{p.title}</span>
                </>
              ) : (
                '梨'
              )}
            </button>
          );
        })}
      </div>

      <p>
        <button id="game-again" onClick={() => initGame(patterns)}>
          重新开始
        </button>
      </p>
    </>
  );
};
