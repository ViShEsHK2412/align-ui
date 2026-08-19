const cards = [24, 24, 24, 25.5, 24, 24];

export default function Page() {
  return (
    <main style={{ position: 'relative', height: 600, paddingTop: 24 }}>
      <h1 style={{ fontSize: 18, marginLeft: 24 }}>Next.js App Router — press Ctrl/Cmd+Shift+A</h1>
      {/* Same seeded near-miss as the Vite demo: five cards at 24px, one at 25.5px. */}
      {cards.map((left, i) => (
        <div key={i} style={{ position: 'absolute', left, top: 80 + i * 32,
                              width: 160, height: 24, background: '#232833',
                              borderRadius: 4 }} />
      ))}
    </main>
  );
}
