import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function NotFoundContent() {
  const params = useSearchParams();
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
      fontFamily: 'Chillax, Inter, sans-serif',
      color: '#1a202c',
    }}>
      <div style={{
        background: 'white',
        padding: '3rem 2.5rem',
        borderRadius: '2rem',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.17)',
        textAlign: 'center',
        maxWidth: 420,
        width: '100%',
      }}>
        <div style={{
          fontSize: 120,
          fontWeight: 700,
          color: '#f87171',
          lineHeight: 1,
          marginBottom: 16,
        }}>404</div>
        <h1 style={{ fontSize: 32, fontWeight: 600, marginBottom: 12 }}>Page Not Found</h1>
        <p style={{ fontSize: 18, marginBottom: 24 }}>
          Sorry, the page you are looking for does not exist.<br />
          {params && params.get("ref") && (
            <span style={{ color: '#64748b', fontSize: 14 }}>Ref: {params.get("ref")}</span>
          )}
        </p>
        <a
          href="/"
          style={{
            display: 'inline-block',
            padding: '0.75rem 2.25rem',
            borderRadius: '999px',
            background: 'linear-gradient(90deg, #6366f1, #3b82f6)',
            color: 'white',
            fontWeight: 500,
            fontSize: 18,
            textDecoration: 'none',
            boxShadow: '0 2px 8px 0 rgba(99, 102, 241, 0.12)',
            transition: 'background 0.2s',
          }}
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

export default function NotFoundPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}
