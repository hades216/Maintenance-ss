import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { BUSINESS_INFO, PORTFOLIO_ITEMS } from '../data/business';
import { INITIAL_SERVICES, SERVICE_CATEGORIES } from '../data/catalog';
import type {
  CartItem,
  EditableBusinessSettings,
  ProjectPortfolioItem,
  ServiceCategory,
  ServiceItem,
  VerifiedReview,
} from '../types/kaamfix';
import {
  addItemToCart,
  calculateCartSummary,
  type CartPricingSummary,
  removeItemFromCart,
  updateItemNotes,
  updateItemQuantity,
} from '../utils/bookingLogic';

const CART_STORAGE_KEY = 'kaamfix_cart_v1';

interface ToastState {
  id: number;
  message: string;
  subtext?: string;
}

interface StoreContextValue {
  categories: ServiceCategory[];
  services: ServiceItem[];
  projects: ProjectPortfolioItem[];
  reviews: VerifiedReview[];
  settings: EditableBusinessSettings;
  catalogLoading: boolean;
  refreshBootstrap: () => Promise<void>;
  cart: CartItem[];
  cartSummary: CartPricingSummary;
  addToCart: (service: ServiceItem, quantity?: number, notes?: string, silent?: boolean) => void;
  setQuantity: (serviceId: string, quantity: number) => void;
  setItemNotes: (serviceId: string, notes: string) => void;
  removeFromCart: (serviceId: string) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  toast: ToastState | null;
  dismissToast: () => void;
  selectedServiceForModal: ServiceItem | null;
  setSelectedServiceForModal: (service: ServiceItem | null) => void;
}

const DEFAULT_SETTINGS: EditableBusinessSettings = {
  phoneDisplay: BUSINESS_INFO.phoneDisplay,
  whatsappNumber: BUSINESS_INFO.whatsappNumber,
  address: BUSINESS_INFO.address,
  hours: BUSINESS_INFO.hours,
  facebookUrl: BUSINESS_INFO.facebookUrl,
  serviceLocationNote: BUSINESS_INFO.serviceLocationNote,
  bookingAvailable: true,
  confirmedAreas: ['Satellite Town (Block A–F, Rawalpindi)'],
};

const StoreContext = createContext<StoreContextValue | null>(null);

function loadStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<ServiceCategory[]>(SERVICE_CATEGORIES);
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [projects, setProjects] = useState<ProjectPortfolioItem[]>(PORTFOLIO_ITEMS);
  const [reviews, setReviews] = useState<VerifiedReview[]>([]);
  const [settings, setSettings] = useState<EditableBusinessSettings>(DEFAULT_SETTINGS);
  const [catalogLoading, setCatalogLoading] = useState<boolean>(true);

  const [cart, setCart] = useState<CartItem[]>(loadStoredCart);
  const [isCartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<ServiceItem | null>(null);

  const refreshBootstrap = useCallback(async () => {
    try {
      const res = await fetch('/api/bootstrap');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories);
        }
        if (Array.isArray(data.services) && data.services.length > 0) {
          setServices(data.services);
        }
        if (Array.isArray(data.projects)) {
          setProjects(data.projects);
        }
        if (Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        }
        if (data.settings) {
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
      }
    } catch {
      // Fallback gracefully to bundled catalog
    } finally {
      setCatalogLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshBootstrap();
  }, [refreshBootstrap]);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore storage quota issues
    }
  }, [cart]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => {
      setToast(null);
    }, 3400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const addToCart = useCallback(
    (service: ServiceItem, quantity = 1, notes = '', silent = false) => {
      const category = categories.find((c) => c.slug === service.categorySlug);
      const categoryName = category?.name || 'Home Services';
      setCart((prev) => addItemToCart(prev, service, categoryName, quantity, notes));
      if (!silent) {
        setToast({
          id: Date.now(),
          message: `Added ${service.name} to cart`,
          subtext: 'You can keep browsing or review your combined cart.',
        });
      }
    },
    [categories]
  );

  const setQuantity = useCallback((serviceId: string, quantity: number) => {
    setCart((prev) => updateItemQuantity(prev, serviceId, quantity));
  }, []);

  const setItemNotes = useCallback((serviceId: string, notes: string) => {
    setCart((prev) => updateItemNotes(prev, serviceId, notes));
  }, []);

  const removeFromCart = useCallback((serviceId: string) => {
    setCart((prev) => removeItemFromCart(prev, serviceId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const cartSummary = useMemo(() => calculateCartSummary(cart), [cart]);

  return (
    <StoreContext.Provider
      value={{
        categories,
        services,
        projects,
        reviews,
        settings,
        catalogLoading,
        refreshBootstrap,
        cart,
        cartSummary,
        addToCart,
        setQuantity,
        setItemNotes,
        removeFromCart,
        clearCart,
        isCartDrawerOpen,
        setCartDrawerOpen,
        toast,
        dismissToast,
        selectedServiceForModal,
        setSelectedServiceForModal,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used inside StoreProvider');
  }
  return ctx;
}
