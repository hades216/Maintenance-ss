import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import type { ImageKey } from '../types/kaamfix';
import { SafeImage } from './SafeImage';

interface ParallaxBannerProps {
  imageKey: ImageKey;
  alt: string;
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  heightClass?: string;
  overlayGradient?: string;
  eyebrowClass?: string;
}

export const ParallaxBanner: React.FC<ParallaxBannerProps> = ({
  imageKey,
  alt,
  eyebrow,
  title,
  description,
  action,
  heightClass = 'min-h-[420px] md:min-h-[500px]',
  overlayGradient = 'bg-gradient-to-r from-[#071426]/92 via-[#0B1E38]/78 to-[#0D9488]/45',
  eyebrowClass = 'text-[#60A5FA]',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? ['0%', '0%'] : ['-10%', '10%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], shouldReduceMotion ? [1, 1, 1] : [1.08, 1.03, 1.08]);

  return (
    <section
      ref={containerRef}
      className={`relative overflow-hidden bg-[#0B1E38] text-white ${heightClass} flex items-center`}
    >
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 will-change-transform pointer-events-none"
      >
        <SafeImage imageKey={imageKey} alt={alt} className="w-full h-full object-cover" />
      </motion.div>
      <div className={`absolute inset-0 ${overlayGradient}`} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-24">
        <div className="max-w-2xl">
          <p className={`text-xs font-semibold tracking-[0.14em] uppercase mb-3 ${eyebrowClass}`}>
            {eyebrow}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white text-balance leading-[1.12]">
            {title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/85 leading-relaxed max-w-xl">
            {description}
          </p>
          {action && <div className="mt-7">{action}</div>}
        </div>
      </div>
    </section>
  );
};

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const Reveal: React.FC<RevealProps> = ({ children, delay = 0, className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
