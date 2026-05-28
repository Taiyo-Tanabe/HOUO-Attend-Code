import Link from "next/link"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"

export const metadata = {
  title: "HOUO Attend",
  description: "法桜交流会のイベント管理アプリ",
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body style={{ backgroundColor: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
        <AuthProvider>
          <header style={{
            position: "sticky", top: 0, zIndex: 200,
            background: "rgba(10,10,10,0.92)",
            borderBottom: "1px solid var(--border)",
            backdropFilter: "blur(16px)",
            padding: "0 1.25rem",
            height: "54px",
            display: "flex",
            alignItems: "center",
          }}>
            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.55rem" }}>
              <span style={{
                width: "28px", height: "28px", borderRadius: "8px",
                background: "var(--primary)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.8rem", fontWeight: 900, color: "#000", flexShrink: 0,
                letterSpacing: "-0.02em",
              }}>H</span>
              <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text)", letterSpacing: "0.01em" }}>
                HOUO <span style={{ color: "var(--text-dim)", fontWeight: 500 }}>Attend</span>
              </span>
            </Link>
          </header>
          <main style={{ maxWidth: "520px", margin: "0 auto", padding: "1.5rem 1rem 4rem" }}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
