import React, { useState } from 'react'
import { styles } from './styles/styles'
import '../pages/styles/LandingPage.css'

export default function LandingPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState(null)
  
  const architectureItems = [
    {
      step: '01',
      title: 'Input',
      description: 'Log your study session — subject, duration, focus level, and how you felt going in.',
    },
    {
      step: '02',
      title: 'Analysis',
      description: 'Sensora detects patterns across your sessions, identifying when and how you learn best.',
    },
    {
      step: '03',
      title: 'Adaptation',
      description: 'Your session recommendations evolve over time, shaped entirely by your own data.',
    },
  ]

  return (
    <div style={styles.page}>
      <nav style={styles.nav} className="anim-nav">
        <span style={styles.navLogo}>Sensora</span>
        <button
          style={styles.navBtn}
          className={`nav-cta${activeTab === 'log' ? ' active' : ''}`}
          onClick={() => { setActiveTab('log'); onNavigate('log') }}
        >
          Log
        </button>
      </nav>

      <main style={styles.hero} className="anim-hero">
        <h1 style={styles.heroTitle}>Welcome to Sensora</h1>
        <p style={styles.heroSub}>Study sessions shaped by you, for you.</p>
      </main>

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

      <footer style={styles.footer}>
        <p style={styles.footerText}>© {new Date().getFullYear()} Sensora. All rights reserved.</p>
      </footer>
    </div>
  )
}