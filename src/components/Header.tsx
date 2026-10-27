import React, { useState } from 'react';
import { Icon } from './Icon';
import { useApp } from '../context/AppContext';
import { primaryNav, activeSection, navigate } from '../utils/router';

interface HeaderProps {
  currentPage: string;
}

export const Header: React.FC<HeaderProps> = ({ currentPage }) => {
  const { toggleMenu, isMenuOpen } = useApp();
  const [query, setQuery] = useState('');
  const activeSec = activeSection(currentPage);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`#search/${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header id="site-header">
      <a className="brand" href="#home">
        <span>
          梨花季<span className="brand-dot">·</span>译绣
        </span>
        <span className="seal">绣</span>
        <small>
          PEAR BLOSSOM SEASON
          <br />
          CHINESE EMBROIDERY
        </small>
      </a>

      <nav id="top-nav" aria-label="主要导航">
        {primaryNav.map(([key, name]) => (
          <a
            key={key}
            href={`#${key}`}
            className={key === activeSec ? 'active' : ''}
            aria-current={key === activeSec ? 'page' : undefined}
          >
            <span>{name}</span>
          </a>
        ))}
      </nav>

      <form id="site-search" role="search" onSubmit={handleSearch}>
        <button type="submit" className="search-submit" aria-label="搜索">
          <Icon name="search" />
        </button>
        <input
          id="global-search"
          aria-label="搜索绣品、针法、灵感"
          placeholder="搜索绣品、针法、灵感"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <a id="scan-shortcut" href="#ar" aria-label="扫描教程卡">
          <Icon name="scan" />
        </a>
      </form>

      <button
        id="menu"
        className="icon-button"
        aria-label="展开全部功能"
        aria-expanded={isMenuOpen}
        aria-controls="sidebar"
        onClick={toggleMenu}
      >
        <Icon name="menu" />
      </button>
    </header>
  );
};
