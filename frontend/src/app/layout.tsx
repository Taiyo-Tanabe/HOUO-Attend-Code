import type { Metadata } from "next"
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
            background: "rgba(6,12,24,0.85)",
            borderBottom: "1px solid var(--border)",
            backdropFilter: "blur(20px) saturate(1.4)",
            padding: "0 1rem",
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span style={{ fontSize: "1rem", fontWeight: 700, letterSpacing: "0.05em" }}>
              <span style={{ color: "var(--brand)" }}>HOUO</span>
              <span style={{ color: "var(--primary)", marginLeft: "0.25rem" }}>Attend</span>
            </span>
          </header>
          <main style={{ maxWidth: "520px", margin: "0 auto", padding: "1.5rem 1rem" }}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
