import { useState } from 'react'
import { styles } from './styles/styles'

const levelColor = { INFO: '#4ade80', WARN: '#facc15', ERROR: '#f87171' }

export default function LogPage({ onNavigate }) {
  const [logs] = useState([
    { id: 1, time: '2026-03-07 09:00', level: 'INFO',  message: 'Application started successfully.' },
    { id: 2, time: '2026-03-07 09:02', level: 'INFO',  message: 'User session initialized.' },
    { id: 3, time: '2026-03-07 09:05', level: 'WARN',  message: 'Config value missing, using default.' },
    { id: 4, time: '2026-03-07 09:10', level: 'ERROR', message: 'Failed to connect to external service.' },
    { id: 5, time: '2026-03-07 09:15', level: 'INFO',  message: 'Retry succeeded. Connection restored.' },
  ])

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <span style={styles.navLogo}>Sensora</span>
        <button style={styles.navBtn} onClick={() => onNavigate('landing')}>← Home</button>
      </nav>

      <main style={{ ...styles.hero, alignItems: 'flex-start', padding: '3rem 2rem' }}>
        <h1 style={{ ...styles.heroTitle, fontSize: '2rem', marginBottom: '1.5rem' }}>Activity Log</h1>

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
      </main> 
    </div>
  )
}
