import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import Link from 'next/link';
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import "./globals.css";

export const metadata = {
  title: "PROJX | Premium Anime",
  description: "The Ultimate Streaming Experience",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </head>
        <body className="antialiased bg-[#09090b] text-white selection:bg-[#ff4d4d] selection:text-white flex flex-col min-h-screen" style={{ fontFamily: "'Poppins', sans-serif" }}>
          
          {/* GLOBAL HEADER */}
          <header className="w-full bg-[#09090b]/90 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
              <div className="flex items-center gap-8">
                <Link href="/" className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#ff4d4d] rounded flex items-center justify-center text-white text-sm shadow-[0_0_15px_rgba(255,77,77,0.5)]">
                    <i className="fas fa-play ml-0.5"></i>
                  </div>
                  PROJ<span className="text-[#ff4d4d]">X</span>
                </Link>
                <nav className="hidden lg:flex gap-6 text-sm font-semibold text-gray-300">
                  <Link href="/" className="hover:text-[#ff4d4d] transition-colors">Home</Link>
                  <Link href="/search" className="hover:text-[#ff4d4d] transition-colors">Search & Filter</Link>
                  <Link href="#" className="hover:text-[#ff4d4d] transition-colors">Categories</Link>
                </nav>
              </div>
              
              <div className="flex items-center gap-4">
                <form action="/search" method="GET" className="hidden md:block relative">
                  <input type="text" name="q" placeholder="Search anime..." className="bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-white focus:outline-none focus:border-[#ff4d4d] transition-colors" />
                  <button type="submit" className="absolute right-3 top-1.5 text-gray-400 hover:text-white"><i className="fas fa-search"></i></button>
                </form>
                <Show when="signed-out">
                  <SignInButton mode="modal">
                    <button className="px-6 py-2 bg-[#ff4d4d] text-white font-bold text-sm rounded-full hover:scale-105 transition-transform shadow-lg">
                      Sign In
                    </button>
                  </SignInButton>
                </Show>
                <Show when="signed-in">
                  <UserButton />
                </Show>
              </div>
            </div>
          </header>

          {/* MAIN CONTENT */}
          <main className="flex-grow">
            {children}
          </main>

          {/* GLOBAL FOOTER */}
          <footer className="w-full bg-[#050505] border-t border-white/5 py-12 mt-20">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <Link href="/" className="text-2xl font-black text-white tracking-tighter">
                  PROJ<span className="text-[#ff4d4d]">X</span>
                </Link>
                <p className="text-gray-500 text-xs mt-4 leading-relaxed">
                  PROJX does not store any files on our server, we only linked to the media which is hosted on 3rd party services.
                </p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Navigation</h4>
                <ul className="text-gray-400 text-sm space-y-2">
                  <li><Link href="/" className="hover:text-[#ff4d4d] transition-colors">Home</Link></li>
                  <li><Link href="/search" className="hover:text-[#ff4d4d] transition-colors">Advanced Search</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Categories</h4>
                <ul className="text-gray-400 text-sm space-y-2">
                  <li><Link href="#" className="hover:text-[#ff4d4d] transition-colors">Action</Link></li>
                  <li><Link href="#" className="hover:text-[#ff4d4d] transition-colors">Romance</Link></li>
                  <li><Link href="#" className="hover:text-[#ff4d4d] transition-colors">Shounen</Link></li>
                </ul>
              </div>
            </div>
          </footer>

        </body>
      </html>
    </ClerkProvider>
  );
}