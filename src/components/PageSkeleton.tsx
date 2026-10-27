import React from 'react';

export const PageSkeleton: React.FC = () => {
  return (
    <div className="skeleton-container" aria-busy="true" aria-label="正在加载页面...">
      <div className="skeleton-title shimmer" />
      <div className="skeleton-subtitle shimmer" />
      <div className="grid four">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card skeleton-card">
            <div className="skeleton-image shimmer" />
            <div className="skeleton-text shimmer" />
            <div className="skeleton-text short shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
};
