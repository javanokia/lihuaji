import React from 'react';

interface PageTitleProps {
  title: string;
  sub?: string;
  children?: React.ReactNode;
}

export const PageTitle: React.FC<PageTitleProps> = ({ title, sub, children }) => {
  return (
    <div className="page-title">
      <div>
        <h1>{title}</h1>
        {sub && <p className="sub">{sub}</p>}
      </div>
      {children}
    </div>
  );
};
