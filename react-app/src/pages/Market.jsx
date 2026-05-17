import './Market.css';

const barData = [
  { label: "Q1'24", gold: 45, silver: 30, goldVal: '₹5,890', silverVal: '₹72' },
  { label: "Q2'24", gold: 52, silver: 34, goldVal: '₹6,050', silverVal: '₹76' },
  { label: "Q3'24", gold: 48, silver: 32, goldVal: '₹5,980', silverVal: '₹74' },
  { label: "Q4'24", gold: 60, silver: 40, goldVal: '₹6,240', silverVal: '₹79' },
  { label: "Q1'25", gold: 55, silver: 37, goldVal: '₹6,150', silverVal: '₹77' },
  { label: "Q2'25", gold: 68, silver: 45, goldVal: '₹6,450', silverVal: '₹82' },
  { label: "Q3'25", gold: 72, silver: 48, goldVal: '₹6,580', silverVal: '₹84' },
  { label: "Q4'25", gold: 65, silver: 43, goldVal: '₹6,390', silverVal: '₹81' },
  { label: "Q1'26", gold: 78, silver: 52, goldVal: '₹6,720', silverVal: '₹86' },
  { label: "Q2'26", gold: 100, silver: 65, goldVal: '₹7,120', silverVal: '₹91' },
  { label: "Q3'26", gold: 88, silver: 58, goldVal: '₹6,950', silverVal: '₹89' },
  { label: 'Now',   gold: 92, silver: 62, goldVal: '₹6,850', silverVal: '₹88' },
];

const insights = [
  { icon: '↑', text: <>Gold prices rose by <strong>18.5%</strong> over the past 2 years, outperforming most traditional investment classes.</> },
  { icon: '◈', text: <>Highest volatility recorded in <strong>Q4 2025</strong> driven by global economic uncertainty and currency fluctuations.</> },
  { icon: '~', text: <>Average quarterly growth of <strong>2.1%</strong> — consistent upward momentum with low drawdown periods.</> },
  { icon: '★', text: <>Investment demand surged <strong>34%</strong> in 2025–2026 as retail investors shifted to safe-haven assets.</> },
];

export default function Market() {
  return (
    <div className="market-page">
      {/* Ticker */}
      <div className="ticker-strip">
        <div className="ticker-inner">
          {[1, 2].map((_, ri) => (
            <span key={ri}>
              <span>GOLD (24K) &nbsp;₹ 6,850/gm</span>
              <span className="up">▲ +2.3%</span>
              <span>SILVER &nbsp;₹ 88/gm</span>
              <span className="up">▲ +1.1%</span>
              <span>GOLD (22K) &nbsp;₹ 6,280/gm</span>
              <span className="down">▼ −0.4%</span>
              <span>PLATINUM &nbsp;₹ 3,120/gm</span>
              <span className="up">▲ +0.8%</span>
              <span>MCX GOLD &nbsp;₹ 68,500/10gm</span>
              <span className="up">▲ +1.9%</span>
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div className="p3-hero">
        <span className="p3-eyebrow">Market Intelligence</span>
        <h1 className="p3-title">Gold &amp; Silver<br /><em>Price Analytics</em></h1>
        <div className="p3-gold-line" />
        <p className="p3-subtitle">Historical Data · 2024 – 2026 · Updated Daily</p>
      </div>

      {/* Dashboard */}
      <div className="p3-main">
        {/* Stat Cards */}
        <div className="stat-card">
          <span className="stat-card__label">Current Price</span>
          <div className="stat-card__value">₹ 6,850 <span>/gm</span></div>
          <div className="stat-card__change up">▲ +2.3% today</div>
          <div className="stat-card__icon">◈</div>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">2-Year High</span>
          <div className="stat-card__value">₹ 7,120 <span>/gm</span></div>
          <div className="stat-card__change neutral">Jan 2026</div>
          <div className="stat-card__icon">↑</div>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">2-Year Low</span>
          <div className="stat-card__value">₹ 5,890 <span>/gm</span></div>
          <div className="stat-card__change neutral">Mar 2024</div>
          <div className="stat-card__icon">↓</div>
        </div>
        <div className="stat-card">
          <span className="stat-card__label">2-Year Growth</span>
          <div className="stat-card__value">18.5 <span>%</span></div>
          <div className="stat-card__change up">▲ Steady uptrend</div>
          <div className="stat-card__icon">%</div>
        </div>

        {/* Bar Chart */}
        <div className="chart-section">
          <div className="chart-section__header">
            <div>
              <div className="chart-section__title">Quarterly Price Movement</div>
              <div className="chart-section__sub">Gold vs Silver — 2024 to 2026</div>
            </div>
            <div className="chart-legend">
              <span className="legend-dot">Gold (24K)</span>
              <span className="legend-dot silver">Silver</span>
            </div>
          </div>

          <div className="bar-chart-wrap">
            <div className="chart-grid">
              <div className="grid-line" style={{ bottom: '25%' }} />
              <div className="grid-line" style={{ bottom: '50%' }} />
              <div className="grid-line" style={{ bottom: '75%' }} />
            </div>
            <div className="bar-chart">
              {barData.map((d, i) => (
                <div className="bar-group" key={i}>
                  <div className="bar gold-bar" style={{ height: `${d.gold}%` }} title={d.goldVal} />
                  <div className="bar silver-bar" style={{ height: `${d.silver}%` }} title={d.silverVal} />
                </div>
              ))}
            </div>
            <div className="bar-labels">
              {barData.map((d, i) => <span key={i}>{d.label}</span>)}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="insights-card">
          <div className="insights-card__title">Key Market Insights</div>
          {insights.map((ins, i) => (
            <div className="insight-row" key={i}>
              <div className="insight-icon">{ins.icon}</div>
              <div className="insight-text">{ins.text}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="cta-card">
          <div className="cta-card__label">Live Data</div>
          <div className="cta-card__title">Real-Time Charts<br />&amp; Interactive Data</div>
          <div className="cta-card__desc">Access live gold and silver prices, historical charts, and global market trends updated every minute.</div>
          <a
            href="https://goldbroker.com/charts/gold-price/inr#historical-chart"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn"
          >
            View Live Charts →
          </a>
        </div>
      </div>
    </div>
  );
}
