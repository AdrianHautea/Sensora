import { styles } from './styles/styles'

export default function LandingPage({ onNavigate }) {
  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <span style={styles.navLogo}>Sensora</span>
        <button style={styles.navBtn} onClick={() => onNavigate('log')}>Log</button>
      </nav>

      <main style={styles.hero}>
        <h1 style={styles.heroTitle}>Welcome to Sensora</h1>
        <p style={styles.heroSub}>Study sessions shaped by you, for you.</p>
      </main>
    </div>
  )
}
