import React from 'react';
import { Icon } from './Icon';
import { primaryNav, activeSection } from '../utils/router';

interface BottomNavProps {
  currentPage: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentPage }) => {
  const activeSec = activeSection(currentPage);

  return (
    <nav id="bottom-nav" aria-label="手机主要导航">
      {primaryNav.map(([key, name, glyph]) => (
        <a
          key={key}
          href={`#${key}`}
          className={key === activeSec ? 'active' : ''}
          aria-current={key === activeSec ? 'page' : undefined}
        >
          <Icon name={glyph} />
          <span>{name}</span>
        </a>
      ))}
    </nav>
  );
};
