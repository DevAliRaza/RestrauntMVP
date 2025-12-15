import { redirect } from 'next/navigation';

export default function DemoPage() {
  // For now, redirect to a demo restaurant
  // In production, you would seed a demo restaurant in your database
  // and redirect to /r/demo-restaurant
  redirect('/');
}

