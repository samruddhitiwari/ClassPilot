import './globals.css';

export const metadata = {
  title: 'ClassPilot Auth',
  description: 'Supabase authentication for ClassPilot'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
