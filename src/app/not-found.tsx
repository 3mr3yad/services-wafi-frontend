import Link from 'next/link';

// Reached only for URLs the locale proxy does not handle.
export default function GlobalNotFound() {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ fontFamily: 'system-ui, sans-serif', display: 'grid', placeItems: 'center', minHeight: '100vh', margin: 0 }}>
        <main style={{ textAlign: 'center' }}>
          <h1>404</h1>
          <p>
            <Link href="/ar">الرئيسية</Link> · <Link href="/en">Home</Link>
          </p>
        </main>
      </body>
    </html>
  );
}
