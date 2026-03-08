import { useState } from 'react'
import { styles } from './styles/styles'
import LineChart from '../components/LineChart'

const levelColor = { INFO: '#4ade80', WARN: '#facc15', ERROR: '#f87171' }

export default function LogPage({ onNavigate }) {
  const [logs] = useState([
    { id: 1, time: '2026-03-07 09:00', level: 'INFO',  message: 'Application started successfully.' },
    { id: 2, time: '2026-03-07 09:02', level: 'INFO',  message: 'User session initialized.' },
    { id: 3, time: '2026-03-07 09:05', level: 'WARN',  message: 'Config value missing, using default.' },
    { id: 4, time: '2026-03-07 09:10', level: 'ERROR', message: 'Failed to connect to external service.' },
    { id: 5, time: '2026-03-07 09:15', level: 'INFO',  message: 'Retry succeeded. Connection restored.' },
  ])

  const [focusData] = useState([
    { time: '2026-03-07T08:30:00', score: 62 },
    { time: '2026-03-07T09:00:00', score: 70 },
    { time: '2026-03-07T09:30:00', score: 55 },
    { time: '2026-03-07T10:00:00', score: 78 },
    { time: '2026-03-07T10:30:00', score: 85 },
    { time: '2026-03-07T11:00:00', score: 73 },
    { time: '2026-03-07T11:30:00', score: 66 },
  ])

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <span style={styles.navLogo}>Sensora</span>
        <button style={styles.navBtn} onClick={() => onNavigate('landing')}>← Home</button>
      </nav>

      {/* Focus Score */}
      <main style={{ ...styles.hero, alignItems: 'flex-start', padding: '2.5rem 2rem' }}>
        <h1 style={{ ...styles.heroTitle, fontSize: '2rem', marginBottom: '1rem' }}>Focus Score</h1>
        <p style={{ color: '#94a3b8', marginTop: 0, marginBottom: 18 }}>Line chart of focus score over time. Hover points for details (native tooltip).</p>

        <div style={{ width: '100%', maxWidth: 805, background: '#0b1220', padding: 18, borderRadius: 10 }}>
          <LineChart data={focusData} width={800} height={260} />
        </div>
      </main>

      {/* Activity Log */}
      <main style={{ ...styles.hero, alignItems: 'flex-start', padding: '3rem 2rem' }}>
        <h1 style={{ ...styles.heroTitle, fontSize: '2rem', marginBottom: '1.5rem' }}>Activity Log</h1>

        <div style={{ width: '100%', maxWidth: 920 }}>
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span style={{ flex: 2 }}>Timestamp</span>
              <span style={{ flex: 1 }}>Level</span>
              <span style={{ flex: 5 }}>Message</span>
            </div>
            {logs.map(log => (
              <div key={log.id} style={styles.tableRow}>
                <span style={{ flex: 2, color: '#94a3b8', fontSize: '0.85rem' }}>{log.time}</span>
                <span style={{ flex: 1 }}>
                  <span style={{
                    ...styles.badge,
                    background: levelColor[log.level] + '22',
                    color: levelColor[log.level],
                    border: `1px solid ${levelColor[log.level]}44`
                  }}>
                    {log.level}
                  </span>
                </span>
                <span style={{ flex: 5, color: '#e2e8f0' }}>{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}