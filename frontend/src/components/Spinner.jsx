export default function Spinner({ size = 32 }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "3rem 0" }}>
      <div
        className="spinner"
        style={{ width: size, height: size }}
        role="status"
        aria-label="読み込み中"
      />
    </div>
  )
}
