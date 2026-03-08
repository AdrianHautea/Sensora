import React, { useState } from 'react'
import { styles } from './styles/styles'
import '../pages/styles/LandingPage.css'

export default function LandingPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState(null)

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
        <div className="hero-container">
          <svg
            className="hero-wave"
            viewBox="0 0 1200 220"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="waveGrad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.06" />
              </linearGradient>
              <linearGradient id="waveGrad2" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.04" />
              </linearGradient>
            </defs>

            <path
              className="wave wave1"
              d="M0,120 C150,200 350,40 600,100 C850,160 1050,60 1200,120 L1200,220 L0,220 Z"
            />
            <path
              className="wave wave2"
              d="M0,140 C150,80 350,200 600,140 C850,80 1050,180 1200,140 L1200,220 L0,220 Z"
            />
          </svg>

          <div className="hero-inner">
            <h1 style={styles.heroTitle}>Welcome to Sensora</h1>
            <p style={styles.heroSub}>Study sessions shaped by you, for you.</p>
          </div>
        </div>
      </main>

      {/* Inspiration & Mission */}
      <section style={{ padding: '44px 20px' }} className="anim-architecture">
        <div style={{ maxWidth: 980, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ marginBottom: 6, color: '#94a3b8', fontWeight: 600 }}>Inspiration</p>
          <h2 style={{ marginTop: 0, fontSize: '1.625rem' }}>Why we built Sensora</h2>
          <p style={{ color: '#cbd5e1', maxWidth: 760, margin: '12px auto 20px' }}>
            During our hackathon we noticed students struggle to translate time spent into real learning.
            Sensora was born to surface what actually helps you focus — visualizing your habits, suggesting better sessions,
            and keeping data private and lightweight.
          </p>

          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', marginTop: 18 }}>
            <div style={{ padding: 14, borderRadius: 10, background: '#071126', boxShadow: '0 8px 20px rgba(2,6,23,0.5)' }}>
              <strong>Privacy-first</strong>
              <div style={{ color: '#94a3b8', marginTop: 6 }}>All analysis happens locally — your habits stay yours.</div>
            </div>
            <div style={{ padding: 14, borderRadius: 10, background: '#071126', boxShadow: '0 8px 20px rgba(2,6,23,0.5)' }}>
              <strong>Actionable insights</strong>
              <div style={{ color: '#94a3b8', marginTop: 6 }}>Not just charts — clear recommendations you can use now.</div>
            </div>
            <div style={{ padding: 14, borderRadius: 10, background: '#071126', boxShadow: '0 8px 20px rgba(2,6,23,0.5)' }}>
              <strong>Lightweight</strong>
              <div style={{ color: '#94a3b8', marginTop: 6 }}>Small footprint, zero mandatory accounts, demo-ready for judges.</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}