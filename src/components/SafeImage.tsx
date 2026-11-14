import React, { useState } from 'react';
import { Wrench } from 'lucide-react';
import { MEDIA_ASSETS } from '../data/media';
import type { ImageKey } from '../types/kaamfix';

interface SafeImageProps {
  imageKey: ImageKey;
  customUrl?: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  imageKey,
  customUrl,
  alt,
  className = 'w-full h-full object-cover',
  priority = false,
}) => {
  const [failed, setFailed] = useState(false);
  const src = customUrl?.trim() ? customUrl.trim() : MEDIA_ASSETS[imageKey];

  if (failed || !src) {
    return (
      <div
        className="w-full h-full bg-gradient-to-br from-[#0B1E38] via-[#132F56] to-[#1D6FF2]/40 flex flex-col items-center justify-center p-6 text-center text-white"
        role="img"
        aria-label={alt}
      >
        <Wrench className="w-7 h-7 text-[#60A5FA] mb-2" aria-hidden="true" />
        <span className="text-xs font-medium tracking-wide text-white/85 max-w-[220px]">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
