import React, { useEffect, useRef } from 'react';
import { downloadFile } from '../utils/download';
import { navigate } from '../utils/router';

export const Story: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let disposed = false;
    let cleanupFn: (() => void) | undefined;

    const el = containerRef.current;
    if (!el) return;

    import('../assets-proxy/story-page.js')
      .then(({ mountStory }) => {
        if (disposed || !containerRef.current) return;
        return mountStory(containerRef.current, {
          download: downloadFile,
          navigate,
          isCurrent: () => !disposed,
        });
      })
      .then((cleanup) => {
        if (disposed) {
          cleanup?.();
        } else {
          cleanupFn = cleanup;
        }
      })
      .catch(console.error);

    return () => {
      disposed = true;
      cleanupFn?.();
    };
  }, []);

  return <div ref={containerRef} className="story-container" />;
};
