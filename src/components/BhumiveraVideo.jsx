import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Film } from 'lucide-react';

/**
 * BhumiveraVideo
 * Reusable HTML5 video component that replaces static images and illustrative artwork
 * across the storefront, impact, science, about, legal, returns, and footer components.
 */
export default function BhumiveraVideo({
  src,
  poster = '/logo.webp',
  alt = 'Bhumivera botanical cinema',
  className = 'h-full w-full object-cover',
  containerClassName = 'relative h-full w-full overflow-hidden',
  badge = null,
  badgeClassName = 'absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 bg-[#101811]/85 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#e1e8ce] backdrop-blur-md border border-white/10',
  showControls = false,
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  preload = 'metadata',
  overlayClassName = '',
  children,
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(Boolean(autoPlay));
  const [isMuted, setIsMuted] = useState(Boolean(muted));

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    videoEl.muted = isMuted;
    if (autoPlay) {
      const playPromise = videoEl.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          setIsPlaying(false);
        });
      }
    }
  }, [src, autoPlay, isMuted]);

  const togglePlay = event => {
    event.preventDefault();
    event.stopPropagation();
    const videoEl = videoRef.current;
    if (!videoEl) return;
    if (videoEl.paused) {
      videoEl.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoEl.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = event => {
    event.preventDefault();
    event.stopPropagation();
    const videoEl = videoRef.current;
    if (!videoEl) return;
    const nextMuted = !isMuted;
    videoEl.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <div className={containerClassName}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        aria-label={alt}
        title={alt}
        autoPlay={autoPlay}
        loop={loop}
        muted={isMuted}
        playsInline={playsInline}
        preload={preload}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className={className}
      >
        <source src={src} type="video/mp4" />
      </video>

      {overlayClassName && <div className={overlayClassName} aria-hidden="true" />}

      {badge && (
        <span className={badgeClassName}>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          <Film size={11} className="text-[#d4af37] shrink-0" aria-hidden="true" />
          <span>{badge}</span>
        </span>
      )}

      {showControls && (
        <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-[#101811]/80 text-[#e1e8ce] backdrop-blur-md transition hover:bg-[#101811] hover:text-white"
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-[#101811]/80 text-[#e1e8ce] backdrop-blur-md transition hover:bg-[#101811] hover:text-white"
          >
            {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>
        </div>
      )}

      {children}
    </div>
  );
}
