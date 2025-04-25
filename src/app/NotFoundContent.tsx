"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function NotFoundContentInner() {
  const searchParams = useSearchParams();
  return (
    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}

export default function NotFoundContent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContentInner />
    </Suspense>
  );
}
