// app/layout.tsx
import { AuthProvider } from '@/contexts/AuthContext';
import { PredictionProvider } from '@/contexts/PredictionContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <PredictionProvider>
            {children}
          </PredictionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}