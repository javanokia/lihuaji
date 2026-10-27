import React from 'react';
import { useApp } from '../context/AppContext';
import { PageTitle } from '../components/PageTitle';
import { Icon } from '../components/Icon';
import { downloadFile, resolveAsset } from '../utils/download';

const brandPalette = [
  { name: '绢白', hex: '#F8F6EF', story: '如初展的绢帛，容纳光与留白。' },
  { name: '梨花白', hex: '#EDE9DF', story: '花瓣的柔光，温润而不刺眼。' },
  { name: '青瓷绿', hex: '#C8D6C9', story: '取一抹青瓷，衬托细密针脚。' },
  { name: '远山绿', hex: '#7B9480', story: '山影与新叶之间的安静色阶。' },
  { name: '墨竹绿', hex: '#3F5A4F', story: '深而不重，让文字清晰可读。' },
  { name: '朱砂红', hex: '#C95A4A', story: '只用一枚印，落款东方心意。' },
];

export const Palette: React.FC = () => {
  const { showToast, openModal } = useApp();

  const handleCopy = async (c: (typeof brandPalette)[0]) => {
    try {
      if (!navigator.clipboard) throw new Error();
      await navigator.clipboard.writeText(c.hex);
      showToast(`${c.name} ${c.hex} 已复制`);
    } catch {
      openModal(
        <div>
          <h2>{c.name}</h2>
          <p>当前浏览器未允许自动复制，可选择下方色值复制。</p>
          <input readOnly aria-label="颜色值" defaultValue={c.hex} id="color-copy" />
        </div>
      );
    }
  };

  const handleDownload = () => {
    const text =
      brandPalette.map((c) => `${c.name} ${c.hex}\n${c.story}`).join('\n\n') +
      '\n\n数字参考色，不对应真实线号。';
    downloadFile('绢白馆藏数字色谱.txt', text, 'text/plain');
  };

  return (
    <>
      <PageTitle
        title="东方色谱"
        sub="从草木与山水中取色，把一季梨花的柔光，织进日常。"
      />

      <div className="palette-intro">
        <img src={resolveAsset('assets/ivory/silk.webp')} alt="青绿色与米白色丝线概念图" />
        <div>
          <h2>六色之间，留住东方。</h2>
          <p>
            绢白为底，青绿为意，朱砂只作一枚小小落款。点击色卡复制颜色，或下载这套数字参考色谱。
          </p>
          <p className="small">屏幕色不等于实物线色，请以真实丝线色卡和小样为准。</p>
          <button id="download-palette" onClick={handleDownload}>
            <Icon name="download" /> 下载色谱
          </button>
        </div>
      </div>

      <div className="palette-grid">
        {brandPalette.map((c, i) => (
          <button
            key={i}
            className="palette-card"
            data-color={i}
            aria-label={`复制${c.name}色值 ${c.hex}`}
            onClick={() => handleCopy(c)}
          >
            <span className="palette-chip" style={{ background: c.hex }} />
            <span>
              <strong>{c.name}</strong>
              <code>{c.hex}</code>
              <p>{c.story}</p>
            </span>
          </button>
        ))}
      </div>
    </>
  );
};
