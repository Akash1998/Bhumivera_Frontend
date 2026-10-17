import React from 'react';

/**
 * BhumiveraVideo (Static Photographic Specimen Frame)
 * All video animations (.mp4 / <video>) have been removed across the platform.
 * Renders a high-resolution, watermark-free static photograph with optional specimen badge.
 */
export default function BhumiveraVideo({
  src,
  poster = '/assets/images/real_001.webp',
  alt = 'Bhumivera botanical photograph',
  className = 'w-full h-full object-cover',
  containerClassName = 'relative w-full h-full overflow-hidden',
  badge = null,
}) {
  // Never use .mp4; always resolve to a static .webp/.jpg image
  const resolvedImage =
    poster && !String(poster).endsWith('.mp4')
      ? poster
      : src && !String(src).endsWith('.mp4')
      ? src
      : '/assets/images/real_001.webp';

  const cleanBadge = badge
    ? String(badge)
        .replace(/live\s*video|hd\s*video|live\s*hd|live\s*cinema|video|film/gi, 'Photographic Study')
        .replace(/\s+/g, ' ')
        .trim()
    : null;

  return (
    <div className={containerClassName}>
      <img
        src={resolvedImage}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = '/assets/images/real_001.webp';
        }}
        className={className}
      />
      {cleanBadge && (
        <div className="pointer-events-none absolute bottom-3 left-3 z-20 flex items-center gap-2 rounded-full border border-white/20 bg-black/65 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f4f1e9] backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span>{cleanBadge}</span>
        </div>
      )}
    </div>
  );
}
