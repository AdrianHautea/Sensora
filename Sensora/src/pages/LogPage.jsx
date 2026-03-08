import React, { useState } from 'react'
import { styles } from './styles/styles'
import LineChart from '../components/LineChart'
import '../pages/styles/LandingPage.css'
import cameraImg from '../assets/camera.png'
import clipImg from '../assets/clip.png'
import mcuImg from '../assets/mcu.png'

const levelColor = { INFO: '#4ade80', WARN: '#facc15', ERROR: '#f87171' }

export default function LogPage({ onNavigate }) {
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

      <section style={{ ...styles.architectureSection, padding: '2rem 0' }} className="anim-architecture">
        <div style={{ ...styles.architectureInner, maxWidth: 980 }}>
          <p style={styles.architectureEyebrow}>How it works</p>
          <h2 style={styles.architectureTitle}>Processing pipeline (visual)</h2>
          <p style={styles.architectureSub}>
            Camera captures facial patterns → OpenAI CLIP interprets emotions → Microcontroller receives labels and outputs signals.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 18,
              marginTop: 20,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.02), transparent)',
              padding: 18,
              borderRadius: 10,
            }}
            className="anim-card"
          >
            {/* Camera */}
            <div style={{ flex: 1, textAlign: 'center', padding: 12 }}>
              <div style={{ width: 110, height: 110, margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={cameraImg} alt="Camera" style={{ maxWidth: '100%', maxHeight: '100%' }} />
              </div>
              <h3 style={{ margin: 6, fontSize: 16 }}>Camera (capture)</h3>
              <p style={{ color: '#94a3b8', marginTop: 6, fontSize: 13 }}>Detects facial landmarks & patterns in real-time.</p>
            </div>

            {/* Arrow */}
            <div style={{ width: 60, display: 'flex', justifyContent: 'center' }}>
              <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <line x1="2" y1="20" x2="46" y2="20" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
                <path d="M46 20 L40 14 M46 20 L40 26" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* CLIP */}
            <div style={{ flex: 1, textAlign: 'center', padding: 12 }}>
              <div style={{ width: 110, height: 110, margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={clipImg} alt="OpenAI CLIP" style={{ maxWidth: '100%', maxHeight: '100%' }} />
              </div>
              <h3 style={{ margin: 6, fontSize: 16 }}>OpenAI CLIP (interpret)</h3>
              <p style={{ color: '#94a3b8', marginTop: 6, fontSize: 13 }}>Classifies visual input into likely emotions and context labels.</p>
            </div>

            {/* Arrow */}
            <div style={{ width: 60, display: 'flex', justifyContent: 'center' }}>
              <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <line x1="2" y1="20" x2="46" y2="20" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
                <path d="M46 20 L40 14 M46 20 L40 26" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Microcontroller */}
            <div style={{ flex: 1, textAlign: 'center', padding: 12 }}>
              <div style={{ width: 110, height: 110, margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={mcuImg} alt="Microcontroller" style={{ maxWidth: '100%', maxHeight: '100%' }} />
              </div>
              <h3 style={{ margin: 6, fontSize: 16 }}>Microcontroller (output)</h3>
              <p style={{ color: '#94a3b8', marginTop: 6, fontSize: 13 }}>Receives labels and drives actuators / indicators accordingly.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}