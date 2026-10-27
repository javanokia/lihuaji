import React from 'react';
import { useApp } from '../context/AppContext';
import { PageTitle } from '../components/PageTitle';
import { Icon } from '../components/Icon';
import { downloadFile } from '../utils/download';

export const Profile: React.FC = () => {
  const { progress } = useApp();

  const handleExport = () => {
    downloadFile(
      '梨花季学习记录.json',
      JSON.stringify(progress, null, 2),
      'application/json'
    );
  };

  const recentDays = progress.days.slice(-14);

  return (
    <>
      <PageTitle
        title="我的 · 慢绣日常"
        sub="不赶时间，只积攒手上的熟练。练习记录仅保存在当前浏览器，不跨设备同步。"
      />

      <div className="metrics">
        <div className="metric-box">
          <span className="metric">{progress.days.length}</span>
          <p>练习天数</p>
        </div>
        <div className="metric-box">
          <span className="metric">{progress.best}</span>
          <p>配对最高分</p>
        </div>
      </div>

      <div className="card">
        <h2>365天慢绣计划</h2>
        <p>按自己的节奏，练习直线针、套针与滚针。</p>
        <a className="btn primary" href="#ar">
          开始练习
        </a>
        <p>{recentDays.join('、') || '尚无练习记录'}</p>
        <button id="export-progress" onClick={handleExport}>
          导出本机学习记录
        </button>
      </div>

      <div className="profile-links">
        <a className="card" href="#game">
          <Icon name="game" /> 纹样配对 <Icon name="arrow" />
        </a>
        <a className="card" href="#palette">
          <Icon name="palette" /> 东方色谱 <Icon name="arrow" />
        </a>
        <a className="card" href="#collaborate">
          <Icon name="users" /> 协作修改 <Icon name="arrow" />
        </a>
      </div>
    </>
  );
};
