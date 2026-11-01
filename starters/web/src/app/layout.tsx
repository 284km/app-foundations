import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Notes · App Foundations', description: 'A local development starter using synthetic data.' };
export default function Layout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
