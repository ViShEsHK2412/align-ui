import AlignDev from '../components/AlignDev';

export const metadata = { title: 'Align — Next.js example' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0f1115', color: '#cbd3e1',
                     fontFamily: 'system-ui, sans-serif' }}>
        {children}
        {process.env.NODE_ENV !== 'production' && <AlignDev />}
      </body>
    </html>
  );
}
