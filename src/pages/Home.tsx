import React from 'react';
import { useApp } from '../context/AppContext';
import { Icon } from '../components/Icon';
import { resolveAsset } from '../utils/download';

const stitchArchive = [
  {
    name: '平绣',
    caption: '丝理平整细腻，藏功于一针。',
    image: 'embroidery',
    position: '25% 62%',
    body: '平绣注重丝理整齐、针脚匀密和布面平服。先用短而平行的直线针练习，保持拉线力度一致，再尝试小片花瓣与叶面。',
  },
  {
    name: '乱针绣',
    caption: '以针代笔，层层叠色。',
    image: 'silk',
    position: '45% 35%',
    body: '乱针绣用方向交错、长短相间的针脚叠加色彩与明暗。它不是随意把线堆在一起，需要观察对象的体积与色阶。初学时先练习疏密和单层张力。',
  },
  {
    name: '打籽绣',
    caption: '一粒一珠，点出花蕊生机。',
    image: 'embroidery',
    position: '54% 53%',
    body: '打籽绣以立体小结表现花蕊、果实等点状细节。绕线松紧、入针位置和绣线粗细会影响成籽大小。初学时应先在小样上练习；本页为针法介绍，不提供打籽针路动画。',
  },
  {
    name: '套针绣',
    caption: '长短相接，晕染细微的过渡。',
    image: 'embroidery',
    position: '25% 20%',
    body: '套针用长短错落、前后穿插的针脚衔接色阶，常用于花瓣和叶片。顺着丝理方向套接，避免针脚尾端形成生硬的直线。可以从两种相近色开始。',
  },
];

export const Home: React.FC = () => {
  const { site, openModal, closeModal } = useApp();

  const handleStitchClick = (item: (typeof stitchArchive)[0]) => {
    openModal(
      <article className="stitch-detail">
        <img src={resolveAsset(`assets/ivory/${item.image}.webp`)} alt="丝线工艺概念特写" />
        <h2>{item.name}</h2>
        <p>{item.body}</p>
        <p className="small">
          图片为针线质感概念示意。实际操作以课堂练习和专业指导为准。
        </p>
        <a className="btn primary" href="#ar" onClick={closeModal}>
          进入基础针法课堂 <Icon name="arrow" />
        </a>
      </article>
    );
  };

  const titleText = site?.title || '一针一线，译古为今。';
  const introText = site?.intro || '探索苏绣之美';

  return (
    <>
      <section className="hero ivory-hero">
        <div className="hero-copy">
          <h1>
            {titleText.includes('，') ? (
              <>
                {titleText.split('，')[0]}，
                <br />
                {titleText.split('，').slice(1).join('，')}
              </>
            ) : (
              titleText
            )}
          </h1>
          <p>{introText}</p>
          <a className="btn primary hero-cta" href="#create">
            开始译绣 <Icon name="arrow" />
          </a>
          <span className="english hero-caption">TRADITION MEETS THE FUTURE</span>
        </div>
        <div className="hero-art">
          <img
            src={resolveAsset('assets/ivory/hero.webp')}
            alt="梨花苏绣绣框、青绿色丝线与瓷器的馆藏风格概念陈列"
            width="1536"
            height="1024"
            fetchPriority="high"
          />
        </div>
      </section>

      <section className="today-section">
        <div className="section-heading">
          <div className="section-label">
            <h2>今日绣事</h2>
            <span className="english">TODAY IN EMBROIDERY</span>
          </div>
          <a className="text-link" href="#library">
            查看更多
            <Icon name="arrow" />
          </a>
        </div>
        <div className="today-grid">
          <a className="editorial-card" href="#exhibit">
            <img
              src={resolveAsset('assets/ivory/embroidery.webp')}
              alt="梨花丝线针脚概念特写"
              width="1200"
              height="900"
            />
            <div>
              <h3>梨花新绣</h3>
              <p>循着花瓣，细看春意如何落针。</p>
              <span>
                EXPLORE <Icon name="arrow" />
              </span>
            </div>
          </a>
          <a className="editorial-card" href="#create">
            <img
              src={resolveAsset('assets/ivory/garden.webp')}
              alt="苏州园林与梨花的东方意境概念图"
              width="1200"
              height="675"
            />
            <div>
              <h3>绣稿上色体验</h3>
              <p>从一张图片开始，感受东方色彩。</p>
              <span>
                CREATE <Icon name="arrow" />
              </span>
            </div>
          </a>
          <a className="editorial-card" href="#palette">
            <img
              src={resolveAsset('assets/ivory/silk.webp')}
              alt="青绿与米白色丝线的材质概念特写"
              width="1200"
              height="900"
            />
            <div>
              <h3>东方色谱</h3>
              <p>从草木与山水中，寻找细腻的色彩。</p>
              <span>
                DISCOVER <Icon name="arrow" />
              </span>
            </div>
          </a>
        </div>
      </section>

      <section className="stitch-section">
        <div className="section-heading">
          <div className="section-label">
            <h2>针法档案</h2>
            <span className="english">STITCH ARCHIVE</span>
          </div>
          <a className="text-link" href="#ar">
            进入针法课堂
            <Icon name="arrow" />
          </a>
        </div>
        <div className="stitch-grid">
          {stitchArchive.map((s, i) => (
            <button
              key={i}
              className="stitch-card"
              aria-label={`了解${s.name}`}
              onClick={() => handleStitchClick(s)}
            >
              <span className="stitch-photo">
                <img
                  src={resolveAsset(`assets/ivory/${s.image}.webp`)}
                  style={{ transformOrigin: s.position }}
                  alt=""
                  width="120"
                  height="120"
                  loading="lazy"
                />
              </span>
              <span className="stitch-copy">
                <strong>{s.name}</strong>
                <span>{s.caption}</span>
                <small className="english">
                  LEARN MORE <Icon name="arrow" />
                </small>
              </span>
            </button>
          ))}
        </div>
      </section>

      <a className="museum-banner" href="#gallery">
        <div>
          <div className="section-label">
            <h2>梨花绣馆</h2>
            <span className="english">
              THE EMBROIDERY
              <br />
              MUSEUM
            </span>
          </div>
          <p>在园林之间，遇见苏绣的当代生活方式。</p>
          <span className="text-link">
            走进绣馆 <Icon name="arrow" />
          </span>
        </div>
        <img
          src={resolveAsset('assets/ivory/garden.webp')}
          alt="梨花掩映的园林概念场景"
          width="1200"
          height="675"
          loading="lazy"
        />
      </a>
    </>
  );
};
