import './globals.css';

export const metadata = {
  title: 'ClassPilot',
  description: 'ClassPilot app with Supabase authentication and attendance tracking.'
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
