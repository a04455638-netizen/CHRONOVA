import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { I18nProvider } from '@/context/I18nContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/store/CartDrawer';
import MaintenanceOverlay from '@/components/common/MaintenanceOverlay';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'CHRONOVA — Shveytsariya Lyuks Soatlar Butigi',
  description: 'Rolex, Omega, Patek Philippe, Audemars Piguet va Cartier kabi dunyoning eng nufuzli soatlari. 100% asl nusxa, rasmiy xalqaro kafolat va Toshkent bo‘ylab xavfsiz yetkazib berish.',
  keywords: ['soat sotib olish', 'shveytsariya soatlari', 'rolex toshkent', 'omega speedmaster', 'lyuks soatlar', 'chronova'],
  authors: [{ name: 'CHRONOVA Haute Horlogerie' }],
  openGraph: {
    title: 'CHRONOVA — Shveytsariya Lyuks Soatlar Butigi',
    description: 'Dunyoning eng sara original Shveytsariya soatlari rasmiy kafolati bilan.',
    url: 'https://chronova.uz',
    siteName: 'CHRONOVA',
    images: [
      {
        url: '/images/watches/rolex-submariner.jpg',
        width: 1200,
        height: 630,
        alt: 'CHRONOVA Luxury Watches',
      },
    ],
    locale: 'uz_UZ',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className="dark" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-surface-light dark:bg-surface-darkMuted text-graphite-900 dark:text-ivory-100 antialiased selection:bg-gold-500 selection:text-white">
        <ThemeProvider>
          <I18nProvider>
            <WishlistProvider>
              <CartProvider>
                <Navbar />
                <main className="flex-1">
                  {children}
                </main>
                <CartDrawer />
                <MaintenanceOverlay />
                <Footer />
              </CartProvider>
            </WishlistProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
