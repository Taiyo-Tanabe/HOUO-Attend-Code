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
            background: "rgba(10,10,10,0.9)",
            borderBottom: "1px solid var(--border)",
            backdropFilter: "blur(12px)",
            padding: "0 1.25rem",
            height: "52px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{
                width: "22px", height: "22px", borderRadius: "6px",
                background: "var(--primary)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.7rem", fontWeight: 900, color: "#000",
                flexShrink: 0,
              }}>H</span>
              <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text)", letterSpacing: "0.02em" }}>
                HOUO <span style={{ color: "var(--text-dim)", fontWeight: 400 }}>Attend</span>
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
