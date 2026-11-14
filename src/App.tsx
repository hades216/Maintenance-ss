import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CartDrawer } from './components/CartDrawer';
import { FloatingActions } from './components/FloatingActions';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { RouterProvider, useRouter } from './context/RouterContext';
import { StoreProvider } from './context/StoreContext';
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';
import { BookPage } from './pages/BookPage';
import { CartPage } from './pages/CartPage';
import { ContactPage } from './pages/ContactPage';
import { FaqsPage } from './pages/FaqsPage';
import { HomePage } from './pages/HomePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { PrivacyPolicyPage, TermsConditionsPage } from './pages/LegalPages';
import { OurWorkPage } from './pages/OurWorkPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { ServiceAreasPage } from './pages/ServiceAreasPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { ServicesPage } from './pages/ServicesPage';
import type { ServiceCategorySlug } from './types/kaamfix';

const CATEGORY_SLUGS: ServiceCategorySlug[] = [
  'electrical',
  'plumbing',
  'carpentry',
  'painting',
  'civil-work',
  'home-maintenance',
  'renovation',
];

const PageView: React.FC = () => {
  const { pathname } = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const normalized = pathname.replace(/\/+$/, '') || '/';

  const renderPage = () => {
    if (normalized === '/') return <HomePage />;
    if (normalized === '/about') return <AboutPage />;
    if (normalized === '/how-it-works') return <HowItWorksPage />;
    if (normalized === '/services') return <ServicesPage />;

    if (normalized.startsWith('/services/')) {
      const slug = normalized.replace('/services/', '') as ServiceCategorySlug;
      if (CATEGORY_SLUGS.includes(slug)) {
        return <ServicesPage categorySlug={slug} />;
      }
      return <ServicesPage />;
    }

    if (normalized.startsWith('/service/')) {
      const serviceSlug = normalized.replace('/service/', '');
      if (serviceSlug) {
        return <ServiceDetailPage slug={serviceSlug} />;
      }
      return <ServicesPage />;
    }

    if (normalized === '/book') return <BookPage />;
    if (normalized === '/cart') return <CartPage />;
    if (normalized === '/our-work') return <OurWorkPage />;
    if (normalized === '/reviews') return <ReviewsPage />;
    if (normalized === '/service-areas') return <ServiceAreasPage />;
    if (normalized === '/contact') return <ContactPage />;
    if (normalized === '/faqs') return <FaqsPage />;
    if (normalized === '/privacy-policy') return <PrivacyPolicyPage />;
    if (normalized === '/terms-and-conditions') return <TermsConditionsPage />;
    if (normalized === '/admin') return <AdminPage />;

    return <HomePage />;
  };

  if (shouldReduceMotion) {
    return <>{renderPage()}</>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={normalized}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {renderPage()}
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <RouterProvider>
      <StoreProvider>
        <div className="min-h-screen flex flex-col bg-white text-[#1E2430]">
          <Header />
          <main className="flex-1">
            <PageView />
          </main>
          <Footer />
          <CartDrawer />
          <ServiceDetailModal />
          <FloatingActions />
        </div>
      </StoreProvider>
    </RouterProvider>
  );
}
