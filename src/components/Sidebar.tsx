import React, { useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { useApp } from '../context/AppContext';
import { pageNames, routeIcons } from '../utils/router';

interface SidebarProps {
  currentPage: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage }) => {
  const { isMenuOpen, setMenuOpen } = useApp();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen, setMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isMenuOpen]);

  // Keep sidebar links filtered
  const navEntries = Object.entries(pageNames).filter(
    ([key]) => !['search', 'exhibit'].includes(key)
  );

  return (
    <>
      <button
        id="nav-scrim"
        hidden={!isMenuOpen}
        aria-label="关闭导航"
        onClick={() => setMenuOpen(false)}
      />
      <aside id="sidebar" aria-label="全部功能" inert={!isMenuOpen ? true : undefined}>
        <div className="drawer-heading">
          <span className="brand">梨花季·译绣</span>
          <button
            id="close-nav"
            ref={closeButtonRef}
            className="icon-button"
            aria-label="关闭全部功能"
            onClick={() => setMenuOpen(false)}
          >
            <Icon name="close" />
          </button>
        </div>
        <p className="side-note">一针一线，译古为今。</p>
        <nav id="nav" aria-label="全部功能导航">
          {navEntries.map(([key, name]) => (
            <a
              key={key}
              href={`#${key}`}
              className={key === currentPage ? 'active' : ''}
              aria-current={key === currentPage ? 'page' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              <Icon name={routeIcons[key] || 'flower'} />
              <span>{name}</span>
            </a>
          ))}
        </nav>
        <div className="sidebar-foot">
          绢白馆藏 · 苏绣文化与互动
          <br />
          <a href="#collaborate" onClick={() => setMenuOpen(false)}>
            与朋友一起完善梨花季
          </a>
        </div>
      </aside>
    </>
  );
};
