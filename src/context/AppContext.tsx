import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Pattern, Product, SiteInfo, UserProgress } from '../types';
import { loadPatterns, loadProducts, loadSiteInfo } from '../utils/catalog';

interface AppContextValue {
  site: SiteInfo | null;
  patterns: Pattern[];
  products: Product[];
  progress: UserProgress;
  addProgressDay: (day: string) => void;
  updateBestScore: (score: number) => void;
  showToast: (msg: string) => void;
  modalContent: React.ReactNode | null;
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
  isMenuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  toggleMenu: () => void;
  ensurePatternsLoaded: () => Promise<Pattern[]>;
  ensureProductsLoaded: () => Promise<Product[]>;
}

const STORAGE_KEY = 'lihuaji.pages.progress.v1';

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [site, setSite] = useState<SiteInfo | null>(null);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      return { days: [], best: 0, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
    } catch {
      return { days: [], best: 0 };
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Load site info on start
  useEffect(() => {
    loadSiteInfo().then(setSite).catch(console.error);
  }, []);

  const saveProgress = useCallback((next: UserProgress) => {
    setProgress(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      showToast('浏览器未允许本地保存，本次仍可继续体验。');
    }
  }, []);

  const addProgressDay = useCallback((day: string) => {
    setProgress((prev) => {
      if (prev.days.includes(day)) return prev;
      const next = { ...prev, days: [...prev.days, day] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        showToast('浏览器未允许本地保存，本次仍可继续体验。');
      }
      return next;
    });
  }, []);

  const updateBestScore = useCallback((score: number) => {
    setProgress((prev) => {
      const next = { ...prev, best: Math.max(prev.best, score) };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        showToast('浏览器未允许本地保存，本次仍可继续体验。');
      }
      return next;
    });
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  // Toast auto-hide
  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 4500);
    return () => clearTimeout(t);
  }, [toastMessage]);

  const openModal = useCallback((content: React.ReactNode) => {
    setModalContent(content);
  }, []);

  const closeModal = useCallback(() => {
    setModalContent(null);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const ensurePatternsLoaded = useCallback(async () => {
    if (patterns.length > 0) return patterns;
    const data = await loadPatterns();
    setPatterns(data);
    return data;
  }, [patterns]);

  const ensureProductsLoaded = useCallback(async () => {
    if (products.length > 0) return products;
    const data = await loadProducts();
    setProducts(data);
    return data;
  }, [products]);

  return (
    <AppContext.Provider
      value={{
        site,
        patterns,
        products,
        progress,
        addProgressDay,
        updateBestScore,
        showToast,
        modalContent,
        openModal,
        closeModal,
        isMenuOpen,
        setMenuOpen: setIsMenuOpen,
        toggleMenu,
        ensurePatternsLoaded,
        ensureProductsLoaded,
      }}
    >
      {children}
      {/* Toast Notification Container */}
      <div id="toast" role="status" className={toastMessage ? 'show' : ''}>
        {toastMessage}
      </div>
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
