import type { Metadata } from "next"
import Link from "next/link"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"

export const metadata: Metadata = {
  title: "HOUO Attend",
  description: "法桜交流会のイベント管理アプリ",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body style={{ backgroundColor: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
        <AuthProvider>
          <header style={{
            position: "sticky", top: 0, zIndex: 200,
            background: "rgba(5,5,15,0.8)",
            borderBottom: "1px solid rgba(120,80,255,0.2)",
            backdropFilter: "blur(20px) saturate(1.4)",
            padding: "0 1rem",
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <span style={{ fontSize: "1rem", fontWeight: 800, letterSpacing: "0.06em" }}>
                <span style={{ color: "var(--brand)", textShadow: "0 0 12px rgba(255,45,120,0.6)" }}>HOUO</span>
                <span style={{ color: "var(--primary)", marginLeft: "0.3rem", textShadow: "0 0 12px rgba(0,229,255,0.6)" }}>Attend</span>
              </span>
            </Link>
          </header>
          <main style={{ maxWidth: "520px", margin: "0 auto", padding: "1.5rem 1rem" }}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
