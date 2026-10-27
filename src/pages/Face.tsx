import React, { useEffect, useRef } from 'react';
import { PageTitle } from '../components/PageTitle';

interface FaceProps {
  param?: string;
}

export const Face: React.FC<FaceProps> = ({ param = '' }) => {
  const [id = '', sku = ''] = param.split('~');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    return () => {
      iframeRef.current?.contentWindow?.postMessage(
        { scope: 'lihua-face-host', type: 'stop' },
        window.location.origin
      );
    };
  }, []);

  const src = `./face.html?v=ivory-20261005&product=${encodeURIComponent(id)}&sku=${encodeURIComponent(sku)}`;

  return (
    <>
      <PageTitle
        title="文创试搭"
        sub="所有规格可选择；缺独立款式图时显示主图参考。目前只有银杏蓝眼罩有专用自动跟脸贴图。"
      />
      <iframe
        id="face-frame"
        ref={iframeRef}
        className="demo-frame"
        title="文创照片搭配"
        allow="camera"
        src={src}
      />
    </>
  );
};
