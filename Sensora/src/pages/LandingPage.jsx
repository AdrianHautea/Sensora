import { styles } from './styles/styles'

export default function LandingPage({ onNavigate }) {
  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <span style={styles.navLogo}>Sensora</span>
        <button style={styles.navBtn} onClick={() => onNavigate('log')}>Log</button>
      </nav>

      <main style={styles.hero}>
        <h1 style={styles.heroTitle}>Welcome to MyApp</h1>
        <p style={styles.heroSub}>A simple, clean starting point for your next big idea.</p>
        <button style={styles.ctaBtn} onClick={() => onNavigate('log')}>
          View the Log →
        </button>
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2026 MyApp. All rights reserved.</p>
      </footer>
    </div>
  )
}
