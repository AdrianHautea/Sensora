import React, { useState } from 'react'
import { styles } from './styles/styles'
import LineChart from '../components/LineChart'
import '../pages/styles/LandingPage.css'

const levelColor = { INFO: '#4ade80', WARN: '#facc15', ERROR: '#f87171' }

export default function LogPage({ onNavigate }) {
  // focus data (replace with real source as needed)
  const [focusData] = useState([
    { time: '2026-03-07T08:30:00', score: 62 },
    { time: '2026-03-07T09:00:00', score: 70 },
    { time: '2026-03-07T09:30:00', score: 55 },
    { time: '2026-03-07T10:00:00', score: 78 },
    { time: '2026-03-07T10:30:00', score: 85 },
    { time: '2026-03-07T11:00:00', score: 73 },
    { time: '2026-03-07T11:30:00', score: 66 },
  ])

  const [activeTab, setActiveTab] = useState(null)

  const architectureItems = [
    {
      step: '01',
      title: 'Input',
      description: 'Log sessions quickly — subject, duration and initial focus.',
    },
    {
      step: '02',
      title: 'Analysis',
      description: 'Detects patterns across sessions to surface your best conditions.',
    },
    {
      step: '03',
      title: 'Adaptation',
      description: 'Recommendations evolve with your data: more of what works.',
    },
  ]

  return (
    <div style={styles.page}>
      <nav style={styles.nav} className="anim-nav">
        <span style={styles.navLogo}>Sensora</span>
        <button
          style={styles.navBtn}
          className={`nav-cta${activeTab === 'home' ? ' active' : ''}`}
          onClick={() => { setActiveTab('home'); onNavigate('landing') }}
        >
          ← Home
        </button>
      </nav>

      {/* Focus Score */}
      <main style={{ ...styles.hero, alignItems: 'flex-start', padding: '2.5rem 2rem' }} className="anim-hero">
        <h1 style={{ ...styles.heroTitle, fontSize: '2rem', marginBottom: '1rem' }}>Focus Score</h1>
        <p style={{ color: '#94a3b8', marginTop: 0, marginBottom: 18 }}>Line chart of focus score over time. Hover points for details (native tooltip).</p>

        <div
          style={{ width: '100%', maxWidth: 805, background: '#0b1220', padding: 18, borderRadius: 10 }}
          className="anim-card"
        >
          <LineChart data={focusData} width={800} height={260} />
        </div>
      </main>

      {/* Architecture / How it works (moved from LandingPage) */}
      <section style={styles.architectureSection} className="anim-architecture">
        <div style={styles.architectureInner}>
          <p style={styles.architectureEyebrow}>How it works</p>
          <h2 style={styles.architectureTitle}>Built around your rhythm</h2>
          <p style={styles.architectureSub}>
            Sensora doesn't apply a one-size-fits-all method. It listens, learns, and adjusts — turning your habits into your advantage.
          </p>

          <div style={styles.architectureGrid}>
            {architectureItems.map((item, i) => (
              <div
                key={item.step}
                style={{ ...styles.architectureCard, animationDelay: `${i * 140}ms` }}
                className="architecture-card anim-card"
              >
                <span style={styles.architectureStep}>{item.step}</span>
                <h3 style={styles.architectureCardTitle}>{item.title}</h3>
                <p style={styles.architectureCardDesc}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}