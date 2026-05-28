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
            background: "rgba(2,12,27,0.85)",
            borderBottom: "1px solid rgba(0,210,110,0.15)",
            backdropFilter: "blur(20px) saturate(1.4)",
            padding: "0 1rem",
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <span style={{ fontSize: "1rem", fontWeight: 800, letterSpacing: "0.06em" }}>
                <span style={{ color: "var(--primary)", textShadow: "0 0 14px rgba(0,230,118,0.7)" }}>HOUO</span>
                <span style={{ color: "var(--brand)", marginLeft: "0.3rem", textShadow: "0 0 14px rgba(0,180,216,0.7)" }}>Attend</span>
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
