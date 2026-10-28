import React from 'react';
import { PageTitle } from '../components/PageTitle';
import { Icon } from '../components/Icon';
import { resolveAsset } from '../utils/download';

export const Exhibit: React.FC = () => {
  return (
    <>
      <PageTitle
        title="梨花新绣"
        sub="循着一朵花的轮廓，重新发现苏绣的细腻。"
      />

      <article className="exhibit-layout">
        <img src={resolveAsset('assets/ivory/embroidery.webp')} alt="梨花苏绣针脚概念图" loading="lazy" decoding="async" />
        <div>
          <span className="english">INSPIRATION ARCHIVE · No.001</span>
          <h2>把春天，留在丝线里。</h2>
          <p>
            花瓣的柔光、花蕊的细密、叶片的层次，是这次“绢白馆藏”的视觉起点。让画面少一些装饰，让一针一线成为主角。
          </p>
          <p className="small">
            本页为品牌视觉专题，图像由AI生成，不是实际馆藏作品。真实纹样请查看灵感图录中的逐条出处与许可。
          </p>
          <div className="row">
            <a className="btn primary" href={`#library/${encodeURIComponent('花')}`}>
              浏览花卉纹样 <Icon name="arrow" />
            </a>
            <a className="btn" href="#create">
              开始译绣 <Icon name="arrow" />
            </a>
          </div>
        </div>
      </article>

      <a className="museum-banner" href="#ar">
        <div>
          <h2>从第一针开始</h2>
          <p>先读懂丝理，再练习颜色的过渡。</p>
          <span className="text-link">
            进入针法课堂 <Icon name="arrow" />
          </span>
        </div>
        <img src={resolveAsset('assets/ivory/silk.webp')} alt="丝线材质概念图" loading="lazy" decoding="async" />
      </a>
    </>
  );
};
