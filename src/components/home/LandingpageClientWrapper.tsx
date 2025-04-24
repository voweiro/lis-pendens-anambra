"use client";
import dynamic from 'next/dynamic';

const LandingPage = dynamic(() => import('./Landingpage'), { ssr: false });

export default function LandingpageClientWrapper() {
  return <LandingPage />;
}
