import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import "./globals.css";

export const metadata = {
  title: "PROJECT X | Anime",
  description: "Premium Buffer-Free Anime Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          {/* Changed from Anton to Poppins for that sleek AniWatch consumer look */}
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </head>
        <body className="bg-[#0a0a0a] text-gray-200 font-sans antialiased" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}